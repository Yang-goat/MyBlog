import comp from "D:/Project/Blog/myBlog/src/.vuepress/.temp/pages/dev/frontend/模块化/ESM规范.html.vue"
const data = JSON.parse("{\"path\":\"/dev/frontend/%E6%A8%A1%E5%9D%97%E5%8C%96/ESM%E8%A7%84%E8%8C%83.html\",\"title\":\"ESM规范\",\"lang\":\"zh-CN\",\"frontmatter\":{\"icon\":\"pen-to-square\",\"date\":\"2025-06-17T00:00:00.000Z\",\"order\":2,\"category\":[\"前端\"],\"tag\":[\"ES6\"],\"description\":\"ESM规范 一、ESM 的基本概念 ESM（ECMAScript Module）是 ECMAScript 2015（ES6）引入的官方模块化规范，旨在解决 JavaScript 长期缺乏标准化模块化方案的问题。它通过import和export关键字实现模块的导入与导出，具有静态化结构、浏览器与 Node.js 统一支持、按需加载等特性，是现代前端开发的...\",\"head\":[[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"Article\\\",\\\"headline\\\":\\\"ESM规范\\\",\\\"image\\\":[\\\"\\\"],\\\"datePublished\\\":\\\"2025-06-17T00:00:00.000Z\\\",\\\"dateModified\\\":\\\"2025-10-17T15:13:33.000Z\\\",\\\"author\\\":[{\\\"@type\\\":\\\"Person\\\",\\\"name\\\":\\\"Goat_Yang\\\",\\\"url\\\":\\\"../intro.html\\\"}]}\"],[\"meta\",{\"property\":\"og:url\",\"content\":\"https://github.com/Yang-goat/MyBlog/dev/frontend/%E6%A8%A1%E5%9D%97%E5%8C%96/ESM%E8%A7%84%E8%8C%83.html\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"Goat_Yang\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"ESM规范\"}],[\"meta\",{\"property\":\"og:description\",\"content\":\"ESM规范 一、ESM 的基本概念 ESM（ECMAScript Module）是 ECMAScript 2015（ES6）引入的官方模块化规范，旨在解决 JavaScript 长期缺乏标准化模块化方案的问题。它通过import和export关键字实现模块的导入与导出，具有静态化结构、浏览器与 Node.js 统一支持、按需加载等特性，是现代前端开发的...\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"article\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}],[\"meta\",{\"property\":\"og:updated_time\",\"content\":\"2025-10-17T15:13:33.000Z\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"ES6\"}],[\"meta\",{\"property\":\"article:published_time\",\"content\":\"2025-06-17T00:00:00.000Z\"}],[\"meta\",{\"property\":\"article:modified_time\",\"content\":\"2025-10-17T15:13:33.000Z\"}]]},\"git\":{\"createdTime\":1750173800000,\"updatedTime\":1760714013000,\"contributors\":[{\"name\":\"Yang-goat\",\"username\":\"Yang-goat\",\"email\":\"1700425119@qq.com\",\"commits\":3,\"url\":\"https://github.com/Yang-goat\"}]},\"readingTime\":{\"minutes\":2.99,\"words\":896},\"filePathRelative\":\"dev/frontend/模块化/ESM规范.md\",\"excerpt\":\"\\n<h2>一、ESM 的基本概念</h2>\\n<p>ESM（ECMAScript Module）是 ECMAScript 2015（ES6）引入的官方模块化规范，旨在解决 JavaScript 长期缺乏标准化模块化方案的问题。它通过import和export关键字实现模块的导入与导出，具有静态化结构、浏览器与 Node.js 统一支持、按需加载等特性，是现代前端开发的核心基础之一。</p>\\n<h3>特性</h3>\\n<ul>\\n<li>模块引用为只读视图，无法直接修改值，但引用的值可以通过其他方法修改（如使用导出对象的方法）</li>\\n<li>静态模块结构：模块依赖关系在编译时确定，便于工具进行Tree Shaking（移除未使用代码），例如 Webpack 可通过此特性优化打包体积。</li>\\n<li>单例模块：每个模块在应用中仅加载一次，多次导入指向同一实例，适合管理全局状态</li>\\n</ul>\",\"autoDesc\":true}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
