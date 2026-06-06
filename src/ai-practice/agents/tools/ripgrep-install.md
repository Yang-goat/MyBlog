---
title: ripgrep（rg）下载与安装教程
icon: magnifying-glass
date: 2026-06-06
order: 1
category:
  - AI 应用实践
tag:
  - 智能体
  - ripgrep
  - 命令行工具
---

# ripgrep（rg）下载与安装教程

## 软件简介

ripgrep 是一个跨平台的命令行文本搜索工具，命令名为 `rg`。它可以递归搜索目录中的文件内容，并默认遵循 `.gitignore`，跳过被忽略的文件、隐藏目录和二进制文件。

与普通的逐文件搜索相比，`rg` 速度快、输出清晰，并支持正则表达式、文件类型和路径过滤，尤其适合大型代码仓库。

## 为什么对智能体有帮助

代码智能体需要频繁定位函数、配置项、错误信息和旧路径。安装 `rg` 后，智能体可以更高效地：

- 在整个项目中搜索代码和文本。
- 按文件类型或目录缩小搜索范围。
- 显示匹配行号和上下文。
- 自动避开 `.gitignore` 中的构建产物与依赖目录。

例如：

```powershell
rg -n 'TODO|FIXME' src
rg -n 'functionName' -g '*.ts'
rg -n -C 3 'error message' .
```

## Windows 安装教程

推荐使用 Windows 自带的 WinGet 安装。

### 1. 打开终端

打开 PowerShell 或 Windows Terminal。

### 2. 执行安装命令

```powershell
winget install BurntSushi.ripgrep.MSVC
```

根据终端提示确认软件源协议并等待安装完成。

### 3. 重新打开终端

安装完成后关闭当前终端，再打开一个新的 PowerShell 窗口，使环境变量更新生效。

### 4. 验证安装

```powershell
rg --version
```

如果终端输出 ripgrep 的版本信息，说明安装成功。

::: tip 其他 Windows 安装方式
已经安装 Chocolatey 或 Scoop 时，也可以使用以下命令：

```powershell
choco install ripgrep
```

```powershell
scoop install ripgrep
```
:::

## macOS 安装

使用 Homebrew：

```bash
brew install ripgrep
rg --version
```

## Linux 安装

Ubuntu 或 Debian：

```bash
sudo apt update
sudo apt install ripgrep
rg --version
```

Fedora：

```bash
sudo dnf install ripgrep
rg --version
```

Arch Linux：

```bash
sudo pacman -S ripgrep
rg --version
```

## 常见问题

### 安装后提示找不到 `rg`

先关闭并重新打开终端。如果仍然无效，可以重启系统，或检查 ripgrep 的安装目录是否已加入 `PATH`。

### 搜索不到隐藏文件或被忽略的文件

这是 ripgrep 的默认过滤行为。需要搜索隐藏文件时使用：

```powershell
rg --hidden '关键词'
```

需要同时忽略 `.gitignore` 等规则时使用：

```powershell
rg -uuu '关键词'
```

使用 `-uuu` 会显著扩大搜索范围，应避免在大型项目中无目的执行。

## 参考资料

- [ripgrep 官方仓库与安装说明](https://github.com/BurntSushi/ripgrep)
- [ripgrep 使用指南](https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md)
