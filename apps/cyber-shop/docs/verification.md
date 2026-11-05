# Demo 验收记录

验证日期：2026-11-05。基线为 `bb582f03a`，功能分支为 `codex/cyber-shop-demo`。最终游戏数值版本为 `demo-2`；前一次 `demo-1` 的记录保存在 `evidence/initial-demo1/`，不混作最终产物证据。

## 最终本机验收

| 范围 | 实际结果 |
| --- | --- |
| 规则、存档、内容 | 5 个测试文件、44 项全部通过；Vue/TypeScript 类型检查通过 |
| 三条专精路线 | 固定种子 42，全程正常规则动作，第 22 日通关，47 个案例、9 点技能点；未直接修改胜利标志 |
| 无尽成长 | 规则回归涵盖古董证书、维修、新人物、全部 24 技能最终可达 |
| 最终正常 UI | 565 次主要操作，90.124 秒自动操作；第 16 日胜利，累计 11 点、35 件维修、65 笔交易；保存结局并继续至第 26 日 |
| 六类与古董 | 六类商品均实际收购和售出；取得古董证书，完成 5 件古董客户维修；第 26 日累计 16 点、55 件维修、105 笔交易 |
| 界面与输入 | 库存原生拖放、1200×800 窗口下 Phaser 拖放、全屏与 90% CSS 渲染缩放拖放、弹窗隔离通过；844×390 真触控完成客户维修和无故障旧货翻新，无横向溢出 |
| 存档与声音 | 免费及付费技能重配保持资产，不重复返还；损坏导入保留原档；导出导入、结局刷新继续通过；AudioContext 为 running |
| 美术 | 66/66：64 项逐项 AI 生成、2 项经用户授权原创绘制；5,109,798 字节，62 张透明素材有效；实际浏览器解码、MIME、SHA256 全部通过 |
| 浏览器错误 | 完整流程与最终冒烟均无控制台错误；完整流程无缺失资源 |
| VuePress | 完整整站构建退出 0，617 页；结构校验 364 Markdown、38 板块、79,255 本地引用，无错误 |
| 海克斯麻将 | 192 张卡牌校验通过，16 项测试通过；真实点击介绍页进入主持台、创建比赛，打开新游戏后 IndexedDB 原存档字节不变 |
| 视觉检查 | 已查看最终柜台、触屏工作台、结局、技能、收藏、博客介绍页及 66 项素材总览；技能原始浏览器客户端完成两轮场景截图与状态输出 |

主线约两小时是内容节奏目标。自动脚本略过阅读和思考，实际自动操作耗时不能作为人的首次通关时长。数值修订依据见[试玩数值记录](balance-notes.md)。

电子备件与绝缘材料的图像工具输出各被审核拒绝两次。用户明确授权后，分别用独立源码原创绘制；资产清单保留失败记录，并标记 `original-drawn`。门禁只允许这两个 ID 使用该来源，其余 64 项保持 `generated` / `image_gen` 要求。

初版 `demo-1` 的 556 次操作、89.752 秒及图片加载错误保存在 `evidence/initial-demo1/`，仅为历史流程证据。窄窗口拖放修复前的失败保存在 `evidence/ui-smoke/pre-fix-failure.*`。最终可见范围定位已经通过真实输入复测。

## 已执行命令

以下命令均退出 0；独立应用产物检查确认两个入口及 66 张发布图片与源文件一致。

```powershell
pnpm.cmd cyber:validate
pnpm.cmd cyber:test
pnpm.cmd cyber:typecheck
pnpm.cmd site:build
node scripts/validate-content-structure.mjs
node scripts/check-independent-apps.mjs
git diff --check
git status --short
```

海克斯麻将另外执行 `pnpm.cmd hex:validate`、`pnpm.cmd hex:test`，分别验证 192 张卡牌和 16 项测试。最终台面位置微调另执行 `pnpm.cmd cyber:build`，并再次通过完整界面冒烟与截图检查。

浏览器脚本为 `scripts/ui-playthrough.mjs`、`scripts/ui-smoke.mjs` 和 `scripts/ui-assets.mjs`，前两者使用真实 DOM/鼠标/触控操作与只读玩家状态输出。完整流程从新游戏玩到结局并继续无尽，没有导入测试用胜利状态。冒烟从前者正常导出的存档继续验证，并使用独立新局完成触控维修；素材脚本逐图解码和比对源文件哈希。

测试使用桌面现有 Playwright 与本机 Chrome。重跑时将 `CYBER_PLAYWRIGHT_PATH` 指向已有 Playwright 的 `index.mjs`，`CYBER_CHROMIUM_PATH` 指向 Chrome 可执行文件，然后运行：

```powershell
node --import ./apps/cyber-shop/scripts/runtime-loader.mjs ./apps/cyber-shop/scripts/ui-playthrough.mjs
node --import ./apps/cyber-shop/scripts/runtime-loader.mjs ./apps/cyber-shop/scripts/ui-smoke.mjs
node --import ./apps/cyber-shop/scripts/runtime-loader.mjs ./apps/cyber-shop/scripts/ui-assets.mjs
```

结果见 [完整流程](../evidence/ui-playthrough/result.json)、[界面冒烟](../evidence/ui-smoke/result.json)、[逐图解码](../evidence/art-browser.json)；截图见 [最终柜台](../evidence/counter-final.png)、[横屏维修](../evidence/ui-smoke/touch-workbench.png)、[经营权结局](../evidence/ui-playthrough/victory.png)、[素材总览](../evidence/art-contact-sheet.png)。

