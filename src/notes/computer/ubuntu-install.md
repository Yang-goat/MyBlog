---
title: Ubuntu Desktop 安装与重装教程
icon: fa-brands fa-ubuntu
date: 2026-06-06
order: 2
category:
  - 计算机随记
tag:
  - Ubuntu
  - Linux
  - 系统安装
  - 启动 U 盘
---

# Ubuntu Desktop 安装与重装教程

本文介绍如何下载 Ubuntu Desktop、制作启动 U 盘，并完成单系统安装、覆盖重装或与 Windows 共存。教程以普通 x86-64、UEFI 电脑和 Ubuntu 24.04 LTS 为例。

::: danger 重要警告
“擦除磁盘并安装 Ubuntu”会清空所选磁盘。手动分区时，格式化错误分区也会造成永久数据丢失。开始前必须完成备份，并确认目标磁盘的容量、型号和分区用途。
:::

## 一、选择安装方式

开始前先确定目标：

| 目标 | 推荐选项 |
| --- | --- |
| 只使用 Ubuntu，清空原系统 | 擦除磁盘并安装 Ubuntu |
| 重装已有 Ubuntu | 备份后擦除原 Ubuntu 所在磁盘 |
| 保留 Windows，安装双系统 | 与 Windows 共存 |
| 自定义 `/`、`/home` 等分区 | 手动分区 |

不熟悉 Linux 分区时，应优先使用安装器提供的自动选项。

## 二、安装前准备

### 1. 准备所需物品

- 一台可以正常联网的电脑。
- 一个容量不小于 8 GB 的空 U 盘，建议使用 12 GB 或更大容量。
- 稳定的网络和电源。
- 至少 25 GB 可用磁盘空间，日常使用建议预留 80 GB 以上。

### 2. 备份重要数据

备份个人文件、浏览器资料、SSH 密钥、项目代码、软件配置和许可证。制作启动盘也会清空 U 盘中的现有文件。

如果要保留 Windows 组成双系统，还应：

