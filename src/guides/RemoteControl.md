---
title: 免费低延迟、只拼网速的远控方案：Tailscale + Windows 远程桌面
icon: computer
date: 2026-07-05
category:
  - 软件工具
tag:
  - Tailscale
  - 远程桌面
  - RDP
  - 科研工具
isOriginal: true
---

# 免费低延迟、只拼网速的远控方案：Tailscale + Windows 远程桌面

很多远程控制软件都能临时救急，但免费版体验经常会受线路、画质、帧率、时长或功能策略影响。`Tailscale + Windows 远程桌面` 的思路不一样：Tailscale 只负责把自己的设备安全组到同一个私有网络里，桌面显示和键鼠操作交给 Windows 自带的 RDP。

对个人长期使用来说，这套方案的核心优势很明确：

- **免费门槛低**：Tailscale Personal 计划可以免费使用，Windows 远程桌面是系统自带能力；
- **体验主要拼网速**：连接质量主要取决于两端网络、家里宽带上传、是否能直连，以及 RDP 的显示设置；
- **效果更适合干活**：写代码、读论文、看文档、远程跑实验时，RDP 的文字清晰度和输入延迟通常比常见免费远控软件更舒服。

简单说，就是使用 **Tailscale** 建立个人虚拟局域网，再通过 **Windows 远程桌面（Remote Desktop Protocol，RDP）** 连接家里的 Windows 电脑。它不像向日葵、ToDesk 那样把远控体验交给第三方远控平台的免费线路和功能策略，更像是在自己的私有网络里远程登录一台 Windows 工作站。

> 本文验证时间为 **2026-07-06**。Tailscale 免费计划、Windows 设置入口和软件界面可能会更新，实际以官方文档为准。

## 适合什么场景

这个方案适合：

- 有一台长期作为主力工作站的 Windows 电脑；
- 想用笔记本、平板或其他设备远程访问这台电脑；
- 希望远控方案尽量免费，不想为画质、线路或时长额外付费；
- 更重视文字清晰、输入延迟和长期稳定性，而不是一键安装后立刻用；
- 需要远程操作 MATLAB、Python、VS Code、Zotero、Obsidian、PDF 阅读器等工具；
- 不想把 Windows RDP 的 `3389` 端口直接暴露到公网；
- 希望远控效果主要取决于自己的网络质量，而不是第三方远控软件的免费版限制。

不太适合：

- 需要远程高帧率游戏；
- 需要多人同时观看同一个物理屏幕；
- 台式机经常关机、睡眠，且无法远程唤醒；
- 学校或图书馆网络极不稳定，导致任何远控工具都会卡顿。

::: important 核心思路
Tailscale 负责解决“外部设备如何安全访问家里电脑”的网络问题；Windows RDP 负责解决“如何显示和操控 Windows 桌面”的远程桌面问题。只要两端网络质量足够好，这套方案就能获得很接近本地操作的远程体验。
:::

## 方案组成

最终链路可以理解为：

```text
图书馆笔记本
  ↓
Tailscale 虚拟局域网
  ↓
家里 Windows 台式机
  ↓
Windows RDP 远程桌面会话
```

更准确地说，Tailscale 并不是传统意义上的远控软件。它更像是一个自动配置的个人虚拟专用网络（Virtual Private Network，VPN），可以让你的多台设备像处在同一个私有局域网中一样互相访问。

Windows RDP 则是微软提供的远程桌面协议，负责传输键盘、鼠标、画面、剪贴板等远程桌面数据。

```mermaid
flowchart LR
  A["图书馆笔记本"] --> B["Tailscale 加密虚拟网络"]
  B --> C{"连接方式"}
  C -->|Direct| D["家里台式机"]
  C -->|DERP Relay| E["Tailscale DERP 中继"]
  E --> D
  D --> F["Windows RDP 桌面会话"]
```

图中需要关注两点：

1. 如果两端网络可以直连，Tailscale 会尽量建立直接连接，延迟通常更低。
2. 如果直连失败，Tailscale 会使用 DERP 中继转发加密流量，连接成功率更高，但延迟可能增加。

## 和向日葵、ToDesk、校园 VPN 的区别

