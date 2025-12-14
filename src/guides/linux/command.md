---
icon: book
date: 2025-11-11
order: 2
category:
  - Linux
  - Ubuntu
tag:
  - 命令行
  - Shell
---

# Ubuntu 常用指令

整理常见、实用的 Ubuntu 命令，按场景分类速查。

清空控制台

```bash
clear
```
或直接按快捷键：`Ctrl + L`

---

## 📁 文件与目录操作

| 功能 | 命令示例 | 说明 |
|------|-----------|------|
| 查看当前路径 | `pwd` | 打印当前工作目录 |
| 列出文件 | `ls -l` / `ls -al` | 显示详细列表 / 包含隐藏文件 |
| 进入目录 | `cd /path/to/dir` | 切换工作目录 |
| 返回上级目录 | `cd ..` | 返回上一级目录 |
| 创建目录 | `mkdir "mydir"` | 新建目录 |
| 创建多级目录 | `mkdir -p "a/b/c"` | 一次创建多层 |
| 删除文件 | `rm "file.txt"` | 删除单个文件 |
| 删除目录 | `rm -rf "dirname"` | 强制删除目录及内容 |
| 复制文件 | `cp file1 file2` | 复制文件 |
| 复制目录 | `cp -r dir1 dir2` | 递归复制目录 |
| 移动或重命名 | `mv old new` | 移动或重命名文件或目录 |
| 查看文件内容 | `cat file` / `less file` / `head -n 10 file` | 快速查看文件内容 |
| 搜索文件 | `find / -name "*.conf"` | 查找配置文件 |
| 查找文本 | `grep "pattern" filename` | 按内容搜索文件 |
| 压缩文件 | `tar -czvf archive.tar.gz folder` | 创建压缩包 |
| 解压文件 | `tar -xzvf archive.tar.gz` | 解压压缩包 |

---

## ⚙️ 系统管理与信息查看

| 功能 | 命令示例 | 说明 |
|------|-----------|------|
| 查看系统信息 | `uname -a` | 显示内核信息 |
| 查看发行版版本 | `lsb_release -a` / `cat /etc/os-release` | Ubuntu 版本信息 |
| 查看 CPU / 内存 | `lscpu` / `free -h` | 硬件与内存使用 |
| 磁盘使用情况 | `df -h` | 查看挂载磁盘空间 |
| 当前目录空间占用 | `du -sh .` | 查看目录大小 |
| 查看设备挂载 | `lsblk` / `mount` | 磁盘分区情况 |
| 查看时间与时区 | `date` / `timedatectl` | 当前系统时间 |
| 更新系统时间 | `sudo timedatectl set-timezone Asia/Shanghai` | 设置时区 |
| 关机 / 重启 | `sudo shutdown -h now` / `sudo reboot` | 系统关机或重启 |

---

## 👤 用户与权限管理

| 功能 | 命令示例 | 说明 |
|------|-----------|------|
| 当前用户 | `whoami` | 查看当前用户名 |
| 切换用户 | `su username` | 切换到其他用户 |
| 以 root 执行命令 | `sudo command` | 提升权限执行 |
| 添加用户 | `sudo adduser newuser` | 创建新用户 |
| 删除用户 | `sudo deluser username` | 删除用户 |
| 修改密码 | `passwd username` | 修改用户密码 |
| 修改文件权限 | `chmod 755 file` | 设置执行权限 |
| 修改所有者 | `chown user:group file` | 更改文件归属 |
| 查看用户组 | `groups username` | 查看所属组 |

---

## 🧩 软件包管理（APT）

| 功能 | 命令示例 | 说明 |
|------|-----------|------|
| 更新软件源 | `sudo apt update` | 更新可用软件列表 |
| 升级系统 | `sudo apt upgrade` | 升级已安装软件 |
| 安装软件 | `sudo apt install vim` | 安装指定软件 |
| 删除软件 | `sudo apt remove vim` | 卸载但保留配置 |
| 完全删除 | `sudo apt purge vim` | 连同配置删除 |
| 清理缓存 | `sudo apt autoremove` / `sudo apt clean` | 清理无用包 |
| 搜索软件 | `apt search nginx` | 查找软件包 |

---

## 🌐 网络命令

| 功能 | 命令示例 | 说明 |
|------|-----------|------|
| 查看 IP | `ip a` / `hostname -I` | 显示网络地址 |
| 测试连通性 | `ping 8.8.8.8` | 测试网络连接 |
| 查看端口占用 | `sudo netstat -tulnp` / `ss -tuln` | 查看服务端口 |
| 查看路由表 | `ip route` | 显示路由信息 |
| 下载文件 | `wget URL` / `curl -O URL` | 下载远程资源 |
| 查看 DNS 解析 | `nslookup example.com` / `dig example.com` | 域名解析信息 |
| 本机开放端口 | `sudo ufw allow 8080` / `sudo ufw status` | 防火墙管理 |

---

## 🧠 进程与服务管理

| 功能 | 命令示例 | 说明 |
|------|-----------|------|
| 查看进程 | `ps aux` / `top` / `htop` | 监控进程状态 |
| 查找进程 | `ps aux \| grep nginx` | 按名称查找 |
| 结束进程 | `kill PID` / `kill -9 PID` | 强制终止 |
| 查看后台任务 | `jobs` / `bg` / `fg` | 管理后台任务 |
| 查看系统服务 | `systemctl list-units --type=service` | 查看服务状态 |
| 启动服务 | `sudo systemctl start nginx` | 启动服务 |
| 停止服务 | `sudo systemctl stop nginx` | 停止服务 |
| 开机自启 | `sudo systemctl enable nginx` | 设置开机启动 |

