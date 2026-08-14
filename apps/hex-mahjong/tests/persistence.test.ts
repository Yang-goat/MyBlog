import { IDBFactory } from "fake-indexeddb";
import { describe, expect, it } from "vitest";
import {
  MatchStorageError,
  createMatch,
  createSeededRandom,
  deleteStoredMatch,
  loadMatch,
  migrateStoredMatch,
  saveMatch,
} from "../src/domain";

describe("IndexedDB persistence and migrations", () => {
  it("round-trips and explicitly deletes a JSON match", async () => {
    const indexedDb = new IDBFactory();
    const match = createMatch(
      { mode: "party", players: ["东家", "南家", "西家", "北家"] },
      createSeededRandom(3),
    );
    await saveMatch(match, indexedDb);
    expect(await loadMatch(indexedDb)).toEqual(match);
    await deleteStoredMatch(indexedDb);
    expect(await loadMatch(indexedDb)).toBeNull();
  });

  it("migrates an unversioned legacy score/history shape", () => {
    const current = createMatch(
      { mode: "strategy", players: ["东家", "南家", "西家", "北家"] },
      createSeededRandom(4),
    );
    const legacy = JSON.parse(JSON.stringify(current)) as Record<string, any>;
    delete legacy.schemaVersion;
    legacy.history = legacy.undoStack;
    delete legacy.undoStack;
    for (const player of legacy.players) {
      player.score = player.totalScore;
      delete player.totalScore;
    }
    const migrated = migrateStoredMatch(legacy);
    expect(migrated.schemaVersion).toBe(1);
    expect(migrated.players.map((player) => player.totalScore)).toEqual([0, 0, 0, 0]);
    expect(migrated.undoStack).toEqual([]);
  });

  it("never silently clears a corrupt or future-version save", () => {
    expect(() => migrateStoredMatch({ schemaVersion: 999 })).toThrow(MatchStorageError);
    expect(() => migrateStoredMatch("not a match")).toThrow(MatchStorageError);
  });
});
