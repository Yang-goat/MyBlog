import { describe, expect, it } from "vitest";
import {
  advancePrep,
  chooseSecretCard,
  confirmSecretChoice,
  createMatch,
  createSeededRandom,
  drawManualCard,
  getPendingItems,
  openContractAbandonWindow,
  rankPlayers,
  setCardStatus,
  setContractAbandonWindow,
  setContractStatus,
  settleRound,
  startRound,
  toggleAugmentUse,
  undoMatch,
} from "../src/domain";
import type { AugmentState, AugmentTier, CardInstance, MatchState, RoundScores } from "../src/domain";

const playerNames = ["东家", "南家", "西家", "北家"];

describe("match state machine", () => {
  it("runs augment draw-two-pick-one and contract three-pick-one without duplicate cards", () => {
    const random = createSeededRandom(42);
    let match = createMatch({ mode: "party", players: playerNames }, random);
    match = startRound(match, random);
    expect(match.phase).toBe("augment-selection");
    expect(match.currentRound?.number).toBe(1);
    expect(allCandidateCardIds(match)).toHaveLength(8);
    expect(new Set(allCandidateCardIds(match)).size).toBe(8);

    match = completeSecretSelection(match, random);
    expect(match.phase).toBe("contract-selection");
    expect(match.currentRound?.worldCard?.cardId).toMatch(/^W-/);
    expect(match.currentRound?.treasureCard).toBeNull();
    expect(allCandidateCardIds(match)).toHaveLength(12);
    expect(new Set(allCandidateCardIds(match)).size).toBe(12);

    match = completeSecretSelection(match, random);
    expect(match.phase).toBe("playing");
    expect(match.players.every((player) => player.contract !== null)).toBe(true);
    expect(match.players.every((player) => player.augments.silver !== undefined)).toBe(true);
    expect(JSON.parse(JSON.stringify(match))).toEqual(match);
  });

  it("tracks manual cards, card/contract statuses, signed scores, and confirmation", () => {
    const random = createSeededRandom(7);
    let match = enterPlaying(createMatch({ mode: "full", players: playerNames }, random), random);
    match = drawManualCard(match, "opportunity", "player-1", random);
    match = drawManualCard(match, "fun", "player-2", random);
    expect(getPendingItems(match)).toHaveLength(6);

    const opportunity = match.currentRound!.temporaryCards[0];
    match = setCardStatus(match, opportunity.instanceId, "completed");
    for (const player of match.players) match = setContractStatus(match, player.id, "completed");

    const scores = scoreMap(match, [5, -2, 0, 3]);
    match = settleRound(match, scores);
    expect(match.phase).toBe("settlement");
    expect(match.players.map((player) => player.totalScore)).toEqual([0, 0, 0, 0]);
    expect(match.currentRound?.settlementNeedsConfirmation).toBe(true);

    match = settleRound(match, scores, { confirmPending: true });
    expect(match.phase).toBe("ready");
    expect(match.players.map((player) => player.totalScore)).toEqual([5, -2, 0, 3]);
    expect(match.currentRound).toBeNull();
    expect(match.roundRecords).toHaveLength(1);
    expect(Object.keys(match.decks.opportunity.held)).toHaveLength(0);
  });

  it("moves resolved temporary cards to discard and reshuffles within the same round", () => {
    const random = createSeededRandom(9);
    let match = enterPlaying(createMatch({ mode: "strategy", players: playerNames }, random), random);
    for (let index = 0; index < 37; index += 1) {
      match = drawManualCard(match, "opportunity", "player-1", random);
      const card = match.currentRound!.temporaryCards.at(-1)!;
      match = setCardStatus(match, card.instanceId, "completed");
    }
    expect(match.decks.opportunity.reshuffleCount).toBeGreaterThanOrEqual(1);
    expect(match.decks.opportunity.discardPile.length).toBeGreaterThan(0);
    expect(Object.keys(match.decks.opportunity.held)).toHaveLength(0);
  });

  it("does not automatically apply the black-contract abandonment penalty", () => {
    const random = createSeededRandom(13);
    let match = createMatch({ mode: "strategy", players: playerNames }, random);
    match = startRound(match, random);
    match = completeSecretSelection(match, random);
    match = completeSecretSelection(match, random, (cards) => cards.find((card) => card.cardId.startsWith("B-"))!);
    match = setContractStatus(match, "player-1", "abandoned");
    for (const player of match.players.slice(1)) match = setContractStatus(match, player.id, "completed");
    match = settleRound(match, scoreMap(match, [0, 0, 0, 0]));
    expect(match.players[0].totalScore).toBe(0);
  });

  it("opens the abandon window only when players trigger it manually", () => {
    const random = createSeededRandom(21);
    let match = enterPlaying(createMatch({ mode: "strategy", players: playerNames }, random), random);
    expect(match.currentRound?.contractAbandonWindowOpened).toBe(false);
    match = openContractAbandonWindow(match);
    expect(match.currentRound?.contractAbandonWindowOpened).toBe(true);
  });

  it("keeps the latest 50 undo snapshots and restores the previous state", () => {
    const random = createSeededRandom(28);
    let match = enterPlaying(createMatch({ mode: "party", players: playerNames }, random), random);
    for (let index = 0; index < 60; index += 1) {
      match = setContractAbandonWindow(match, index % 2 === 0);
    }
    expect(match.undoStack).toHaveLength(50);
    const previousValue = match.currentRound!.contractAbandonWindowOpened;
    const changed = setContractAbandonWindow(match, !previousValue);
    expect(undoMatch(changed).currentRound?.contractAbandonWindowOpened).toBe(previousValue);
  });

  it("cycles tracked augment uses up to the rule-defined limit", () => {
    const random = createSeededRandom(31);
    let match = enterPlaying(createMatch({ mode: "strategy", players: playerNames }, random), random);
    match.players[0].augments.silver = fakeAugment("silver", "S-18", "整场2次", null, 2);
    match = toggleAugmentUse(match, "player-1", "silver");
    match = toggleAugmentUse(match, "player-1", "silver");
    expect(match.players[0].augments.silver?.usedThisMatch).toBe(2);
    match = toggleAugmentUse(match, "player-1", "silver");
    expect(match.players[0].augments.silver?.usedThisMatch).toBe(0);
  });

  it("completes eight rounds, retains final state, and ranks ties directly", () => {
    const random = createSeededRandom(50);
    let match = createMatch({ mode: "strategy", players: playerNames }, random);
    for (let round = 1; round <= 8; round += 1) {
      match = startRound(match, random);
      if (match.phase === "augment-selection") match = completeSecretSelection(match, random);
      match = completeSecretSelection(match, random);
      for (const player of match.players) match = setContractStatus(match, player.id, "completed");
      match = settleRound(match, scoreMap(match, round === 8 ? [2, 2, 0, -1] : [0, 0, 0, 0]));
    }
    expect(match.phase).toBe("finished");
    expect(match.roundRecords).toHaveLength(8);
    expect(match.players.map((player) => player.totalScore)).toEqual([2, 2, 0, -1]);
    expect(rankPlayers(match).map(({ rank, playerId }) => [rank, playerId])).toEqual([
      [1, "player-1"],
      [1, "player-2"],
      [3, "player-3"],
      [4, "player-4"],
    ]);
  });
});

