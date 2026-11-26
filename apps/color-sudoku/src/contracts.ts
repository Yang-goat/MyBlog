// Grid and proof coordinates are zero-based, row-major, from the top left.
export type Bit = 0 | 1;
export type Size = 5 | 7 | 10;
export type Tool = 'fill' | 'empty';
export type Cell = 'unknown' | 'filled' | 'empty' | 'miss-filled' | 'miss-empty';
export type Axis = 'row' | 'column';
export interface Clues { size: number; rowClues: number[][]; columnClues: number[][] }
export interface PublicPuzzle extends Clues { id: number; size: Size; seed: number; book: string }
export interface Sticker { name: string; story: string; size: Size; colors: (string | null)[] }
export interface Puzzle extends PublicPuzzle { solution: Bit[]; sticker: Sticker }
export interface Move { at: number; tool: Tool }
export interface Round { levelId: number; seed: number; cells: Cell[]; lives: number; status: 'playing' | 'won' | 'lost'; moves: Move[]; message: string }
export interface Deduction { at: number; value: Bit }
export interface ProofStep {
  axis: Axis; line: number; clue: number[]; possibilities: number;
  // All previously unknown cells on the chosen line on which every legal placement agrees.
  forced: Deduction[];
  // Other cells sealed by gameplay as a consequence of this entire batch.
  sealed: number[];
}
export interface Proof { route: 'single' | 'multiple'; steps: ProofStep[]; openings: number }
export type Verification = { ok: true; proof: Proof } | { ok: false; reason: string };
export interface AlbumEntry { id: number; book: string; size: Size; sticker: Sticker | null; perfect: boolean }
// A component only receives public clues, visible marks and already earned stickers.
export interface GameView {
  page: 'tutorial' | 'play' | 'album'; puzzle: PublicPuzzle; round: Round; tool: Tool;
  entries: AlbumEntry[]; revealed: Sticker | null; level: number; coins: number;
  sound: boolean; reducedMotion: boolean; storageOk: boolean; firstReward: boolean;
}
export type Action = { type: 'mark'; at: number } | { type: 'tool'; tool: Tool } | { type: 'open'; id: number }
  | { type: 'practice' | 'finishPractice' | 'album' | 'back' | 'retry' | 'sound' | 'motion' };
// Save v1: replay actions, never trust serialized cells/lives. Rewards are derived from distinct wins.
export interface SaveV1 {
  version: 1; edition: string; current: number; tool: Tool; practiceDone: boolean;
  sound: boolean; reduceMotion: boolean; wins: Record<string, { perfect: boolean }>;
  rounds: Record<string, { seed: number; moves: Move[] }>;
}
