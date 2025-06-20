import comp from "D:/Project/Blog/my-blog_newtheme/src/.vuepress/.temp/pages/宝藏站点/link.html.vue"
const data = JSON.parse("{\"path\":\"/%E5%AE%9D%E8%97%8F%E7%AB%99%E7%82%B9/link.html\",\"title\":\"宝藏站点\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"宝藏站点\",\"icon\":\"link\",\"sidebar\":false,\"description\":\"常用网址导航\"},\"readingTime\":{\"minutes\":0.37,\"words\":111},\"filePathRelative\":\"宝藏站点/link.md\",\"excerpt\":\"\\n<div id=\\\"link-container\\\"></div>\\n\",\"autoDesc\":true}")
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
