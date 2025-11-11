import comp from "/media/goat/双系统共享/project/Blog/myBlog/src/.vuepress/.temp/pages/index.html.vue"
const data = JSON.parse("{\"path\":\"/\",\"title\":\"主页\",\"lang\":\"zh-CN\",\"frontmatter\":{\"home\":true,\"layout\":\"Blog\",\"icon\":\"house\",\"title\":\"主页\",\"heroImage\":\"assets/icon/头像.jpg\",\"heroImageStyle\":{\"border-radius\":\"100%\",\"height\":\"200px\"},\"heroText\":\"Goat_Yang\",\"heroFullScreen\":true,\"tagline\":\"个人博客·知识库\",\"projects\":[{\"icon\":\"folder-open\",\"name\":\"个人博客\",\"desc\":\"基于vuepress的个人博客网站\",\"link\":\"https://github.com/Yang-goat/MyBlog\"},{\"icon\":\"book\",\"name\":\"USTSthesis\",\"desc\":\"苏州科技大学本科生毕业论文Latex模板\",\"link\":\"https://github.com/Yang-goat/USTSthesis\"},{\"icon\":\"comment\",\"name\":\"评论管理系统\",\"desc\":\"支持github登录的个人博客评论管理系统\",\"link\":\"https://github.com/Yang-goat/MyBlog_CMBackend\"}],\"footer\":\"感谢访问\",\"head\":[[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"WebPage\\\",\\\"name\\\":\\\"主页\\\"}\"],[\"meta\",{\"property\":\"og:url\",\"content\":\"https://github.com/Yang-goat/MyBlog/\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"Goat_Yang\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"主页\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"website\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}],[\"meta\",{\"property\":\"og:locale:alternate\",\"content\":\"en-US\"}],[\"link\",{\"rel\":\"alternate\",\"hreflang\":\"en-us\",\"href\":\"https://github.com/Yang-goat/MyBlog/en/\"}]]},\"readingTime\":{\"minutes\":0.64,\"words\":192},\"filePathRelative\":\"README.md\",\"excerpt\":\"\"}")
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
