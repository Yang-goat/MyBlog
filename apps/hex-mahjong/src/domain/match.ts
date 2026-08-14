import { CARD_DEFINITIONS, getCardDefinition } from "../data";
import { createDecks, discardHeldCards, drawCardId, holdCard, returnHeldCards } from "./decks";
import { systemRandom } from "./random";
import type {
  AugmentState,
  AugmentTier,
  CardInstance,
  CardStatus,
  ContractStatus,
  CreateMatchInput,
  DeckKey,
  ManualDrawCategory,
  MatchSnapshot,
  MatchState,
  PendingItem,
  PlayerInput,
  PlayerState,
  RandomSource,
  RankedPlayer,
  RoundScores,
  SecretSelectionState,
  Seat,
  SettleRoundOptions,
} from "./types";

export const MATCH_SCHEMA_VERSION = 1;
export const MAX_UNDO_SNAPSHOTS = 50;

// Setup order follows the approved table reference: east, south, west, north.
const SEATS: readonly Seat[] = ["right", "bottom", "left", "top"];
const AUGMENT_ROUNDS: Readonly<Record<number, AugmentTier>> = {
  1: "silver",
  3: "gold",
  5: "prismatic",
};

export function createMatch(input: CreateMatchInput, random: RandomSource = systemRandom): MatchState {
  if (!(["strategy", "party", "full"] as const).includes(input.mode)) {
    throw new Error(`Unknown game mode: ${String(input.mode)}`);
  }
  if (input.players.length !== 4) throw new Error("A Hex Mahjong match requires exactly four players.");

  const players = input.players.map((player, index) => normalizePlayer(player, index));
  if (new Set(players.map((player) => player.id)).size !== players.length) {
    throw new Error("Player ids must be unique.");
  }
  if (new Set(players.map((player) => player.seat)).size !== players.length) {
    throw new Error("Player seats must be unique.");
  }

  return {
    schemaVersion: MATCH_SCHEMA_VERSION,
    contentVersion: "1.2",
    rulesVersion: "1.2",
    mode: input.mode,
    phase: "ready",
    players,
    decks: createDecks(CARD_DEFINITIONS, input.mode, random),
    currentRound: null,
    roundRecords: [],
    nextInstanceSequence: 1,
    undoStack: [],
  };
}

export function startRound(match: MatchState, random: RandomSource = systemRandom): MatchState {
  assertSchema(match);
  if (match.phase !== "ready" || match.currentRound) {
    throw new Error(`A round can start only from ready; current phase is ${match.phase}.`);
  }
  if (match.roundRecords.length >= 8) throw new Error("All eight rounds have already been completed.");

  return updateWithUndo(match, (draft) => {
    const roundNumber = draft.roundRecords.length + 1;
    for (const player of draft.players) {
      for (const augment of Object.values(player.augments)) {
        if (augment) augment.usedThisRound = 0;
      }
      player.contract = null;
    }

    draft.currentRound = {
      number: roundNumber,
      dealerPlayerId: draft.players[(roundNumber - 1) % draft.players.length].id,
      worldCard: null,
      treasureCard: null,
      temporaryCards: [],
      secretSelection: null,
      scoreDraft: Object.fromEntries(draft.players.map((player) => [player.id, null])),
      settlementNeedsConfirmation: false,
      contractAbandonWindowOpened: false,
    };

    const tier = AUGMENT_ROUNDS[roundNumber];
    if (tier) {
      dealAugmentSelection(draft, tier, random);
    } else {
      preparePublicCardsAndContracts(draft, random);
    }
  });
}

export function chooseSecretCard(match: MatchState, playerId: string, instanceId: string): MatchState {
  const selection = requireSecretSelection(match);
  if (selection.confirmedPlayerIds.includes(playerId)) {
    throw new Error(`${playerId} has already confirmed a secret choice.`);
  }
  const candidates = selection.candidates[playerId];
  if (!candidates) throw new Error(`Player ${playerId} has no secret candidates.`);
  if (!candidates.some((card) => card.instanceId === instanceId)) {
    throw new Error(`Card instance ${instanceId} is not a candidate for ${playerId}.`);
  }

  return updateWithUndo(match, (draft) => {
    const draftSelection = requireSecretSelection(draft);
    draftSelection.selections[playerId] = instanceId;
  });
}

