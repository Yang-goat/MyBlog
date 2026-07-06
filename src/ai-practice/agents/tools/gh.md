---
title: GitHub CLI（gh）：AI Agent 使用 GitHub 的命令行入口
icon: brands:github
date: 2026-07-06
category:
  - 软件工具
tag:
  - GitHub
  - GitHub CLI
  - gh
  - AI Agent
  - 命令行工具
---

# GitHub CLI（gh）：AI Agent 使用 GitHub 的命令行入口

在使用 Codex、Claude Code、OpenHands 这类 AI Agent 工具时，Agent 经常需要和 GitHub 打交道，例如：

- 克隆一个开源仓库；
- 查看项目的 Issue、Pull Request；
- 创建分支、提交修改；
- 根据仓库内容分析代码；
- 帮你生成 Pull Request 或 Release 说明。

如果只依赖浏览器操作，AI Agent 很难稳定地完成这些任务。**GitHub CLI（Command Line Interface，简称 gh）** 就是为了解决这个问题：它把 GitHub 的常用网页操作搬到了命令行里，让人和 AI Agent 都可以通过终端直接操作 GitHub。

简单来说，`gh` 是 GitHub 官方提供的命令行工具。GitHub 官方对它的描述是：`gh` 可以把 Pull Request、Issue 等 GitHub 概念带到终端中，和你本地的 `git` 与代码工作流放在一起使用。

::: important 为什么 Agent 需要 gh
AI Agent 最擅长操作终端、读取文件、执行命令和分析输出。安装 `gh` 后，Agent 就可以用标准命令完成 GitHub 相关操作，而不是让你频繁切换浏览器、复制链接、手动下载压缩包。
:::

## 一、gh 和 git 有什么区别

很多人容易把 `git` 和 `gh` 混在一起。它们不是同一个工具。

| 工具 | 主要作用 | 典型命令 |
| --- | --- | --- |
| `git` | 本地版本控制工具，负责提交、分支、合并、推送等 | `git status`、`git commit`、`git push` |
| `gh` | GitHub 官方命令行工具，负责操作 GitHub 平台功能 | `gh auth login`、`gh repo clone`、`gh pr create` |

可以这样理解：

- `git` 管的是**代码版本**；
- `gh` 管的是**GitHub 平台功能**；
- 两者配合起来，才是比较完整的 GitHub 命令行工作流。

例如，克隆仓库既可以用：

```bash
git clone https://github.com/owner/repo.git
```

也可以用：

```bash
gh repo clone owner/repo
```

后者的好处是：登录 GitHub 之后，访问私有仓库、组织仓库、PR、Issue 等场景会更顺手。

## 二、适合安装 gh 的场景

如果你有下面这些需求，就建议安装 GitHub CLI：

1. 经常从 GitHub 下载或克隆开源项目；
2. 使用 Codex、Claude Code 等 AI 编程 Agent；
3. 需要让 Agent 读取 GitHub 仓库、Issue 或 PR；
4. 希望少打开浏览器，直接在终端里管理 GitHub；
5. 经常写代码、改代码、提交代码或维护项目。

对于普通用户来说，`gh` 不是必须安装的软件；但对于 AI Agent 工作流来说，它属于比较推荐的基础工具。

## 三、安装前准备

安装前建议确认三件事：

1. 已经有 GitHub 账号；
2. 电脑上已经安装 Git；
3. 终端可以正常联网访问 GitHub。

在 Windows 中可以先检查 Git：

```powershell
git --version
```

如果能看到类似下面的输出，说明 Git 已安装：

```text
git version 2.xx.x.windows.x
```

如果没有安装 Git，可以先到 Git 官网下载安装：

