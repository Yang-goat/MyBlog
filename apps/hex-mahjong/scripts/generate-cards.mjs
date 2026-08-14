import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildCatalog, validateCatalog } from "./cards-lib.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "../../..");
const handoffDirectory = resolve(repositoryRoot, process.argv[2] ?? "海克斯麻将网站版交接包_v1");
const sourceDirectory = resolve(handoffDirectory, "source-data");
const outputPath = resolve(scriptDirectory, "../src/data/cards.v1.2.json");

const catalog = await buildCatalog(
  resolve(sourceDirectory, "海克斯麻将卡牌文字库_v0.2.md"),
  resolve(sourceDirectory, "192张卡牌印刷映射表.csv"),
);
const errors = validateCatalog(catalog);
if (errors.length > 0) {
  throw new Error(`Generated card catalog is invalid:\n- ${errors.join("\n- ")}`);
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
console.log(`Generated ${catalog.cards.length} cards at ${outputPath}`);