| 方案 | 本质 | 适合场景 | 优点 | 局限 |
|---|---|---|---|---|
| Tailscale + RDP | 私有组网 + Windows 远程桌面 | 长期访问自己的主力电脑 | 免费门槛低、文字清晰、延迟低、体验主要看网络质量 | 初次配置比一键远控麻烦 |
| 向日葵 / ToDesk | 一体化远控软件 | 临时远控、远程维护、无人值守 | 上手简单，文件传输和远控功能完整 | 免费版可能受画质、帧率、线路或功能策略影响 |
| Parsec / Moonlight | 低延迟串流 | 高帧率桌面、图形界面、游戏串流 | 鼠标跟手和画面流畅度可能更好 | 配置和稳定性取决于网络与设备 |
| 校园 VPN | 访问学校内网资源 | 访问图书馆数据库、校园系统 | 适合进入学校内网 | 不是用来访问你家里台式机的 |

简单理解：

- **校园 VPN**：让你从外面访问学校资源；
- **向日葵 / ToDesk**：直接提供远控桌面功能；
- **Tailscale**：把你的设备安全地组到一个私有网络里；
- **RDP**：在这个私有网络里远程打开 Windows 桌面。

如果只是偶尔帮别人处理电脑问题，向日葵和 ToDesk 仍然很方便。但如果目标是长期远程使用自己的主力 Windows 电脑，尤其是写代码、读文献、开 IDE 和跑实验，`Tailscale + RDP` 的免费体验通常更值得优先尝试。

## 环境和前提

本文使用的环境是：

| 设备 | 环境 |
|---|---|
| 家里台式机 | Windows 11 Pro for Workstations |
| 外出笔记本 | Windows 11 |
| 组网工具 | Tailscale |
| 远程桌面 | Windows 自带远程桌面连接 |
| 备用远控 | 向日葵免费版或 ToDesk 免费版 |

::: warning 不要直接暴露 RDP 端口
已经使用 Tailscale 后，不建议再在路由器上做 `3389` 端口转发。也就是说，不要把公网 IP 的 `3389` 端口直接映射到家里台式机。这样做会显著增加被扫描和爆破的风险。
:::

还需要确认几件事：

- 台式机系统版本支持作为 RDP 主机；
- 台式机需要有 Windows 登录密码；
- 台式机接通电源后不要自动睡眠；
- 台式机和笔记本都能登录同一个 Tailscale 账号；
- 初次配置前最好保留一个向日葵或 ToDesk 备用入口。

## 第一步：先准备备用远控

正式配置前，建议先保留一个备用远控工具，例如向日葵免费版或 ToDesk 免费版。

原因是：如果后续 RDP 凭据、系统设置或 Tailscale 状态出问题，人在图书馆时还能通过备用远控进入台式机修复。

建议确认：

- 备用远控已经能连接台式机；
- 备用远控开启了无人值守；
- 台式机重启后备用远控仍能自动上线。

## 第二步：设置台式机不自动睡眠

在家里台式机上进入：

```text
设置 → 系统 → 电源 → 屏幕和睡眠
```

建议设置为：

```text
接通电源后关闭屏幕：按需设置
接通电源后使设备进入睡眠状态：从不
```

屏幕可以关闭，但主机不要睡眠。否则台式机睡眠后，Tailscale 和 RDP 都无法正常连接。

## 第三步：开启 Windows 远程桌面

在台式机上进入：

```text
设置 → 系统 → 远程桌面
```

打开：

```text
远程桌面：开
```

如果系统提示确认，选择确认。

建议同时确认：

```text
需要设备使用网络级别身份验证进行连接：开启
```

网络级别身份验证（Network Level Authentication，NLA）可以让用户在远程会话建立前先完成身份验证，一般建议保持开启。

## 第四步：安装并登录 Tailscale

在台式机和笔记本上都安装 Tailscale：

1. 打开 Tailscale 官方下载页面；
2. 下载 Windows 安装程序；
3. 安装完成后，在系统托盘找到 Tailscale 图标；
4. 登录同一个 Tailscale 账号。

登录完成后，两台设备会加入同一个 Tailnet，也就是你的个人 Tailscale 网络。

在台式机上打开 PowerShell，可以查看它的 Tailscale IP：

```powershell
tailscale ip -4
```

输出类似：

```text
100.80.12.34
```

这个 `100.x.x.x` 地址就是台式机在 Tailscale 网络里的私有地址。后面笔记本远程连接时，要填这个地址。

## 第五步：在笔记本上测试 Tailscale 连接

在笔记本上打开 PowerShell，先查看 Tailnet 中的设备：

```powershell
tailscale status
```

如果能看到家里台式机的设备名和 `100.x.x.x` 地址，说明两台设备已经加入同一个 Tailscale 网络。

继续测试连接状态：

