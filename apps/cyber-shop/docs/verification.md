# 游戏验收记录

## 2026-11-13 分层店铺与修复师篇 0.2

本轮起点为 `main@9ab2b163f`，工作区干净。以下为本轮已完成的本机验证；后续章节保留 11 月 5 日历史记录。

| 范围 | 实际结果与证据 |
| --- | --- |
| 规则与存档 | 15 个测试文件、100 项通过；覆盖现金日结、章节目标、独立价签、旧存档兼容、批量珍品挑战、维修档案、工序预览、街区回信、欠费恢复与订货交付；类型检查通过 |
| 议价与成交 | 合理报价逐步让价、极端报价维持价格、剩余预算与逐件上限一致。正常界面三件来货还价 412、买家还价 97 后分别成交；刷新、换货阻止误接受、耐心耗尽与 844×390 实际触控通过，见 `negotiation-polished` |
| 街坊订货 | 12 种需求、六类商品，按实际检查结果与库存交货。正常界面完成饮水 100、电池 420 两单，排除实测容量不足的电池；上限、过期、取消、键盘、触控、导入和刷新通过，见 `deliveries-polished` |
| 欠费补救 | 正常花尽现金后，第 4 日停业、刷新、精确恢复当日开门备份；两次手动援助维修获得 620，补缴 340 后剩 280，进入第 5 日并重载一致。日结期限与任务板引导核对通过，见 `rescue-final` |
| 街区故事 | 四条委托各三封回信，只在真实领取后解锁；完成后获得四种纪念。免费行动也保留选择记录；实际新局验证首信、刷新、次日付费与正常成长存档的四条完成故事，桌面与横屏阅读通过，见 `district` |
| 维修决策 | 库存耗材、客户专款、现金补料、余料和回收按实际事务预览。手动校准正确应用技能/工具容差；多故障快捷维修处理选定项。正常 UI 从真实通关存档继续至第 27 日，原件修整、±9 容差、库存和专款核对通过；桌面/横屏截图已查看，见 `repair-decisions-final` |
| 维修档案与回访 | 真实操作记录收件、工序、交付、品相和实际报酬；跨日错误操作后成功交付、导出导入与刷新一致。最近 80 份档案保留且累计案例不重置，早期存档缺失字段继续兼容。回访对白只引用真实在手或已交付工单 |
| 完整流程 | `ui-journey.mjs` 在正式构建版与逐件货品开发版分别正常通关：第 16 日、35 件维修、66 笔交易，六类商品均买入和售出。保存结局、刷新、无尽经营、导出与导入一致；没有写入游戏状态或胜利标记 |
| 通关后 | 以 `CYBER_ENDLESS_DAYS=6` 从新局继续到第 23 日；第 22 日累计 47 件维修、90 笔交易，古董考核通过，批量维修挑战在第 19 日结算 1,500，真实来源核验后陈列 1 件旧物。无尽任务板改为古董资质、收藏、图鉴、技能与当前挑战；存档与错误检查通过 |
| 手动维修 | 接点擦拭、螺丝拆装、信号校准均通过；准备不扣工时、现金或专款，执行后才结算；844×390 模拟触屏实际点按完成清洁与执行。新分层维修台四种检测状态与已取得工具展示通过，减少动态会停止扫描动画 |
| 店铺成长 | 从正常通关的第 23 日存档继续买货、来源核验与陈列，第 25 日摆满六件真品；1440×960、960×650、844×390 两层布局、扩建与重载通过。经营权标识与展柜灯光随状态变化 |
| 工具与耗材采购 | 已拥有工具、设施上限、现金不足均正确禁用；五份清洁剂实际扣款 80，正常学习经营技能后为 68，数量与现金一致；滚动后关闭按钮可直接点击 |
| 交易细节 | 不同货品独立价签、逐件检查和刷新恢复通过；先买一件再批发三件、入库、单件后批量出售、预算内挑选与余货保留通过 |
| 任务与日结 | 四章路径、谢礼、现金收支收据、下一日入口由真实经营状态推导；欠费及到期食品提示已接入 |
| 表现与偏好 | 6 项独立街景/设备/纹理、程序店铺、分层维修台、天气/车流/灯光；减少动态冻结画面、正常动态改变画面但不推进经营。声音锁定与交互解锁、静音、环境音、音量、偏好刷新和全屏通过 |
| 可读性与键盘 | 修复深色对白框继承深色文字的问题；对白按最亮背景合成的对比度检查通过。任务/手记、交易与扩容面板焦点循环、Esc 与焦点返回通过 |
| 响应式 | 正式构建在 1920×948、1440×960、960×650、844×390 的全窗口布局、仓库正方格、初始六行、菜单、行情卡与触摸长按通过；844×390 另用纯触摸走通接客、手动维修、买货、入库、日结和第二天。叫号命中范围至少 44×44，长对白在窗口内滚动 |
| 素材门禁 | 原有 66 项资源及 6 项新分层素材全部通过。浏览器逐项解码 72 项、总计 5,612,888 字节，HTTP、MIME 与源文件哈希一致。旧整张店铺与维修台图明确归档；新素材共 640,618 字节，原始 PNG、完整提示词与哈希留存 |
| 整站 | 分层维修台与成长版本 `site:build` 退出 0、渲染 617 页；结构检查 364 Markdown、38 板块、79,254 本地引用，无错误；两款独立应用产物及图片一致。日志 `evidence/living-shop/growth-site-build.log` |

