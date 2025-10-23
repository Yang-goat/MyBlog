import comp from "D:/Project/Blog/myBlog/src/.vuepress/.temp/pages/guides/index.html.vue"
const data = JSON.parse("{\"path\":\"/guides/\",\"title\":\"软件工具指南\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"软件工具指南\",\"index\":false,\"article\":false,\"icon\":\"toolbox\",\"head\":[[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"WebPage\\\",\\\"name\\\":\\\"软件工具指南\\\"}\"],[\"meta\",{\"property\":\"og:url\",\"content\":\"https://github.com/Yang-goat/MyBlog/guides/\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"Goat_Yang\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"软件工具指南\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"website\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}],[\"meta\",{\"property\":\"og:updated_time\",\"content\":\"2025-10-21T07:08:14.000Z\"}],[\"meta\",{\"property\":\"article:modified_time\",\"content\":\"2025-10-21T07:08:14.000Z\"}]]},\"git\":{\"createdTime\":1749567106000,\"updatedTime\":1761030494000,\"contributors\":[{\"name\":\"Yang-goat\",\"username\":\"Yang-goat\",\"email\":\"1700425119@qq.com\",\"commits\":4,\"url\":\"https://github.com/Yang-goat\"}]},\"readingTime\":{\"minutes\":0.05,\"words\":15},\"filePathRelative\":\"guides/README.md\",\"excerpt\":\"\"}")
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
