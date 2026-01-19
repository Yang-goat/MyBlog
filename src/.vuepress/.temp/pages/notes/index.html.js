import comp from "/media/goat/data/project/Blog/myBlog/src/.vuepress/.temp/pages/notes/index.html.vue"
const data = JSON.parse("{\"path\":\"/notes/\",\"title\":\"随笔\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"随笔\",\"index\":false,\"article\":false,\"icon\":\"pen-to-square\",\"head\":[[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"WebPage\\\",\\\"name\\\":\\\"随笔\\\"}\"],[\"meta\",{\"property\":\"og:url\",\"content\":\"https://github.com/Yang-goat/MyBlog/notes/\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"Goat_Yang\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"随笔\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"website\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}],[\"meta\",{\"property\":\"og:updated_time\",\"content\":\"2025-11-11T03:38:08.000Z\"}],[\"meta\",{\"property\":\"article:modified_time\",\"content\":\"2025-11-11T03:38:08.000Z\"}]]},\"git\":{\"createdTime\":1749567106000,\"updatedTime\":1762832288000,\"contributors\":[{\"name\":\"Yang-goat\",\"username\":\"Yang-goat\",\"email\":\"1700425119@qq.com\",\"commits\":5,\"url\":\"https://github.com/Yang-goat\"}]},\"readingTime\":{\"minutes\":0.04,\"words\":13},\"filePathRelative\":\"notes/README.md\",\"excerpt\":\"\"}")
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
