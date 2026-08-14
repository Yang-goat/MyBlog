import rawCatalog from "./cards.v1.2.json";
import type { CardCatalog, CardDefinition, GameMode } from "../domain/types";

export const CARD_CATALOG = rawCatalog as unknown as CardCatalog;
export const CARD_DEFINITIONS: readonly CardDefinition[] = Object.freeze(CARD_CATALOG.cards);
export const CARD_BY_ID: Readonly<Record<string, CardDefinition>> = Object.freeze(
  Object.fromEntries(CARD_DEFINITIONS.map((card) => [card.id, card])),
);

export function cardsForMode(mode: GameMode): CardDefinition[] {
  return CARD_DEFINITIONS.filter((card) => card.modes.includes(mode));
}

export function getCardDefinition(cardId: string): CardDefinition {
  const card = CARD_BY_ID[cardId];
  if (!card) throw new Error(`Unknown card id: ${cardId}`);
  return card;
}