export function confirmSecretChoice(match: MatchState, playerId: string): MatchState {
  const selection = requireSecretSelection(match);
  if (!selection.candidates[playerId]) throw new Error(`Player ${playerId} has no secret candidates.`);
  if (!selection.selections[playerId]) throw new Error(`Player ${playerId} must select a card before confirming.`);
  if (selection.confirmedPlayerIds.includes(playerId)) return match;

  return updateWithUndo(match, (draft) => {
    requireSecretSelection(draft).confirmedPlayerIds.push(playerId);
  });
}

export function advancePrep(match: MatchState, random: RandomSource = systemRandom): MatchState {
  const selection = requireSecretSelection(match);
  assertEveryPlayerConfirmed(match, selection);

  return updateWithUndo(match, (draft) => {
    const currentSelection = requireSecretSelection(draft);
    if (draft.phase === "augment-selection" && currentSelection.kind === "augment") {
      commitAugmentSelection(draft, currentSelection, random);
      preparePublicCardsAndContracts(draft, random);
      return;
    }
    if (draft.phase === "contract-selection" && currentSelection.kind === "contract") {
      commitContractSelection(draft, currentSelection, random);
      draft.phase = "playing";
      return;
    }
    throw new Error(`Cannot advance preparation from ${draft.phase}.`);
  });
}

export function drawManualCard(
  match: MatchState,
  category: ManualDrawCategory,
  playerId?: string,
  random: RandomSource = systemRandom,
): MatchState {
  assertPlayablePhase(match);
  if (category !== "opportunity" && category !== "fun") {
    throw new Error(`Only opportunity and fun cards can be drawn manually; received ${String(category)}.`);
  }
  if (category === "fun" && match.mode === "strategy") {
    throw new Error("Fun challenge cards are disabled in strategy mode.");
  }
  if (playerId) requirePlayer(match, playerId);

  return updateWithUndo(match, (draft) => {
    const card = drawInstance(draft, category, playerId ?? null, random);
    requireRound(draft).temporaryCards.push(card);
  });
}

export function setCardStatus(match: MatchState, instanceId: string, status: CardStatus): MatchState {
  assertPlayablePhase(match);
  assertCardStatus(status);
  const existing = requireRound(match).temporaryCards.find((card) => card.instanceId === instanceId);
  if (!existing) throw new Error(`Temporary card instance ${instanceId} was not found in the current round.`);
  if (existing.status === status) return match;
  if (existing.status !== "pending" && status === "pending") {
    throw new Error("A resolved card can be restored to pending only by undoing the resolution.");
  }

  return updateWithUndo(match, (draft) => {
    const card = requireRound(draft).temporaryCards.find((candidate) => candidate.instanceId === instanceId);
    if (!card) throw new Error(`Temporary card instance ${instanceId} was not found in the current round.`);
    if (card.status === "pending" && status !== "pending") discardInstances(draft, [card]);
    card.status = status;
  });
}

export function setContractStatus(match: MatchState, playerId: string, status: ContractStatus): MatchState {
  assertPlayablePhase(match);
  assertContractStatus(status);
  const player = requirePlayer(match, playerId);
  if (!player.contract) throw new Error(`Player ${playerId} has no current contract.`);
  if (player.contract.contractStatus === "completed" && status === "abandoned") {
    throw new Error("A completed contract cannot be abandoned.");
  }
  if (player.contract.contractStatus === status) return match;

  return updateWithUndo(match, (draft) => {
    const contract = requirePlayer(draft, playerId).contract;
    if (!contract) throw new Error(`Player ${playerId} has no current contract.`);
    contract.contractStatus = status;
    contract.status = status === "completed" ? "completed" : status === "abandoned" ? "skipped" : "pending";
  });
}

export function setContractAbandonWindow(match: MatchState, opened = true): MatchState {
  assertPlayablePhase(match);
  if (requireRound(match).contractAbandonWindowOpened === opened) return match;
  return updateWithUndo(match, (draft) => {
    requireRound(draft).contractAbandonWindowOpened = opened;
  });
}

