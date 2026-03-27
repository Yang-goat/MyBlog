---
icon: pen-to-square
title: Git 常见场景应用
date: 2026-03-27
order: 2
star: false
category:
  - 软件教程
  - git
tag:
  - 教程

---

# Git 常见场景应用

这篇文章不追求把 Git 讲全，而是把个人开发里最常见、最实用的一批场景整理成一份速查笔记。

- 日常提交与同步
- 分支开发与合并
- 查看本地和远程差异
- 临时保存修改
- 回退、恢复与远程回档

---

## 一、核心工作流程

Git 最核心的一条链路可以概括为：

**工作区 → 暂存区 → 本地仓库 → 远程仓库**

也就是：

- 先修改文件
- 再把修改加入暂存区
- 然后提交到本地仓库
- 最后按需同步到远程仓库

下面是一套最基础、最常用的提交流程。

```bash
# 1. 查看当前状态
git status

# 2. 添加到暂存区
git add 文件名
git add .          # 添加当前目录下所有改动

# 3. 提交到本地仓库
git commit -m "提交说明"

# 4. 推送到远程仓库
git push origin main
```

代码说明：

- `git status`：查看当前仓库状态，比如哪些文件被修改了、哪些文件已暂存、当前分支是否领先或落后远程。
- `git add 文件名`：把指定文件加入暂存区。
- `git add .`：把当前目录下所有改动加入暂存区。
- `git commit -m "提交说明"`：把暂存区内容提交到本地仓库。
- `git push origin main`：把本地 `main` 分支同步到远程仓库 `origin`。

其中：

- `origin` 是远程仓库默认名称
- `main` 是分支名，有些仓库可能还是 `master`

---

## 二、场景一：日常开发、阶段性提交与最终同步

这个场景适合：

- 你正在本地持续开发
- 想经常保存阶段性进度
- 但不一定每次提交后都立刻推送到远程

这是个人项目里最常见的用法。  
本地可以多次 `commit`，最后再统一 `push`。

完整流程如下：

```bash
# 第一次阶段性提交
git add .
git commit -m "完成首页初版"

# 第二次阶段性提交
git add .
git commit -m "修复首页布局问题"

# 第三次阶段性提交
git add .
git commit -m "调整文章列表样式"

# 最后统一推送到远程
git push origin main
```

代码说明：

- 每次 `commit` 都只是提交到本地仓库，不会自动同步远程。
- 最后一条 `git push origin main` 才会把这些本地提交一起推上去。

需要注意：

**远程不会只新增 1 条提交记录，而是会新增你本地尚未推送的所有提交记录。**

如果你本地中间提交很多次，但这些提交本质上都属于同一件事，推送前也可以先整理成一条更干净的提交。

```bash
# 把最近 3 次提交合并处理
git reset --soft HEAD~3

# 重新提交为一条新的提交记录
git commit -m "重构博客首页"

# 推送到远程
git push origin main
```

也可以使用交互式写法：

```bash
git rebase -i HEAD~3
```

代码说明：

- `git reset --soft HEAD~3`：回退最近 3 次提交，但保留修改内容在暂存区。
- `git commit -m "..."`：把这些内容重新整理成 1 条提交。
- `git rebase -i HEAD~3`：交互式整理最近 3 次提交，更灵活，但稍复杂。
- `git push origin main`：把整理后的结果同步到远程。

---

## 三、场景二：克隆仓库、切分支开发、最后合并

这个场景适合：

- 你第一次拿到一个 GitHub 仓库
- 想拉到本地开发
- 不想直接在 `main` 上修改，而是走“功能分支开发”的方式

完整流程如下：

```bash
# 1. 克隆仓库
git clone git@github.com:用户名/仓库名.git
# 或者使用 HTTPS
# git clone https://github.com/用户名/仓库名.git

# 2. 进入项目目录
cd 仓库名

# 3. 查看本地和远程分支
git branch -a

# 4. 新建并切换到开发分支
git checkout -b feature-dev
# 等价写法：
# git switch -c feature-dev

# 5. 开发完成后提交
git add .
git commit -m "实现 xxx 功能"

# 6. 第一次推送本地分支到远程
git push -u origin feature-dev
```

代码说明：

- `git clone ...`：把远程仓库完整拉到本地。
- `git branch -a`：查看所有分支，包括本地和远程分支。
- `git checkout -b feature-dev`：创建并切换到 `feature-dev` 分支。
- `git switch -c feature-dev`：较新的等价写法。
- `git push -u origin feature-dev`：第一次推送时建立本地和远程分支的跟踪关系。