1. 保存 [BitLocker 恢复密钥](https://aka.ms/myrecoverykey)。
2. 在 Windows 中关闭快速启动。
3. 确认 Windows 分区没有处于休眠状态。
4. 按 Ubuntu 安装器提示关闭 BitLocker，或将 Ubuntu 安装到独立的未加密硬盘。

::: warning
BitLocker 开启时，Ubuntu 安装器可能无法安全调整 Windows 分区。不要强行修改加密分区。
:::

### 3. 检查硬件兼容性

可以查看 [Ubuntu 认证硬件列表](https://ubuntu.com/certified)，但未列出的电脑也不代表一定无法使用。

安装前建议先进入“试用 Ubuntu”模式，检查：

- Wi-Fi 和有线网络。
- 声音、麦克风和摄像头。
- 触控板、键盘快捷键和蓝牙。
- 屏幕亮度、分辨率和外接显示器。
- NVIDIA、AMD 或 Intel 显卡。

## 三、下载 Ubuntu 镜像

### 1. 选择 LTS 版本

打开 [Ubuntu Desktop 官方下载页面](https://ubuntu.com/download/desktop)，下载当前受支持的 LTS 版本。

LTS 版本支持周期长、资料多，更适合日常工作和初次安装。下载文件名类似：

```text
ubuntu-24.04.x-desktop-amd64.iso
```

`amd64` 同时适用于常见的 Intel 和 AMD 64 位处理器，不代表只能用于 AMD CPU。

### 2. 可选：校验 ISO

校验可以发现下载损坏或文件被替换的问题。Ubuntu 官方发布目录会提供 `SHA256SUMS`。

在 Windows PowerShell 中计算 ISO 的 SHA-256：

```powershell
Get-FileHash .\ubuntu-24.04.x-desktop-amd64.iso -Algorithm SHA256
```

将输出值与 Ubuntu 官方发布目录中的对应值逐字符比较。若不一致，应删除 ISO 并重新下载。

## 四、制作 Ubuntu 启动 U 盘

### Windows：使用 Rufus

Ubuntu 官方安装教程推荐 Windows 用户使用 Rufus。

#### 1. 下载 Rufus

访问 [Rufus 官方网站](https://rufus.ie/)，下载当前稳定版本。

#### 2. 设置写盘参数

插入 U 盘并打开 Rufus，然后设置：

| 选项 | 建议值 |
| --- | --- |
| 设备 | 目标 U 盘 |
| 引导类型选择 | 下载的 Ubuntu ISO |
| 分区类型 | GPT |
| 目标系统类型 | UEFI（非 CSM） |
| 文件系统 | 保持 Rufus 推荐值 |

现代 Windows 11 电脑通常使用 GPT + UEFI。只有确认旧电脑使用 Legacy BIOS 时才考虑 MBR。

#### 3. 开始写入

1. 再次核对 U 盘容量和名称。
2. 点击“开始”。
3. 如果询问写入模式，优先使用 Rufus 推荐的 ISO 镜像模式。
4. 确认清空 U 盘。
5. 等待状态显示“准备就绪”。

### Ubuntu：使用“磁盘”工具

1. 打开“磁盘”应用。
2. 在左侧选择目标 U 盘。
3. 点击菜单按钮并选择“恢复磁盘映像”。
4. 选择下载的 Ubuntu ISO。
5. 确认设备后开始写入。
6. 完成后安全弹出 U 盘。

### macOS：使用 balenaEtcher

从 [balenaEtcher 官方网站](https://etcher.balena.io/) 下载工具：

1. 选择 Ubuntu ISO。
2. 选择目标 U 盘。
3. 点击 Flash。
4. 等待写入和验证完成。

## 五、从 U 盘启动

1. 将启动 U 盘插入目标电脑。
2. 重启电脑。
3. 出现厂商 Logo 时连续按启动菜单键。
4. 选择带 `UEFI` 标识的 U 盘。

常见启动菜单键包括 F12、F11、F9、Esc 或 F8，具体应查看电脑或主板说明书。

如果进入 Ubuntu 启动菜单，选择：

```text
Try or Install Ubuntu
```

## 六、先试用再安装

进入图形界面后，可以选择“试用 Ubuntu”而不修改硬盘。

建议先完成以下检查：

1. 连接 Wi-Fi。
2. 播放音频。
3. 测试触控板和键盘。
4. 打开“设置 → 显示器”检查分辨率。
5. 检查是否能够识别内部硬盘。

确认基本硬件正常后，双击桌面的“安装 Ubuntu”。

## 七、安装器基础设置

依次完成：

1. 选择语言。
2. 选择键盘布局。
3. 连接网络。
4. 选择交互式安装。
5. 选择默认安装或扩展安装。

在“优化计算机”或类似页面，通常建议启用：

- 安装第三方显卡和 Wi-Fi 驱动。
- 下载并安装额外媒体格式支持。
- 安装过程中下载更新。

需要全程离线安装时，可以稍后通过系统更新补充这些内容。

## 八、磁盘分区与安装方式

### 方案 A：擦除磁盘并安装 Ubuntu

适用于 Ubuntu 独占目标磁盘，且磁盘上的数据全部可以删除。

1. 选择“擦除磁盘并安装 Ubuntu”。
2. 多硬盘电脑需要选择正确的目标磁盘。
3. 根据容量和型号再次核对。
4. 查看安装器给出的分区变更摘要。
5. 确认无误后开始安装。

安装器会自动创建 EFI 系统分区、Linux 文件系统和必要的引导结构。

#### 是否启用加密

需要保护笔记本数据时，可以在高级选项中选择 LVM 和加密。Ubuntu 官方将其作为推荐的加密方式之一。

启用后必须妥善保管磁盘解锁密码。密码丢失通常意味着数据无法恢复。

### 方案 B：与 Windows 共存

适用于保留 Windows 并安装双系统。

#### 1. 在 Windows 中释放空间

安装前在 Windows 中操作更容易控制：

1. 右键开始菜单，打开“磁盘管理”。
2. 右键空间充足的 Windows 分区。
3. 选择“压缩卷”。
4. 输入计划给 Ubuntu 的容量。
5. 保持压缩出的空间为“未分配”，不要在 Windows 中格式化。

建议至少预留 50 GB；用于开发、容器或大型软件时建议 100 GB 以上。

#### 2. 在 Ubuntu 安装器中选择共存

如果安装器识别到 Windows，会显示“与 Windows Boot Manager 共存”一类选项：

1. 选择目标磁盘。
2. 调整 Ubuntu 使用的空间。
3. 检查变更摘要。
4. 确认安装。

安装完成后，GRUB 启动菜单通常会允许选择 Ubuntu 或 Windows。

::: warning
共存选项没有出现时，不要直接选择“擦除磁盘”。先检查 BitLocker、快速启动、磁盘未分配空间以及 UEFI 启动模式。
:::

### 方案 C：手动分区

手动分区适合熟悉 UEFI、挂载点和 Linux 文件系统的用户。

#### 推荐的基础结构

| 分区 | 建议大小 | 文件系统 | 挂载点 | 是否格式化 |
| --- | ---: | --- | --- | --- |
| EFI 系统分区 | 512 MB 左右 | FAT32 | `/boot/efi` | 新磁盘需要；双系统复用时不要格式化 |
| 根分区 | 50 GB 以上 | ext4 | `/` | 是 |
| Home 分区 | 剩余空间 | ext4 | `/home` | 新建时是；重装保留时否 |
| Swap | 可选 | swap | 无 | 视需求 |

Ubuntu 也可以使用交换文件，因此普通桌面安装通常不必单独创建 Swap 分区。

#### 单系统手动分区示例

以一块空的 512 GB SSD 为例：

1. 创建 GPT 分区表。
2. 创建约 512 MB FAT32 分区，标记为 EFI System Partition。
3. 创建 80 至 120 GB ext4 分区，挂载到 `/`。
4. 将剩余空间创建为 ext4，挂载到 `/home`。
5. 确认引导加载器安装到目标磁盘。

#### 重装 Ubuntu 并保留 `/home`

只有之前单独划分了 `/home` 时才适用：

1. 将原根分区设置为 ext4、挂载点 `/`，并勾选格式化。
2. 将原 Home 分区设置为 ext4、挂载点 `/home`。
3. **不要格式化 Home 分区**。
4. 复用原 EFI 分区并挂载到 `/boot/efi`，不要格式化。
5. 使用与原系统一致的用户名，可以减少权限和目录混乱。

即使单独保留 `/home`，安装前仍然必须备份。

::: danger
双系统中现有 EFI 分区通常同时存放 Windows 和 Ubuntu 的引导文件。格式化它可能导致两个系统都无法启动。
:::

## 九、创建账户并开始安装

填写：

- 时区。
- 姓名。
- 计算机名称。
- 用户名。
- 登录密码。

检查安装摘要，重点确认：

- 目标磁盘正确。
- 将被格式化的分区正确。
- 双系统场景下 Windows 分区没有被删除。
- EFI 分区处理方式正确。

确认后开始安装。安装过程中不要拔出 U 盘或切断电源。

## 十、完成安装

安装完成后：

1. 点击“立即重启”。
2. 按提示拔出 U 盘。
3. 按 Enter 继续启动。
4. 如果出现 GRUB 菜单，选择 Ubuntu。

若拔出 U 盘后提示没有可启动设备，应进入 BIOS/UEFI，确认内部硬盘或 `ubuntu` 启动项位于启动顺序中。

## 十一、安装后的必要操作

### 1. 更新系统

打开终端执行：

```bash
sudo apt update
sudo apt full-upgrade
```

完成后重启：

```bash
sudo reboot
```

### 2. 检查附加驱动

打开“软件和更新 → 附加驱动”，查看是否有推荐的 NVIDIA、Wi-Fi 或其他专有驱动。

选择推荐版本并应用更改，然后重启。

### 3. 检查磁盘与分区

```bash
lsblk -f
df -h
```

确认 `/`、`/home` 和 EFI 分区挂载符合预期。

### 4. 检查双系统启动

重启并分别进入 Ubuntu 与 Windows。确认 Windows 数据分区可用后，再考虑重新启用 BitLocker。

## 常见问题

### 安装器看不到内部硬盘

部分电脑启用了 Intel RST、VMD 或 RAID 模式。应优先查阅电脑厂商和 Ubuntu 文档。直接切换到 AHCI 可能导致现有 Windows 无法启动，不应在没有准备恢复方案时修改。

### 黑屏或无法进入图形界面

可以在启动菜单中尝试“安全图形”模式。安装后再通过“附加驱动”安装合适的显卡驱动。

### 安装后直接进入 Windows

进入 BIOS/UEFI，将 `ubuntu` 启动项移动到 Windows Boot Manager 之前。也可以使用一次性启动菜单选择 `ubuntu`。

### Windows 时间与 Ubuntu 相差数小时

Windows 和 Linux 对硬件时钟的默认处理方式不同。建议查阅当前系统版本的时间同步方案后统一设置，不要反复手动改时间。

### 想恢复为只有 Windows

先备份 Ubuntu 数据，再使用 Windows 的磁盘管理删除 Linux 分区并扩展 Windows 分区。删除 EFI 中的 Ubuntu 引导项需要额外操作，执行前应准备 Windows 安装 U 盘。

## 参考资料

- [下载 Ubuntu Desktop](https://ubuntu.com/download/desktop)
- [Ubuntu Desktop 官方安装教程](https://documentation.ubuntu.com/desktop/en/24.04/tutorial/install-ubuntu-desktop/)
- [Ubuntu 高级磁盘设置](https://documentation.ubuntu.com/desktop/en/24.04/reference/advanced-disk-setup-features/)
- [校验 Ubuntu 下载文件](https://ubuntu.com/tutorials/how-to-verify-ubuntu)
- [Rufus 官方网站](https://rufus.ie/)
