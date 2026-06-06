---
title: 如何解决 Codex 每次对话前的 5 次重连
icon: rotate
date: 2026-06-06
category:
  - AI 应用实践
tag:
  - Codex
  - WebSocket
  - 代理
---

# 如何解决 Codex 每次对话前的 5 次重连

## 问题现象

在部分网络或代理环境中，Codex 每次开始对话前都会连续显示类似以下内容：

```text
Reconnecting... 1/5
Reconnecting... 2/5
Reconnecting... 3/5
Reconnecting... 4/5
Reconnecting... 5/5
```

等待一段时间后，Codex 又能恢复正常并开始回答。这个现象通常不表示模型不可用、账号异常或 Codex 已崩溃，而是说明实时连接在建立或保持过程中出现了问题。

Codex 支持通过 Responses API 的 WebSocket 传输响应。当前实现默认最多重连 5 次，WebSocket 单次连接的默认超时时间为 15 秒。如果代理没有正确转发 WebSocket Secure（WSS）流量，Codex 会反复尝试重连，随后才可能回退到普通 HTTPS 请求，因此产生明显的启动等待。

::: tip 判断依据
如果 HTTPS 请求能够正常访问 OpenAI 服务，但每次对话前固定出现多次 `Reconnecting`，应优先检查 WebSocket 与代理配置，而不是直接归因于模型速度或账号状态。
:::

## 方法一：为 Codex 配置代理环境变量（推荐）

推荐优先保留 Codex 的默认传输能力，并让 HTTPS 与 WebSocket 流量都通过正确的代理地址。

### 1. 确认代理端口

打开代理软件的设置页面，确认本机 HTTP 代理监听地址和端口。常见地址为 `127.0.0.1`，端口必须以代理软件实际显示的值为准。

常见示例：

- Clash 系列软件经常使用 `7890`
- v2rayN 经常使用 `10808`

这些只是常见默认值，不能替代实际配置。

### 2. 创建 `.env` 文件

Codex 会从其用户配置目录读取 `.env` 文件。

不同系统的默认路径如下：

```text
macOS / Linux：~/.codex/.env
Windows：C:\Users\你的用户名\.codex\.env
```

Windows 用户应确认文件名确实为 `.env`，而不是被隐藏扩展名后的 `.env.txt`。

### 3. 写入代理配置

将以下内容写入 `.env`，并把端口替换为代理软件实际使用的 HTTP 代理端口：

```dotenv
HTTP_PROXY="http://127.0.0.1:7890"
HTTPS_PROXY="http://127.0.0.1:7890"
NO_PROXY="localhost,127.0.0.1,::1"
```

其中：

- `HTTP_PROXY`：指定普通 HTTP 请求使用的代理。
- `HTTPS_PROXY`：指定 HTTPS 请求以及相关连接使用的代理。
- `NO_PROXY`：让本机地址绕过代理，避免影响本地开发服务。

如果使用 v2rayN，且其 HTTP 代理端口为 `10808`，可以改为：

```dotenv
HTTP_PROXY="http://127.0.0.1:10808"
HTTPS_PROXY="http://127.0.0.1:10808"
NO_PROXY="localhost,127.0.0.1,::1"
```

::: warning
应填写 HTTP 代理端口，而不是未经确认直接填写 SOCKS 端口。不同代理软件的“混合端口”“HTTP 端口”和“SOCKS 端口”可能不同。
:::

### 4. 完整重启 Codex

关闭当前 Codex 会话或 Codex App，然后重新启动。已有进程通常不会自动重新读取 `.env`。

重新发起一次对话，观察是否仍然出现连续 5 次重连。如果问题消失，说明原来的 WebSocket 流量大概率没有正确经过代理。

### 5. 仍然重连时的检查项

依次检查以下内容：

1. 代理软件是否正在运行。
2. `.env` 是否位于正确的 Codex 配置目录。
3. Windows 文件名是否实际为 `.env.txt`。
4. 代理地址和端口是否与软件设置一致。
5. 当前代理节点是否允许 WebSocket 连接。
6. 公司网络、防火墙或安全软件是否阻止 WSS 握手。

::: info 兼容性说明
Codex 当前开源实现会读取 `~/.codex/.env`，但官方环境变量文档主要将环境变量描述为进程级配置。升级 Codex 后如果该方法失效，应以最新官方文档和当前版本行为为准，也可以把相同变量配置为系统或启动进程的环境变量。
:::

## 方法二：禁用 WebSocket，强制使用 HTTPS

如果代理环境无法稳定支持 WebSocket，或者只希望尽快消除重连等待，可以为 Codex 增加一个仅使用 HTTPS 的模型提供方。

### 1. 打开配置文件

默认路径如下：

```text
macOS / Linux：~/.codex/config.toml
Windows：C:\Users\你的用户名\.codex\config.toml
```

### 2. 配置 HTTP-only provider

在配置文件的顶层设置：

```toml
model_provider = "openai_http"
```

然后添加：

```toml
[model_providers.openai_http]
name = "OpenAI"
wire_api = "responses"
requires_openai_auth = true
supports_websockets = false
```

`supports_websockets = false` 会禁止该 provider 使用 Responses API 的 WebSocket 传输，从而直接使用 HTTPS。

保存文件后完整重启 Codex。

### 注意事项

- 该方法会放弃 WebSocket 传输，适合作为网络兼容方案。
- 自定义 provider 的标识为 `openai_http`，部分客户端版本可能按 provider 对历史会话进行分组。
- 如果切换后暂时看不到原有会话，不代表会话数据已被删除。恢复原来的 `model_provider` 配置后通常可以重新查看。
- 修改前建议备份 `config.toml`，避免覆盖已有的模型、权限或 MCP 配置。

## 方法三：在代理软件中开启 TUN 模式

如果前两种方法仍不能解决问题，可以考虑启用代理软件的 TUN 模式。

TUN 模式通过虚拟网卡接管更大范围的系统流量，不依赖单个应用是否正确读取代理环境变量，因此通常更容易覆盖 Codex 的 HTTPS 和 WebSocket 连接。

但是，TUN 模式的影响范围也更大，可能改变以下功能的网络行为：

- 其他桌面软件
- 局域网和公司内网访问
- 本地开发服务
- 虚拟机、容器或移动设备调试
- 依赖特定路由或 DNS 的应用

因此，不建议把 TUN 作为首选方案。启用后应检查内网、本地服务和其他常用软件是否仍能正常访问，并根据代理软件文档配置绕过规则。

## 推荐处理顺序

建议按照以下顺序排查：

1. **配置 `.env` 代理变量**：保留 WebSocket 能力，适合作为长期方案。
2. **配置 HTTP-only provider**：快速绕过 WebSocket 问题，改动范围较小。
3. **启用 TUN 模式**：作为前两种方法无效时的系统级兜底方案。

如果只是偶发重连，也应先确认 OpenAI 服务状态和本地网络稳定性。只有在问题稳定复现，并且 HTTPS 正常、WebSocket 异常时，上述代理配置才具有明确针对性。

## 参考资料

- [Codex Configuration Reference](https://developers.openai.com/codex/config-reference)
- [Codex Environment Variables](https://developers.openai.com/codex/environment-variables)
- [Codex 模型提供方实现](https://github.com/openai/codex/blob/main/codex-rs/model-provider-info/src/lib.rs)
- [Codex `.env` 加载实现](https://github.com/openai/codex/blob/main/codex-rs/arg0/src/lib.rs)