当前场景块约 10 KB，主包约 285 KB；没有继续加载旧 Phaser 场景块，本轮构建没有其旧大块警告。最终大小以发布构建为准。自动化脚本跳过阅读与思考，其运行时间不代表人的首次游玩时长。

本轮证据统一位于 `evidence/living-shop/`：`career-built`、`career-varied`、`repair-rig`、`batch`、`gameplay-polish`、`presentation`、`responsive-final`、`first-loop-final`、`touch-day`、`art-browser`。原始技能浏览器客户端也已执行并查看场景截图；其截图只含 Canvas，完整界面另由上述脚本截图检查。

后续成长阶段的正式构建证据为 `shop-growth-final`、`layered-bench-final`、`supplies-final`、`art-browser-72`。键盘回归在 `growth-focus`，技能客户端在 `growth-skill`。采购脚本原先未等待文件导入完成，出现面板关闭定位抢跑，已添加完成条件；主线脚本也同步修正等待。首次维修台的静态图片导入错误与 CSS 路径警告已局部修复，最终构建和浏览器均无该问题。

维修档案阶段的完整构建试玩位于 `archive-career`：第 16 日通关，继续至第 23 日，共 47 次经营维修、90 笔交易；存档实际含 50 份记录，其中客户维修 44 份、考核 3 份、中枢委托 3 份。保存结局、导入、刷新、古董考核和挑战均通过，控制台错误与缺失资源为零。跨日手动操作与横屏档案截图在 `repair-archive-polished`；技能客户端在 `archive-skill`。整站构建日志为 `archive-site-build.log`。

维修预览阶段再次通过完整主线与六个无尽营业日，结果在 `decisions-career`，仍为第 16 日通关、第 23 日继续、47 次维修和 90 笔交易，存档一致且无浏览器错误。`decisions-site-build.log` 记录整站退出 0、617 页；结构与独立应用门禁通过（364 Markdown、38 板块、79,254 引用、72 项美术资源）。技能原始客户端截图及状态在 `decisions-skill`。

街区回信版本整站构建为 `district-site-build.log`（退出 0、617 页），结构与独立应用产物检查通过。`district-focus` 复测了包含原生详情入口的焦点循环、Esc 与焦点返回，同时回归逐件检查和价格保存；原始技能客户端为 `district-skill`。本阶段核心经济只增加零金额行动记录，完整主线最近一次证据为上一阶段的 `decisions-career`。

已执行：`pnpm.cmd cyber:test`、`cyber:validate`、`cyber:typecheck`、`site:build`，`node scripts/validate-content-structure.mjs`、`node scripts/check-independent-apps.mjs`、`git diff --check`。新脚本均可用 `CYBER_URL` 指向开发、产物或线上入口，复用既有 Playwright 与 Chrome。没有安装依赖。

应用版本号调整为 0.2.0 后，当前 pnpm 的运行前检查自动尝试安装，被沙箱符号链接限制拦截。已核实依赖与锁文件没有改变，后续命令仅在当前进程设置 `$env:pnpm_config_verify_deps_before_run='warn'`，保留检查提示并避免自动安装；构建、类型与规则测试成功。没有修改全局配置。

当前尚未发布本轮代码。用户最新要求账户剩余 50% 时停止扩展并发布部署；继续通过账户实际额度读数跟踪。

欠费补救版本整站构建日志为 `rescue-site-build.log`（退出 0、617 页）。`ui-rescue.mjs` 以 `CYBER_EXPECT_RESCUE_UI=1` 校验新期限、任务优先级与完整恢复流程；基线旧提示保存在 `rescue-baseline`，通过结果在 `rescue-final`。当前主包 286.18 KB。原始技能客户端 `rescue-skill` 已执行，截图已查看。

