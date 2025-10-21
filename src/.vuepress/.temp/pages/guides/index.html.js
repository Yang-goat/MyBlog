import comp from "D:/Project/Blog/myBlog/src/.vuepress/.temp/pages/guides/index.html.vue"
const data = JSON.parse("{\"path\":\"/guides/\",\"title\":\"软件工具指南\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"软件工具指南\",\"index\":false,\"article\":false,\"icon\":\"toolbox\"},\"git\":{\"createdTime\":1749567106000,\"updatedTime\":1760714013000,\"contributors\":[{\"name\":\"Yang-goat\",\"username\":\"Yang-goat\",\"email\":\"1700425119@qq.com\",\"commits\":3,\"url\":\"https://github.com/Yang-goat\"}]},\"readingTime\":{\"minutes\":0.05,\"words\":15},\"filePathRelative\":\"guides/README.md\",\"excerpt\":\"\"}")
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
