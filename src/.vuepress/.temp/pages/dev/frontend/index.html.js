import comp from "/media/goat/data/project/Blog/myBlog/src/.vuepress/.temp/pages/dev/frontend/index.html.vue"
const data = JSON.parse("{\"path\":\"/dev/frontend/\",\"title\":\"前端\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"前端\",\"index\":false,\"article\":false,\"icon\":\"laptop-code\",\"head\":[[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"WebPage\\\",\\\"name\\\":\\\"前端\\\"}\"],[\"meta\",{\"property\":\"og:url\",\"content\":\"https://github.com/Yang-goat/MyBlog/dev/frontend/\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"Goat_Yang\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"前端\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"website\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}],[\"meta\",{\"property\":\"og:updated_time\",\"content\":\"2025-11-11T03:38:08.000Z\"}],[\"meta\",{\"property\":\"article:modified_time\",\"content\":\"2025-11-11T03:38:08.000Z\"}]]},\"git\":{\"createdTime\":1749567106000,\"updatedTime\":1762832288000,\"contributors\":[{\"name\":\"Yang-goat\",\"username\":\"Yang-goat\",\"email\":\"1700425119@qq.com\",\"commits\":5,\"url\":\"https://github.com/Yang-goat\"}]},\"readingTime\":{\"minutes\":0.06,\"words\":17},\"filePathRelative\":\"dev/frontend/README.md\",\"excerpt\":\"\"}")
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
