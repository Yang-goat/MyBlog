---
redirectFrom:
  - "/ai-practice/agents/chatgpt-codex/codex-reconnecting.html"
title: Codex 反复 Reconnecting 的排查：代理、WebSocket 与 HTTPS/SSE
icon: rotate
date: 2026-06-06
category:
  - AI 应用实践
tag:
  - Codex
  - WebSocket
  - 代理
---

# Codex 反复 Reconnecting 的排查：代理、WebSocket 与 HTTPS/SSE

本文首次发布于 2026-06-06，最近核对于 **2026-09-18**。适用于本机运行的 Codex CLI、IDE 插件或桌面客户端遇到模型请求重连的情况；不同客户端内置的 Codex 版本可能不同，需结合实际版本和日志判断。

::: important 先看错误，再选方案
`Reconnecting... 5/5` 只是重试现象，不足以确定故障发生在 WebSocket、代理、认证还是服务端。本文的代理配置和 HTTPS/SSE 方案用于有针对性的排查，不保证解决所有重连问题。
:::

## 问题现象

在部分网络或代理环境中，Codex 每次开始对话前都会连续显示类似以下内容：

```text
Reconnecting... 1/5
Reconnecting... 2/5
Reconnecting... 3/5
Reconnecting... 4/5
Reconnecting... 5/5
```

重连可能发生在开始回答之前，也可能发生在回答中途。有时等待后能够恢复，有时会以错误结束；应记录首次错误和最终结果，不能仅凭重试次数排除认证、服务端或网络问题。

Codex 支持 Responses API 的 WebSocket 传输，也支持通过 HTTPS 接收服务器发送事件（Server-Sent Events，SSE）。WSS 本身同样使用 TLS 加密；下文“切换到 HTTPS/SSE”指改变响应传输方式。