```powershell
tailscale ping <台式机设备名>
```

把 `<台式机设备名>` 换成 `tailscale status` 里显示的设备名。

如果不确定设备名，也可以直接测试台式机的 Tailscale IP：

```powershell
ping <台式机Tailscale-IP>
```

例如：

```powershell
ping 100.80.12.34
```

重点看两件事：

| 结果 | 含义 |
|---|---|
| 显示 direct 或 via 某个地址 | 大概率是直连，延迟通常更低 |
| 显示 DERP | 通过 Tailscale 中继转发，可能比直连慢 |
| ping 不通 | 先检查两端 Tailscale 是否在线、是否登录同一账号 |

::: note 延迟由什么决定
Tailscale 本身不是网络加速器。实际延迟主要取决于家里宽带上传、图书馆网络质量、两端 NAT 环境，以及最终是直连还是走 DERP 中继。
:::

## 第六步：使用 Windows RDP 连接台式机

在笔记本上按 `Win + R`，输入：

```text
mstsc
```

打开远程桌面连接。

在“计算机”中填写台式机的 Tailscale IP：

```text
100.80.12.34
```

也可以直接通过命令启动：

```powershell
mstsc /v:<台式机Tailscale-IP>
```

例如：

```powershell
mstsc /v:100.80.12.34
```

然后输入台式机的 Windows 用户名和密码。

## 第七步：处理 Windows 账户凭据问题

RDP 登录时最常见的问题是：

```text
你的凭据不工作
```

这通常不是 Tailscale 的问题，而是 RDP 对 Windows 账户凭据格式比较敏感。

可以依次尝试以下格式。

### 方式一：使用 whoami 查看本机用户名

这是最常用、也最不容易填错的方式。先在台式机上打开 PowerShell：

```powershell
whoami
```

输出可能类似：

```text
DESKTOP-ABC123\yang
```

那么 RDP 登录时，用户名直接填写：

```text
DESKTOP-ABC123\yang
```

密码填写对应 Windows 账户密码。如果这个账户绑定的是微软账号，密码通常是微软账号密码；如果是本地账户，就填写本地账户密码。不要填写 Windows Hello PIN。

### 方式二：微软账号格式

```text
MicrosoftAccount\<你的微软邮箱>
```

例如：

```text
MicrosoftAccount\example@outlook.com
```

密码填写微软账号密码，不是 PIN。

### 方式三：直接填写邮箱

```text
example@outlook.com
```

密码仍然填写微软账号密码。

::: warning PIN 不是 RDP 密码
Windows Hello PIN、指纹、人脸识别通常不能直接作为 RDP 密码。RDP 登录需要使用 Windows 账户密码。
:::

如果仍然失败，可以在台式机上先用“密码”而不是 PIN 本地登录一次：

```text
Win + L → 登录选项 → 选择密码 → 输入微软账号密码
```

之后再从笔记本尝试 RDP。

## 第八步：推荐建立一个专用本地账户

如果微软账号凭据一直不稳定，建议单独创建一个本地账户专门用于 RDP。

在台式机上进入：

```text
设置 → 账户 → 其他用户 → 添加账户
```

选择：

```text
我没有此人的登录信息 → 添加没有 Microsoft 账户的用户
```

例如创建：

```text
用户名：rdpuser
密码：设置一个强密码
```

然后进入：

```text
设置 → 系统 → 远程桌面 → 远程桌面用户
```

把 `rdpuser` 添加进去。

之后在笔记本 RDP 登录时填写：

```text
<台式机名称>\rdpuser
```

例如：

```text
DESKTOP-ABC123\rdpuser
```

这种方式比微软账号更稳定，也便于后续单独管理远程登录权限。

## 第九步：连接成功后的体验设置

第一次连接成功后，不建议直接开很高分辨率和多屏。可以先用较保守设置测试稳定性。

在远程桌面连接中点击：

```text
显示选项 → 显示
```

建议先设置为：

```text
1920 × 1080
```

在：

```text
显示选项 → 体验
```

如果网络一般，可以关闭一些视觉效果，例如：

```text
桌面背景
菜单和窗口动画
拖动时显示窗口内容
```

读论文、写代码时，文字清晰和输入延迟比动画效果更重要。

在：

```text
显示选项 → 本地资源
```

建议开启：

```text
剪贴板
```

这样可以在笔记本和台式机之间复制文字。磁盘映射可以按需开启，不建议一开始就打开全部本地磁盘。

## 常见问题

### Tailscale 里看不到台式机