订货版本主线重跑在 `deliveries-career`：从新局第 16 日通关，继续至第 23 日，47 次维修、90 笔交易，六类交易、古董考核、挑战与存档均通过。`deliveries-first` 为首次桌面结果；随后触控发现默认首单交货后自动切换来信，已固定选中 ID，失败保留 `deliveries-final`，最终桌面与触控复测通过 `deliveries-polished`。对应整站构建 `deliveries-site-build.log` 退出 0、617 页，结构与两应用门禁通过；主包 309.68 KB，原始技能客户端为 `deliveries-skill`，截图均已查看。

议价与教程版本的最终构建验证为 `negotiation-guide-site-build.log`：退出0、617页，结构与两应用/72素材门禁通过，主包321.25KB。`trade-desk-career-final` 从新局通关并继续至第23日，47次维修/90笔交易；六类买卖、古董资质、挑战和存档通过。`trade-desk-lean` 验证三种视口及触控还价和小票自动定位，`guide-final` 验证六章教程、原工单/清单返回、引导重启与键盘。技能客户端 `guide-skill` 已查看。首轮主线空清单按钮定位失败与教程图片加载等待失败保留在各自旧目录，未作为通过证据。

实体手册版本：`handbook-final` 验证仓库道具、库存入口、七个双页、三维翻页、目录跳转、键盘焦点、减少动态、引导重启、返回原操作与844×390触控。`handbook-batch` 方格/交易回归和 `handbook-touch-day-final` 首日纯触控流程通过；旧触控脚本使用了错误的来访对白按钮，失败保留并按实际类型修订定位。已查看书封、展开书页、翻页中间帧和横屏截图。新增两件手册素材，当前共74项，`handbook-art-74` 实际解码5990076字节且哈希一致。整站 `handbook-site-build.log` 退出0、617页，结构与两应用门禁通过；主包324.62KB，原始技能客户端 `handbook-skill` 已执行并查看。

## 2026-11-05 初版记录

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


## 嵌套箱包与可选开局条件（2026-11-14）

用户纠正后，箱包玩法为实际父子容器关系。NPC 携带四种款式，买入后在谈判台收货，箱内箱、包内包按格位收纳；外部堆叠实验已撤销。标准开局仓库仍为 144 格，缩小仓库只属于负面开局词条。未提交的外部堆叠实验截图保留为历史，不作为当前验收。

- 核心规则：17 文件、110 项测试通过，类型检查通过；覆盖 NPC 有限货源、空间几何、循环拒绝、预算/空箱转售、标签、旧存档和词条冲突。
- 正常 UI：`evidence/living-shop/nested-storage-final/` 验证四种箱包 NPC 购买、实际成交小票、四层嵌套、鼠标拖动、标签机、取出、整箱移动、刷新保持；另以 844×390 模拟触屏开启狭小仓库并买包套包。桌面与横屏词条窗口、收纳截图已查看，控制台和资源请求错误为零。
- 回归：`nested-batch`、`nested-handbook`、`nested-touch` 通过。`nested-career` 从全新标准开局，经第 16 日取得经营权，到第 23 日无尽经营，47 次维修、90 笔交易；覆盖六类商品买卖、古董证照、挑战及存档导出/导入。完整流程在最终成交小票/词条窗口样式之前运行，这两项增量另由最终专项 UI 回归覆盖。
- 技能原始客户端：`nested-skill/`；截图已查看。浏览器逐图解码与哈希验证共 79 项、6,275,140 字节。
- `site:build` 完成 617 页与两款应用；日志 `evidence/living-shop/nested-site-build.log`。结构检查 79,254 个本地引用，无错误；独立应用产物检查通过。无新增依赖，没有修改全局 pnpm 设置。

`containers-career` 的旧实验首次长流程使用开发端口，源文件编辑触发 HMR 后回到标题导致失败；固定构建端口 4176 后完整重跑通过，失败记录保留。当前嵌套版本的长流程同样使用固定端口。触控结果来自浏览器模拟，尚未实体手机验收。本阶段尚未推送部署。


## 局部箱包浮窗与三层上限（2026-11-14）

本节取代上一节独立收纳页的 UI 及四层演示；箱包 NPC 交易与五个可选开局词条保留。双击箱包在鼠标附近打开非模态格子框，内部箱包继续双击，店铺和原仓库保持可操作；窗口可拖动、置顶、逐个关闭。最多三层，最外层计第一层，整箱搬动也检查内部完整子树。

