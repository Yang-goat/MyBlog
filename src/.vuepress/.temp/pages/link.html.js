import comp from "D:/Project/Blog/my-blog_newtheme/src/.vuepress/.temp/pages/link.html.vue"
const data = JSON.parse("{\"path\":\"/link.html\",\"title\":\"宝藏站点\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"宝藏站点\",\"icon\":\"circle-info\",\"index\":false,\"article\":false,\"head\":[[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"WebPage\\\",\\\"name\\\":\\\"宝藏站点\\\"}\"],[\"meta\",{\"property\":\"og:url\",\"content\":\"https://github.com/Yang-goat/MyBlog/MyBlog/link.html\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"Goat_Yang\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"宝藏站点\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"website\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}]]},\"git\":{},\"readingTime\":{\"minutes\":0.04,\"words\":12},\"filePathRelative\":\"link.md\",\"excerpt\":\"\"}")
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
