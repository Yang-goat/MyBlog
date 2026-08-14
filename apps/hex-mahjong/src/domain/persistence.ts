import { MATCH_SCHEMA_VERSION } from "./match";
import type { MatchPhase, MatchState } from "./types";

const DATABASE_NAME = "hex-mahjong";
const DATABASE_VERSION = 1;
const STORE_NAME = "match-state";
const CURRENT_MATCH_KEY = "current";

const MATCH_PHASES: readonly MatchPhase[] = [
  "ready",
  "augment-selection",
  "contract-selection",
  "playing",
  "settlement",
  "finished",
];

export class MatchStorageError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "MatchStorageError";
  }
}

export async function saveMatch(
  match: MatchState,
  indexedDb: IDBFactory | undefined = globalThis.indexedDB,
): Promise<void> {
  const database = await openDatabase(indexedDb);
  try {
    await requestAsPromise(database.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).put(match, CURRENT_MATCH_KEY));
  } catch (error) {
    throw new MatchStorageError("比赛状态无法写入本地存储。请检查浏览器的隐私或存储设置。", { cause: error });
  } finally {
    database.close();
  }
}

export async function loadMatch(
  indexedDb: IDBFactory | undefined = globalThis.indexedDB,
): Promise<MatchState | null> {
  const database = await openDatabase(indexedDb);
  try {
    const stored = await requestAsPromise<unknown>(
      database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(CURRENT_MATCH_KEY),
    );
    return stored === undefined ? null : migrateStoredMatch(stored);
  } catch (error) {
    if (error instanceof MatchStorageError) throw error;
    throw new MatchStorageError("已保存的比赛无法读取；原存档未被清除。", { cause: error });
  } finally {
    database.close();
  }
}

export async function deleteStoredMatch(
  indexedDb: IDBFactory | undefined = globalThis.indexedDB,
): Promise<void> {
  const database = await openDatabase(indexedDb);
  try {
    await requestAsPromise(database.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).delete(CURRENT_MATCH_KEY));
  } catch (error) {
    throw new MatchStorageError("本地比赛存档无法删除。", { cause: error });
  } finally {
    database.close();
  }
}

export const clearStoredMatch = deleteStoredMatch;

/** Pure migration entrypoint, also used by tests before anything touches IndexedDB. */
export function migrateStoredMatch(stored: unknown): MatchState {
  if (!stored || typeof stored !== "object" || Array.isArray(stored)) {
    throw new MatchStorageError("本地比赛存档格式无效；原存档未被清除。");
  }
  const source = deepClone(stored as Record<string, unknown>);
  const version = typeof source.schemaVersion === "number" ? source.schemaVersion : 0;
  if (version > MATCH_SCHEMA_VERSION) {
    throw new MatchStorageError(`存档版本 ${version} 高于当前应用支持的版本 ${MATCH_SCHEMA_VERSION}。`);
  }

  let migrated = source;
  if (version === 0) migrated = migrateVersionZero(migrated);
  assertCurrentMatch(migrated);
  return migrated as unknown as MatchState;
}

function migrateVersionZero(source: Record<string, unknown>): Record<string, unknown> {
  const legacyHistory = Array.isArray(source.undoStack)
    ? source.undoStack
    : Array.isArray(source.undoHistory)
      ? source.undoHistory
      : Array.isArray(source.history)
      ? source.history
        : [];
  const players = Array.isArray(source.players)
    ? source.players.map((player) => {
        if (!player || typeof player !== "object" || Array.isArray(player)) return player;
        const record = player as Record<string, unknown>;
        const { score: _legacyScore, ...currentPlayer } = record;
        return {
          ...currentPlayer,
          totalScore: typeof record.totalScore === "number" ? record.totalScore : Number(record.score ?? 0),
          contract: record.contract ?? null,
          augments: record.augments ?? {},
        };
      })
    : source.players;
  const { history: _history, undoHistory: _undoHistory, ...currentSource } = source;

  return {
    ...currentSource,
    schemaVersion: MATCH_SCHEMA_VERSION,
    contentVersion: source.contentVersion ?? "1.2",
    rulesVersion: source.rulesVersion ?? "1.2",
    players,
    currentRound: source.currentRound ?? null,
    roundRecords: source.roundRecords ?? [],
    nextInstanceSequence: source.nextInstanceSequence ?? 1,
    undoStack: legacyHistory,
  };
}

function assertCurrentMatch(value: Record<string, unknown>): void {
  if (value.schemaVersion !== MATCH_SCHEMA_VERSION) {
    throw new MatchStorageError(`存档迁移未能生成版本 ${MATCH_SCHEMA_VERSION}。`);
  }
  if (value.contentVersion !== "1.2" || value.rulesVersion !== "1.2") {
    throw new MatchStorageError("存档的规则或卡牌数据版本不受支持。");
  }
  if (typeof value.mode !== "string" || !["strategy", "party", "full"].includes(value.mode)) {
    throw new MatchStorageError("存档缺少有效的游戏模式。");
  }
  if (typeof value.phase !== "string" || !MATCH_PHASES.includes(value.phase as MatchPhase)) {
    throw new MatchStorageError("存档缺少有效的比赛阶段。");
  }
  if (!Array.isArray(value.players) || value.players.length !== 4) {
    throw new MatchStorageError("存档必须包含四名玩家。");
  }
  if (!value.decks || typeof value.decks !== "object" || Array.isArray(value.decks)) {
    throw new MatchStorageError("存档缺少牌库状态。");
  }
  if (!Array.isArray(value.roundRecords) || !Array.isArray(value.undoStack)) {
    throw new MatchStorageError("存档缺少局记录或撤销记录。");
  }
}

async function openDatabase(indexedDb: IDBFactory | undefined): Promise<IDBDatabase> {
  if (!indexedDb) {
    throw new MatchStorageError("当前浏览器不支持 IndexedDB，比赛不会被静默清空。");
  }
  try {
    const request = indexedDb.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) request.result.createObjectStore(STORE_NAME);
    };
    return await requestAsPromise(request);
  } catch (error) {
    throw new MatchStorageError("无法打开本地比赛存储。", { cause: error });
  }
}

function requestAsPromise<T = IDBValidKey>(request: IDBRequest<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed."));
  });
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