- `cyber:test` 17 文件、111 项通过；`cyber:build` 包含类型检查通过。存档边界拒绝第四层和循环。
- `floating-storage-final` 从新局正常购买四款箱包、组成三层，验证标签/颜色、跨窗搬运、箱内旋转、取回仓库、整箱移至谈判台、闭店阻止、移回、关闭/复开、刷新存档、重复打开不增加副本、越界红色预览、未购入物品拒绝入包及自动放置方向。844×390 模拟触屏用真实触摸事件拖动窗口、点选套包，窗口与正方格均在视口内。
- `floating-room` 原仓库交易/维修/日结、`floating-handbook` 实体教程、`floating-focus` 键盘焦点回归均通过。`floating-skill` 为技能原始客户端，截图已查看；专项桌面/横屏截图也已查看。控制台错误为零。
- `site:build` 退出 0、617 页，日志 `floating-site-build.log`；主包 349.53 KB，场景块 10.32 KB。结构检查 79,254 引用无错误，两应用产物门禁通过，仍为 79 项本地美术资源。

一次产物检查在整站构建尚未结束时抢跑，临时报告缺失重定向与游戏资源；构建完成后复查通过。没有据此改变功能或配置。最近完整标准主线与六个无尽日证据仍为 `nested-career`；本次主要改动是箱包交互和嵌套上限，原核心经营回归通过。本阶段未推送部署。

## 2026-11-14 霓虹场景素材

- `neon-final`：1920×948、1440×960、960×650、844×390，实际叫号、次日、鼠标与触控通过；`neon-storage`：正常 NPC 购买、三层浮窗与跨窗移动、触屏、存档恢复通过。`neon-bench`：维修清理/换件/校准通过。截图已查看，浏览器错误为 0。
- `neon-presentation`：动态/减少动态、音频、全屏和偏好保存通过；`neon-art-79`：79 项、6,208,746 字节实际解码/MIME/哈希通过；原始技能客户端 `neon-skill` 截图与状态已查看。
- `cyber:validate`、类型检查及 `cyber:build` 通过。`neon-site-build.log` 完整构建退出 0、617 页，结构检查 79,254 引用无错误；两应用产物及新旧素材引用门禁通过。原有三张素材移入归档，核对归档哈希并确保旧文件不在发布目录。
- 本阶段仅视觉和素材门禁改变，完整职业通关沿用 `nested-career` 的正常 UI 证据，没有将场景回归称为重新通关。初版叫号覆盖层错位已在最终截图中修正。

## 2026-11-14 工时、货源与保质期词条

- 规则/存档：17 文件、120 项通过，类型检查和构建通过；原标准开局保持 ₡1,200、144 格、12 工时、每日 ₡85。词条改变后的耗尽工时、次日重置、不同批量价格与还价、实际成本、食品生成与保鲜、冲突和无效存档均有覆盖。
- `conditions-final`：正常桌面与 844×390 触屏，11 词条、互斥/恢复、固定按钮与预览、2 件九折/3 件无折扣、实际扣款、议价、次日与存档恢复通过。截图已查看，错误 0。
- `conditions-career`：短班营业＋零售货源＋临期货源，正常 UI 第 17 日通关，35 次维修/70 笔交易，六类商品买卖均覆盖；结局保存、进入第 18 日、导出导入与刷新一致。自动化耗时 78.65 秒，跳过阅读和思考，不代表玩家游玩时长。其余词条组合未宣称全部通关。
- 技能原始客户端 `conditions-skill` 已执行并查看场景截图；素材门禁通过。原保质期测试曾误调用非导出函数，改为正常跨日生成后 120 项全部通过。
- 最终整站构建 `conditions-site-build.log` 退出 0、617 页；主包 351.16 KB、场景块 10.73 KB。结构检查 79,254 引用无错误，独立应用门禁及介绍页产物内容通过，`git diff --check` 通过。既有 pnpm 元数据警告保留，无新增构建警告。


## 2026-11-14 同尺寸格子与手册开局

- `uniform-grid-third`：通过正常界面买入 3×2 随身终端与背包，核对来货、待谈、已购台面、仓库、箱内五处外框均为 87×58 像素，图标可见框 85×56；旋转后两轴对应交换。1440×960、1920×948、960×650、844×390 下，来货、谈判、仓库、箱内的正方形单格分别统一为 29、33、18、12 像素。默认仍 144 格。九步蒙版、实际点击实体手册、教学移入书中、重播、小屏和刷新通过。
- `uniform-storage-second`：四款 NPC 箱包、三层嵌套、跨窗拖放、旋转、标签、第四层与循环拒绝、柜台中转/日结限制、重载和横屏触控通过。`uniform-handbook` 六章七跨页、翻页、键盘、焦点、上下文返回与减少动态通过。`uniform-immersive-first` 四视口、菜单、鼠标信息和触摸长按通过；完整 DOM 截图已查看。
- `uniform-career-final`：标准新局按真实 UI 第 16 日通关，35 次维修、66 笔交易，六类买卖均覆盖，结局保存、继续到第 17 日及存档往返通过。自动化耗时 75.711 秒不代表实际游玩时长。首次脚本仍定位已删除的顶部招牌，已改用主画面保留的任务板入口。
- 17 文件、120 项规则测试通过；所有 UI 脚本语法检查、类型检查及构建通过。技能原始客户端 `uniform-skill` 已执行并查看 canvas 截图。初次测试中的聚焦按钮空格激活、公开状态字段定位和快速双击已打开内包的定位错误保留在 `uniform-grid-first/second`、`uniform-storage-first`，最终通过项见上述目录。
- `uniform-site-build.log` 完整构建退出 0、617 页，主包 354.01 KB、场景块 10.07 KB。结构检查 79,254 引用、两应用产物/79 素材门禁和 `git diff --check` 通过。既有 pnpm 元数据提示保留，没有安装或修改依赖。


