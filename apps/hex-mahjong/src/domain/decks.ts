import type { CardDefinition, DeckKey, DeckState, GameMode, RandomSource } from "./types";
import { shuffled, systemRandom } from "./random";

export const DECK_KEYS: readonly DeckKey[] = [
  "world",
  "opportunity",
  "fun",
  "silver",
  "gold",
  "prismatic",
  "normal-contract",
  "black-contract",
  "treasure",
];

export function createDecks(
  cards: readonly CardDefinition[],
  mode: GameMode,
  random: RandomSource = systemRandom,
): Record<DeckKey, DeckState> {
  return Object.fromEntries(
    DECK_KEYS.map((key) => {
      const ids = cards.filter((card) => card.category === key && card.modes.includes(mode)).map((card) => card.id);
      return [
        key,
        {
          key,
          drawPile: shuffled(ids, random),
          discardPile: [],
          held: {},
          reshuffleCount: 0,
        } satisfies DeckState,
      ];
    }),
  ) as unknown as Record<DeckKey, DeckState>;
}

export function drawCardId(deck: DeckState, random: RandomSource = systemRandom): string {
  if (deck.drawPile.length === 0) {
    if (deck.discardPile.length === 0) {
      throw new Error(`The ${deck.key} deck has no available cards.`);
    }
    deck.drawPile = shuffled(deck.discardPile, random);
    deck.discardPile = [];
    deck.reshuffleCount += 1;
  }

  const cardId = deck.drawPile.pop();
  if (!cardId) throw new Error(`The ${deck.key} deck could not produce a card.`);
  if (deck.held[cardId]) throw new Error(`Card ${cardId} is already held by ${deck.held[cardId]}.`);
  return cardId;
}

export function holdCard(deck: DeckState, cardId: string, instanceId: string): void {
  if (deck.held[cardId]) throw new Error(`Card ${cardId} is already held by ${deck.held[cardId]}.`);
  deck.held[cardId] = instanceId;
}

export function returnHeldCards(
  deck: DeckState,
  cards: readonly { cardId: string; instanceId: string }[],
  random: RandomSource = systemRandom,
): void {
  for (const card of cards) {
    assertHeldBy(deck, card.cardId, card.instanceId);
    delete deck.held[card.cardId];
    deck.drawPile.push(card.cardId);
  }
  deck.drawPile = shuffled(deck.drawPile, random);
}

export function discardHeldCards(deck: DeckState, cards: readonly { cardId: string; instanceId: string }[]): void {
  for (const card of cards) {
    assertHeldBy(deck, card.cardId, card.instanceId);
    delete deck.held[card.cardId];
    deck.discardPile.push(card.cardId);
  }
}

function assertHeldBy(deck: DeckState, cardId: string, instanceId: string): void {
  const holder = deck.held[cardId];
  if (holder !== instanceId) {
    throw new Error(`Card ${cardId} in ${deck.key} is held by ${holder ?? "nobody"}, not ${instanceId}.`);
  }
}
