import comp from "D:/Project/Blog/my-blog_newtheme/src/.vuepress/.temp/pages/前端/index.html.vue"
const data = JSON.parse("{\"path\":\"/%E5%89%8D%E7%AB%AF/\",\"title\":\"前端\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"前端\",\"index\":false,\"article\":false,\"icon\":\"laptop-code\",\"head\":[[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"WebPage\\\",\\\"name\\\":\\\"前端\\\"}\"],[\"meta\",{\"property\":\"og:url\",\"content\":\"https://github.com/Yang-goat/MyBlog/MyBlog/%E5%89%8D%E7%AB%AF/\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"Goat_Yang\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"前端\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"website\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}],[\"meta\",{\"property\":\"og:updated_time\",\"content\":\"2025-06-12T14:53:08.000Z\"}],[\"meta\",{\"property\":\"article:modified_time\",\"content\":\"2025-06-12T14:53:08.000Z\"}]]},\"git\":{\"createdTime\":1749567106000,\"updatedTime\":1749739988000,\"contributors\":[{\"name\":\"Yang-goat\",\"username\":\"Yang-goat\",\"email\":\"1700425119@qq.com\",\"commits\":2,\"url\":\"https://github.com/Yang-goat\"}]},\"readingTime\":{\"minutes\":0.06,\"words\":17},\"filePathRelative\":\"前端/README.md\",\"excerpt\":\"\"}")
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
