import comp from "D:/Project/Blog/myBlog/src/.vuepress/.temp/pages/dev/frontend/ThreeBasics/index.html.vue"
const data = JSON.parse("{\"path\":\"/dev/frontend/ThreeBasics/\",\"title\":\"前端三剑客\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"前端三剑客\",\"index\":false,\"article\":false,\"icon\":\"laptop-code\",\"category\":[\"基础\"],\"head\":[[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"WebPage\\\",\\\"name\\\":\\\"前端三剑客\\\"}\"],[\"meta\",{\"property\":\"og:url\",\"content\":\"https://github.com/Yang-goat/MyBlog/dev/frontend/ThreeBasics/\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"Goat_Yang\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"前端三剑客\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"website\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}],[\"meta\",{\"property\":\"og:updated_time\",\"content\":\"2025-10-21T07:08:14.000Z\"}],[\"meta\",{\"property\":\"article:modified_time\",\"content\":\"2025-10-21T07:08:14.000Z\"}]]},\"git\":{\"createdTime\":1761030494000,\"updatedTime\":1761030494000,\"contributors\":[{\"name\":\"Yang-goat\",\"username\":\"Yang-goat\",\"email\":\"1700425119@qq.com\",\"commits\":1,\"url\":\"https://github.com/Yang-goat\"}]},\"readingTime\":{\"minutes\":0.06,\"words\":18},\"filePathRelative\":\"dev/frontend/ThreeBasics/README.md\",\"excerpt\":\"\"}")
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
