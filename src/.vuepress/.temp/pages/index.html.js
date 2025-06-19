import comp from "D:/Project/Blog/my-blog_newtheme/src/.vuepress/.temp/pages/index.html.vue"
const data = JSON.parse("{\"path\":\"/\",\"title\":\"主页\",\"lang\":\"zh-CN\",\"frontmatter\":{\"home\":true,\"layout\":\"Blog\",\"icon\":\"house\",\"title\":\"主页\",\"heroImage\":\"assets/icon/头像.jpg\",\"heroImageStyle\":{\"border-radius\":\"100%\"},\"heroText\":\"Goat_Yang\",\"heroFullScreen\":true,\"tagline\":\"个人博客·知识库\",\"projects\":[{\"icon\":\"folder-open\",\"name\":\"项目名称\",\"desc\":\"项目详细描述\",\"link\":\"https://你的项目链接\"},{\"icon\":\"link\",\"name\":\"链接名称\",\"desc\":\"链接详细描述\",\"link\":\"https://链接地址\"},{\"icon\":\"book\",\"name\":\"书籍名称\",\"desc\":\"书籍详细描述\",\"link\":\"https://你的书籍链接\"},{\"icon\":\"newspaper\",\"name\":\"文章名称\",\"desc\":\"文章详细描述\",\"link\":\"https://你的文章链接\"},{\"icon\":\"user-group\",\"name\":\"伙伴名称\",\"desc\":\"伙伴详细介绍\",\"link\":\"https://你的伙伴链接\"},{\"icon\":\"https://theme-hope-assets.vuejs.press/logo.svg\",\"name\":\"自定义项目\",\"desc\":\"自定义详细介绍\",\"link\":\"https://你的自定义链接\"}],\"footer\":\"感谢访问\",\"head\":[[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"WebPage\\\",\\\"name\\\":\\\"主页\\\"}\"],[\"meta\",{\"property\":\"og:url\",\"content\":\"https://github.com/Yang-goat/MyBlog/MyBlog/\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"Goat_Yang\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"主页\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"website\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}],[\"meta\",{\"property\":\"og:updated_time\",\"content\":\"2025-06-19T06:28:34.000Z\"}],[\"meta\",{\"property\":\"article:modified_time\",\"content\":\"2025-06-19T06:28:34.000Z\"}]]},\"git\":{\"createdTime\":1749567106000,\"updatedTime\":1750314514000,\"contributors\":[{\"name\":\"Yang-goat\",\"username\":\"Yang-goat\",\"email\":\"1700425119@qq.com\",\"commits\":2,\"url\":\"https://github.com/Yang-goat\"}]},\"readingTime\":{\"minutes\":0.6,\"words\":180},\"filePathRelative\":\"README.md\",\"excerpt\":\"\"}")
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
