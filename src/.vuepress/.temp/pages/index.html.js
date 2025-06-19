import comp from "D:/Project/Blog/my-blog_newtheme/src/.vuepress/.temp/pages/index.html.vue"
const data = JSON.parse("{\"path\":\"/\",\"title\":\"主页\",\"lang\":\"zh-CN\",\"frontmatter\":{\"home\":true,\"layout\":\"Blog\",\"icon\":\"house\",\"title\":\"主页\",\"heroImage\":\"assets/icon/头像.jpg\",\"heroImageStyle\":{\"border-radius\":\"100%\",\"height\":\"200px\"},\"heroText\":\"Goat_Yang\",\"heroFullScreen\":true,\"tagline\":\"个人博客·知识库\",\"projects\":[{\"icon\":\"folder-open\",\"name\":\"个人博客\",\"desc\":\"基于vuepress的个人博客网站\",\"link\":\"https://github.com/Yang-goat/MyBlog\"}],\"footer\":\"感谢访问\"},\"git\":{\"createdTime\":1749567106000,\"updatedTime\":1750314514000,\"contributors\":[{\"name\":\"Yang-goat\",\"username\":\"Yang-goat\",\"email\":\"1700425119@qq.com\",\"commits\":2,\"url\":\"https://github.com/Yang-goat\"}]},\"readingTime\":{\"minutes\":0.6,\"words\":181},\"filePathRelative\":\"README.md\",\"excerpt\":\"\"}")
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
