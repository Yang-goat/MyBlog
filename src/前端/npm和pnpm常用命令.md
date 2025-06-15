---
icon: pen-to-square
date: 2025-06-15
order: 2
category:
  - 前端
tag:
  - npm
  - pnpm
---


# npm 和 pnpm 常用命令开发文档
## 一、概述
npm（Node Package Manager）和 pnpm（Performant npm）是 Node.js 生态系统中用于管理项目依赖、运行脚本的工具。本文档详细列出两者在不同开发场景下的常用命令，帮助开发者快速上手和切换使用。

## 二、项目初始化
| 操作 | npm 命令 | pnpm 命令 | 说明 |
| ---- | ---- | ---- | ---- |
| 交互式初始化项目 | `npm init` | `pnpm init` | 生成 package.json 文件，配置项目元数据 |
| 快速初始化项目 | `npm init -y` | `pnpm init -y` | 使用默认配置，跳过交互步骤 |

## 三、依赖管理
### 3.1 安装依赖
| 操作 | npm 命令 | pnpm 命令 | 说明 |
| ---- | ---- | ---- | ---- |
| 安装所有依赖 | `npm install` 或 `npm i` | `pnpm install` 或 `pnpm i` | 安装 package.json 中定义的所有依赖 |
| 安装生产依赖 | `npm install <包名>` | `pnpm add <包名>` | 安装包并添加到 dependencies |
| 安装开发依赖 | `npm install -D <包名>` | `pnpm add -D <包名>` | 安装包并添加到 devDependencies |
| 安装指定版本 | `npm install <包名>@<版本号>` | `pnpm add <包名>@<版本号>` | 安装指定版本的包 |
| 全局安装 | `npm install -g <包名>` | `pnpm add -g <包名>` | 全局安装包，可在任意项目中使用 |

### 3.2 卸载依赖
| 操作 | npm 命令 | pnpm 命令 | 说明 |
| ---- | ---- | ---- | ---- |
| 卸载指定包 | `npm uninstall <包名>` | `pnpm remove <包名>` 或 `pnpm rm <包名>` | 从项目中移除指定包 |
| 卸载全局包 | `npm uninstall -g <包名>` | `pnpm remove -g <包名>` | 从全局环境中移除指定包 |

### 3.3 更新依赖
| 操作 | npm 命令 | pnpm 命令 | 说明 |
| ---- | ---- | ---- | ---- |
| 更新所有依赖 | `npm update` | `pnpm update` 或 `pnpm up` | 更新所有依赖到最新兼容版本 |
| 更新指定包 | `npm update <包名>` | `pnpm update <包名>` 或 `pnpm up <包名>` | 更新指定包到最新兼容版本 |
| 查看可更新的依赖 | `npm outdated` | `pnpm outdated` | 列出所有可更新的依赖 |

## 四、脚本执行
| 操作 | npm 命令 | pnpm 命令 | 说明 |
| ---- | ---- | ---- | ---- |
| 运行自定义脚本 | `npm run <脚本名>` | `pnpm run <脚本名>` 或 `pnpm <脚本名>` | 执行 package.json 中 scripts 定义的脚本 |
| 运行测试脚本 | `npm test` | `pnpm test` | 运行测试脚本，通常对应 `test` 脚本 |
| 运行启动脚本 | `npm start` | `pnpm start` | 启动项目，通常对应 `start` 脚本 |

## 五、依赖查看与清理
| 操作 | npm 命令 | pnpm 命令 | 说明 |
| ---- | ---- | ---- | ---- |
| 查看依赖树 | `npm list` 或 `npm ls` | `pnpm list` 或 `pnpm ls` | 查看项目依赖结构 |
| 查看包详情 | `npm info <包名>` | `pnpm info <包名>` | 查看指定包的详细信息 |
| 清理缓存 | `npm cache clean --force` | `pnpm store prune` | 清理缓存，释放磁盘空间 |
| 查看全局存储路径 | - | `pnpm store path` | 查看 pnpm 全局存储路径 |

## 六、版本控制
| 操作 | npm 命令 | pnpm 命令 | 说明 |
| ---- | ---- | ---- | ---- |
| 更新包版本 | `npm version patch/minor/major` | `pnpm version patch/minor/major` | 按规则更新包版本号 |
| 查看包版本信息 | `npm view <包名> versions` | `pnpm view <包名> versions` | 查看包的所有可用版本 |

## 七、工作空间管理（多包项目）
| 操作 | npm 命令 | pnpm 命令 | 说明 |
| ---- | ---- | ---- | ---- |
| 初始化工作空间 | 在 package.json 配置`workspaces`字段后执行`npm install` | 在 pnpm-workspace.yaml 配置后执行`pnpm install` | 初始化多包项目工作空间 |
| 对所有包执行命令 | `npm run <脚本名> -w` | `pnpm recursive <脚本名>` | 对工作空间内所有包执行脚本 |

## 八、其他命令
| 操作 | npm 命令 | pnpm 命令 | 说明 |
| ---- | ---- | ---- | ---- |
| 登录 npm 账户 | `npm login` | `pnpm login` | 登录 npm 账户，用于发布包 |
| 发布包到 npm 仓库 | `npm publish` | `pnpm publish` | 将包发布到 npm 仓库 |
| 检查依赖安全漏洞 | `npm audit` | `pnpm audit` | 扫描项目依赖的安全漏洞 |

## 九、注意事项
1. **配置文件差异**：npm 生成`package-lock.json`，pnpm 生成`pnpm-lock.yaml`，两者格式不同但均用于锁定依赖版本。
2. **性能差异**：pnpm 采用内容可寻址存储，安装速度更快，磁盘占用更低；npm 依赖结构可能存在幽灵依赖问题。
3. **命令兼容性**：大部分 npm 命令在 pnpm 中可直接使用，但部分参数和行为可能存在细微差异，如 pnpm 的`pnpm store`系列命令为特有功能。 