## 2026-11-14 人群与关系回归

基线 `ab4b870a5`。新增四位人物、七个人群的交易与信任待遇、次日人群预约、四份订货和多方关系事件。当前状态为本机通过，未发布；用户指定账户剩余 50% 时发布，本轮实测剩余 65%。

| 检查 | 结果 |
| --- | --- |
| `pnpm.cmd --filter @goatyang/cyber-shop test` | PASS：19 文件，135 项 |
| `pnpm.cmd --filter @goatyang/cyber-shop build` / `validate` | PASS：类型、游戏构建、73 基础图及内容 |
| `ui-journey.mjs`，`CYBER_FACTIONS=1` | PASS：16 日结局、35 维修、67 交易、六类买卖；四位新来客、真实人群预约与一卖一买到访；结局及第 17 日存档恢复 |
| `ui-faction-touch.mjs` | PASS：正常存档经 UI 导入，真实触控切换、预约持久化与取消；手册左右页可读和滚动 |
| `ui-grid-consistency.mjs` / `ui-nested-storage.mjs` | PASS：格子一致性、蒙版/手册入口、三层浮窗与跨容器搬运 |
| `ui-assets.mjs` | PASS：86 项，6,972,956 字节，解码/MIME/哈希一致 |
| 原始 `web_game_playwright_client.js` | PASS：执行、状态与截图；完整界面另有 DOM 证据 |
| `pnpm.cmd site:build` | PASS：617 页，退出 0 |
| `node scripts/validate-content-structure.mjs` | PASS：79,254 本地引用 |
| `node scripts/check-independent-apps.mjs` | PASS：两个独立应用，73 基础资源和 13 补充资源 |
| `git diff --check` | PASS |

截图、正常导出存档、结构化结果和构建日志见 `evidence/living-shop/factions-*`。本轮浏览器无异常或缺失资源；pnpm 工作区元数据警告与 Git 换行提示属于既有环境现象。自动化旅程证明可达性与兼容性，不等于首次玩家节奏验收。

## 2026-11-14 有限需求与库存资金回归

基线 `bea7fa355`。增加按人群生成的采购数量、分单与空箱包共享计数、旧档兼容、进货后现金及日结库存成本反馈。标准仓库保持 144 格。

| 检查 | 结果 |
| --- | --- |
| `pnpm.cmd --filter @goatyang/cyber-shop test` | PASS：20 文件，141 项，含数量原子拒绝、持久化、旧档及箱包边界 |
| `pnpm.cmd --filter @goatyang/cyber-shop validate` | PASS：73 基础资源、13 补充资源及内容 |
| `ui-demand.mjs` | PASS：`demand-final-demand` 桌面与 844×390 真实触控，买四卖三、分单重载、余货与成本显示 |
| `ui-batch.mjs` | PASS：`demand-batch`，单件与批发、持久化、实际入库、需求及预算 |
| `ui-negotiation.mjs` | 初次 FAIL：手机小票溢出；修正头部高度后 `demand-final-negotiation` PASS，未放宽可见性断言 |
| `ui-journey.mjs` | PASS：`demand-journey`，第 16 日结局、35 维修、67 交易、六类买卖、继续第 17 日与保存恢复 |
| 原始 `web_game_playwright_client.js` | PASS：`demand-skill`，状态与 canvas 截图；完整界面以专项 DOM 截图为准 |
| `pnpm.cmd site:build` | PASS：退出 0，617 页，含游戏类型检查与构建 |
| `node scripts/validate-content-structure.mjs` | PASS：79,254 本地引用 |
| `node scripts/check-independent-apps.mjs` | PASS：两应用、73 基础图和 13 补充图 |
| `git diff --check` | PASS |

