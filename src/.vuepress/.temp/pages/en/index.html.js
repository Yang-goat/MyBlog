import comp from "D:/Project/Blog/myBlog/src/.vuepress/.temp/pages/en/index.html.vue"
const data = JSON.parse("{\"path\":\"/en/\",\"title\":\"博客多语言·英文版正在开发中\",\"lang\":\"en-US\",\"frontmatter\":{\"title\":\"博客多语言·英文版正在开发中\",\"icon\":\"book\",\"index\":false,\"article\":false,\"head\":[[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"WebPage\\\",\\\"name\\\":\\\"博客多语言·英文版正在开发中\\\"}\"],[\"meta\",{\"property\":\"og:url\",\"content\":\"https://github.com/Yang-goat/MyBlog/en/\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"Goat_Yang\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"博客多语言·英文版正在开发中\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"website\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"en-US\"}],[\"meta\",{\"property\":\"og:locale:alternate\",\"content\":\"zh-CN\"}],[\"meta\",{\"property\":\"og:updated_time\",\"content\":\"2025-10-17T15:13:33.000Z\"}],[\"meta\",{\"property\":\"article:modified_time\",\"content\":\"2025-10-17T15:13:33.000Z\"}],[\"link\",{\"rel\":\"alternate\",\"hreflang\":\"zh-cn\",\"href\":\"https://github.com/Yang-goat/MyBlog/\"}]]},\"git\":{\"createdTime\":1760714013000,\"updatedTime\":1760714013000,\"contributors\":[{\"name\":\"Yang-goat\",\"username\":\"Yang-goat\",\"email\":\"1700425119@qq.com\",\"commits\":1,\"url\":\"https://github.com/Yang-goat\"}]},\"readingTime\":{\"minutes\":0.1,\"words\":30},\"filePathRelative\":\"en/README.md\",\"excerpt\":\"<h2><a href=\\\"/\\\" target=\\\"_blank\\\">点击跳转至中文主页</a></h2>\\n\"}")
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
