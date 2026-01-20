---
icon: book
date: 2026-01-20
order: 2
category:
  - Linux
  - Ubuntu
tag:
  - apt
---

# Ubuntu / Debian 软件管理

:::info
本文按照三个实际场景给出参考代码：

- 使用已有官方源的软件
- 需要添加第三方源的软件
- 使用本地 deb 包的软件
:::

Ubuntu 和 Debian 使用的是 APT 体系（Advanced Package Tool），核心是：

- `.deb`：软件包格式
- `apt / apt-get / apt-cache`：高层管理工具
- `dpkg`：底层包管理工具

你可以把它理解为：

`apt` = 会自动处理依赖、联网、查仓库
`dpkg` = 只负责“装/卸一个本地包”，不管依赖

## APT 体系结构

```
远程仓库 → apt update → 本地索引
                   ↓
               apt install
                   ↓
                dpkg 安装
```

关键目录
| 目录                         | 作用         |
| -------------------------- | ---------- |
| `/etc/apt/sources.list`    | 主软件源       |
| `/etc/apt/sources.list.d/` | 第三方源       |
| `/var/lib/apt/lists/`      | 本地软件索引     |
| `/var/cache/apt/archives/` | 下载的 deb 缓存 |
| `/var/lib/dpkg/`           | 已安装包数据库    |

## 场景1：使用已有官方源的软件

比如：`vim`, `git`, `curl`, `htop`, `nginx`, `redis` 等。

### 安装

```bash
sudo apt update #  安装前更新索引

apt search xxx  # 搜索软件

apt show xxx    # 查看软件信息

sudo apt install xxx # 安装

dpkg -l | grep redis  # 使用dpkg查看是否安装成功
```

### 升级

```bash
sudo apt upgrade xxx  # 升级指定软件

sudo apt upgrade      # 是是升级所有软件
```

### 卸载

```bash
sudo apt remove xxx # 只删程序

sudo apt purge xxx  # 程序 + 配置文件
```

### 清理残留依赖

```bash
sudo apt autoremove
```

## 场景2：需要添加第三方源的软件

比如：`Docker`, `Node.js`, `Chrome`, `VS Code`, `MySQL 官方版` 等。

需要先添加第三方源，其余类似。

以`Docker`为例:

### 安装



```bash
sudo apt update  # 安装前更新索引
sudo apt install -y ca-certificates curl gnupg  # 安装必要工具

# 添加 GPG key（用于验证软件包来源的合法性）
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 添加第三方软件源
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list

sudo apt update  # 更新索引，使新源生效
```

## 场景3：使用本地 deb 包的软件

比如：企业内部系统、离线环境软件、定制安装包等。

新新卸载和清理残留依赖代码类似。

假设你有一个文件：myapp_1.2.3_amd64.deb

### 安装

```bash
sudo apt update  # 更新索引（虽然是本地包，但仍然建议执行）

sudo apt install ./myapp_1.2.3_amd64.deb  # 推荐方式（自动处理依赖）

# 如果你使用了 dpkg 安装且出现依赖问题
sudo dpkg -i myapp_1.2.3_amd64.deb         # 仅安装，不处理依赖
sudo apt -f install                       # 修复依赖

dpkg -l | grep myapp  # 使用 dpkg 查看是否安装成功
```

### 升级

直接使用新版本的`deb`覆盖安装即可

```bash
sudo apt install ./myapp_1.2.4_amd64.deb  # 使用新版本 deb 覆盖安装
```


