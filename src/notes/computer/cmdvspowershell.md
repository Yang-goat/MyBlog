---
title: CMD 与 PowerShell 的区别
icon: laptop-code
date: 2026-03-23
category:
  - Windows
tag:
  - CMD
  - PowerShell
  - 命令行

---

# CMD 与 PowerShell 的区别

## 一句话理解

- **CMD**：Windows 传统命令行工具，适合执行基础命令和老式批处理脚本。
- **PowerShell**：更现代的命令行与脚本环境，适合自动化、系统管理和批量处理任务。

## 两者的定位

### CMD

CMD（Command Prompt）是 Windows 较早期的命令行工具，风格接近 DOS，主要用于：

- 执行基础系统命令
- 运行 `.bat`、`.cmd` 脚本
- 进行简单文件操作和网络测试

### PowerShell

PowerShell 是微软推出的现代化命令行工具，同时也是脚本语言，主要用于：

- 系统管理
- 自动化运维
- 批量处理任务
- 编写功能更强的脚本

## 核心区别

### 1. 处理对象不同

#### CMD 处理的是文本

CMD 中大多数命令输出的是纯文本，后续处理通常依赖字符串匹配。

```bash
ipconfig
tasklist
```

#### PowerShell 处理的是对象

PowerShell 中很多命令返回的是对象，可以直接按属性筛选、排序和传递。

```powershell
Get-Process
Get-Service
```

这也是 PowerShell 比 CMD 强很多的根本原因。

### 2. 命令风格不同

#### CMD 命令更传统

常见命令：

```bash
dir
cd
copy
del
ping
ipconfig
```

#### PowerShell 命令更规范

PowerShell 命令通常采用 `Verb-Noun` 风格：

```powershell
Get-ChildItem
Set-Location
Copy-Item
Remove-Item
Get-Process
```

常见动词包括：

- `Get-`：获取
- `Set-`：设置
- `New-`：新建
- `Remove-`：删除
- `Start-`：启动
- `Stop-`：停止

### 3. 脚本能力不同

#### CMD 适合简单批处理

CMD 脚本通常是 `.bat` 或 `.cmd` 文件，适合做简单任务：

```bat
@echo off
echo Hello
pause
```

适用场景：

- 顺序执行几条命令
- 简单复制或删除文件
- 启动程序

#### PowerShell 更接近正式编程语言

PowerShell 脚本是 `.ps1` 文件，支持：

- 变量
- 条件判断
- 循环
- 函数
- 异常处理
- 模块化

例如：

```powershell
$files = Get-ChildItem *.txt
foreach ($file in $files) {
    Write-Host $file.Name
}
```

### 4. 管道机制不同

#### CMD 管道传递文本

```bash
tasklist | findstr chrome
```

CMD 的管道本质上是把文本传给下一个命令。

#### PowerShell 管道传递对象

```powershell
Get-Process | Where-Object {$_.ProcessName -like "*chrome*"}
```

PowerShell 的管道传递的是对象，因此处理效率和灵活性都更高。

### 5. 系统管理能力不同

#### CMD

CMD 能完成一些基础管理任务，但能力有限，很多时候只是调用系统程序。

#### PowerShell

PowerShell 对 Windows 系统管理支持很强，可以方便地操作：

- 进程
- 服务
- 注册表
- 计划任务
- 用户与权限
- 系统配置
- 远程主机

例如：

```powershell
Get-Service
Stop-Service spooler
Get-EventLog -LogName System
```

## 实际使用上的差异

### CMD 更适合什么

- 临时执行简单命令
- 跑老教程中的命令
- 使用传统批处理脚本
- 做基础网络测试

常见场景：

```bash
ping github.com
ipconfig
tracert baidu.com
```

### PowerShell 更适合什么

- 批量处理文件
- 自动化脚本
- 开发环境配置
- 系统管理
- 处理结构化数据

例如 PowerShell 可以方便处理 JSON：

```powershell
$data = Get-Content data.json | ConvertFrom-Json
```

这一类任务用 CMD 会很不方便。

## 兼容性问题

### CMD

对老命令、老脚本兼容性更好。

### PowerShell

PowerShell 可以执行很多 CMD 常见命令，但有些名字相同的命令，在 PowerShell 中实际是别名，不一定调用的是 CMD 原生命令。

例如：

```powershell
dir
```

在 PowerShell 中通常等价于：

```powershell
Get-ChildItem
```

因此看起来一样，底层实现可能不同。

## 执行策略区别

PowerShell 有脚本执行策略限制，默认情况下可能不允许直接运行 `.ps1` 脚本。

这也是很多人在 Windows 中安装开发工具时遇到 `pnpm.ps1`、`npm.ps1` 被拦截的原因。

CMD 一般不会遇到这类脚本执行策略问题。

## 对比总结

| 方面         | CMD            | PowerShell            |
| ------------ | -------------- | --------------------- |
| 定位         | 传统命令行     | 现代命令行 + 脚本环境 |
| 输出类型     | 文本           | 对象                  |
| 脚本后缀     | `.bat`、`.cmd` | `.ps1`                |
| 管道传递     | 文本           | 对象                  |
| 自动化能力   | 较弱           | 很强                  |
| 系统管理能力 | 一般           | 很强                  |
| 学习难度     | 较低           | 略高                  |

## 如何选择

### 选 CMD

当你只是想：

- 执行几条简单命令
- 跑老脚本
- 按老教程操作
- 做基础排错

### 选 PowerShell

当你需要：

- 写自动化脚本
- 批量处理任务
- 管理 Windows 系统
- 配置开发环境
- 做更复杂的命令行操作

## 结论

CMD 更像是 Windows 中的传统命令行工具，简单直接，但能力有限。  
PowerShell 则更现代、更强大，既能当命令行工具用，也能当脚本语言用。

对于日常简单操作，CMD 足够。  
对于开发、自动化和系统管理，PowerShell 更值得重点掌握。