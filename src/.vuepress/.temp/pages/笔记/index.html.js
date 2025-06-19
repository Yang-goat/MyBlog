import comp from "D:/Project/Blog/my-blog_newtheme/src/.vuepress/.temp/pages/笔记/index.html.vue"
const data = JSON.parse("{\"path\":\"/%E7%AC%94%E8%AE%B0/\",\"title\":\"笔记\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"笔记\",\"icon\":\"book\",\"index\":false,\"article\":false,\"head\":[[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"WebPage\\\",\\\"name\\\":\\\"笔记\\\"}\"],[\"meta\",{\"property\":\"og:url\",\"content\":\"https://github.com/Yang-goat/MyBlog/%E7%AC%94%E8%AE%B0/\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"Goat_Yang\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"笔记\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"website\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}],[\"meta\",{\"property\":\"og:updated_time\",\"content\":\"2025-06-19T06:28:34.000Z\"}],[\"meta\",{\"property\":\"article:modified_time\",\"content\":\"2025-06-19T06:28:34.000Z\"}]]},\"git\":{\"createdTime\":1750314514000,\"updatedTime\":1750314514000,\"contributors\":[{\"name\":\"Yang-goat\",\"username\":\"Yang-goat\",\"email\":\"1700425119@qq.com\",\"commits\":1,\"url\":\"https://github.com/Yang-goat\"}]},\"readingTime\":{\"minutes\":0.03,\"words\":9},\"filePathRelative\":\"笔记/README.md\",\"excerpt\":\"\"}")
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