如果后续你已经在本地把功能分支改好了，想合并回主分支，可以这样做：

```bash
# 1. 切回 main
git checkout main

# 2. 更新 main
git pull origin main

# 3. 合并开发分支
git merge feature-dev

# 4. 推送 main
git push origin main
```

代码说明：

- `git checkout main`：切回主分支。
- `git pull origin main`：先让本地主分支和远程保持一致。
- `git merge feature-dev`：把功能分支合并到主分支。
- `git push origin main`：把合并结果推送到远程。

如果是 GitHub 协作开发，也可以把分支推上去后再发 PR 合并。

---

## 四、场景三：本地没写完，但要先处理远程更新

这个场景适合：

- 你本地代码写到一半
- 还不想提交
- 但想先拉取远程最新代码

最常用的做法是 `stash`，先临时收起当前修改，处理完远程更新后再恢复。

完整流程如下：

```bash
# 1. 临时保存当前未提交的修改
git stash

# 2. 拉取远程更新并合并
git pull origin main

# 3. 恢复刚才临时保存的修改
git stash pop
```

如果你只是想恢复，但还想保留 stash 记录，也可以写成：

```bash
git stash apply
```

代码说明：

- `git stash`：把当前未提交的修改临时收起来，工作区会变干净。
- `git pull origin main`：拉取远程 `main` 分支最新代码并合并到当前分支。
- `git stash pop`：恢复 stash 内容，并删除这条 stash 记录。
- `git stash apply`：恢复 stash 内容，但保留 stash 记录。

---

## 五、场景四：查看本地与远程的状态、提交和代码差异

这个场景适合：

- 你想知道本地比远程多了什么
- 远程是不是已经有了你本地没有的提交
- 当前到底改了哪些文件、哪些代码

这是排查同步问题时最常用的一组命令。

完整流程如下：

```bash
# 1. 先更新远程信息
git fetch origin

# 2. 查看当前整体状态
git status

# 3. 查看本地有、远程没有的提交
git log --oneline origin/main..main

# 4. 查看远程有、本地没有的提交
git log --oneline main..origin/main

# 5. 查看具体代码差异
git diff origin/main..main

# 6. 只看变更文件概览
git diff --stat origin/main..main

# 7. 查看路线图和分支关系
git log --oneline --graph --decorate --all
```

代码说明：

- `git fetch origin`：只更新远程信息，不自动合并代码。
- `git status`：查看当前分支状态，例如是否领先或落后远程。
- `git log --oneline origin/main..main`：查看本地比远程多出的提交。
- `git log --oneline main..origin/main`：查看远程比本地多出的提交。
- `git diff origin/main..main`：查看本地相对远程的具体代码差异。
- `git diff --stat origin/main..main`：只显示哪些文件改了以及大致改动量。
- `git log --oneline --graph --decorate --all`：以图形化方式查看提交路线和分支关系。

如果只想看某个文件的差异，可以这样写：

```bash
git diff origin/main..main -- package.json
```

代码说明：

- 这条命令只比较 `package.json` 在本地和远程之间的差异。

---

## 六、场景五：回退、恢复和远程回档

这一类操作本质上都是“让代码回到过去某个状态”，但按影响范围不同，可以分成四种情况：

- 只是临时看旧版本
- 让本地分支真正回退
- 让本地彻底恢复成远程版本
- 让远程仓库也回档

### 1. 临时查看某个历史版本

适用于：

- 只是想看看以前的代码
- 做对比
- 试运行旧版本
- 不想真正改动当前分支

完整流程如下：

```bash
# 1. 查看提交历史
git log --oneline

# 2. 切换到指定提交
git checkout 提交号
# 或者
# git switch --detach 提交号
```

看完以后回到主分支：

```bash
git checkout main
# 或者
# git switch main
```

代码说明：

- `git checkout 提交号`：切到某个历史提交查看代码。
- `git switch --detach 提交号`：较新的写法，表示进入游离 `HEAD` 状态。
- `git checkout main`：回到正常分支继续开发。

---

### 2. 让本地当前分支真正回到某个旧版本

适用于：

- 当前分支后面的提交不要了
- 想直接让本地分支退回某个提交

完整流程如下：

```bash
# 1. 查看提交历史
git log --oneline

# 2. 强制回退到指定提交
git reset --hard 提交号
```

代码说明：

- `git reset --hard 提交号`：让当前分支、暂存区、工作区全部退回到那个提交的状态。

---

### 3. 本地改乱了，直接恢复成远程仓库当前版本

适用于：

- 本地已经改乱了
- 当前本地修改不想要了
- 想直接恢复成远程仓库当前状态

完整流程如下：

