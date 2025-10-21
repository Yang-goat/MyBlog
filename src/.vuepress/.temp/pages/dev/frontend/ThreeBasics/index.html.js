import comp from "D:/Project/Blog/myBlog/src/.vuepress/.temp/pages/dev/frontend/ThreeBasics/index.html.vue"
const data = JSON.parse("{\"path\":\"/dev/frontend/ThreeBasics/\",\"title\":\"前端三剑客\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"前端三剑客\",\"index\":false,\"article\":false,\"icon\":\"laptop-code\",\"category\":[\"基础\"],\"head\":[[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"WebPage\\\",\\\"name\\\":\\\"前端三剑客\\\"}\"],[\"meta\",{\"property\":\"og:url\",\"content\":\"https://github.com/Yang-goat/MyBlog/dev/frontend/ThreeBasics/\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"Goat_Yang\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"前端三剑客\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"website\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}]]},\"git\":{},\"readingTime\":{\"minutes\":0.06,\"words\":18},\"filePathRelative\":\"dev/frontend/ThreeBasics/README.md\",\"excerpt\":\"\"}")
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
