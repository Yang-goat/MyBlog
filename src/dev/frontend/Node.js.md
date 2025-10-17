---
icon: pen-to-square
date: 2025-06-17
order: 1
category:
  - 前端
tag:
  - Node.js
---

# Node.js

## 一、什么是Node.js

### 定义

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境，允许开发者使用 JavaScript 进行服务器端编程

本质：并非传统意义上的框架或库，而是一个让 JavaScript 运行在服务端的平台
特点：异步非阻塞 I/O、单线程事件循环、轻量高效

### 核心优势

1. 前后端语言统一：前端开发者可直接使用 JavaScript 开发服务端
2. 异步非阻塞：适合处理高并发、I/O 密集型任务（如文件读写、网络请求）
3. 轻量级：内存占用低，适合构建微服务和实时应用
4. 生态丰富：npm 仓库拥有数百万开源包，开发效率高

### 应用场景

- 实时应用：聊天应用、直播平台（WebSocket 支持）
- 数据流式处理：文件上传、日志处理
- 微服务架构：轻量级服务拆分
- API 接口层：作为中间层对接前端与数据库

## 二、环境安装与配置

### 1. 安装Node.js

- 官方下载：从 [Node.js 官网](https://nodejs.org/zh-cn) 下载对应系统的安装包（推荐 LTS 长期支持版本）
- 版本检查：安装后在终端输入

```bash
node -v  # 查看 Node 版本
npm -v   # 查看 npm 包管理器版本
```

### 2. 包管理器

见 [包管理器](./包管理器/包管理器.md#二、npm-node-package-manager) 文章。

### 3. 搭建第一个 Node 服务

创建 app.js 文件：

```javascript
// 引入 http 核心模块
const http = require('http');

// 创建服务器
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, Node.js!\n');
});

// 监听端口
const port = 3000;
server.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
```

启动服务：

```bash
node app.js
```

访问 `http://localhost:3000` 查看效果

## 三、核心模块与概念

### 1. 模块系统

见 [模块化](./模块化/概述.md) 笔记。

### 2. 异步编程模型

方法一：回调函数

```javascript
fs.readFile('data.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

方法二：`Promise`：ES6 引入的异步处理方案，解决回调地狱

```javascript
fs.promises.readFile('data.txt', 'utf8')
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

方法三：`async/await`：ES7 语法糖，让异步代码更像同步

```javascript
async function readData() {
  try {
    const data = await fs.promises.readFile('data.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
readData();
```

### 3. fs（文件系统模块）

### 4. http（HTTP模块）

### 5. path（路径模块）

### 6. events（事件模块）

### 7. util（工具模块）
