import comp from "D:/Project/Blog/my-blog_newtheme/src/.vuepress/.temp/pages/算法/评论测试文章.html.vue"
const data = JSON.parse("{\"path\":\"/%E7%AE%97%E6%B3%95/%E8%AF%84%E8%AE%BA%E6%B5%8B%E8%AF%95%E6%96%87%E7%AB%A0.html\",\"title\":\"评论功能测试\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2025-09-11T00:00:00.000Z\",\"category\":[\"测试\"],\"description\":\"评论功能测试\"},\"git\":{},\"readingTime\":{\"minutes\":0.07,\"words\":22},\"filePathRelative\":\"算法/评论测试文章.md\",\"excerpt\":\"\\n\",\"autoDesc\":true}")
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
