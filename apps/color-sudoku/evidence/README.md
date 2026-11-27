# 实机与证明

`edition-proofs.json` 由 `node scripts/verify-edition.ts --record` 产生。每一页保留行列线索、公开种子、主证明以及备用种子证明。`axis` / `line` 选一行或一列（从 0 开始）；`possibilities` 是用当前已知格筛过后的合法放法数；`forced` 是这些放法共同确定的整批格子；`sealed` 是随之自动封空的其他位置。位置为自左上角起的行优先下标。

日常验收用只读的 `pnpm.cmd color:validate`；它重新证明题目、核对每次推理依据，并用与界面相同的 `play` 函数实际走到三次机会都在的终局。`route` 统计完整可行推理链，与最终图案唯一性分开。

整站实测见[浏览器验收记录](browser-acceptance.json)和[作品集封面](../../../src/.vuepress/public/assets/ai-portfolio/color-sudoku.webp)。封面来自扩展版 7×7 实机中盘，以 1200×675 像素输出。[通关揭晓](reveal.webp)、[手机放大定位](phone-board.webp)和[手机完整贴纸](phone-reveal.webp)是首发版的实测记录。

局部视觉和整站自动化使用本地 Chromium 与同一份真实界面。浏览器回归可指定已有 Playwright 的 `PLAYWRIGHT_MODULE`、浏览器可执行文件 `PLAYWRIGHT_CHROMIUM_EXECUTABLE` 及仅本机的 `SITE_ORIGIN`，从应用目录执行 `node scripts/browser-check.mjs --full`；额外屏幕截图与日志在忽略的 `output/playwright/`。
