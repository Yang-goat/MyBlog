---
icon: book
date: 2025-10-02
category:
  - 软件
tag:
  - Latex
---

# Zotero教程

Zotero 是一款免费开源的文献管理工具，能帮研究者高效收集、组织、注释和引用研究资料。它可通过浏览器插件一键抓取网页、数据库中的文献信息与 PDF 全文，也能自动识别本地 PDF 的元数据。

写作时，它能与 Word、 Latex 等深度集成，一键插入引用并按 APA、MLA 等上万种格式自动生成参考文献列表。同时支持跨设备同步、团队协作共享，还可通过丰富插件拓展功能，且由非营利组织开发保障数据安全。

:::info
本文仅介绍本人在使用的功能，并给出具体操作的将将教程链接。
详细信息请前往[Zotero中文社区](https://zotero-chinese.com/)
:::

## 下载与安装

[官网下载地址连接](https://www.zotero.org/download/)

[安装教程 | 中文](https://zotero-chinese.com/user-guide/install)

按教程安装完主程序，以及浏览器扩展后即可

## 同步功能

编辑 -> 设置 -> 同步 ，创建账号并登录即可使用同步功能

## 插件下载推荐

[插件下载链接](https://zotero-chinese.com/plugins/)

推荐插件（本人正在使用）：

- Better Notes：笔记插件，支持 Markdown。安装后软件内教程
- 茉莉花：增加中文文献支持，支持知网元数据检索。[教程](https://zotero-chinese.com/user-guide/plugins/jasminum)
- Translate for Zotero：文献翻译插件，需要接入翻译引擎。[教程](https://zotero-chinese.com/user-guide/plugins/translate/)
- Ethereal Style：增强Zotero界面，可查看期刊分区影响因子以及阅读进度。

## 下载指定文献引用格式

请阅读[安装样式教程](https://zotero-chinese.com/user-guide/citation-styles)。外文使用`从官方存储库`方法，中文使用`从第三方存储库`方法中的`通过 Zotero Connector 直接安装样式`。

[中文 CSL 样式库](https://zotero-chinese.com/styles/)

## 查看文献期刊分区影响因子以及阅读进度

需要Ethereal Style以及[easyscholar平台密钥](https://www.easyscholar.cc/)。

详细教材参考b站视频[Zotero|教你怎么设置显示期刊等级和影响因子](https://www.bilibili.com/video/BV1MaKMe1Evk/?share_source=copy_web&vd_source=0413cd0e5c575eb002962022bf3e84d8)

## 导出文献引用到剪切板等

该方法对于写文献引用最简单粗暴，不需要下载其他插件，直接选择文献到剪切板直接复制即可。

缺点：文献顺序需要手动调整，文中引用需要手动插入。

[中文社区教程](https://zotero-chinese.com/user-guide/create-bibliographies-within-zotero)

## Latex 导出文献数据库文件

在撰写论文或报告时，我们常常需要在 LaTeX 中插入引用，而 Zotero 能非常方便地导出符合要求的 .bib 文献数据库文件。以下是详细步骤。

1. 选中文献并打开导出菜单
在 Zotero 主界面中，选中需要导出的文献条目（可多选），右击后点击 “导出条目…”。

![](img/导出条目1.png)

![ =200x](img/导出条目2.png)

系统将弹出导出设置窗口。

2. 选择导出格式
在“格式”选项中选择 BibTeX，并勾选 “导出文件”。这样不仅会生成 .bib 文献数据库文件，还会同时导出与条目关联的 PDF 文献。

![ =250x](img/导出条目3.png)


3. 保存导出结果
点击“确定”后，选择保存位置。建议将 .bib 文件放在 LaTeX 项目文件夹中，方便引用。导出完成后，可以看到生成的 .bib 文件以及 files 文件夹：

![](img/导出条目4.png)

其中 .bib 文件是文献数据库文件，files 文件夹中存放了对应的 PDF 原文。

## Word 中使用Zotero插入参考文献

需要下载word插件的等操作，有一定学习成本。

[中文社区教程](https://zotero-chinese.com/user-guide/ms-word-plugin)

:::tip
本人并未使用该方法进行word论文撰写。
:::