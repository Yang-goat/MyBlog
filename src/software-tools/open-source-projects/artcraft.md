---
title: ArtCraft 系列：从 AI 创作到图像、视频与办公工具
icon: palette
date: 2026-10-10
category:
  - github项目
tag:
  - GitHub
  - 开源工具
  - Rust
  - AI创作
  - MCP
---

# ArtCraft 系列：从 AI 创作到图像、视频与办公工具

让模型生成一张图之后，往往还要调整构图、摆放人物，或者让下一镜头沿用同一场景。[ArtCraft](https://github.com/storytold/artcraft) 把这些操作放进一个创作工作区：先用二维画布和三维场景确定画面，再结合生成模型完成图像或视频。

顺着仓库往下看，会发现 ArtCraft 团队还在开发一整套独立应用。修图、矢量绘图、剪辑、排版之外，系列已经扩展到文档、表格、演示、CAD 和音频工作站。想关注开源创作软件，或者研究怎样让 Agent 操作桌面工具，这组项目值得一起看。

::: info 项目范围与开发状态
本文于 2026 年 10 月 10 日核对官方组织、各仓库 README 和 Launcher 的套件清单，覆盖 ArtCraft 主程序、12 个 Craft 应用以及直接配套仓库。部分应用仍标为 early alpha、pre-alpha 或早期开发；下文介绍官方公布的用途与功能，未对整套软件进行安装实测。
:::

## ArtCraft 主程序：先摆好画面，再生成

ArtCraft 自称“面向艺术家的 IDE”。它的工作区支持二维图层合成，也支持摆放三维物体、角色姿态和相机。比如做同一个房间的多个镜头，可以先确定场景与人物位置，再切换机位生成画面。这样的操作方式更接近布景和拍摄。

官方演示包括背景移除、图像转三维网格、角色姿态控制，以及二维和三维素材混合。文本生图、按提示编辑图片和图生视频也在主程序的功能范围内。具体模型与服务商会继续变化，使用前可以查看 [主仓库 README 的模型说明](https://github.com/storytold/artcraft#models-and-providers-supported-within-artcraft)。

主仓库维护 Tauri 桌面应用，服务端已经单独放到 `artcraft-services`。普通用户可以从 [官网](https://getartcraft.com/) 或 [GitHub Releases](https://github.com/storytold/artcraft/releases) 找到下载入口。源码公开与模型服务的可用性是两件事；安装桌面程序后，仍需确认所选生成服务的账户、费用和接入要求。

## 12 个独立应用，各自负责什么

[官方 Launcher 的套件清单](https://github.com/storytold/craft-launcher#the-craft-app-suite) 目前列出下面 12 个应用，每个都有独立仓库。表中的熟悉软件用于帮助理解工作流；功能完整度、文件兼容性和使用体验，需要分别判断。

| 应用与仓库 | 主要用途 | 熟悉的工作流 |
| --- | --- | --- |
| [PhotoCraft](https://github.com/storytold/photocraft) | 图像编辑，图层、蒙版、文字与 PSD 文件处理 | Photoshop |
| [VectorCraft](https://github.com/storytold/vectorcraft) | 矢量插画，路径、形状、画板和 SVG/PDF 处理 | Illustrator |
| [LightCraft](https://github.com/storytold/lightcraft) | 照片库管理与 RAW 显影 | Lightroom |
| [FilmCraft](https://github.com/storytold/filmcraft) | 视频剪辑、调色与声音处理 | Premiere Pro |
| [EffectCraft](https://github.com/storytold/effectcraft) | 动态图形与视觉特效，合成、图层和关键帧 | After Effects |
| [DesignCraft](https://github.com/storytold/designcraft) | 多页版面设计与出版排版 | InDesign |
| [PdfCraft](https://github.com/storytold/pdfcraft) | PDF 阅读、页面整理、合并拆分与保护 | Acrobat |
| [WordCraft](https://github.com/storytold/wordcraft) | 文字处理与文档设计，读写 DOCX | Word |
| [GridCraft](https://github.com/storytold/gridcraft) | 电子表格与数据处理 | Excel |
| [DeckCraft](https://github.com/storytold/deckcraft) | 幻灯片制作与放映，主题、布局和动画 | PowerPoint |
| [CADCraft](https://github.com/storytold/cadcraft) | 计算机辅助设计与制图，图层、尺寸和 DXF 图纸 | AutoCAD |
| [SoundCraft](https://github.com/storytold/soundcraft) | 多轨录音、编辑与混音，MIDI 和自动化 | Pro Tools |

### 修图和绘图：PhotoCraft、VectorCraft、LightCraft

PhotoCraft 适合关注像素编辑和分层文件的人。README 介绍了图层与蒙版、调整图层、智能对象、滤镜以及 PSD/PSB 读写。它还公开了格式往返测试的说明，方便开发者查看文件打开再保存时保留了哪些内容。作者明确把它标为 early alpha，并提醒目前还不足以替代日常专业 Photoshop 工作。

VectorCraft 处理矢量对象，重点是贝塞尔路径、形状运算、多画板和可编辑的外观。SVG、PDF 以及带 PDF 兼容内容的 `.ai` 文件都在其介绍范围内；这里的 `.ai` 支持有条件，不能理解成任意 Illustrator 文件都能完整还原。

LightCraft 主要围绕照片库和 RAW 显影展开。做照片整理和基础调色可以先看它；需要分层合成和局部图像编辑，再看 PhotoCraft。两者面对的工作阶段不同。

### 视频与声音：FilmCraft、EffectCraft、SoundCraft

FilmCraft 把剪辑、调色、声音和导出放在视频编辑流程里。EffectCraft 则更关注合成和动画，通过图层与关键帧安排画面变化，并提供效果、三维相机与灯光、渲染队列等功能。

SoundCraft 是单独的数字音频工作站（Digital Audio Workstation，DAW），围绕多轨编辑、混音、MIDI 和录音展开。它当前标为 pre-alpha。对音频工具而言，能打开界面与能稳定完成一场录音之间还有距离；准备试用时，可以先用短音频检查播放、保存和导出。

### 文档与排版：DesignCraft、PdfCraft、WordCraft、GridCraft、DeckCraft

这几项可以按产物来选。杂志、画册或多页出版物看 DesignCraft；需要阅读、整理和拆分 PDF 看 PdfCraft。WordCraft 面向文字文档，README 介绍了样式、表格、修订和参考文献等工作流，并提供 DOCX 读写。

GridCraft 对应电子表格，DeckCraft 对应演示文稿。现阶段更适合拿一份文件副本试用，检查公式、字体、分页或动画是否满足自己的需要。文件扩展名受支持，并不能说明复杂文件中的每种对象都能往返保留。

### 工程制图：CADCraft

CADCraft 面向 CAD 制图，README 列出了命令行、对象捕捉、图层、尺寸标注、填充、块和 DXF 图纸等内容。它仍处于早期开发。若要评估实际用途，建议从简单二维图纸开始，确认尺寸、图层和导出文件的表现，再尝试复杂项目。

## 系列中的配套仓库

创作应用之外，下面这些仓库负责安装、服务端、共享代码和测试资料。只想使用某个工具时，可以直接进入该应用的 Releases；研究实现或参与开发时，再按职责查看配套仓库。

| 仓库 | 职责 |
| --- | --- |
| [craft-launcher](https://github.com/storytold/craft-launcher) | 官方应用启动器，集中查看、安装、更新和启动 12 个 Craft 应用；自身仍处于 early alpha |
| [artcraftx](https://github.com/storytold/artcraftx) | ArtCraft-X，简化的 AI 创作桌面应用，覆盖图像、视频、音频、三维网格和世界生成；README 标为早期实验发布，构建包仍待提供 |
| [artcraft-services](https://github.com/storytold/artcraft-services) | ArtCraft 后端、HTTP API、后台工作进程和 Web 前端，包含账户、生成任务、媒体库及计费等实现 |
| [craft-libs](https://github.com/storytold/craft-libs) | Craft 应用可复用的 Rust 库工作区 |
| [craft-fonts](https://github.com/storytold/craft-fonts) | 共享字体资源、许可证与来源清单，以及加载和嵌入字体的 Rust 库 |
| [photocraft-corpus](https://github.com/storytold/photocraft-corpus) | PhotoCraft 的文件格式测试素材与生成脚本，用于验证 PSD 等文件的解析和表现 |
| [craft-repo-status-app](https://github.com/storytold/craft-repo-status-app) | 开发维护用的状态面板，查看 Craft 仓库的 PR、构建与发布情况 |
| [github-media](https://github.com/storytold/github-media) | README 演示视频和其他媒体资源 |
| [cloud-worker](https://github.com/storytold/cloud-worker) | 在 RunPod GPU 环境通过 ComfyUI 运行 MiniMax H3 的配置、脚本与基准工具 |

组织里还保留了已归档的 [placeholder-artcraft](https://github.com/storytold/placeholder-artcraft)。查看当前桌面应用应进入 `artcraft`，避免从旧占位仓库开始。完整组织列表见 [storytold 的公开仓库](https://github.com/orgs/storytold/repositories)；其中还有历史研究、基础设施和第三方分叉项目，它们不都属于当前 Craft 应用套件。

## 为什么开发者也值得关注

这组工具的一个共同方向，是让桌面操作同时具备程序接口。PhotoCraft 的 README 明确说明，界面、CLI、JSON 控制通道和 MCP 服务调用同一套命令。VectorCraft、WordCraft 等项目也提供面向 Agent 的接口说明。

这给自动化留下了具体的入口。例如，Agent 可以通过命令打开文件、修改对象并导出结果，而开发者能检查命令参数和保存后的文件。研究这类设计时，可以先读 [PhotoCraft 的控制协议](https://github.com/storytold/photocraft/blob/main/docs/control-protocol.md) 和 [VectorCraft 的 MCP 文档](https://github.com/storytold/vectorcraft/blob/main/docs/mcp.md)。不同应用暴露的能力各有范围，接入前仍要查看各自文档。

各 Craft 应用普遍采用 Rust，并提供桌面及 WebAssembly 方向的实现。ArtCraft 主程序和服务端有自己的技术栈，不能把“整个系列”都概括成同一种纯 Rust 桌面架构。

## 下载与试用建议

如果只对一个应用感兴趣，从它的 GitHub Releases 下载即可。准备同时跟踪多个应用，可以查看 [ArtCraft Launcher 的最新发布](https://github.com/storytold/craft-launcher/releases/latest)。Launcher 会选择系统和处理器对应的构建，并检查发布文件的 SHA-256；平台和安装形式以当次发布为准。

第一次试用，我建议挑一份较小的文件副本，完成“打开、修改、保存、用原工具重新打开”的检查。图像要看图层和蒙版，文档要看字体与分页，剪辑项目要看素材路径和导出结果。这比只看功能菜单更容易发现与自己工作有关的缺口。

ArtCraft 和多数 Craft 应用的 README 声明采用 MIT 或 Apache-2.0 双许可证。共享字体、媒体、品牌标识和其他附带素材可能有单独条款；做二次分发时，应继续查看对应仓库的 `LICENSE`、`NOTICE` 和素材署名文件。

我会优先从自己正在做的事情里选一个应用试用。图像编辑看 PhotoCraft，矢量插画看 VectorCraft；如果关注 AI 场景生成，则从 ArtCraft 主程序开始。其余仓库可以随需求再跟进，早期项目的更新速度和实际可用程度也值得一起观察。

## 参考资料

- [storytold/artcraft：功能演示、模型与下载入口](https://github.com/storytold/artcraft)
- [craft-launcher：官方套件清单与安装管理](https://github.com/storytold/craft-launcher)
- [PhotoCraft：功能、文件兼容与早期开发说明](https://github.com/storytold/photocraft)
- [VectorCraft：功能、状态与文件支持范围](https://github.com/storytold/vectorcraft)
- [ArtCraft Services：后端与 Web 架构](https://github.com/storytold/artcraft-services)
- [ArtCraft 官方公开仓库列表](https://github.com/orgs/storytold/repositories)