三种子十日规则模拟前后数据保存在 `stock-flow-before.json` 与 `stock-flow-demand.json`，用途为比较固定采购策略的库存与现金；自动维修不能作为实际游玩证据。最终日结及手机成交截图已人工查看；历史失败目录保留。原始技能客户端的 canvas 截图不包含 DOM 界面。主包为 373.34 KB，完整日志为 `demand-site-build.log`；只有既有 pnpm 元数据警告与 Git 换行提示。正常旅程自动操作耗时 76.759 秒，不代表首次玩家通关时长。当前未发布，账户实测剩余 64%，继续按用户的 50% 阈值执行。

## 2026-11-14 小屏显示回归

基线 `b1af1ac87`，只调整 480 px 以下的电视字号/行距和闭店按钮高度/位置。`ui-room-fit.mjs` 在修复前真实重现文字裁切，历史证据保留于 `room-fit-before`。修复后 `room-fit-clean` 使用新局及通过 UI 导入的正常第 17 日存档，各测六种视口：1920×948、1440×960、960×650、844×390、740×360、667×375。

12 组实际文字范围、完整按钮、与菜单无重叠、页面无溢出、三区正方形格子一致性均通过；844×390 真实触控声音、手册、日结、次日及存档恢复通过，浏览器错误 0。最终桌面和横屏截图已查看，导入提示自然消失后拍摄。原始技能客户端 `room-fit-skill` 运行及 canvas 图查看完成。

`pnpm.cmd --filter @goatyang/cyber-shop build`、`node scripts/check-independent-apps.mjs`、`node --check apps/cyber-shop/scripts/ui-room-fit.mjs`、`git diff --check` 通过。规则及博客内容未变，本阶段没有重跑规则测试和整站构建；前一阶段 141 项和 617 页结果仍保留，当前受影响的游戏产物已重新构建。既有 pnpm 元数据警告不影响退出码。

## 2026-11-14 账本检索与实物定位

基线 `5504b391e`。查询和排序不修改物品位置；账本筛选使用公共名称、玩家标签、存放路径及已知状态，未检查保质期不参与临期筛选。清货报价沿用原比例，界面和结算共用同一函数。

| 检查 | 结果 |
| --- | --- |
| `pnpm.cmd --filter @goatyang/cyber-shop test` | PASS：21 文件，146 项；含三层路径、未知信息、所有权、状态筛选、不修改实物的排序和清货到账 |
| `pnpm.cmd --filter @goatyang/cyber-shop build` / `validate` | PASS：类型、游戏构建、73 基础图及 13 补充图 |
| `ui-stock-ledger.mjs` | PASS：`ledger-final` 正常 NPC 购买、三层标签检索、组合/空结果/成本排序、单窗定位与焦点、查询不改变经营状态、取出、重载、₡42 报价实际到账、送修与工单返回、三日积压、双击实物清旧筛选、844×390 真实触控 |
| `ui-handbook.mjs` | PASS：`ledger-handbook`，实体入口、翻页、目录、上下文返回、键盘、减少动态与触控 |
| 原始 `web_game_playwright_client.js` | PASS：`ledger-skill`，执行、状态与 canvas 截图已查看；完整 UI 以专项 DOM 图为准 |
| `pnpm.cmd site:build` | PASS：退出 0、617 页，日志 `ledger-site-build.log` |
| `node scripts/validate-content-structure.mjs` | PASS：79,254 本地引用 |
| `node scripts/check-independent-apps.mjs` | PASS：两独立应用及资源 |
| 脚本语法 / `git diff --check` | PASS |

`ledger-first` 记录测试落点被浮窗遮挡的失败，改为真正可见空格后继续；没有强制点击或更改物品位置。`ledger-second` 记录界面关闭后筛选丢失，随后修为本次经营保留、新局/读档清空。`ledger-third` 和最终版本通过，历史证据保留。手机通过正常导出的 `nested-save.json` 经 UI 导入，没有注入游戏状态。最终桌面与手机图已查看，浏览器无异常或缺图。主包 378.01 KB；既有 pnpm 元数据警告与 Git 换行提示保留。账户剩余 62%，当前未发布。

## 2026-11-14 四件旧物的辨识度

基线 `01aac1fbb`，四件美术独立重画并更新实际透明边界，保持原占格与统一等比渲染。旧图片及元数据完整归档。检查范围是美术和存放显示，未改动经济、仓库容量或旋转规则。

