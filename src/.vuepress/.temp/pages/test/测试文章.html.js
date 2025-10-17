import comp from "D:/Project/Blog/myBlog/src/.vuepress/.temp/pages/test/测试文章.html.vue"
const data = JSON.parse("{\"path\":\"/test/%E6%B5%8B%E8%AF%95%E6%96%87%E7%AB%A0.html\",\"title\":\"功能测试\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2025-09-11T00:00:00.000Z\",\"icon\":\"suitcase\",\"article\":false,\"category\":[\"测试\"],\"description\":\"功能测试\",\"head\":[[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"WebPage\\\",\\\"name\\\":\\\"功能测试\\\",\\\"description\\\":\\\"功能测试\\\"}\"],[\"meta\",{\"property\":\"og:url\",\"content\":\"https://github.com/Yang-goat/MyBlog/test/%E6%B5%8B%E8%AF%95%E6%96%87%E7%AB%A0.html\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"Goat_Yang\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"功能测试\"}],[\"meta\",{\"property\":\"og:description\",\"content\":\"功能测试\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"website\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}],[\"meta\",{\"property\":\"article:published_time\",\"content\":\"2025-09-11T00:00:00.000Z\"}]]},\"git\":{},\"readingTime\":{\"minutes\":0.08,\"words\":24},\"filePathRelative\":\"test/测试文章.md\",\"excerpt\":\"\\n\",\"autoDesc\":true}")
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
