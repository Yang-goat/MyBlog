import comp from "D:/Project/Blog/my-blog_newtheme/src/.vuepress/.temp/pages/前端/生产级应用/Node.html.vue"
const data = JSON.parse("{\"path\":\"/%E5%89%8D%E7%AB%AF/%E7%94%9F%E4%BA%A7%E7%BA%A7%E5%BA%94%E7%94%A8/Node.html\",\"title\":\"\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"readingTime\":{\"minutes\":0,\"words\":0},\"filePathRelative\":\"前端/生产级应用/Node.md\",\"excerpt\":\"\"}")
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
