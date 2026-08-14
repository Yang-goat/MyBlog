import { describe, expect, it } from "vitest";
import { discardHeldCards, drawCardId, holdCard } from "../src/domain/decks";
import type { DeckState } from "../src/domain";

describe("deck lifecycle", () => {
  it("reshuffles the discard pile only when the draw pile is exhausted", () => {
    const deck: DeckState = {
      key: "opportunity",
      drawPile: ["O-P01"],
      discardPile: ["O-P02", "O-P03"],
      held: {},
      reshuffleCount: 0,
    };
    expect(drawCardId(deck, () => 0)).toBe("O-P01");
    expect(deck.reshuffleCount).toBe(0);
    expect(drawCardId(deck, () => 0)).toBe("O-P02");
    expect(deck.reshuffleCount).toBe(1);
    expect(deck.discardPile).toEqual([]);
  });

  it("prevents two active instances from holding the same numbered card", () => {
    const deck: DeckState = {
      key: "world",
      drawPile: [],
      discardPile: [],
      held: {},
      reshuffleCount: 0,
    };
    holdCard(deck, "W-01", "first");
    expect(() => holdCard(deck, "W-01", "second")).toThrow(/already held/);
    discardHeldCards(deck, [{ cardId: "W-01", instanceId: "first" }]);
    expect(deck.held).toEqual({});
    expect(deck.discardPile).toEqual(["W-01"]);
  });
});
