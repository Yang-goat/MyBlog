import comp from "D:/Project/Blog/myBlog/src/.vuepress/.temp/pages/算法/index.html.vue"
const data = JSON.parse("{\"path\":\"/%E7%AE%97%E6%B3%95/\",\"title\":\"算法\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"算法\",\"index\":false,\"article\":false,\"icon\":\"code\",\"head\":[[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"WebPage\\\",\\\"name\\\":\\\"算法\\\"}\"],[\"meta\",{\"property\":\"og:url\",\"content\":\"https://github.com/Yang-goat/MyBlog/%E7%AE%97%E6%B3%95/\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"Goat_Yang\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"算法\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"website\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}]]},\"readingTime\":{\"minutes\":0.04,\"words\":11},\"filePathRelative\":\"算法/README.md\",\"excerpt\":\"\"}")
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
