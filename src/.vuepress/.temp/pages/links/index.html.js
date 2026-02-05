import comp from "/media/goat/data/project/Blog/myBlog/src/.vuepress/.temp/pages/links/index.html.vue"
const data = JSON.parse("{\"path\":\"/links/\",\"title\":\"宝藏站点\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"宝藏站点\",\"layout\":\"TreasureSites\",\"sidebar\":false,\"pageInfo\":false,\"breadcrumb\":false,\"navbar\":true,\"footer\":true,\"prev\":false,\"next\":false,\"timeline\":\"fales\",\"index\":false,\"article\":false,\"head\":[[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"WebPage\\\",\\\"name\\\":\\\"宝藏站点\\\"}\"],[\"meta\",{\"property\":\"og:url\",\"content\":\"https://github.com/Yang-goat/MyBlog/links/\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"Goat_Yang\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"宝藏站点\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"website\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}]]},\"readingTime\":{\"minutes\":0.09,\"words\":27},\"filePathRelative\":\"links/README.md\",\"excerpt\":\"\"}")
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
