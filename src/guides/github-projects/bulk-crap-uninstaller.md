---
title: Bulk Crap Uninstaller：批量卸载 Windows 软件
icon: trash-can
date: 2026-07-10
category:
  - github项目
tag:
  - GitHub
  - Windows
  - 软件卸载
  - 开源工具
---

# Bulk Crap Uninstaller：批量卸载 Windows 软件

Windows 自带的“已安装的应用”适合逐个卸载软件，但在清理旧电脑、测试环境或预装软件较多的设备时，逐项确认会比较耗时，也不方便集中检查卸载残留。

[Bulk Crap Uninstaller](https://github.com/BCUninstaller/Bulk-Crap-Uninstaller)（简称 **BCU** 或 **BCUninstaller**）是一款开源的 Windows 软件卸载工具。它可以批量执行卸载程序、尝试静默卸载、识别失效的卸载项，并在卸载后扫描可能残留的文件与注册表项。

::: info 本文适用版本
本文于 **2026 年 7 月 10 日**根据 BCU **v6.2** 整理。v6 系列面向 Windows 10 及以上系统，安装版需要 .NET 8 Desktop Runtime；完整便携版已经包含运行时。
:::

::: important 一句话推荐
如果你需要集中清理大量 Windows 软件，又希望在真正卸载前先筛选、排序和核对目标，BCU 比逐个打开系统卸载界面更高效。
:::

## 主要功能

| 功能 | 适用场景 |
| --- | --- |
| 批量卸载 | 一次选择多个软件并按队列处理 |
| 静默卸载 | 对支持静默参数的卸载程序减少重复确认 |
| 残留扫描 | 卸载完成后检查可能遗留的文件、目录和注册表项 |
| 异常项识别 | 查找卸载程序缺失、路径失效或已经孤立的应用记录 |
| 多来源识别 | 支持常规安装程序、Windows Store 应用、Steam、Windows 功能等来源 |
| 筛选与排序 | 按发布者、大小、安装日期、卸载状态等信息缩小检查范围 |

BCU 更适合“先看清楚，再批量处理”的清理方式。它会汇总系统中不同来源的软件条目，但最终选择哪些项目、是否清理残留，仍然需要用户判断。

## 下载版本怎么选

请从 [GitHub Releases](https://github.com/BCUninstaller/Bulk-Crap-Uninstaller/releases) 下载稳定版本。v6.2 提供三种主要形式：

| 版本 | 特点 | 建议 |
| --- | --- | --- |
| Setup | 正常安装；缺少所需运行时时会一并处理 | 日常长期使用优先选择 |
| Portable | 自带 .NET 运行时，体积较大 | 临时维护多台电脑时更方便 |
| net | 不安装的轻量便携版，但系统需要已有 .NET 8 Desktop Runtime | 已配置运行时的设备可选 |

除非要测试尚未发布的修复，否则不建议普通用户使用 nightly 构建。

## 基本使用流程

1. 启动 BCU，等待它扫描已安装软件和可用的卸载信息。
2. 使用搜索、筛选或列表列信息缩小范围，逐项确认软件名称、发布者和安装路径。
3. 选择要移除的软件，启动批量卸载任务。
4. 检查 BCU 生成的卸载队列，不确定的系统组件、驱动或运行库先从队列中移除。
5. 完成各软件自身的卸载流程后，再查看残留扫描结果。
6. 只清理能够确认归属于已卸载软件的残留项，最后重启并检查常用软件是否正常。

::: warning 批量操作前先留出恢复路径
批量卸载和残留清理都可能影响共享运行库、驱动、外壳扩展或其他软件。操作前应关闭正在运行的程序，保留重要配置备份，并优先创建系统还原点。无法确认用途的项目不要勾选。
:::

## 适合与不适合的场景

BCU 适合：

- 清理长期使用后积累的大量软件；
- 移除测试机、实验室电脑或旧设备上的成批应用；
- 排查系统设置中存在、但卸载程序已经丢失的条目；
- 希望使用便携工具维护多台 Windows 设备。

它不适合代替系统修复工具，也不应该用来盲目删除不认识的组件。杀毒软件、硬件驱动、开发运行库和厂商恢复组件通常有自己的卸载或修复流程，处理这些项目时应先查阅对应厂商说明。

## 项目信息

- 开源协议：Apache License 2.0；
- 支持平台：v6 主要支持 Windows 10 及以上系统；
- 开发语言：以 C# 为主；
- 稳定版下载：安装版、完整便携版和依赖本机运行时的轻量便携版。

## 参考资料

- [BCUninstaller/Bulk-Crap-Uninstaller GitHub 仓库](https://github.com/BCUninstaller/Bulk-Crap-Uninstaller)
- [Bulk Crap Uninstaller Releases](https://github.com/BCUninstaller/Bulk-Crap-Uninstaller/releases)
- [Bulk Crap Uninstaller 在线文档](https://htmlpreview.github.io/?https://github.com/BCUninstaller/Bulk-Crap-Uninstaller/blob/master/doc/BCU_manual.html)
