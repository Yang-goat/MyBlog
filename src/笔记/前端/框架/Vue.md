---
icon: pen-to-square
date: 2025-09-11
order: 1
category:
  - 前端
tag:
  - Vue
---

# Vue入门必备知识

## 1. 基础概念

- **Vue.js**：渐进式前端框架，专注视图层（可逐步引入到项目中）。
- **核心思想**：
  - 数据驱动视图（声明式渲染）
  - 组件化开发（复用、可维护）
- **优点**：学习曲线平缓、生态完善、性能优良（尤其是 Vue 3）。
- **使用 ES 模块构建**

---

## 2. 单文件组件结构（SFC）

Vue 推荐使用 **单文件组件（Single File Component, `.vue` 文件）**，把模板、逻辑、样式写在一个文件里，方便管理。文件通常分为三块：

1. `<template>`：写页面结构（HTML + Vue 指令），只能有一个根元素。

2. `<script setup>`：写逻辑（数据、方法、生命周期），组合式 API 推荐使用 script setup。

3. `<style>`：写样式，scoped 表示样式只作用于当前组件

示例：

```vue
<template>
  <div class="hello">
    <h1>{{ message }}</h1>
    <button @click="addCount">点击 {{ count }}</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('Hello Vue!')
const count = ref(0)

function addCount() {
  count.value++
}
</script>

<style scoped>
.hello {
  color: blue;
}
</style>
```

## 3. 创建一个vue应用

### 应用实例

每个 Vue 应用都是通过 `createApp` 函数创建一个新的应用实例:

```js
import { createApp } from 'vue'

const app = createApp({
  /* 根组件选项 */
})
```

### 根组件
我们传入 `createApp` 的对象实际上是一个组件，每个应用都需要一个“根组件”，其他组件将作为其子组件。

如果你使用的是单文件组件，我们可以直接从另一个文件中导入根组件。

```js
import { createApp } from 'vue'
// 从一个单文件组件中导入根组件
import App from './App.vue'

const app = createApp(App)
```

### 挂载应用

指将 Vue 实例（或 Vue 3 中的 createApp 创建的应用实例）与页面中的 DOM 元素进行关联，让 Vue 能够管理该 DOM 及其子元素的渲染、响应式更新等操作。简单来说，就是让 Vue “接管” 页面上的一块区域。

应用实例必须在调用了 `.mount()` 方法后才会渲染出来。该方法接收一个“容器”参数，可以是一个实际的 DOM 元素或是一个 CSS 选择器字符串：

```html
<div id="app"></div>
```

```js
app.mount('#app')
```

## 4. 模板语法

### 文本插值

`{{ 变量 }}` 可以直接在模板中显示数据（纯文本）。

```vue
<template>
  <p>{{ username }}</p>
</template>

<script setup>
import { ref } from 'vue'
const username = ref('Tom')
</script>
```

### 原始HTML

双大括号会将数据解释为纯文本，而不是 HTML。若想插入 HTML，你需要使用 `v-html` 指令:

::: vue-demo 文本插值与 v-html 指令对比

```vue
<template>
  <div class="demo-container">
    <p>Using text interpolation: {{ rawHtml }}</p>
    <p>Using v-html directive: <span v-html="rawHtml"></span></p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rawHtml: '<span style="color: red">This should be red</span>'
    }
  }
}
</script>

<style scoped>
.demo-container {
  padding: 1rem;
  border: 1px solid #eaecef;
  border-radius: 4px;
}
</style>
```
:::

```vue
<p>Using text interpolation: {{ rawHtml }}</p>
<p>Using v-html directive: <span v-html="rawHtml"> </span></p>
```

### Attribute 绑定​

双大括号不能在 HTML attributes 中使用。想要响应式地绑定一个 attribute，应该使用 `v-bind` 指令

```vue
<div v-bind:id="dynamicId"></div>
```

`v-bind` 指令指示 Vue 将元素的 `id` attribute 与组件的 `dynamicId` 属性保持一致。如果绑定的值是 `null` 或者 `undefined`，那么该 attribute 将会从渲染的元素上移除。

#### 简写`:`

因为 `v-bind` 非常常用，我们将其简写为 `:`：

```vue
<div :id="dynamicId"></div>
```

#### 同名简写

如果 attribute 的名称与绑定的 JavaScript 变量的名称相同，那么可以进一步简化语法，省略 attribute 值：