```bash
# 1. 更新远程信息
git fetch origin

# 2. 强制把当前分支重置到远程 main
git reset --hard origin/main

# 3. 删除未跟踪文件和被忽略文件
git clean -fdx
# 如果不想删忽略文件，也可以用：
# git clean -fd
```

代码说明：

- `git reset --hard origin/main`：把当前分支强制对齐到远程 `main`。
- `git clean -fdx`：删除未跟踪文件和忽略文件，恢复更彻底。
- `git clean -fd`：只删除未跟踪文件，不删除被 `.gitignore` 忽略的内容。

---

### 4. 让远程仓库也回到旧状态

这个场景分两种。

#### 写法一：不改写历史，推荐优先用 `revert`

适用于：

- 远程某些提交有问题
- 想撤销这些提交的效果
- 但不想强推改写远程历史

完整流程如下：

```bash
# 1. 查看提交历史
git log --oneline

# 2. 撤销某次提交
git revert 提交号

# 3. 推送到远程
git push origin main
```

如果要连续撤销多个提交，可以依次执行：

```bash
git revert 提交号3
git revert 提交号2
git revert 提交号1
git push origin main
```

代码说明：

- `git revert 提交号`：不会删除原提交，而是新建一条“反向提交”来抵消它。
- `git push origin main`：把撤销结果同步到远程。
- 这种方式历史完整，更适合多人协作。

#### 写法二：直接强推回档，适合个人仓库

适用于：

- 你已经确定要把远程历史直接退回去
- 仓库是个人仓库，或者你完全控制远程分支

完整流程如下：

```bash
# 1. 本地先回退到目标版本
git reset --hard 提交号

# 2. 强制同步到远程
git push origin main --force-with-lease
# 更直接但更危险的写法：
# git push origin main --force
```

代码说明：

- `git reset --hard 提交号`：本地先退回目标版本。
- `git push origin main --force-with-lease`：强制更新远程，但会先检查远程是否有你未知的新提交，相对更安全。
- `git push origin main --force`：直接强推，风险更大。

---

### 5. 远程先回档，本地当前开发先保留

这个场景很实用，适合：

- 远程 `main` 当前版本有问题，想先恢复稳定状态
- 但你本地还保留着新版本开发进度，不想丢
- 等本地修好后，再重新合并回远程

完整流程如下：

```bash
# 1. 先保存当前开发状态到新分支
git checkout -b dev-current

# 2. 切回 main
git checkout main

# 3. 拉取远程最新代码
git pull origin main

# 4. 撤销有问题的提交，让远程先恢复稳定状态
git revert 提交号
# 如果有多个提交要撤销，就依次 revert

# 5. 推送 main 到远程
git push origin main

# 6. 切回开发分支继续修
git checkout dev-current
```

修好以后再合并回主分支：

```bash
# 1. 切回 main
git checkout main

# 2. 合并开发分支
git merge dev-current

# 3. 推送到远程
git push origin main
```

代码说明：

- `git checkout -b dev-current`：把当前尚未完成但又不想丢的代码保存到一个新分支。
- `git revert 提交号`：先让远程主分支恢复稳定状态。
- `git merge dev-current`：等修好后再把开发分支合并回主分支。

这个流程比“直接强推远程回档”更稳，也更不容易把本地开发进度弄乱。

---

## 七、最后建议：个人项目最常用的一套命令

如果只是个人项目日常开发，下面这组命令基本就够用了。

### 1. 查看本地和远程差异

```bash
git fetch origin
git status
git log --oneline origin/main..main
git diff --stat origin/main..main
```

### 2. 本地阶段性保存进度

```bash
git add .
git commit -m "阶段性保存"
```

### 3. 最后同步远程

```bash
git push origin main
```

### 4. 本地改乱了，恢复远程版本

```bash
git fetch origin
git reset --hard origin/main
git clean -fdx
```

### 5. 本地很多碎提交，整理后再推送

```bash
git reset --soft HEAD~3
git commit -m "整理后的正式提交"
git push origin main
```

---

## 八、总结

可以把 Git 常用操作简化成五类：

- **日常提交**：`add`、`commit`、`push`
- **分支开发**：`branch`、`checkout`、`merge`
- **临时保存**：`stash`
- **查看差异**：`status`、`log`、`diff`
- **恢复与回退**：`checkout`、`reset`、`revert`

如果只是个人开发，其实最关键的是下面三点：

1. 开发过程中可以放心多次 `commit`，先把阶段性成果存住  
2. 推送前再决定是否整理提交历史  
3. 遇到问题先看状态、看日志、看差异，再决定是合并、回退还是恢复