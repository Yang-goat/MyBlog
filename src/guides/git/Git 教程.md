---
icon: book-bookmark
date: 2025-09-27
order: 1
category:
  - git
tag:
  - 版本控制
  - 教程
---

# Git 教程

## 一、Git 简介

Git 是一个分布式版本控制系统，常用于代码管理。它能帮助你：

- 追踪代码变化历史
- 与多人协作开发
- 方便回退与分支管理

## 二、Git安装

[git官网下载链接](https://git-scm.cn/downloads)

[引用外站CSDN安装教程](https://blog.csdn.net/mukes/article/details/115693833)

安装后可用以下命令检查版本：

```bash
git --version
```

## 三、基本配置（第一次使用时需要设置）

### 用户名与邮箱配置

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

查看当前配置：

```bash
git config --list
```

### Windows 配置 GitHub SSH Key (Gitee类似)

#### 1. 检查是否已有 SSH key

```bash
ls ~/.ssh
```

如果里面有 `id_ed25519` 或 `id_rsa`，说明已经生成过，可以跳到 **第 3 步**。

#### 2. 生成新的 SSH key

在终端或 `Git Bash` 执行：

```bash
ssh-keygen -t ed25519 -C "你的GitHub邮箱"
```

⚠️ 注意：

- `-C` 后面是你的 **GitHub 注册邮箱**。
- 如果电脑比较老，不支持 ed25519，可以改成 `rsa`：

  ```
  ssh-keygen -t rsa -b 4096 -C "你的GitHub邮箱"
  ```

一路回车即可，默认会保存在：

```
C:\Users\你的用户名\.ssh\
```

会生成两个文件：

- `id_ed25519`（私钥，不能泄露）
- `id_ed25519.pub`（公钥，要上传到 GitHub）

#### 3. 启动 SSH 代理并添加 key

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

（如果报错找不到 `ssh-add`，用 **Git Bash** 执行）

#### 4. 把公钥加到 GitHub

1. 打开文件：

   ```bash
   notepad ~/.ssh/id_ed25519.pub  # 或手动在c盘中打开该文件
   ```

   复制里面的内容。

2. 登录 GitHub → `Settings` → `SSH and GPG keys` → `New SSH key`。

![](\img\1.png)

3. Title 随便填（比如 "My Windows PC"），Key 里粘贴刚才复制的内容 → **保存**。

![](\img\2.png)

------

#### 5. 测试连接

在终端执行：

```bash
ssh -T git@github.com
```

第一次可能会提示：

```bash
The authenticity of host 'github.com' can't be established...
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

输入 `yes` 回车。

如果输出：

```bash
Hi 你的GitHub用户名! You've successfully authenticated...
```

说明 SSH 配置成功 ✅。

#### 6. 修改远程仓库地址为 SSH

进入你的项目目录，执行：

```bash
git remote set-url origin git@github.com:你的用户名/仓库名.git
```

## 四、创建仓库

### 1. 在本地新建仓库

```bash
mkdir my-project
cd my-project
git init
```

执行后会生成一个 .git 文件夹，表示已经是一个 Git 仓库。

### 2. 克隆远程仓库

```bash
git clone 仓库地址
```

仓库地址从github对应仓库页面的code处复制粘贴，可以选择https和ssh：

![](\img\仓库地址.png)

由于第三点已配置ssh，这里优先使用ssh连接，因为ssh连接比https连接更稳定

示例：

```bash
# https连接
git clone https://github.com/username/repo.git

# ssh连接
git clone git@github.com:username/repo.git
```

至此就实现了首次将远程仓库代码下载到本地。

## 五、核心工作流程

Git 的核心流程：
**工作区 → 暂存区 → 本地仓库 → 远程仓库**

1. 查看状态

  ```bash
  git status
  ```

2. 添加到暂存区

  ```bash
  git add 文件名
  git add .      # 添加所有文件
  ```

3. 提交到本地仓库

  ```bash
  git commit -m "提交说明"
  ```

4. 推送到远程仓库

  ```bash
  git push origin main
  ```

  origin 是远程仓库的默认名字，main 是分支名（有时是 master）。

## 六、常见场景

### 从 GitHub 拉取仓库并在新分支上开发

假设 GitHub 上已经有一个仓库，你要拉取下来，然后在自己的分支开发。

#### 1. 克隆仓库到本地

在命令行输入：

```bash
git clone git@github.com:用户名/仓库名.git
```

（如果没配置 SSH，也可以用 HTTPS 地址）

进入项目目录：

```bash
cd 仓库名
```

#### 2. 查看远程和本地分支

```bash
git branch -a
```

- 带 `remotes/origin/...` 的是远程分支
- 没有 `remotes` 的是你本地的分支

#### 3. 新建并切换到开发分支

假设你要在 `feature-dev` 分支上开发：

```bash
git checkout -b feature-dev
```

这样就新建了一个本地分支，并自动切换过去。

（等价写法：

```bash
git switch -c feature-dev
```

）

#### 4. 开发 & 提交代码

写完代码后：

```bash
git add .
git commit -m "实现了xxx功能"
```

------

#### 5. 推送分支到远程

第一次推送需要指定远程分支：

```bash
git push -u origin feature-dev
```

之后只要：

```bash
git push
```

就行。

#### 6. 提交 Pull Request (PR)

1. 打开 GitHub 仓库页面。
2. 你会看到提示「Compare & pull request」，点进去。
3. 选择 **base 分支**（一般是 `main` 或 `master`），和你的 **feature-dev 分支**进行对比。
4. 填写说明，提交 PR。
5. 等团队成员 review 并合并。

### 本地代码未敲完时，暂存本地代码，拉取远程代码，后与本地代码合并

把本地未完成的修改先临时存起来，拉取远程代码后再恢复。

```bash
# 1. 保存本地改动到 stash（不会丢失）
git stash

# 2. 拉取远程更新并合并
git pull origin main

# 3. 取回你刚才 stash 的修改
git stash pop
```

## 七、