Skill 原始脚本 `develop-web-game/scripts/web_game_playwright_client.js` 也纳入验证。当前桌面自带 Playwright 包对应的测试浏览器未安装，测试通过 `CYBER_PLAYWRIGHT_PATH` 与 `CYBER_CHROMIUM_PATH` 显式复用桌面运行库及本机 Chrome，未新增全局依赖。

## 警告与环境边界

- Phaser 单独懒加载块约 1.20 MB（gzip 319 KB），Vite 给出 500 KB chunk 建议。游戏首屏先载入标题场景；进入店铺才下载引擎，其余人物与物品按当前场景加载。没有关闭构建诊断。
- pnpm 安装显示已有传递依赖弃用提示。锁文件最终只增加新游戏 importer、Phaser 和 eventemitter3，没有升级博客原有依赖。
- pnpm 存储链接、Vitest 临时目录和预览套接字在沙箱内受限。相同命令通过工具审批后运行成功，未修改全局沙箱或系统环境。
- Git 的 LF/CRLF 转换提示与空白错误分开处理；局部改动保留原文件格式。

## 部署边界

功能分支与 PR 只验证。GitHub Pages 配置、上传、部署均限定 `main`，包含手动触发。完成本地最终门禁和功能分支 CI 后才合并发布。

正式入口为 [赛博杂货铺](https://goatyang.com/cyber-shop/)，部署工作流见 [GitHub Actions](https://github.com/Yang-goat/MyBlog/actions/workflows/deploy.yml)。线上验收需核对真实 HTML、资源 MIME、内容哈希和运行页面，不能由本机构建结果代替。

发布后的提交、CI 与线上核验记录保存在本机 `evidence/online/`。该目录不提交到版本库，避免记录发布提交本身导致额外部署。

本机预览保留在 <http://127.0.0.1:4176/cyber-shop/>；停止及重启方式见 [README](../README.md)。

## 店铺空间改版补充（2026-11-05，未发布）

本节记录当前工作区改版，不覆盖上面的历史版本验收。实现和观察边界见 [参考观察](reference-observations.md)；正常输入回归脚本为 `scripts/ui-room.mjs`，截图及状态为 `evidence/room-redesign/`。新布局已验证手动摆放、未付款入库拦截、维修教学、购买后柜台暂存再入库、库存出售、刷新恢复与跨日。测试使用真实鼠标和键盘，不直接写入经营状态。新布局的全主线通关和真实触摸输入尚未重跑。

本轮最终检查：`pnpm.cmd cyber:test` 为 7 文件、55 项通过；`cyber:build`、`cyber:validate`、`site:check-apps` 通过，66张发布图一致。`site:build` 渲染617页，最终游戏单独重建；结构检查通过。完整界面回归为 `ui-room.mjs`（含扩容及存档）和 `ui-batch.mjs`（单件后批发购买、单件后多件出售、剩余预算）。批发门槛为同次至少3件九折，非原游戏实测规则。当前开发预览端口4175，未发布本轮更改。正方形台面候选按用户要求弃用，保留v3背景与横向深色格线。原版未实测的框选多货、生活需求、特性等仍不宣称实现。

## 全窗口与物品交互（2026-11-05）

本次增量：上下栏撤除，电视显示时间/现金，右下设备菜单；鼠标信息卡、右键菜单、触屏详情与长按；首日及次日通过绿色按钮主动叫号。规则测试56项通过，游戏构建与整站独立应用产物检查通过，Phaser大块警告既有。浏览器证据 `evidence/immersive-room/results.json` 和对应截图验证四种窗口全覆盖、无页面溢出、六个菜单、悬浮信息、实际右键操作、跨日叫号、模拟触屏点按与长按；另已回归 `ui-room.mjs` 和 `ui-batch.mjs`。本轮没有部署，也没有重新进行完整主线或实体手机验收。

## 谈判台整理中转（2026-11-05）

自有库存可在没有顾客时移到谈判台、保留其他物品原位、腾出仓库格子；不可移到店外。台面位置保存，切换顾客不清空。闭店前检查台面，自有货物必须入库；阻止闭店时状态和现金不变。买家可收购符合类别的台面自有货物。

`pnpm.cmd cyber:test` 为9文件、59项通过；`pnpm.cmd cyber:build`（含类型检查）、`pnpm.cmd site:check-apps` 通过。新增 `scripts/ui-counter-buffer.mjs` 用实际拖动验证无顾客中转、复用腾出格位、店外放置拦截、刷新恢复、未入库闭店拦截及入库后闭店；结果与截图见 `evidence/counter-buffer/`。`ui-room.mjs` 和 `ui-batch.mjs` 回归通过，浏览器错误为0。首次中转检查发现新局未记录格位时剩余库存自动补位，已修复并复测；首次失败截图保留。Phaser大块警告沿用，本轮未部署。

## 谈判台红绿预览（2026-11-05）

谈判台与仓库共用占格预览样式，落位和预览使用一致的网格坐标及碰撞判断。`scripts/ui-placement-preview.mjs` 验证拖动与点选时的可放/重叠/越界颜色、旋转更新、取消清除、自身排除、来货与自有暂存物之间的碰撞；直接比对两个区域的边框与填充色。结果及已查看截图在 `evidence/placement-preview/`。`ui-counter-buffer.mjs` 回归通过，两者浏览器错误为0；技能自带客户端另完成基础冒烟。

`pnpm.cmd cyber:build`（含类型检查）、`pnpm.cmd site:check-apps`、`git diff --check` 通过。Phaser大块警告为既有；本次只改物品放置交互，没有重复运行核心规则测试或全主线，本轮未部署。
