---
icon: code
title: SSH 简介
date: 2026-03-23
star: false
category:
  - 开发基础
tag:
  - SSH
  - Linux
  - Windows

---

# SSH 简介

## 1. 什么是 SSH

SSH（Secure Shell，安全外壳协议）是一种用于**远程登录**、**远程执行命令**和**安全传输文件**的网络协议，也常指对应的一套命令行工具。

它的核心特点是：

- 通信过程加密
- 可以验证服务器和用户身份
- 适合远程管理 Linux 主机与代码托管平台认证

---

## 2. SSH 能做什么

### 远程登录

```bash
ssh username@host
```

### 远程执行命令

```bash
ssh username@host "ls -l"
```

### 传输文件

```bash
scp file.txt username@host:/home/username/
```

### Git 身份认证

```bash
git clone git@github.com:user/repo.git
```

### 建立安全隧道

SSH 还支持端口转发，可用于访问内网服务、数据库等。

---

## 3. 为什么使用 SSH

相比早期的 Telnet 一类工具，SSH 更安全，主要体现在：

- **加密**：传输内容不会明文暴露
- **认证**：可以确认连接对象是否合法
- **完整性保护**：防止通信内容被篡改

因此，SSH 已经是远程管理服务器的标准方式。

---

## 4. 常见认证方式

### 密码认证

连接后直接输入远程主机密码。  
优点是简单，缺点是安全性和自动化能力一般。

### 密钥认证

使用一对密钥进行认证：

- **私钥**：保存在本机，不能泄露
- **公钥**：放在服务器或平台上

这是更常用、更推荐的方式，尤其适合：

- 登录服务器
- 配置 GitHub / GitLab
- 自动化脚本

---

## 5. 常见命令

### `ssh`

用于远程登录：

```bash
ssh user@host
```

指定端口：

```bash
ssh -p 2222 user@host
```

### `scp`

用于复制文件：

```bash
scp local.txt user@host:/path/
scp user@host:/path/file.txt ./
```

### `sftp`

用于交互式文件传输：

```bash
sftp user@host
```

### `ssh-keygen`

用于生成 SSH 密钥：

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

---

## 6. Windows 与 Linux 中的使用

::: tabs#ssh-usage

@tab Windows

### 环境

Windows 10 / 11 通常已经自带 OpenSSH 客户端，可直接在以下终端使用：

- PowerShell
- CMD
- Windows Terminal

检查是否可用：

```bash
ssh
```

如果能显示帮助信息，说明已经安装。

### 远程连接

```bash
ssh username@host
```

例如：

```bash
ssh ubuntu@192.168.1.100
```

### 生成密钥

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

默认密钥位置一般为：

```text
C:\Users\用户名\.ssh\
```

### 查看公钥

在 PowerShell 中：

```powershell
type $env:USERPROFILE\.ssh\id_ed25519.pub
```

### 常见用途

- 连接 Linux 服务器
- 配置 GitHub SSH 登录
- 使用 `scp` 上传下载文件

---

@tab Linux

### 环境

大多数 Linux 发行版默认自带 OpenSSH 客户端。  
在终端输入：

```bash
ssh
```

若显示帮助信息，说明可以直接使用。

### 远程连接

```bash
ssh username@host
```

例如：

```bash
ssh root@192.168.1.100
```

### 生成密钥

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

默认密钥位置一般为：

```text
~/.ssh/
```

### 查看公钥

```bash
cat ~/.ssh/id_ed25519.pub
```

### 拷贝公钥到服务器

```bash
ssh-copy-id user@host
```

### 常见用途

- 管理远程服务器
- 执行远程命令
- Git 平台免密认证
- 自动化脚本与多机协作

:::

---

## 7. Windows 与 Linux 的主要区别

::: tabs#ssh-diff

@tab Windows

- 更常用于连接 Linux 服务器和配置 GitHub
- 常见终端是 PowerShell、CMD、Windows Terminal、Git Bash
- SSH 文件通常位于：

```text
C:\Users\用户名\.ssh\
```

---

@tab Linux

- 更常用于服务器管理、脚本自动化和多机通信
- 通常直接在系统终端中使用
- SSH 文件通常位于：

```text
~/.ssh/
```

:::

---

## 8. 第一次连接时的提示

首次连接某台主机时，常会看到类似提示：

```text
The authenticity of host 'xxx' can't be established.
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

这表示系统在确认远程主机身份。输入：

```text
yes
```

后，该主机信息会被记录到本地 `known_hosts` 中，后续连接一般不再重复提示。

---

## 9. 常见问题

### `Permission denied (publickey)`

公钥认证失败，常见原因：

- 公钥未上传到服务器
- 私钥与公钥不匹配
- 用户名写错
- SSH 配置有误

### `Host key verification failed`

主机身份校验失败，通常是本地 `known_hosts` 中的旧记录与当前主机不一致。

### `Connection refused`

连接被拒绝，通常是：

- 远程主机未开启 SSH 服务
- 端口错误
- 防火墙拦截

---

## 10. 小结

SSH 可以概括为一句话：

> SSH 是一种用于远程登录、远程执行命令、文件传输和身份认证的安全通信工具。

在实际开发中，最常见的两类用途是：

- 连接远程 Linux 服务器
- 配置 GitHub / GitLab 的 SSH 密钥认证