```vue
<!-- 与 :id="id" 相同 -->
<div :id></div>

<!-- 这也同样有效 -->
<div v-bind:id></div>
```

### 指令 Directives

- `v-bind` 简写 :，用于绑定属性
- `v-model` 双向绑定
- `v-if` / `v-else` / `v-show` 条件渲染
- `v-for` 列表渲染，必须加 :key
- `v-on` 简写 `@`，绑定事件

示例：

```vue
<template>
  <div>
    <img :src="imgUrl" />
    <input v-model="username" />
    <p v-if="username">你好，{{ username }}</p>
    <ul>
      <li v-for="(item, index) in list" :key="index">
        {{ item }}
      </li>
    </ul>
    <button @click="sayHello">打招呼</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const imgUrl = ref('https://vuejs.org/logo.png')
const username = ref('')
const list = ref(['Vue', 'React', 'Angular'])

function sayHello() {
  alert('你好 ' + username.value)
}
</script>
```

## 5、响应式

> 本节使用 组合式 API

### 声明响应式状态

#### `ref()`

ref() 接收参数，并将其包裹在一个带有 .value 属性的 ref 对象中返回:

```js
import { ref } from 'vue'

const count = ref(0)
console.log(count) // { value: 0 }
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

要在组件模板中访问 ref，请从组件的 setup() 函数中声明并返回它们：

```js
import { ref } from 'vue'

export default {
  // `setup` 是一个特殊的钩子，专门用于组合式 API。
  setup() {
    const count = ref(0)

    // 将 ref 暴露给模板
    return {
      count
    }
  }
}
```

对于更复杂的逻辑，示例如下：

```js
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    function increment() {
      // 在 JavaScript 中需要 .value
      count.value++
    }

    // 不要忘记同时暴露 increment 函数
    return {
      count,
      increment
    }
  }
}
```

```vue
<button @click="increment">
  {{ count }}
</button>
```

#### `<script setup>`

在 setup() 函数中手动暴露大量的状态和方法非常繁琐。幸运的是，我们可以通过使用**单文件组件 (SFC)** 来避免这种情况。我们可以使用 `<script setup>` 来大幅度地简化代码：

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">
    {{ count }}
  </button>
</template>
```

#### 深层响应性​

Ref 可以持有任何类型的值，包括深层嵌套的对象、数组或者 JavaScript 内置的数据结构，比如 `Map`。

Ref 会使它的值具有深层响应性。这意味着即使改变嵌套对象或数组时，变化也会被检测到：

```js
import { ref } from 'vue'

const obj = ref({
  nested: { count: 0 },
  arr: ['foo', 'bar']
})

function mutateDeeply() {
  // 以下都会按照期望工作
  obj.value.nested.count++
  obj.value.arr.push('baz')
}
```

### reactive()

## 6、计算属性

`computer()`

## 7、组件化开发

组件定义

```vue
<template>
  <div>Hello {{ name }}</div>
</template>

<script>
export default {
  props: ['name']
}
</script>
```

父子通信

父传子 → props

子传父 → $emit

跨层通信 → provide / inject

插槽（Slot）

默认插槽 → `<slot></slot>`

具名插槽 → `<slot name="footer"></slot>`

作用域插槽 → `<slot :data="someData"></slot>`


## 8、Vue Router（路由）

### 安装 & 配置

```js
import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: () => import('./pages/About.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
```

### 使用

```vue
<router-link to="/about">关于</router-link>

<router-view></router-view>
```

编程式导航：`router.push('/about')`

## 9、状态管理（Pinia）

### Pinia 基本用法

```js title="stores/user.js"
import { defineStore } from 'pinia'
export const useUserStore = defineStore('user', {
  state: () => ({ name: 'Tom' }),
  actions: {
    setName(newName) { this.name = newName }
  }
})
```

### 使用：

```js
const userStore = useUserStore()
console.log(userStore.name)
userStore.setName('Jerry')
```

## 10、常用工具

### 生命周期（Vue 3）

- onMounted → 组件挂载后
- onUnmounted → 销毁时
- onUpdated → 更新时

### 组合式 API

```js
import { ref, onMounted } from 'vue'
export default {
  setup() {
    const count = ref(0)
    onMounted(() => console.log('组件挂载'))
    return { count }
  }
}
```