本次核对的开源提交 `7498521d` 中，流式响应重试上限的默认值为 5，WebSocket 连接超时的默认值为 15 秒。这些是可配置的实现默认值，不代表所有版本都会固定重试 5 次，也不能据此推算固定等待时间。官方配置文档同样将 SSE 流中断的默认重试次数列为 5。[配置参考](https://learn.chatgpt.com/docs/config-file/config-reference)

如果 WSS 连接失败，客户端可能重试或回退到 HTTPS/SSE；是否发生回退、回退后能否成功，应以日志为准。

## 修改配置前，先收集这些信息

1. **客户端与版本**：记录桌面版、IDE 插件或 CLI 及其版本。CLI 可执行 `codex --version`；系统 CLI 的版本不能替代桌面版或插件内置版本。
2. **发生阶段**：每次新对话开始前重连，还是回答中途断开？到 `5/5` 后能否恢复？
3. **首次错误**：保留首次重连前后的错误、状态码和时间。连接超时、证书错误、认证失败和服务端错误需要分别处理。
4. **代理实际状态**：确认代理进程、HTTP／混合端口和节点；结合代理连接记录判断请求是否经过预期代理。

偶发问题可先检查 OpenAI 服务状态，并对比故障发生时段。浏览器能打开网页，只能说明该浏览器的请求可用，不能证明 Codex 的模型请求或 WebSocket 连接正常。

::: info 日志能证明什么
进程中存在 `HTTP_PROXY` 等变量，不等于请求一定经过该代理。`transport="responses_websocket"` 或 `model_client.stream_responses_websocket` 表明进入了相关请求路径，单独出现这些标签不能证明握手成功。需要结合后续请求结果、回退记录及代理连接记录判断。
:::

## 方法一：检查并配置代理环境变量

当日志或代理记录指向连接没有经过预期代理时，可先检查这一方案，保留客户端的默认传输能力。已经配置过 `.env` 的用户，应先核对当前端口与实际路由，不必反复添加相同配置。

### 1. 确认代理端口

打开代理软件的设置页面，确认本机 HTTP 代理监听地址和端口。常见地址为 `127.0.0.1`，端口必须以代理软件实际显示的值为准。

下文使用 `7890` 作为示例。如果你的软件显示 `7897` 或其他端口，请填写实际值，不能根据软件名称推断端口。

### 2. 创建 `.env` 文件

本次核对的 Codex 开源实现仍会从其用户配置目录读取 `.env` 文件；这项机制并未因再次出现重连提示而被证明失效。

不同系统的默认路径如下：

```text
macOS / Linux：~/.codex/.env
Windows：C:\Users\你的用户名\.codex\.env
```

如果启动 Codex 时设置了 `CODEX_HOME`，应检查该目录中的 `.env`，而不是只看默认路径。Windows 用户还应确认文件名确实为 `.env`，而不是被隐藏扩展名后的 `.env.txt`。

已有 `.env` 时先备份，只调整本次需要的代理变量，保留其他设置。

### 3. 写入代理配置

将以下内容写入 `.env`，并把端口替换为代理软件实际使用的 HTTP 代理端口：

```dotenv
HTTP_PROXY="http://127.0.0.1:7890"
HTTPS_PROXY="http://127.0.0.1:7890"
NO_PROXY="localhost,127.0.0.1,::1"
```

其中：

- `HTTP_PROXY`：指定普通 HTTP 请求使用的代理。
- `HTTPS_PROXY`：为 HTTPS 与受支持的 WSS 连接提供代理设置。
- `NO_PROXY`：让本机地址绕过代理，避免影响本地开发服务。

::: warning 核对端口类型
应填写 HTTP 代理端口，而不是未经确认直接填写 SOCKS 端口。不同代理软件的“混合端口”“HTTP 端口”和“SOCKS 端口”可能不同。
:::

### 4. 完整重启 Codex

结束正在运行的任务，完整退出并重启对应客户端；使用 IDE 插件时也需重启承载插件的 IDE。已有进程通常不会自动重新读取 `.env`。

重新发起一次简短对话，记录是否重连、能否完成及代理连接情况。问题消失说明代理配置可能与故障有关；具体根因仍需结合日志确认。

### 5. 仍然重连时的检查项

依次检查以下内容：

1. 代理软件是否正在运行。
2. `.env` 是否位于正确的 Codex 配置目录。
3. Windows 文件名是否实际为 `.env.txt`。
4. 代理地址和端口是否与软件设置一致。
5. 当前代理节点是否允许 WebSocket 连接。
6. 公司网络、防火墙或安全软件是否阻止 WSS 握手。
7. 是否存在旧的代理变量、过宽的 `NO_PROXY`，或与预期不一致的系统代理／PAC 设置。实际采用的路由需按当前版本核对。

::: info 兼容性说明
开源主分支、已发布 CLI、IDE 插件和桌面客户端不一定使用相同版本。本文对 `.env` 的说明依据文末固定提交中的实现，不代表已在所有客户端实测。若怀疑加载异常，应先核对版本、实际配置目录和启动方式；也可在启动进程中显式设置变量做对照，避免同时修改多处配置。
:::

## 方法二：临时切换到 HTTPS/SSE 做对照

如果日志指向 WebSocket 连接失败，可以临时切换响应传输做对照。这是诊断和网络兼容方案，不能修复所有网络、认证或服务端错误。

以下配置面向使用 OpenAI 官方服务与认证的场景；第三方模型提供方应保留自己的地址和认证配置，不能直接套用。

### 1. 打开配置文件

默认路径如下：

```text
macOS / Linux：~/.codex/config.toml
Windows：C:\Users\你的用户名\.codex\config.toml
```

### 2. 配置 HTTP-only provider

修改前先备份实际使用的 `config.toml`，并记下原来的 `model_provider`。设置了 `CODEX_HOME` 时，配置文件也应在该目录中查找。

将 `model_provider` 放在文件顶层、任何 `[表名]` 之前；已有同名顶层键时修改原值，不要重复添加。再添加对应 provider 表。下面是需要合并的配置片段，不要用它覆盖整个文件：

```toml
model_provider = "openai_http"

[model_providers.openai_http]
name = "OpenAI"
wire_api = "responses"
requires_openai_auth = true
supports_websockets = false
```

当前官方配置参考仍列出 `supports_websockets`。在本次核对的客户端实现中，将其设为 `false` 会禁止该 provider 使用 Responses API 的 WebSocket 传输，转而使用 HTTPS/SSE。它只控制对应模型提供方的响应传输。

保存后完整重启客户端，用新建的简短对话做对照，并检查实际使用的 provider 和传输方式。若配置没有生效，应先核对当前客户端版本与配置来源。

- **切换后恢复**：支持继续调查 WebSocket 路径，但还不能确定是哪一段网络或客户端实现导致失败。
- **仍然重连**：不要继续仅围绕 WebSocket 排查，应根据首次错误检查代理、认证、服务状态等因素。
- **恢复原配置**：将顶层 `model_provider` 恢复为原值；如果原先没有该键，删除本次新增的顶层键，再完整重启客户端。

### 注意事项

- 该方法会放弃 WebSocket 传输，适合作为网络兼容方案。
- 自定义 provider 的标识为 `openai_http`，部分客户端版本可能按 provider 对历史会话进行分组。
- 如果切换后暂时看不到原有会话，不代表会话数据已被删除。恢复原来的 `model_provider` 配置后通常可以重新查看。

## 方法三：在代理软件中开启 TUN 模式

如果证据仍指向应用代理路由不一致，可以考虑启用代理软件的 TUN 模式做对照。认证失败或服务端故障不应通过反复切换 TUN 排查。

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

1. **记录客户端版本与首次错误**，区分启动前重连、回答中断和最终失败。
2. **核对代理端口、配置目录和实际连接记录**，有针对性地调整 `.env`。
3. **日志指向 WebSocket 时，临时切换 HTTPS/SSE 对照**，一次只改变一项条件。
4. **仍怀疑路由问题时，再考虑 TUN 对照**，并检查其他软件与内网访问。

## 仍有问题时，如何提供有效反馈

提供客户端类型与版本、故障时间、是否刚升级或更换节点、发生阶段，以及首次重连前后的少量日志。说明哪些配置改动做过对照、结果如何，避免只提供“5/5”截图。

CLI 的日志行为也存在版本差异。当前官方文档说明，明文 `codex-tui.log` 需要显式设置 `log_dir`；不要假定所有版本都会自动生成同一路径的日志。桌面客户端和 IDE 插件应按各自版本获取诊断信息。[官方日志说明](https://learn.chatgpt.com/docs/config-file/environment-variables)

分享日志前，隐藏 Token、认证头、账号信息及不希望公开的对话内容。无需公开整个 `.env`、`auth.json` 或完整会话文件。

## 参考资料

- [Codex Configuration Reference](https://learn.chatgpt.com/docs/config-file/config-reference)
- [Codex Environment Variables](https://learn.chatgpt.com/docs/config-file/environment-variables)
- [客户端版本差异与故障反馈](https://learn.chatgpt.com/docs/reference/troubleshooting)
- [Codex 模型提供方与默认超时实现（7498521d）](https://github.com/openai/codex/blob/7498521d288b9b3b96ffba4eedf089d8d6e06a84/codex-rs/model-provider-info/src/lib.rs)
- [Codex `.env` 加载实现（7498521d）](https://github.com/openai/codex/blob/7498521d288b9b3b96ffba4eedf089d8d6e06a84/codex-rs/arg0/src/lib.rs)
- [WebSocket 代理连接实现（7498521d）](https://github.com/openai/codex/blob/7498521d288b9b3b96ffba4eedf089d8d6e06a84/codex-rs/websocket-client/src/dialer.rs)
- [模型响应传输与回退实现（7498521d）](https://github.com/openai/codex/blob/7498521d288b9b3b96ffba4eedf089d8d6e06a84/codex-rs/core/src/client.rs)