export function toggleAugmentUse(match: MatchState, playerId: string, tier: AugmentTier): MatchState {
  assertPlayablePhase(match);
  const augment = requirePlayer(match, playerId).augments[tier];
  if (!augment) throw new Error(`Player ${playerId} does not have a ${tier} augment.`);
  if (augment.automatic) return match;

  return updateWithUndo(match, (draft) => {
    const draftAugment = requirePlayer(draft, playerId).augments[tier];
    if (!draftAugment) throw new Error(`Player ${playerId} does not have a ${tier} augment.`);
    if (draftAugment.matchLimit !== null) {
      const next = (draftAugment.usedThisMatch + 1) % (draftAugment.matchLimit + 1);
      const difference = next - draftAugment.usedThisMatch;
      draftAugment.usedThisMatch = next;
      draftAugment.usedThisRound = Math.max(0, draftAugment.usedThisRound + difference);
    } else {
      const limit = draftAugment.roundLimit ?? 1;
      const next = (draftAugment.usedThisRound + 1) % (limit + 1);
      draftAugment.usedThisMatch = Math.max(0, draftAugment.usedThisMatch + next - draftAugment.usedThisRound);
      draftAugment.usedThisRound = next;
    }
  });
}

export function getPendingItems(match: MatchState): PendingItem[] {
  const round = requireRound(match);
  const cards: PendingItem[] = round.temporaryCards
    .filter((card) => card.status === "pending")
    .map((card) => ({
      kind: "card",
      instanceId: card.instanceId,
      cardId: card.cardId,
      playerId: card.ownerId,
    }));
  const contracts: PendingItem[] = match.players.flatMap((player) =>
    player.contract?.contractStatus === "pending"
      ? [
          {
            kind: "contract" as const,
            instanceId: player.contract.instanceId,
            cardId: player.contract.cardId,
            playerId: player.id,
          },
        ]
      : [],
  );
  return [...cards, ...contracts];
}

export function settleRound(
  match: MatchState,
  scores: RoundScores,
  options: SettleRoundOptions = {},
): MatchState {
  assertPlayablePhase(match);
  const normalizedScores = validateScores(match, scores);
  const pendingItems = getPendingItems(match);

  if (pendingItems.length > 0 && !options.confirmPending) {
    return updateWithUndo(match, (draft) => {
      const round = requireRound(draft);
      round.scoreDraft = { ...normalizedScores };
      round.settlementNeedsConfirmation = true;
      draft.phase = "settlement";
    });
  }

  return updateWithUndo(match, (draft) => finalizeRound(draft, normalizedScores));
}

export function undoMatch(match: MatchState): MatchState {
  assertSchema(match);
  const snapshot = match.undoStack.at(-1);
  if (!snapshot) return match;
  return {
    ...deepClone(snapshot),
    undoStack: deepClone(match.undoStack.slice(0, -1)),
  };
}

export function rankPlayers(matchOrPlayers: MatchState | readonly PlayerState[]): RankedPlayer[] {
  const players: readonly PlayerState[] = Array.isArray(matchOrPlayers)
    ? (matchOrPlayers as readonly PlayerState[])
    : (matchOrPlayers as MatchState).players;
  const sorted = [...players].sort((left, right) => right.totalScore - left.totalScore);
  return sorted.map((player, index) => {
    const rank = index > 0 && sorted[index - 1].totalScore === player.totalScore
      ? indexOfScore(sorted, player.totalScore) + 1
      : index + 1;
    return {
      rank,
      playerId: player.id,
      name: player.name,
      totalScore: player.totalScore,
      tied: sorted.filter((candidate) => candidate.totalScore === player.totalScore).length > 1,
    };
  });
}

function normalizePlayer(input: string | PlayerInput, index: number): PlayerState {
  const source: PlayerInput = typeof input === "string" ? { name: input } : input;
  const name = source.name.trim() || `玩家${index + 1}`;
  const id = source.id?.trim() || `player-${index + 1}`;
  return {
    id,
    name,
    seat: source.seat ?? SEATS[index],
    totalScore: 0,
    contract: null,
    augments: {},
  };
}

function updateWithUndo(match: MatchState, update: (draft: MatchState) => void): MatchState {
  assertSchema(match);
  const draft = deepClone(match);
  update(draft);
  draft.undoStack = [...deepClone(match.undoStack), snapshotOf(match)].slice(-MAX_UNDO_SNAPSHOTS);
  return draft;
}

