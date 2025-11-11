---
icon: pen-to-square
date: 2025-09-27
category:
  - Python
tag:
  - conda
  - 指令大全
---

# conda 指令速查表

Conda 是一个开源的包管理和环境管理工具，主要用于 Python 和数据科学领域。它可以帮助你快速创建独立的虚拟环境，避免依赖冲突，并支持从 conda 仓库或 pip 安装各种软件包。通过 Conda，你可以方便地切换不同项目的运行环境，管理依赖，导出与复现环境，从而让开发过程更加高效和可控。

## 1. Conda 基础

查看 conda 版本

```bash
conda --version
```

查看帮助

```bash
conda --help
```

更新 conda

```bash
conda update conda
```

## 2. 环境管理

创建环境（指定 Python 版本）

```bash
conda create -n myenv python=3.10
```

激活环境

```bash
conda activate myenv
```

退出环境

```bash
conda deactivate
```

删除环境

```bash
conda remove -n myenv --all
```

查看所有环境

```bash
conda env list
```

## 3. 包管理

搜索包

```bash
conda search numpy
```

安装包

```bash
conda install numpy
```

指定版本

```bash
conda install numpy=1.24
```

在指定环境中安装包

```bash
conda install -n myenv pandas
```

卸载包

```bash
conda remove numpy
```

更新包

```bash
conda update numpy
```

更新所有包

```bash
conda update --all
```

## 4. 环境导出与复现

导出环境

```bash
conda env export > environment.yml
```

根据文件创建环境

```bash
conda env create -f environment.yml
```

## 5. Conda + Pip

激活环境后再用 pip 安装

```bash
pip install package_name
```

建议：优先用 conda，conda 没有再用 pip。

## 6. 常用技巧

清理缓存

```bash
conda clean --all
```

查看包信息

```bash
conda info numpy
```

克隆环境

```bash
conda create --name new_env --clone old_env
```

## ✅ 推荐工作流

1. 创建环境 → `conda create -n 项目名 python=版本`
2. 激活环境 → `conda activate 项目名`
3. 安装依赖 → `conda install 包名 / pip install 包名`
4. 导出环境 → `conda env export > environment.yml`