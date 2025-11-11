---
icon: pen-to-square
date: 2025-06-17
order: 2
category:
  - 前端
tag:
  - ES6
---

# ESM规范

## 一、ESM 的基本概念

ESM（ECMAScript Module）是 ECMAScript 2015（ES6）引入的官方模块化规范，旨在解决 JavaScript 长期缺乏标准化模块化方案的问题。它通过import和export关键字实现模块的导入与导出，具有静态化结构、浏览器与 Node.js 统一支持、按需加载等特性，是现代前端开发的核心基础之一。

### 特性

- 模块引用为只读视图，无法直接修改值，但引用的值可以通过其他方法修改（如使用导出对象的方法）
- 静态模块结构：模块依赖关系在编译时确定，便于工具进行Tree Shaking（移除未使用代码），例如 Webpack 可通过此特性优化打包体积。
- 单例模块：每个模块在应用中仅加载一次，多次导入指向同一实例，适合管理全局状态

## 二、核心语法与用法

### 1. 模块导出（Export）

#### 1.1 命名导出（Named Export）

可在模块中导出多个命名成员，导入时需使用对应名称：

```javascript
// math.js
export function add(a, b) { return a + b; }
export const PI = 3.14;
export class Calculator { /* ... */ }
```

#### 1.2 默认导出（Default Export）

每个模块只能有一个默认导出，导入时可自定义名称：

```javascript
// person.js
export default function createPerson(name, age) {
  return { name, age };
}
```

#### 1.3 导出重命名与合并

```javascript
// 重命名导出
export { add as sum } from './math.js';
export { default as Person } from './person.js';

// 合并导出
export * from './utils.js';
```

### 2. 模块导入（Import）

#### 2.1 导入命名成员

可重名，同时导入多个

```javascript
import { add as sum, PI } from './math.js';
console.log(add(2, 3)); // 5
```

#### 2.2 导入默认导出

```javascript
import createPerson from './person.js'; // 无需花括号 但变量名要相同
const person = createPerson('Alice', 25);
```

#### 2.3 导入所有成员（命名空间）

将模块所有导出成员作为对象属性导入

```javascript
import * as math from './math.js';
math.add(1, 2); // 3
```

#### 2.4 混合导入默认导出与命名导出

```javascript
// module.js
export default function greet() { /* ... */ }
export const VERSION = '1.0.0';

// 导入
import greet, { VERSION } from './module.js';
```

### 3. 动态导入（Dynamic Import）

#### 3.1 基础语法

用于按需加载模块，返回 Promise 对象, 支持await语法`(ES8)`：
> await 语法：用于暂停异步函数（async函数）的执行，直到 Promise 被解决（resolved 或 rejected），并返回 Promise 的结果

```javascript
// 路由懒加载场景
button.addEventListener('click', async () => {
  const module = await import('./dashboard.js');
  module.renderDashboard();
});
```

#### 3.2 错误处理

```javascript
import('./heavy-module.js')
  .then(module => module.init())
  .catch(error => console.error('Failed to load module:', error));
```

#### 3.3 应用场景

路由软加载（如 React Suspense）:

```javascript
const HomePage = React.lazy(() => import('./pages/HomePage'));
```

条件加载:

```javascript
if (featureEnabled) {
  import('./feature.js').then(/* ... */);
}
```

## 三、ESM的应用

### 浏览器中

在`<script>`标签中添加`type="module"`属性

```html
<script type="module">
  import { greet } from './utils.js';
  greet('World');

  // 可直接加载URL模块
  import { data } from 'https://api.example.com/data.js';
</script>
```

### Node.js中

需使用`.mjs`后缀，或在`package.json`中设置`"type": "module"`：

```json
{
  "type": "module",
  "main": "app.js"
}
```

不支持裸模块名（如`import 'lodash'`）,需通过`package.json`配置：

```json
{
  "type": "module",
  "imports": {
    "lodash": "./node_modules/lodash-es/lodash.js"
  }
}
```

## 四、ESM与CJS对比

### 语法对比

| 功能 | ESM（ECMAScript Modules）     | CJS（CommonJS）                    |
| -- | --------------------------- | -------------------------------- |
| 导出 | `export` / `export default` | `module.exports` / `exports.xxx` |
| 导入 | `import ... from '...'`     | `require('...')`                 |

ESM 示例：

```js
// math.mjs
export function add(a, b) {
  return a + b;
}

// main.mjs
import { add } from './math.mjs';
console.log(add(1, 2));
```

CJS 示例：

```js
// math.js
exports.add = function(a, b) {
  return a + b;
}

// main.js
const math = require('./math.js');
console.log(math.add(1, 2));
```

### 加载机制对比

| 特性           | ESM             | CJS         |
| ------------ | --------------- | ----------- |
| 加载方式         | 静态加载（编译时确定依赖）   | 动态加载（运行时加载） |
| 执行顺序         | 顶层提前加载          | 按需执行        |
| 支持异步         | ✅ 支持 `import()` | ❌ 不支持       |
| Tree Shaking | ✅ 支持            | ❌ 不支持       |
