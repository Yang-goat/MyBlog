import comp from "D:/Project/Blog/myBlog/src/.vuepress/.temp/pages/icons.html.vue"
const data = JSON.parse("{\"path\":\"/icons.html\",\"title\":\"图标大全\",\"lang\":\"zh-CN\",\"frontmatter\":{\"date\":\"2025-09-11T00:00:00.000Z\",\"icon\":\"suitcase\",\"category\":[\"测试\"],\"description\":\"图标大全 Solid 图标\"},\"git\":{},\"readingTime\":{\"minutes\":63.96,\"words\":19188},\"filePathRelative\":\"icons.md\",\"excerpt\":\"\\n<h2>Solid 图标</h2>\\n\",\"autoDesc\":true}")
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
