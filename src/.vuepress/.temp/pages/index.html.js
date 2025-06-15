import comp from "D:/Project/Blog/my-blog_newtheme/src/.vuepress/.temp/pages/index.html.vue"
const data = JSON.parse("{\"path\":\"/\",\"title\":\"博客主页\",\"lang\":\"zh-CN\",\"frontmatter\":{\"home\":true,\"layout\":\"Blog\",\"icon\":\"house\",\"title\":\"博客主页\",\"heroImage\":\"https://theme-hope-assets.vuejs.press/logo.svg\",\"heroText\":\"Goat_Yang\",\"heroFullScreen\":true,\"tagline\":\"个人博客·知识库\",\"projects\":[{\"icon\":\"folder-open\",\"name\":\"项目名称\",\"desc\":\"项目详细描述\",\"link\":\"https://你的项目链接\"}],\"footer\":\"感谢访问\",\"head\":[[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"WebPage\\\",\\\"name\\\":\\\"博客主页\\\"}\"],[\"meta\",{\"property\":\"og:url\",\"content\":\"https://github.com/Yang-goat/MyBlog/\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"Goat_Yang\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"博客主页\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"website\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}]]},\"readingTime\":{\"minutes\":0.75,\"words\":225},\"filePathRelative\":\"README.md\",\"excerpt\":\"<!-- 这是一个博客主页的案例。\\n\\n要使用此布局，你应该在页面前端设置 `layout: Blog` 和 `home: true`。\\n\\n相关配置文档请见 [博客主页](https://theme-hope.vuejs.press/zh/guide/blog/home.html)。 -->\\n\"}")
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
