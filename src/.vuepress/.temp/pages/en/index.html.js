import comp from "/media/goat/data/project/Blog/myBlog/src/.vuepress/.temp/pages/en/index.html.vue"
const data = JSON.parse("{\"path\":\"/en/\",\"title\":\"博客多语言·英文版正在开发中\",\"lang\":\"en-US\",\"frontmatter\":{\"title\":\"博客多语言·英文版正在开发中\",\"icon\":\"book\",\"index\":false,\"article\":false,\"description\":\"The multilingual blog · English version is under development\",\"head\":[[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"WebPage\\\",\\\"name\\\":\\\"博客多语言·英文版正在开发中\\\",\\\"description\\\":\\\"The multilingual blog · English version is under development\\\"}\"],[\"meta\",{\"property\":\"og:url\",\"content\":\"https://github.com/Yang-goat/MyBlog/en/\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"Goat_Yang\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"博客多语言·英文版正在开发中\"}],[\"meta\",{\"property\":\"og:description\",\"content\":\"The multilingual blog · English version is under development\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"website\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"en-US\"}],[\"meta\",{\"property\":\"og:locale:alternate\",\"content\":\"zh-CN\"}],[\"link\",{\"rel\":\"alternate\",\"hreflang\":\"zh-cn\",\"href\":\"https://github.com/Yang-goat/MyBlog/\"}]]},\"readingTime\":{\"minutes\":0.13,\"words\":38},\"filePathRelative\":\"en/README.md\",\"excerpt\":\"<h2>The multilingual blog · English version is under development</h2>\\n<h2><a href=\\\"/\\\" target=\\\"_blank\\\">点击跳转至中文主页</a></h2>\\n\",\"autoDesc\":true}")
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