function completeSecretSelection(
  match: MatchState,
  random: ReturnType<typeof createSeededRandom>,
  pick?: (cards: CardInstance[]) => CardInstance,
): MatchState {
  for (const player of match.players) {
    const candidates = match.currentRound!.secretSelection!.candidates[player.id];
    const chosen = pick?.(candidates) ?? candidates[0];
    match = chooseSecretCard(match, player.id, chosen.instanceId);
    match = confirmSecretChoice(match, player.id);
  }
  return advancePrep(match, random);
}

function enterPlaying(match: MatchState, random: ReturnType<typeof createSeededRandom>): MatchState {
  match = startRound(match, random);
  if (match.phase === "augment-selection") match = completeSecretSelection(match, random);
  return completeSecretSelection(match, random);
}

function allCandidateCardIds(match: MatchState): string[] {
  return Object.values(match.currentRound!.secretSelection!.candidates).flat().map((card) => card.cardId);
}

function scoreMap(match: MatchState, scores: readonly number[]): RoundScores {
  return Object.fromEntries(match.players.map((player, index) => [player.id, scores[index]]));
}

function fakeAugment(
  tier: AugmentTier,
  cardId: string,
  frequency: string,
  roundLimit: number | null,
  matchLimit: number | null,
): AugmentState {
  return {
    tier,
    card: {
      instanceId: "fixture-augment",
      cardId,
      category: tier,
      sourceDeck: tier,
      ownerId: "player-1",
      roundNumber: 1,
      deckZone: "held",
      status: "pending",
    },
    frequency,
    roundLimit,
    matchLimit,
    automatic: false,
    usedThisRound: 0,
    usedThisMatch: 0,
  };
}
