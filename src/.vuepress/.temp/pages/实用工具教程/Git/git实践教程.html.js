import comp from "D:/Project/Blog/myBlog/src/.vuepress/.temp/pages/实用工具教程/Git/Git实践教程.html.vue"
const data = JSON.parse("{\"path\":\"/%E5%AE%9E%E7%94%A8%E5%B7%A5%E5%85%B7%E6%95%99%E7%A8%8B/Git/Git%E5%AE%9E%E8%B7%B5%E6%95%99%E7%A8%8B.html\",\"title\":\"\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"git\":{},\"readingTime\":{\"minutes\":0,\"words\":0},\"filePathRelative\":\"实用工具教程/Git/Git实践教程.md\",\"excerpt\":\"\"}")
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
