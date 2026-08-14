export type GameMode = "strategy" | "party" | "full";

export type MatchPhase =
  | "ready"
  | "augment-selection"
  | "contract-selection"
  | "playing"
  | "settlement"
  | "finished";

export type CardStatus = "pending" | "completed" | "skipped";
export type ContractStatus = "pending" | "completed" | "abandoned";
export type Seat = "bottom" | "right" | "top" | "left";
export type AugmentTier = "silver" | "gold" | "prismatic";
export type CardModule = "fun" | "treasure";

export type CardCategory =
  | "world"
  | "opportunity"
  | "fun"
  | "silver"
  | "gold"
  | "prismatic"
  | "normal-contract"
  | "black-contract"
  | "treasure";

export type DeckKey = CardCategory;
export type ManualDrawCategory = "opportunity" | "fun";

export interface CardField {
  label: string;
  value: string;
}

export interface CardDefinition {
  id: string;
  name: string;
  category: CardCategory;
  categoryName: string;
  subcategory: string | null;
  text: string;
  timing: string | null;
  duration: string | null;
  frequency: string | null;
  validation: string | null;
  trigger: string | null;
  triggerLimit: string | null;
  designatedTile: string | null;
  singleAction: string | null;
  doubleAction: string | null;
  alternativeAction: string | null;
  notes: string[];
  tags: string[];
  replacementRule: string | null;
  modules: CardModule[];
  modes: GameMode[];
  frontTemplate: string;
  backTemplate: string;
  suggestedCopies: number;
  fields: CardField[];
  rawMarkdown: string;
}

export interface CardCatalog {
  schemaVersion: 1;
  contentVersion: "1.2";
  libraryVersion: "0.2";
  cards: CardDefinition[];
}

export interface CardInstance {
  instanceId: string;
  cardId: string;
  category: CardCategory;
  sourceDeck: DeckKey;
  ownerId: string | null;
  roundNumber: number;
  deckZone: "held" | "draw" | "discard";
  status: CardStatus;
  contractStatus?: ContractStatus;
}

export interface DeckState {
  key: DeckKey;
  drawPile: string[];
  discardPile: string[];
  /** A card id can be held by only one active instance. */
  held: Record<string, string>;
  reshuffleCount: number;
}

export interface AugmentState {
  tier: AugmentTier;
  card: CardInstance;
  frequency: string | null;
  roundLimit: number | null;
  matchLimit: number | null;
  automatic: boolean;
  usedThisRound: number;
  usedThisMatch: number;
}

export interface PlayerInput {
  id?: string;
  name: string;
  seat?: Seat;
}

export interface PlayerState {
  id: string;
  name: string;
  seat: Seat;
  totalScore: number;
  contract: CardInstance | null;
  augments: Partial<Record<AugmentTier, AugmentState>>;
}

export type SecretSelectionKind = "augment" | "contract";

export interface SecretSelectionState {
  kind: SecretSelectionKind;
  tier: AugmentTier | null;
  candidates: Record<string, CardInstance[]>;
  selections: Record<string, string | null>;
  confirmedPlayerIds: string[];
  revealed: boolean;
}

export interface RoundState {
  number: number;
  dealerPlayerId: string;
  worldCard: CardInstance | null;
  treasureCard: CardInstance | null;
  temporaryCards: CardInstance[];
  secretSelection: SecretSelectionState | null;
  scoreDraft: Record<string, number | null>;
  settlementNeedsConfirmation: boolean;
  contractAbandonWindowOpened: boolean;
}

export interface PlayerRoundRecord {
  playerId: string;
  score: number;
  totalScoreAfterRound: number;
  contract: CardInstance | null;
}

export interface RoundRecord {
  number: number;
  dealerPlayerId: string;
  worldCard: CardInstance | null;
  treasureCard: CardInstance | null;
  temporaryCards: CardInstance[];
  players: PlayerRoundRecord[];
}

export interface MatchState {
  schemaVersion: number;
  contentVersion: "1.2";
  rulesVersion: "1.2";
  mode: GameMode;
  phase: MatchPhase;
  players: PlayerState[];
  decks: Record<DeckKey, DeckState>;
  currentRound: RoundState | null;
  roundRecords: RoundRecord[];
  nextInstanceSequence: number;
  undoStack: MatchSnapshot[];
}

export type MatchSnapshot = Omit<MatchState, "undoStack">;

export interface CreateMatchInput {
  mode: GameMode;
  players: readonly (string | PlayerInput)[];
}

export type RoundScores = Record<string, number>;

export interface SettleRoundOptions {
  confirmPending?: boolean;
}

export interface PendingItem {
  kind: "card" | "contract";
  instanceId: string;
  cardId: string;
  playerId: string | null;
}

export interface RankedPlayer {
  rank: number;
  playerId: string;
  name: string;
  totalScore: number;
  tied: boolean;
}

export type RandomSource = () => number;
