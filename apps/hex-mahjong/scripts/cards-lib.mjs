import { readFile } from "node:fs/promises";

export const CATEGORY_BY_SOURCE_NAME = Object.freeze({
  世界牌: "world",
  机遇牌: "opportunity",
  欢乐挑战牌: "fun",
  银色强化: "silver",
  金色强化: "gold",
  棱彩强化: "prismatic",
  普通契约: "normal-contract",
  黑色契约: "black-contract",
  宝牌令: "treasure",
});

export const EXPECTED_CATEGORY_COUNTS = Object.freeze({
  world: 16,
  opportunity: 36,
  fun: 36,
  silver: 18,
  gold: 18,
  prismatic: 18,
  "normal-contract": 24,
  "black-contract": 16,
  treasure: 10,
});

export const EXPECTED_MODE_COUNTS = Object.freeze({
  strategy: 138,
  party: 176,
  full: 192,
});

const FUN_LINKED_IDS = new Set(["W-14", "O-C09", "S-17"]);
const TREASURE_LINKED_IDS = new Set(["W-13", "O-X09", "S-16", "P-14", "C-24", "F-S01"]);
const CARD_HEADING = /^#{2,3}\s+((?:[WSGPCTB]-\d{2})|(?:O-[PNCX]\d{2})|(?:F-[TIRS]\d{2}))\s+(.+?)\s*$/;
const FIELD_LINE = /^- \*\*([^*]+)\*\*：(.+)$/;

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        value += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        value += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(value);
      value = "";
    } else if (char === "\n") {
      row.push(value.replace(/\r$/, ""));
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }

  if (quoted) throw new Error("CSV contains an unterminated quoted field.");
  if (value.length > 0 || row.length > 0) {
    row.push(value.replace(/\r$/, ""));
    rows.push(row);
  }

  const [headers, ...body] = rows;
  if (!headers) return [];
  return body.map((cells, rowIndex) => {
    if (cells.length !== headers.length) {
      throw new Error(`CSV row ${rowIndex + 2} has ${cells.length} fields; expected ${headers.length}.`);
    }
    return Object.fromEntries(headers.map((header, column) => [header, cells[column]]));
  });
}