function snapshotOf(match: MatchState): MatchSnapshot {
  const copy = deepClone(match);
  const { undoStack: _undoStack, ...snapshot } = copy;
  return snapshot;
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function dealAugmentSelection(match: MatchState, tier: AugmentTier, random: RandomSource): void {
  const round = requireRound(match);
  const selection = createEmptySelection(match, "augment", tier);
  for (const player of match.players) {
    selection.candidates[player.id] = [
      drawInstance(match, tier, player.id, random),
      drawInstance(match, tier, player.id, random),
    ];
  }
  round.secretSelection = selection;
  match.phase = "augment-selection";
}

function preparePublicCardsAndContracts(match: MatchState, random: RandomSource): void {
  const round = requireRound(match);
  round.worldCard = drawInstance(match, "world", null, random);
  round.treasureCard = match.mode === "full" ? drawInstance(match, "treasure", null, random) : null;

  const selection = createEmptySelection(match, "contract", null);
  for (const player of match.players) {
    const openContract = player.augments.prismatic?.card.cardId === "P-09";
    const normalCount = openContract ? 3 : 2;
    const blackCount = openContract ? 2 : 1;
    selection.candidates[player.id] = [
      ...Array.from({ length: normalCount }, () => drawInstance(match, "normal-contract", player.id, random)),
      ...Array.from({ length: blackCount }, () => drawInstance(match, "black-contract", player.id, random)),
    ];
  }
  round.secretSelection = selection;
  match.phase = "contract-selection";
}

function createEmptySelection(
  match: MatchState,
  kind: SecretSelectionState["kind"],
  tier: AugmentTier | null,
): SecretSelectionState {
  return {
    kind,
    tier,
    candidates: Object.fromEntries(match.players.map((player) => [player.id, []])),
    selections: Object.fromEntries(match.players.map((player) => [player.id, null])),
    confirmedPlayerIds: [],
    revealed: false,
  };
}

function commitAugmentSelection(
  match: MatchState,
  selection: SecretSelectionState,
  random: RandomSource,
): void {
  const tier = selection.tier;
  if (!tier) throw new Error("Augment selection has no tier.");
  const returned: CardInstance[] = [];

  for (const player of match.players) {
    const selectedId = selection.selections[player.id];
    const candidates = selection.candidates[player.id];
    const selected = candidates.find((card) => card.instanceId === selectedId);
    if (!selected) throw new Error(`Player ${player.id} has no valid selected augment.`);
    const definition = getCardDefinition(selected.cardId);
    player.augments[tier] = createAugmentState(tier, selected, definition.frequency);
    returned.push(...candidates.filter((card) => card.instanceId !== selected.instanceId));
  }

  returnInstances(match, returned, random);
  requireRound(match).secretSelection = null;
}

function commitContractSelection(
  match: MatchState,
  selection: SecretSelectionState,
  random: RandomSource,
): void {
  const returned: CardInstance[] = [];
  for (const player of match.players) {
    const selectedId = selection.selections[player.id];
    const candidates = selection.candidates[player.id];
    const selected = candidates.find((card) => card.instanceId === selectedId);
    if (!selected) throw new Error(`Player ${player.id} has no valid selected contract.`);
    selected.contractStatus = "pending";
    selected.status = "pending";
    player.contract = selected;
    returned.push(...candidates.filter((card) => card.instanceId !== selected.instanceId));
  }
  returnInstances(match, returned, random);
  requireRound(match).secretSelection = null;
}

function createAugmentState(tier: AugmentTier, card: CardInstance, frequency: string | null): AugmentState {
  const matchLimitMatch = frequency?.match(/整场[^0-9]{0,6}(\d+)次/);
  const roundLimitMatch = frequency?.match(/每局[^0-9]{0,6}(\d+)次/);
  return {
    tier,
    card,
    frequency,
    roundLimit: roundLimitMatch ? Number(roundLimitMatch[1]) : frequency?.includes("每局1次") ? 1 : null,
    matchLimit: matchLimitMatch ? Number(matchLimitMatch[1]) : null,
    automatic: frequency?.includes("自动生效") ?? false,
    usedThisRound: 0,
    usedThisMatch: 0,
  };
}

function drawInstance(
  match: MatchState,
  deckKey: DeckKey,
  ownerId: string | null,
  random: RandomSource,
): CardInstance {
  const round = requireRound(match);
  const deck = match.decks[deckKey];
  const cardId = drawCardId(deck, random);
  const instanceId = `r${round.number}-i${match.nextInstanceSequence}`;
  match.nextInstanceSequence += 1;
  holdCard(deck, cardId, instanceId);
  return {
    instanceId,
    cardId,
    category: getCardDefinition(cardId).category,
    sourceDeck: deckKey,
    ownerId,
    roundNumber: round.number,
    deckZone: "held",
    status: "pending",
  };
}

function returnInstances(match: MatchState, instances: readonly CardInstance[], random: RandomSource): void {
  for (const deckKey of new Set(instances.map((card) => card.sourceDeck))) {
    const cards = instances.filter((card) => card.sourceDeck === deckKey);
    returnHeldCards(match.decks[deckKey], cards, random);
    for (const card of cards) card.deckZone = "draw";
  }
}

function discardInstances(match: MatchState, instances: readonly CardInstance[]): void {
  for (const deckKey of new Set(instances.map((card) => card.sourceDeck))) {
    const cards = instances.filter((card) => card.sourceDeck === deckKey);
    discardHeldCards(match.decks[deckKey], cards);
    for (const card of cards) card.deckZone = "discard";
  }
}

function finalizeRound(match: MatchState, scores: RoundScores): void {
  const round = requireRound(match);
  const contracts = match.players.flatMap((player) => (player.contract ? [player.contract] : []));
  const cardsToDiscard = [
    ...(round.worldCard ? [round.worldCard] : []),
    ...(round.treasureCard ? [round.treasureCard] : []),
    ...round.temporaryCards,
    ...contracts,
  ];

  for (const player of match.players) player.totalScore += scores[player.id];
  match.roundRecords.push({
    number: round.number,
    dealerPlayerId: round.dealerPlayerId,
    worldCard: deepClone(round.worldCard),
    treasureCard: deepClone(round.treasureCard),
    temporaryCards: deepClone(round.temporaryCards),
    players: match.players.map((player) => ({
      playerId: player.id,
      score: scores[player.id],
      totalScoreAfterRound: player.totalScore,
      contract: deepClone(player.contract),
    })),
  });

  discardInstances(match, cardsToDiscard.filter((card) => card.deckZone === "held"));
  for (const player of match.players) player.contract = null;
  match.currentRound = null;
  match.phase = round.number === 8 ? "finished" : "ready";
}

function validateScores(match: MatchState, scores: RoundScores): RoundScores {
  const playerIds = new Set(match.players.map((player) => player.id));
  const unknownIds = Object.keys(scores).filter((playerId) => !playerIds.has(playerId));
  if (unknownIds.length > 0) throw new Error(`Scores contain unknown players: ${unknownIds.join(", ")}.`);
  const result: RoundScores = {};
  for (const player of match.players) {
    const score = scores[player.id];
    if (!Number.isInteger(score)) throw new Error(`Score for ${player.name} must be a signed integer.`);
    result[player.id] = score;
  }
  return result;
}

function requireRound(match: MatchState) {
  if (!match.currentRound) throw new Error("There is no active round.");
  return match.currentRound;
}

function requirePlayer(match: MatchState, playerId: string): PlayerState {
  const player = match.players.find((candidate) => candidate.id === playerId);
  if (!player) throw new Error(`Unknown player id: ${playerId}`);
  return player;
}

function requireSecretSelection(match: MatchState): SecretSelectionState {
  const selection = requireRound(match).secretSelection;
  if (!selection) throw new Error(`There is no secret selection during ${match.phase}.`);
  return selection;
}

function assertEveryPlayerConfirmed(match: MatchState, selection: SecretSelectionState): void {
  const missing = match.players.filter((player) => !selection.confirmedPlayerIds.includes(player.id));
  if (missing.length > 0) throw new Error(`Waiting for secret choices from: ${missing.map((player) => player.name).join(", ")}.`);
}

function assertPlayablePhase(match: MatchState): void {
  if (match.phase !== "playing" && match.phase !== "settlement") {
    throw new Error(`This action requires an active round; current phase is ${match.phase}.`);
  }
  requireRound(match);
}

function assertSchema(match: MatchState): void {
  if (match.schemaVersion !== MATCH_SCHEMA_VERSION) {
    throw new Error(`Match schema ${match.schemaVersion} is unsupported; expected ${MATCH_SCHEMA_VERSION}.`);
  }
}

function assertCardStatus(status: string): asserts status is CardStatus {
  if (!(status === "pending" || status === "completed" || status === "skipped")) {
    throw new Error(`Unknown card status: ${status}`);
  }
}

function assertContractStatus(status: string): asserts status is ContractStatus {
  if (!(status === "pending" || status === "completed" || status === "abandoned")) {
    throw new Error(`Unknown contract status: ${status}`);
  }
}

function indexOfScore(players: readonly PlayerState[], score: number): number {
  return players.findIndex((player) => player.totalScore === score);
}
