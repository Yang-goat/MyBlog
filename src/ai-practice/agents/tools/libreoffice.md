---
title: LibreOffice 下载与安装教程
icon: file-word
date: 2026-06-06
order: 3
category:
  - AI 应用实践
tag:
  - 智能体
  - LibreOffice
  - 文档处理
---

# LibreOffice 下载与安装教程

## 软件简介

LibreOffice 是一套免费、开源、跨平台的办公软件，包含文字处理、电子表格和演示文稿等组件，可以打开和处理常见的 Word、Excel、PowerPoint 与 OpenDocument 文件。

除图形界面外，LibreOffice 还提供命令行和无界面运行模式，可以完成文档格式转换等自动化任务。

## 为什么对智能体有帮助

在智能体具备终端执行权限时，LibreOffice 可以扩展其文档处理能力，例如：

- 将 DOCX、ODT 等文档批量转换为 PDF。
- 将不同办公文档格式转换为更容易分析的格式。
- 在自动化脚本中进行无界面的文档处理。
- 为文档生成、检查和交付流程提供本地办公软件支持。

::: note
安装 LibreOffice 不代表智能体会自动获得桌面操作权限。能否调用图形界面或命令行，仍取决于智能体所在环境的权限和工具配置。
:::

## Windows 安装教程

### 1. 打开官方下载页面

访问 [LibreOffice 官方下载页面](https://www.libreoffice.org/download/download-libreoffice/)。

### 2. 选择系统版本

在操作系统选项中选择：

```text
Windows (64-bit)
```

大多数 Windows 10 和 Windows 11 电脑都应选择 64 位版本。Windows on ARM 设备应选择 Windows AArch64。

### 3. 下载安装程序

点击下载按钮，保存扩展名为 `.msi` 的主安装程序。建议始终从 LibreOffice 官方网站下载，不要使用来源不明的安装包。

### 4. 运行安装程序

双击下载的 `.msi` 文件，然后按以下步骤操作：

1. 在欢迎页面点击“下一步”。
2. 安装类型选择“典型”。
3. 根据需要决定是否创建桌面快捷方式。
4. 点击“安装”并等待完成。
5. 点击“完成”退出安装向导。

如果 Windows 弹出用户账户控制提示，确认发布者和文件来源后选择“是”。

### 5. 验证图形界面

打开开始菜单，搜索并启动 `LibreOffice`。能够正常进入启动中心即表示基础安装成功。

### 6. 验证命令行

在 PowerShell 中执行：

```powershell
& "$env:ProgramFiles\LibreOffice\program\soffice.com" --version
```

如果输出 LibreOffice 版本信息，说明智能体或自动化脚本可以通过该路径调用 LibreOffice。

## 测试无界面文档转换

准备一个测试文件 `example.docx`，在文件所在目录打开 PowerShell，然后执行：

```powershell
& "$env:ProgramFiles\LibreOffice\program\soffice.com" `
  --headless `
  --convert-to pdf `
  --outdir . `
  .\example.docx
```

执行完成后，当前目录中应生成 `example.pdf`。

::: warning
转换文档前应保留原始文件。复杂排版、特殊字体、宏和第三方插件可能导致转换结果与 Microsoft Office 不完全一致。
:::

## macOS 安装

1. 在官方下载页面选择与设备对应的 `macOS (Apple Silicon)` 或 `macOS (Intel)`。
2. 下载并打开 `.dmg` 文件。
3. 将 LibreOffice 图标拖入“应用程序”文件夹。
4. 从“应用程序”中启动 LibreOffice。

也可以使用 Homebrew：

```bash
brew install --cask libreoffice
```

## Linux 安装

Ubuntu 或 Debian 可以直接使用系统软件源：

```bash
sudo apt update
sudo apt install libreoffice
```

Fedora：

```bash
sudo dnf install libreoffice
```

安装后验证：

```bash
libreoffice --version
```

不同 Linux 发行版提供的版本可能落后于 LibreOffice 官网版本。需要最新版时，应按照官网提供的 DEB、RPM 或 Flatpak 安装说明操作。

## 常见问题

### PowerShell 提示找不到文件

确认 LibreOffice 是否安装在默认目录：

```powershell
Test-Path "$env:ProgramFiles\LibreOffice\program\soffice.com"
```

如果返回 `False`，可能安装在其他目录，应在 LibreOffice 快捷方式属性中查看实际路径。

### 转换时没有生成文件

检查以下内容：

1. 输入文件路径是否正确。
2. 输出目录是否存在并且可写。
3. 文档是否正在被其他程序占用。
4. 当前用户是否有读取源文件和写入目标目录的权限。

## 参考资料

- [LibreOffice 官方下载页面](https://www.libreoffice.org/download/download-libreoffice/)
- [LibreOffice Windows 安装说明](https://www.libreoffice.org/get-help/install-howto/windows/)