---

## 🔒 SSH 与远程管理

| 功能 | 命令示例 | 说明 |
|------|-----------|------|
| 连接远程服务器 | `ssh user@host` | 登录远程主机 |
| 指定端口 | `ssh -p 2222 user@host` | 自定义 SSH 端口 |
| 上传文件 | `scp file user@host:/path/` | 本地 → 远程 |
| 下载文件 | `scp user@host:/path/file .` | 远程 → 本地 |
| 使用密钥连接 | `ssh -i ~/.ssh/id_rsa user@host` | 免密登录 |
| SSH 隧道转发 | `ssh -L 8080:localhost:80 user@host` | 本地端口转发 |

---

## 🧾 日志与调试

| 功能 | 命令示例 | 说明 |
|------|-----------|------|
| 查看系统日志 | `sudo journalctl -xe` | 系统事件日志 |
| 查看服务日志 | `sudo journalctl -u nginx` | 查看特定服务日志 |
| 实时查看日志 | `tail -f /var/log/syslog` | 动态日志输出 |
| 查看最近启动记录 | `last` | 登录历史 |
| 查看登录失败 | `sudo cat /var/log/auth.log` | 登录安全日志 |

---

## 🧰 实用工具命令

| 功能 | 命令示例 | 说明 |
|------|-----------|------|
| 查看命令路径 | `which python3` | 程序所在路径 |
| 查看命令说明 | `man ls` / `ls --help` | 帮助文档 |
| 清屏 | `clear` / `Ctrl + L` | 清空终端 |
| 历史命令 | `history` | 查看历史记录 |
| 重复上条命令 | `!!` | 执行上一条 |
| 比较文件 | `diff file1 file2` | 查看文件差异 |
| 生成哈希 | `md5sum file` / `sha256sum file` | 校验文件完整性 |

---

## 🎮 NVIDIA GPU 信息与性能监控

本节针对安装了 **NVIDIA 显卡** 的 Ubuntu 系统，涵盖查看信息、驱动管理、CUDA 环境检测与性能监控等常用命令。

---

### 🧩 基础信息查看

| 功能 | 命令示例 | 说明 |
|------|-----------|------|
| 查看显卡列表 | `lspci \| grep -E "VGA\|3D"` | 查看系统检测到的显卡型号 |
| 查看详细硬件信息 | `sudo lshw -C display` | 显卡硬件与驱动信息 |
| 查看当前渲染器 | `glxinfo \| grep "OpenGL renderer"` | 查看当前使用的 GPU 渲染设备（需安装 mesa-utils） |
| 检查驱动推荐版本 | `sudo ubuntu-drivers devices` | 自动检测并推荐合适的 NVIDIA 驱动 |
| 查看已安装驱动 | `nvidia-smi --query-gpu=driver_version --format=csv` | 输出当前驱动版本号 |

---

### ⚙️ 驱动与 CUDA 工具链

| 功能 | 命令示例 | 说明 |
|------|-----------|------|
| 查看驱动版本 | `cat /proc/driver/nvidia/version` | 查看内核驱动版本 |
| 查看 CUDA 版本 | `nvcc -V` | 显示 CUDA 编译器版本（需安装 CUDA） |
| 查看 cuDNN 版本 | `cat /usr/include/cudnn_version.h \| grep CUDNN_MAJOR -A 2` | 查看 cuDNN 头文件版本 |
| 查看 GPU 名称 | `nvidia-smi --query-gpu=name --format=csv` | 输出 GPU 型号名称 |
| 查看 GPU 数量 | `nvidia-smi -L` | 列出所有 GPU |
| 查看驱动模块状态 | `lsmod \| grep nvidia` | 检查驱动是否加载成功 |

---

### 📊 GPU 状态与性能监控

| 功能 | 命令示例 | 说明 |
|------|-----------|------|
| 查看总体状态 | `nvidia-smi` | 查看 GPU 温度、显存、进程、驱动版本等 |
| 实时刷新监控 | `watch -n 1 nvidia-smi` | 每秒刷新一次 GPU 状态 |
| 查看显存占用 | `nvidia-smi --query-gpu=memory.total,memory.used,memory.free --format=csv` | 显示显存使用情况 |
| 查看 GPU 利用率 | `nvidia-smi --query-gpu=utilization.gpu,utilization.memory --format=csv` | 输出 GPU 与显存使用率 |
| 查看显卡温度 | `nvidia-smi --query-gpu=temperature.gpu --format=csv` | 输出显卡温度 |
| 查看功耗情况 | `nvidia-smi --query-gpu=power.draw --format=csv` | 实时功率消耗（W） |
| 查看 GPU 时钟频率 | `nvidia-smi --query-gpu=clocks.gr,clocks.mem --format=csv` | 查看核心与显存时钟频率 |

---

### 🔍 进程与任务分析

| 功能 | 命令示例 | 说明 |
|------|-----------|------|
| 查看使用 GPU 的进程 | `nvidia-smi pmon -c 1` | 查看当前 GPU 进程活动 |
| 查看所有 GPU 进程 | `nvidia-smi --query-compute-apps=pid,process_name,used_memory --format=csv` | 输出使用 GPU 的程序 |
| 强制结束某进程 | `sudo kill -9 <PID>` | 终止占用显卡的进程 |
| 查看显卡占用统计 | `nvidia-smi dmon` | 实时动态监控 GPU 负载（性能模式） |

---

## ✅ 小贴士

- 使用 `Tab` 键可自动补全命令或文件名  
- 使用 `Ctrl + C` 可中断当前命令  
- 使用 `Ctrl + D` 可退出终端  
- 使用 `Ctrl + R` 搜索命令历史  

---