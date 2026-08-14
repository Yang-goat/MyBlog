import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { EXPECTED_CATEGORY_COUNTS, EXPECTED_MODE_COUNTS, validateCatalog } from "./cards-lib.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const catalogPath = resolve(scriptDirectory, "../src/data/cards.v1.2.json");
const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
const errors = validateCatalog(catalog);

if (errors.length > 0) {
  console.error(`Card data validation failed:\n- ${errors.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.log(`Validated ${catalog.cards.length} unique cards.`);
  console.log(`Categories: ${Object.entries(EXPECTED_CATEGORY_COUNTS).map(([key, value]) => `${key}=${value}`).join(", ")}`);
  console.log(`Modes: ${Object.entries(EXPECTED_MODE_COUNTS).map(([key, value]) => `${key}=${value}`).join(", ")}`);
}
