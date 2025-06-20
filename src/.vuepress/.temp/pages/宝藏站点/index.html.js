import comp from "D:/Project/Blog/my-blog_newtheme/src/.vuepress/.temp/pages/宝藏站点/index.html.vue"
const data = JSON.parse("{\"path\":\"/%E5%AE%9D%E8%97%8F%E7%AB%99%E7%82%B9/\",\"title\":\"\",\"lang\":\"zh-CN\",\"frontmatter\":{\"containerClass\":\"custom-width-page\",\"sidebar\":false,\"breadcrumb\":false,\"article\":false,\"pageInfo\":false,\"index\":false},\"git\":{},\"readingTime\":{\"minutes\":0.08,\"words\":23},\"filePathRelative\":\"宝藏站点/README.md\",\"excerpt\":\"\"}")
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
