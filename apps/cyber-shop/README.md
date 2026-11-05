# 赛博杂货铺

暂停式赛博朋克经营游戏：接待街坊、交易旧货、修复设备、整理收藏，逐步取得永久经营权。首版完整职业为修复师，提供主线结局和无尽经营。价格与成长速度属于试玩配置；约两小时通关是节奏目标。

玩家先看[游戏介绍与操作说明](../../src/notes/cyber-shop/README.md)。开发进展、已执行检查与待办见 [progress.md](progress.md)，最终验收与发布状态以专门的验收记录为准。

## 本机运行

在博客仓库根目录运行。依赖由现有 pnpm workspace 和锁文件管理；首次检出后使用 `pnpm.cmd install --frozen-lockfile` 安装。

| 命令 | 用途 |
| --- | --- |
| `pnpm.cmd cyber:dev` | 开发服务：<http://127.0.0.1:4175/cyber-shop/> |
| `pnpm.cmd cyber:build` | 类型检查并构建游戏 |
| `pnpm.cmd cyber:preview` | 预览已构建游戏：<http://127.0.0.1:4176/cyber-shop/> |
| `pnpm.cmd cyber:validate` | 66 项美术硬门禁与内容注册表校验 |
| `pnpm.cmd cyber:test` | 规则、成长、成本与存档测试 |
| `pnpm.cmd cyber:typecheck` | Vue 与 TypeScript 类型检查 |

开发和预览分别在独立终端运行，都启用严格端口检查。停止时在启动服务的终端按 `Ctrl+C`；重新运行相同命令即可重启。端口已占用时先确认现有服务，不重复启动。

游戏构建输出到 `src/.vuepress/dist/cyber-shop/`。整站发布使用 `pnpm.cmd site:build`，按博客、海克斯麻将、赛博杂货铺的顺序构建。完整验证、产物检查与发布分支约束见[项目维护文档](../../docs/maintenance.md)。正式目标路径为 <https://goatyang.com/cyber-shop/>；本机构建结果不代表线上版本已更新。

## 游玩与保存

柜台完成检查、议价和成交，工作台完成检测、工序、复检和交付；库存、成长、采购、收藏与街区手记可从底部菜单打开。鼠标点击可完成主要操作，场景和库存也支持拖放。手机使用横屏；`F` 切换全屏，`Esc` 关闭面板或退出全屏，设置中可调音量与减少动态。

客户送修件及材料预付款独立保管，展示品退出普通售卖。零现金时可接基础援助维修；欠费有补救期。通关需要维修大师能力、职业最终委托与经营权收购款，之后可保存结局或继续免租经营。

每次成功经营操作自动保存，营业日开门时保存恢复备份。命名空间为 `cyber-shop:save:v1` 与 `cyber-shop:day-start:v1`，独立于海克斯麻将。

换设备或在本机与正式域名之间迁移时，先导出当前存档，再到目标环境导入。导出文件只含当前进度，不携带原站点的当日开门副本；导入后以导入点建立本地恢复备份，从下一营业日起恢复按开门状态备份。损坏或版本不兼容的文件会被拒绝；自动保存不会静默覆盖已有损坏存档。

## 代码与扩展入口

Phaser 精确锁定为 `3.90.0`，沿用 Phaser 3 的场景、输入与动画 API。Vue 3、TypeScript 与 Vite 使用本仓库工具链，不套用模板的旧依赖版本。集成方式参考 [Phaser 官方 Vue + TypeScript 模板](https://github.com/phaserjs/template-vue-ts)，版本依据见 [Phaser 3.90.0 发布页](https://phaser.io/download/release/v3.90.0)。

| 入口 | 职责 |
| --- | --- |
| [game/types.ts](src/game/types.ts) | 商品模板与实例、职业、工单、状态、动作接口 |
| [game/engine.ts](src/game/engine.ts) | `applyAction` 权威状态转换；交易、维修、日结与胜负 |
| [game/balance.ts](src/game/balance.ts) | 试玩费用、工时、经验、奖励与挑战参数 |
| [content/index.ts](src/content/index.ts) | 商品、人物、事件、技能、证书、设施和主题注册表 |
| [ui/store.ts](src/ui/store.ts) | Vue 与 Phaser 共用状态、动作派发与存档连接 |
| [scenes/ShopCanvas.vue](src/scenes/ShopCanvas.vue) | 场景、按需加载、人物到访、物品拖放与表现 |
| [persistence/storage.ts](src/persistence/storage.ts) | 版本、导入校验、自动保存和恢复备份 |
| [assets-manifest.json](assets-manifest.json) | 逐项素材 ID、提示词、来源、状态与发布路径 |

新增商品或案例先注册内容，再接入规则动作；界面只发送动作并展示结果，不另存一套现金或库存。新职业通过能力、技能和最终里程碑接入共用成长，不永久锁定玩家的开局职业。涉及存档字段变化时显式处理结构、内容与数值版本。

测试可使用固定种子开局。`window.render_game_to_text()` 输出玩家可见状态，`window.advanceTime(ms)` 控制表现时间；推进表现时间不产生收入或新营业日。

六职业总体设计与后续接入方法见[职业设计](docs/professions.md)，内容规模和章节安排见[内容地图](docs/content-map.md)，数值调整与适用范围见[试玩数值记录](docs/balance-notes.md)。合成工匠、能源技师、生态培育者、数据经纪人和遗物策展人的专业加工尚未实现；对应普通商品可以交易，基础保鲜与收藏可以使用。

## 美术与交付门禁

基础素材固定为 36 件商品、10 位人物、16 件工具耗材设施和 4 幅场景/结局，共 66 项。其中 64 项逐项通过 AI 图像工具生成；电子备件（`electronic-parts`）和绝缘材料（`insulation`）经用户授权分别采用原创绘制插画。发布图片位于 `public/art/`，提示词、绘制源文件与生成失败历史在资产清单登记。

`cyber:validate` 要求 64 项为 `generated`，仅上述两个 ID 允许 `original-drawn`，并核对原创绘制来源及保留的失败历史。全部 66 项仍检查真实内容引用、唯一 ID 与路径、大小写、文件数量、重复图片及 WebP 容器、帧头、尺寸、透明通道和哈希。缺失、待生成或无效图片会阻断校验。整站产物检查还要求发布图片与源文件一致；浏览器验收另行检查实际解码、视觉、触控、音频及完整游玩流程。

功能分支 CI 只验证，正式部署限定 `main`。代码、截图或素材数量的单项通过不等于全部验收完成。实际命令、截图、流程耗时和限制见[验收记录](docs/verification.md)。
