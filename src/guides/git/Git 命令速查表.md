---
icon: book-bookmark
date: 2025-09-27
order: 2
category:
  - git
tag:
  - 指令速查
---

# Git 常用指令

## 🔧 基础配置

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
git config --list       # 查看配置
```

## 📦 仓库操作

```bash
git init                # 初始化仓库
git clone URL           # 克隆远程仓库
git remote -v           # 查看远程仓库
git remote add origin URL   # 添加远程仓库
```

## 🛠 工作流程

```bash
git status              # 查看状态
git add 文件名          # 添加到暂存区
git add .               # 添加所有文件
git commit -m "说明"    # 提交到本地仓库
git push origin main    # 推送到远程仓库
git pull origin main    # 拉取远程更新
```

## 🌱 分支操作

```bash
git branch              # 查看分支
git branch 分支名       # 创建分支
git checkout 分支名     # 切换分支
git switch 分支名       # 新推荐写法
git checkout -b 新分支  # 创建并切换分支
git merge 分支名        # 合并分支
git branch -d 分支名    # 删除分支
```

## 📜 历史记录

```bash
git log                 # 查看提交历史
git log --oneline       # 简洁模式
git log --graph --all --oneline   # 图形化查看
```

## ⏪ 撤销与回退

```bash
git checkout -- 文件名  # 撤销工作区修改
git reset 文件名        # 撤销暂存区文件
git reset --hard 提交ID # 回退到某个版本
```

## 🔍 查看改动

```bash
git diff                # 查看未暂存的修改
git diff --staged       # 查看已暂存的修改
```

## 🛟 其他技巧

```bash
git stash               # 保存当前修改
git stash pop           # 恢复保存的修改
git branch -M main      # 修改分支名为 main
```

## Git指令大全

[Git 大全 - Gitee.com](https://gitee.com/all-about-git)
