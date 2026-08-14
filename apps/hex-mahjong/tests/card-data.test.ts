import { describe, expect, it } from "vitest";
import { CARD_CATALOG, CARD_DEFINITIONS } from "../src/data";

describe("production card catalog", () => {
  it("contains the complete unique 192-card library", () => {
    expect(CARD_CATALOG.contentVersion).toBe("1.2");
    expect(CARD_CATALOG.libraryVersion).toBe("0.2");
    expect(CARD_DEFINITIONS).toHaveLength(192);
    expect(new Set(CARD_DEFINITIONS.map((card) => card.id)).size).toBe(192);
  });

  it("has the approved category and mode counts", () => {
    expect(countBy("category")).toEqual({
      "black-contract": 16,
      fun: 36,
      gold: 18,
      "normal-contract": 24,
      opportunity: 36,
      prismatic: 18,
      silver: 18,
      treasure: 10,
      world: 16,
    });
    expect(CARD_DEFINITIONS.filter((card) => card.modes.includes("strategy"))).toHaveLength(138);
    expect(CARD_DEFINITIONS.filter((card) => card.modes.includes("party"))).toHaveLength(176);
    expect(CARD_DEFINITIONS.filter((card) => card.modes.includes("full"))).toHaveLength(192);
  });

  it("preserves authoritative ids, text, metadata, and module exclusions", () => {
    const contracts = CARD_DEFINITIONS.filter((card) => card.category === "normal-contract");
    expect(contracts.map((card) => card.id)).toEqual(
      Array.from({ length: 24 }, (_, index) => `C-${String(index + 1).padStart(2, "0")}`),
    );
    const c24 = contracts.at(-1)!;
    expect(c24.name).toBe("宝牌同行");
    expect(c24.text).toBe("胡牌时，完整牌型中至少包含1张本局宝牌。");
    expect(c24.validation).toBe("隐藏验证");
    expect(c24.modes).toEqual(["full"]);

    const partyOnlyTreasureChallenge = CARD_DEFINITIONS.find((card) => card.id === "F-S01")!;
    expect(partyOnlyTreasureChallenge.modules).toEqual(["fun", "treasure"]);
    expect(partyOnlyTreasureChallenge.modes).toEqual(["full"]);
  });
});

function countBy(property: "category") {
  return Object.fromEntries(
    [...new Set(CARD_DEFINITIONS.map((card) => card[property]))]
      .sort()
      .map((value) => [value, CARD_DEFINITIONS.filter((card) => card[property] === value).length]),
  );
}