优先检查：

- 台式机是否开机；
- 台式机是否睡眠；
- 台式机 Tailscale 是否登录；
- 台式机网络是否正常；
- 两台设备是否使用同一个 Tailscale 账号。

可以在台式机或笔记本上执行：

```powershell
tailscale status
```

### Tailscale 能 ping 通，但 RDP 连不上

优先检查台式机：

```text
设置 → 系统 → 远程桌面
```

确认远程桌面已开启。

然后检查 Windows 防火墙是否允许远程桌面：

```text
控制面板 → 系统和安全 → Windows Defender 防火墙 → 允许应用通过防火墙
```

找到远程桌面相关项，并确认允许。

### RDP 提示凭据不工作

优先检查：

- 用户名是否优先尝试过 `whoami` 输出的 `<电脑名>\<用户名>`；
- 密码是否是 Windows 账户密码，而不是 PIN；
- 如果使用微软账号，是否尝试过 `MicrosoftAccount\<邮箱>`；
- 是否已经清除笔记本保存的错误 RDP 凭据；
- 是否需要改用专用本地账户。

在笔记本上可以查看已保存凭据：

```powershell
cmdkey /list
```

如果看到类似：

```text
TERMSRV/100.80.12.34
```

可以删除旧凭据：

```powershell
cmdkey /delete:TERMSRV/<台式机Tailscale-IP>
```

例如：

```powershell
cmdkey /delete:TERMSRV/100.80.12.34
```

### 连接后感觉卡顿

按优先级处理：

1. 台式机尽量接网线；
2. 降低 RDP 分辨率；
3. 关闭远程桌面动画效果；
4. 用 `tailscale ping <台式机设备名>` 查看是否走 DERP；
5. 换一个图书馆网络更稳定的位置；
6. 必要时使用 ToDesk、向日葵或 Parsec 作为备用方案。

### 远程后家里屏幕锁住了

这是 RDP 的正常特性。RDP 更像是建立一个远程 Windows 会话，不完全等同于把物理显示器画面实时镜像过来。

如果你需要远程看到家里物理屏幕上的实际画面，可以考虑继续保留向日葵、ToDesk、Parsec 这类传统远控或串流工具作为备用。

## 安全建议

Tailscale + RDP 的安全性比较适合个人远程工作站，但前提是不要随意扩大访问面。

建议：

- 不要把 `3389` 端口映射到公网；
- Tailscale 账号开启二次验证；
- 微软账号开启二次验证；
- RDP 账户使用强密码；
- 不用的设备及时从 Tailscale 管理后台移除；
- 图书馆离开座位时，笔记本及时 `Win + L` 锁屏；
- 向日葵、ToDesk 等备用远控也要设置强密码和设备验证。

Tailscale 的流量基于 WireGuard 加密。即使连接走 DERP 中继，DERP 服务器也只是转发已经加密的数据，不能解密你的远程桌面内容。

::: important 推荐使用方式
长期远程使用自己的 Windows 电脑时，优先使用 `Tailscale + RDP`。如果 RDP 凭据、系统设置或网络状态临时出问题，再用向日葵或 ToDesk 作为救急入口。
:::

## 配置检查清单

```text
台式机：
[ ] 接通电源后不自动睡眠
[ ] Windows 账户有密码
[ ] 已开启远程桌面
[ ] 已安装并登录 Tailscale
[ ] 已记下 100.x.x.x 地址
[ ] 已保留备用远控工具

笔记本：
[ ] 已安装并登录同一 Tailscale 账号
[ ] tailscale status 能看到台式机
[ ] tailscale ping 台式机成功
[ ] mstsc 能连接台式机 Tailscale IP
[ ] RDP 用户名和密码验证成功
[ ] 剪贴板、分辨率和体验选项已调整
```

## 参考资料

- [Tailscale：Install Tailscale on Windows](https://tailscale.com/docs/install/windows)
- [Tailscale：Access remote desktops using Windows RDP](https://tailscale.com/docs/solutions/access-remote-desktops-using-windows-rdp)
- [Tailscale：Connection types](https://tailscale.com/docs/reference/connection-types)
- [Tailscale：DERP servers](https://tailscale.com/docs/reference/derp-servers)
- [Tailscale：Tailscale encryption](https://tailscale.com/docs/concepts/tailscale-encryption)
- [Tailscale：Pricing](https://tailscale.com/pricing)
- [Microsoft：Enable Remote Desktop on your PC](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/remotepc/remote-desktop-allow-access)