- [Git 官方网站](https://git-scm.com/)

## 四、安装 GitHub CLI

### 方式一：Windows 使用 winget 安装

Windows 10、Windows 11 推荐使用 `winget` 安装。

打开 PowerShell 或 Windows Terminal，输入：

```powershell
winget install --id GitHub.cli --source winget
```

安装完成后，建议关闭当前终端，重新打开一个新的终端窗口，然后检查版本：

```powershell
gh --version
```

如果能看到类似下面的输出，说明安装成功：

```text
gh version 2.xx.x
```

::: tip 推荐方式
如果你主要在 Windows 上使用 Codex、Claude Code 或其他本地 Agent，优先使用 `winget` 安装。它后续升级也比较方便。
:::

后续升级可以使用：

```powershell
winget upgrade --id GitHub.cli --source winget
```

### 方式二：macOS 安装

macOS 可以使用 Homebrew：

```bash
brew install gh
```

检查版本：

```bash
gh --version
```

### 方式三：Linux 安装

Linux 不同发行版的安装方式略有区别，建议参考 GitHub CLI 官方安装文档。

常见情况下，可以通过系统包管理器安装，例如：

```bash
sudo apt install gh
```

不过不同 Linux 发行版的软件源版本可能不一致，正式使用前建议以官方文档为准。

## 五、登录 GitHub

安装完成后，需要让 `gh` 登录你的 GitHub 账号。

在终端输入：

```powershell
gh auth login
```

一般按照下面的选项选择即可：

```text
? What account do you want to log into? GitHub.com
? What is your preferred protocol for Git operations? HTTPS
? Authenticate Git with your GitHub credentials? Yes
? How would you like to authenticate GitHub CLI? Login with a web browser
```

之后终端会提示你打开浏览器，并输入验证码或完成授权。授权完成后，`gh` 会把认证信息保存到系统凭据管理器中。

登录完成后，检查状态：

```powershell
gh auth status
```

如果看到类似下面的信息，说明登录成功：

```text
Logged in to github.com account <你的用户名>
```

::: warning 账号安全
不要把 GitHub Token、验证码、Cookie 或终端中的敏感认证信息发给别人，也不要直接粘贴到公开的 AI 对话或公开仓库中。让 AI Agent 使用 GitHub 时，也要尽量让它只执行必要命令。
:::

## 六、常用命令

### 1. 查看登录状态

```powershell
gh auth status
```

### 2. 克隆仓库

```powershell
gh repo clone owner/repo
```

例如克隆 GitHub CLI 自己的仓库：

```powershell
gh repo clone cli/cli
```

### 3. 在浏览器中打开仓库

```powershell
gh repo view owner/repo --web
```

### 4. 查看仓库信息

```powershell
gh repo view owner/repo
```

### 5. 查看 Issue

```powershell
gh issue list
```

需要在某个 GitHub 仓库目录下执行，或者指定仓库：

```powershell
gh issue list --repo owner/repo
```

### 6. 查看 Pull Request

```powershell
gh pr list
```

或者指定仓库：

```powershell
gh pr list --repo owner/repo
```

### 7. 创建 Pull Request

```powershell
gh pr create
```

这个命令通常在你完成代码修改、提交并推送分支后使用。执行后，`gh` 会引导你填写 PR 标题、描述和目标分支。

## 七、给 AI Agent 使用时的建议

安装 `gh` 的重点，不只是为了自己少点几下网页，而是为了让 AI Agent 更稳定地参与 GitHub 工作流。

例如，你可以让 Agent 执行这类任务：

```text
请你用 gh 查看这个仓库最近的 issue，并总结哪些和安装失败有关。
```

```text
请你克隆这个 GitHub 仓库，阅读 README，然后告诉我如何在本地启动。
```

```text
请你基于当前修改创建一个分支，并准备一个 Pull Request 草稿。
```

有了 `gh` 之后，Agent 可以更自然地使用这些命令：

```bash
gh repo clone owner/repo
gh issue list --repo owner/repo
gh pr list --repo owner/repo
gh pr view <编号> --repo owner/repo
```

::: important 建议的使用边界
`gh` 可以让 AI Agent 更方便地操作 GitHub，但不代表应该让 Agent 无限制地执行所有命令。涉及 `push`、`pr create`、`repo delete`、`release create` 等操作时，建议先让 Agent 说明计划，再由你确认执行。
:::

## 八、常见问题

### 1. 输入 gh 后提示不是内部或外部命令

可能原因：

- 安装后没有重新打开终端；
- GitHub CLI 没有正确加入 PATH；
- winget 安装过程失败。

可以先重新打开 PowerShell，然后执行：

```powershell
gh --version
```

如果仍然失败，可以重新安装：

```powershell
winget install --id GitHub.cli --source winget
```

### 2. gh auth login 登录失败

常见原因：

- 浏览器登录的 GitHub 账号不是你想绑定的账号；
- 网络无法访问 GitHub；
- 企业或校园网络拦截了认证流程；
- 终端代理没有配置好。

可以先检查当前登录状态：

```powershell
gh auth status
```

如果需要重新登录，可以退出后再登录：

```powershell
gh auth logout
gh auth login
```

### 3. 克隆私有仓库失败

如果你已经登录，但仍然无法克隆私有仓库，通常是权限问题。需要确认：

- 当前 GitHub 账号是否有该仓库权限；
- 是否加入了对应组织；
- 组织是否要求 SSO 授权；
- 仓库地址是否写错。

可以先查看登录账号：

```powershell
gh auth status
```

再尝试查看仓库：

```powershell
gh repo view owner/repo
```

### 4. 需要给 AI Agent 配置 GitHub Token 吗

一般情况下，个人电脑本地使用不需要手动配置 Token。通过：

```powershell
gh auth login
```

完成浏览器登录即可。

只有在自动化脚本、服务器、CI/CD 等场景下，才可能需要使用 Token。普通本地 Agent 使用场景中，优先使用 `gh auth login`。

::: danger 不要随意暴露 Token
GitHub Token 相当于账号权限凭据。不要把 Token 写进代码、截图、博客文章或发给 AI。确实需要使用 Token 时，应限制权限范围，并定期清理不用的 Token。
:::

## 九、推荐安装结论

对于普通 GitHub 用户来说，`gh` 是一个提高效率的命令行工具。

对于 AI Agent 用户来说，`gh` 的意义更明显：它给 Agent 提供了一个稳定、标准、可脚本化的 GitHub 操作入口。安装后，Agent 可以更方便地克隆仓库、读取 Issue、查看 PR、分析项目结构和辅助提交代码。

如果你正在使用 Codex、Claude Code、OpenHands 或类似工具，建议把 GitHub CLI 作为基础环境的一部分安装好。

## 参考资料

- [GitHub CLI 官方网站](https://cli.github.com/)
- [GitHub CLI 官方仓库](https://github.com/cli/cli)
- [GitHub CLI Windows 安装文档](https://github.com/cli/cli/blob/trunk/docs/install_windows.md)
- [GitHub CLI Quickstart](https://docs.github.com/en/github-cli/github-cli/quickstart)
- [gh auth login 官方手册](https://cli.github.com/manual/gh_auth_login)
- [gh repo clone 官方手册](https://cli.github.com/manual/gh_repo_clone)