- `pnpm.cmd --filter @goatyang/cyber-shop build` 通过类型检查及游戏构建，主包 378.01 KB。
- `pnpm.cmd --filter @goatyang/cyber-shop validate`：73 基础资源、13 补充资源、3 项内容测试通过。
- `ui-assets.mjs`：`readability-assets` 全部 86 项浏览器解码、MIME、SHA256 通过，总计 7,048,246 字节，比前版增加 75,290 字节。额外源文件核对确认四张旧图归档哈希一致，其他 69 项基础素材元数据和 39 项比例边界未变。
- `ui-readable-art.mjs`：`readability-ui-verified` 从正常导出的第 17 日职业存档继续，经 NPC 在第 17、18、20、22 日购得四件物品。五处存放区域宽高比、占格大小、每件四次横竖切换、箱内存取、1920/1440/960/844 四视口统一方格及触控设备显示通过，浏览器错误 0。
- `ui-inventory-catalog.mjs` 的全量实际尺寸校样、最终桌面和手机仓库、箱内图已查看。原始 `web_game_playwright_client.js` 的 `readability-skill` 已执行并查看 canvas 截图；实际 UI 以专项 DOM 截图为准。
- `node scripts/check-independent-apps.mjs`、脚本语法与 `git diff --check` 通过。仅有既有 pnpm 工作区元数据提示和 Git 换行提示。

前三次 UI 失败分别来自脚本点到被覆盖格子、假设错背包方向，以及把矩形两朝向规则当作异形四朝向规则；证据保留在 `readability-ui-first`、`readability-ui-final`、`readability-ui-clean`。修正测试后最终通过，没有修改产品规则绕过检查。本轮未重跑完整职业通关和整站构建，前阶段 146 项规则测试与 617 页构建记录保留；受影响的游戏产物已重建。账户剩余 61%，尚未推送部署。

## 2026-11-14 食品过夜预览与保鲜成本

基线 `54bd9704d`，工作区干净。修正日结读取未知保质期，以及过期商品仍标注临期折价；保鲜前必须基础检查日期。预览和实际处理共用保鲜计划、冷藏跨日期限计算，原耗材/技能/隔日冷藏数值保持。

| 检查 | 结果 |
| --- | --- |
| `pnpm.cmd --filter @goatyang/cyber-shop test` | PASS：22 文件、151 项；未知信息不泄露、拒绝不扣耗材、实际均摊成本、一次保鲜、嵌套/展示/客户归属、32 组冷藏日期边界与真实开店一致 |
| `ui-freshness.mjs` | PASS：`freshness-final`，临期词条新局、闭店前跳转食品、真实购买耗材、预览与实际 ₡7 成本一致、一次消耗、保存重载、第五日过期、闭店不能保鲜、真实旧存档中未知日期先检查、844×390 触控冷藏与保鲜 |
| `ui-handbook.mjs` | PASS：`freshness-handbook-final`，六章翻页/目录/返回原操作/键盘/触控，并补拍新增食品说明所在的库存章节 |
| 原始 `web_game_playwright_client.js` | PASS：`freshness-skill`，canvas 截图与状态已检查；实际界面由专项 DOM 截图验证 |
| `pnpm.cmd site:build` | PASS：退出 0，617 页，日志 `freshness-site-build.log`；游戏主包 380.64 KB |
| `pnpm.cmd --filter @goatyang/cyber-shop validate` | PASS：73 基础素材、13 补充素材、3 项内容测试 |
| `node scripts/validate-content-structure.mjs` | PASS：79,254 本地引用 |
| `node scripts/check-independent-apps.mjs` | PASS：两独立应用与发布资源 |
| 脚本语法 / `git diff --check` | PASS |

首轮 `freshness-first` 实际交互已通过，截图检查后把食品保鲜预览提前，手机截图等待提示条消失；最终版本再次通过。已查看最终桌面食品详情、未知日期提醒、手机操作与两种尺寸的库存书页，浏览器错误 0。当前完整职业通关沿用此前 `demand-journey` 的真实 UI 证据，本轮未把食品专项称为重跑完整职业。仅有既有 pnpm 元数据与 Git 换行提示。账户剩余 60%，未推送部署。

## 2026-11-14 安全整理与摆放撤销

基线 `56f06f72e`，开始时工作区干净。自动整理新增原子布局保护；最多 20 步会话撤销仅恢复布局，不退回已消耗工时。仓库、小窗和键盘共用入口，手册说明同步。