function parseMarkdownCards(text) {
  const lines = text.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").split("\n");
  const entries = [];

  for (let index = 0; index < lines.length; index += 1) {
    const heading = CARD_HEADING.exec(lines[index]);
    if (!heading) continue;

    let end = index + 1;
    while (end < lines.length && !/^#{1,3}\s+/.test(lines[end])) end += 1;
    const bodyLines = lines.slice(index + 1, end);
    while (bodyLines.length > 0 && (bodyLines.at(-1)?.trim() === "" || bodyLines.at(-1)?.trim() === "---")) {
      bodyLines.pop();
    }

    const fields = [];
    for (const line of bodyLines) {
      const field = FIELD_LINE.exec(line);
      if (field) fields.push({ label: field[1].trim(), value: field[2].trim() });
    }

    entries.push({
      id: heading[1],
      name: heading[2].trim(),
      fields,
      rawMarkdown: [lines[index], ...bodyLines].join("\n").trim(),
    });
  }

  return entries;
}

function firstField(fields, label) {
  return fields.find((field) => field.label === label)?.value ?? null;
}

function allFields(fields, label) {
  return fields.filter((field) => field.label === label).map((field) => field.value);
}

function subcategoryFor(id) {
  if (id.startsWith("O-P")) return "positive";
  if (id.startsWith("O-N")) return "negative";
  if (id.startsWith("O-C")) return "choice";
  if (id.startsWith("O-X")) return "chaos";
  if (id.startsWith("F-T")) return "tile-challenge";
  if (id.startsWith("F-I")) return "instant";
  if (id.startsWith("F-R")) return "round-response";
  if (id.startsWith("F-S")) return "social";
  return null;
}

function modulesFor(category, tags) {
  const modules = new Set();
  if (category === "fun") modules.add("fun");
  if (category === "treasure") modules.add("treasure");
  if (tags.some((tag) => tag.includes("欢乐挑战"))) modules.add("fun");
  if (tags.some((tag) => tag.includes("宝牌"))) modules.add("treasure");
  return ["fun", "treasure"].filter((module) => modules.has(module));
}

function textFor(fields) {
  const body = firstField(fields, "卡面正文");
  if (body) return body;
  const actionLabels = ["指定牌", "单张动作", "双张动作", "替代动作"];
  return fields
    .filter((field) => actionLabels.includes(field.label))
    .map((field) => `${field.label}：${field.value}`)
    .join("\n");
}

export async function buildCatalog(markdownPath, csvPath) {
  const [markdownText, csvText] = await Promise.all([
    readFile(markdownPath, "utf8"),
    readFile(csvPath, "utf8"),
  ]);
  const markdownCards = parseMarkdownCards(markdownText);
  const csvRows = parseCsv(csvText.replace(/^\uFEFF/, ""));
  const markdownById = new Map(markdownCards.map((card) => [card.id, card]));

  if (markdownCards.length !== 192) {
    throw new Error(`Expected 192 Markdown card entries, found ${markdownCards.length}.`);
  }
  if (csvRows.length !== 192) {
    throw new Error(`Expected 192 CSV rows, found ${csvRows.length}.`);
  }

  const cards = csvRows.map((row) => {
    const markdown = markdownById.get(row["编号"]);
    if (!markdown) throw new Error(`CSV card ${row["编号"]} is missing from the Markdown library.`);
    if (markdown.name !== row["卡名"]) {
      throw new Error(`Name mismatch for ${row["编号"]}: Markdown=${markdown.name}; CSV=${row["卡名"]}.`);
    }
    const category = CATEGORY_BY_SOURCE_NAME[row["牌库"]];
    if (!category) throw new Error(`Unknown category ${row["牌库"]} for ${row["编号"]}.`);

    const tags = allFields(markdown.fields, "标签");
    const modes = [
      row["策略模式"] === "是" ? "strategy" : null,
      row["聚会模式"] === "是" ? "party" : null,
      row["全模块模式"] === "是" ? "full" : null,
    ].filter(Boolean);

    return {
      id: markdown.id,
      name: markdown.name,
      category,
      categoryName: row["牌库"],
      subcategory: subcategoryFor(markdown.id),
      text: textFor(markdown.fields),
      timing: firstField(markdown.fields, "时机"),
      duration: firstField(markdown.fields, "持续时间"),
      frequency: firstField(markdown.fields, "频率"),
      validation: firstField(markdown.fields, "验证"),
      trigger: firstField(markdown.fields, "触发者"),
      triggerLimit: firstField(markdown.fields, "触发上限"),
      designatedTile: firstField(markdown.fields, "指定牌"),
      singleAction: firstField(markdown.fields, "单张动作"),
      doubleAction: firstField(markdown.fields, "双张动作"),
      alternativeAction: firstField(markdown.fields, "替代动作"),
      notes: [...allFields(markdown.fields, "说明"), ...allFields(markdown.fields, "补充")],
      tags,
      replacementRule: firstField(markdown.fields, "替换规则"),
      modules: modulesFor(category, tags),
      modes,
      frontTemplate: row["正面模板"],
      backTemplate: row["背面模板"],
      suggestedCopies: Number(row["建议印数"]),
      fields: markdown.fields,
      rawMarkdown: markdown.rawMarkdown,
    };
  });

  const csvIds = new Set(csvRows.map((row) => row["编号"]));
  for (const markdown of markdownCards) {
    if (!csvIds.has(markdown.id)) throw new Error(`Markdown card ${markdown.id} is missing from the CSV mapping.`);
  }

  return {
    schemaVersion: 1,
    contentVersion: "1.2",
    libraryVersion: "0.2",
    cards,
  };
}

function range(prefix, count) {
  return Array.from({ length: count }, (_, index) => `${prefix}${String(index + 1).padStart(2, "0")}`);
}

export function expectedCardIds() {
  return [
    ...range("W-", 16),
    ...range("O-P", 9),
    ...range("O-N", 9),
    ...range("O-C", 9),
    ...range("O-X", 9),
    ...range("F-T", 14),
    ...range("F-I", 8),
    ...range("F-R", 8),
    ...range("F-S", 6),
    ...range("S-", 18),
    ...range("G-", 18),
    ...range("P-", 18),
    ...range("C-", 24),
    ...range("B-", 16),
    ...range("T-", 10),
  ];
}

function expectedModes(card) {
  const isFun = card.category === "fun" || FUN_LINKED_IDS.has(card.id);
  const isTreasure = card.category === "treasure" || TREASURE_LINKED_IDS.has(card.id);
  return [
    !isFun && !isTreasure ? "strategy" : null,
    !isTreasure ? "party" : null,
    "full",
  ].filter(Boolean);
}

function sameValues(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function validateCatalog(catalog) {
  const errors = [];
  const cards = Array.isArray(catalog?.cards) ? catalog.cards : [];
  if (catalog?.schemaVersion !== 1) errors.push("Catalog schemaVersion must be 1.");
  if (catalog?.contentVersion !== "1.2") errors.push("Catalog contentVersion must be 1.2.");
  if (catalog?.libraryVersion !== "0.2") errors.push("Catalog libraryVersion must be 0.2.");
  if (cards.length !== 192) errors.push(`Expected 192 cards, found ${cards.length}.`);

  const ids = cards.map((card) => card.id);
  const uniqueIds = new Set(ids);
  if (uniqueIds.size !== ids.length) {
    const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
    errors.push(`Duplicate card ids: ${duplicateIds.join(", ")}.`);
  }

  const expectedIds = expectedCardIds();
  const missing = expectedIds.filter((id) => !uniqueIds.has(id));
  const unexpected = ids.filter((id) => !expectedIds.includes(id));
  if (missing.length) errors.push(`Missing card ids: ${missing.join(", ")}.`);
  if (unexpected.length) errors.push(`Unexpected card ids: ${unexpected.join(", ")}.`);

  for (const [category, expected] of Object.entries(EXPECTED_CATEGORY_COUNTS)) {
    const actual = cards.filter((card) => card.category === category).length;
    if (actual !== expected) errors.push(`Category ${category}: expected ${expected}, found ${actual}.`);
  }

  for (const [mode, expected] of Object.entries(EXPECTED_MODE_COUNTS)) {
    const actual = cards.filter((card) => card.modes?.includes(mode)).length;
    if (actual !== expected) errors.push(`Mode ${mode}: expected ${expected}, found ${actual}.`);
  }

  for (const card of cards) {
    if (!card.name || !card.text || !Array.isArray(card.fields) || card.fields.length === 0) {
      errors.push(`${card.id ?? "Unknown card"} is missing its exact name, text, or metadata fields.`);
    }
    const modes = Array.isArray(card.modes) ? card.modes : [];
    const expected = expectedModes(card);
    if (!sameValues(modes, expected)) {
      errors.push(`${card.id} modes must be ${expected.join("/")}; found ${modes.join("/")}.`);
    }
  }

  const normalContractIds = cards
    .filter((card) => card.category === "normal-contract")
    .map((card) => card.id);
  const expectedNormalContracts = range("C-", 24);
  if (!sameValues(normalContractIds, expectedNormalContracts)) {
    errors.push("Normal contracts must be exactly C-01 through C-24 in numeric order.");
  }

  const blackContractIds = cards
    .filter((card) => card.category === "black-contract")
    .map((card) => card.id);
  if (!sameValues(blackContractIds, range("B-", 16))) {
    errors.push("Black contracts must be exactly B-01 through B-16 in numeric order.");
  }

  return errors;
}