| 检查 | 结果 |
| --- | --- |
| `pnpm.cmd --filter @goatyang/cyber-shop test` | PASS：23 文件、157 项，覆盖密集混合形状、逐步撤销、整箱子树、谈判台、失败动作、经济隔断、历史上限与过时布局 |
| `audit-sort-layout.mjs` | PASS：50 组规则构造布局，新增溢出由修改前 48 组降到 0；48 组安全拒绝、2 组完成，拒绝保留原工时，证据 `sort-audit-before` / `sort-audit-after` |
| `ui-layout-undo.mjs` | PASS：`layout-undo-verified`，普通移动和旋转、异形四向旋转连续撤销、整理工时保留、失败摆放保留历史、手持取消、刷新持久化且历史清空、真实清货后不可撤销、三层子树、谈判台往返和 844×390 触控 |
| `ui-handbook.mjs` | PASS：`layout-undo-handbook`，桌面与触控翻页、上下文返回和新撤销说明；两种尺寸的库存书页已查看 |
| 原始 `web_game_playwright_client.js` | PASS：`layout-undo-skill`，canvas 图与状态已检查，实际 UI 另由 DOM 专项截图验证 |
| `pnpm.cmd --filter @goatyang/cyber-shop build` | PASS：类型检查及构建，游戏主包 382.95 KB |
| `pnpm.cmd --filter @goatyang/cyber-shop validate` | PASS：73 基础素材、13 补充素材、3 项内容测试 |
| `node scripts/check-independent-apps.mjs` | PASS：两独立应用、发布资源与游戏素材 |
| 三份脚本语法 / `git diff --check` | PASS |

首轮 UI `layout-undo-first` 通过；补充四向旋转的 `layout-undo-final` 因测试重复点击已被电钻占据的同一格而失败，改用两个真实空位交替放置后最终通过，没有强制穿透或修改产品规则。失败图和状态保留。嵌套场景使用先前正常导出的存档经设置 UI 导入，未注入状态；密集布局仅为规则审计。最终桌面、异形物品、小窗与手机截图已查看，浏览器错误 0。

本轮修改游戏代码和开发说明，游戏产物已重建；没有改博客内容、导航或配置，未重复前阶段 617 页整站构建与完整职业通关。只有既有 pnpm 元数据警告及 Git 换行提示。账户已用 41%、剩余 59%，仍未到剩余 50% 的发布阈值，尚未推送部署。

## 2026-11-14 可成交货物与报价决策

基线 `38ceac46a`，工作区干净。交易清单、自动选择和结算共用前置检查；成本预览区分现价、自定义报价与客人还价。过期食品停止正常顾客交易，仍可清货回收原残值，已知过期信息卡同步显示回收价。

| 检查 | 结果 |
| --- | --- |
| `pnpm.cmd --filter @goatyang/cyber-shop test` | PASS：24 文件、164 项；过期/当日边界、未知信息、许可、归属、工单、实际批发成本、还价入账、负差额、预算缺口与无效输入 |
| `ui-trade-decisions.mjs` | PASS：`trade-decisions-verified`，正常新局至第 3 日，桌面和 844×390 真实触控；以 ₡21 买入、主动以 ₡1 售出，预览和小票差额 −₡20；两种自动选择跳过过期货物，重载、信息卡与实际清货回收一致 |
| `ui-negotiation.mjs` | PASS：`trade-decisions-negotiation-final`，卖家与买家还价预览符合实际结算，清单变化后不显示旧预览，刷新恢复、耐心耗尽和触控回执通过 |
| `ui-journey.mjs` | PASS：`trade-decisions-career`，正常新局第 16 日经营权结局，35 次维修、67 笔交易，六类商品买卖，结局保存/重载、继续经营至第 17 日和导入导出通过 |
| `ui-handbook.mjs` | PASS：`trade-decisions-handbook`，翻页、返回、键盘与触控；桌面和手机交易书页已查看 |
| 原始 `web_game_playwright_client.js` | PASS：`trade-decisions-skill`，已查看 canvas 截图和状态，实际交易以专项 DOM 截图为准 |
| `pnpm.cmd --filter @goatyang/cyber-shop build` | PASS：类型检查及游戏构建，主包 386.25 KB |
| `pnpm.cmd --filter @goatyang/cyber-shop validate` | PASS：73 基础素材、13 补充素材、3 内容测试 |
| `node scripts/check-independent-apps.mjs` | PASS：两独立应用及资源 |
| 两份脚本语法 / `git diff --check` | PASS |

`trade-decisions-first` 失败来自测试误点身份标记，打开手记后继续点被遮挡的按钮；改为真实交谈入口后通过，旧失败图和状态保留。`second` / `final` 的实际交易已通过，查看截图后精简重复预览并提高禁用货品文字对比度，最后补查过期信息卡再形成 `verified`。最终桌面、手机、还价、手册、经营权结局和原始 canvas 图已查看，浏览器错误与缺失资源均为 0。

完整职业流程测试用时 77.704 秒是自动化输入耗时，不是人工游玩时长；它只证明修复师流程可达，不代表其他五个职业已实现。该流程之后补充的是过期信息卡显示，最终专项在更新构建上复查通过。本轮没有修改博客内容、导航或站点配置，未重复前阶段 617 页整站构建。仅既有 pnpm 元数据警告及 Git 换行提示。账户已用 42%、剩余 58%，未到剩余 50% 的发布阈值，未推送部署。
