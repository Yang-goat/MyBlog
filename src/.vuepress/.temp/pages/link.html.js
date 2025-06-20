import comp from "D:/Project/Blog/my-blog_newtheme/src/.vuepress/.temp/pages/link.html.vue"
const data = JSON.parse("{\"path\":\"/link.html\",\"title\":\"宝藏站点\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"宝藏站点\",\"icon\":\"link\",\"sidebar\":false,\"description\":\"常用网址导航\",\"head\":[[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"Article\\\",\\\"headline\\\":\\\"宝藏站点\\\",\\\"image\\\":[\\\"\\\"],\\\"dateModified\\\":null,\\\"author\\\":[{\\\"@type\\\":\\\"Person\\\",\\\"name\\\":\\\"Goat_Yang\\\",\\\"url\\\":\\\"https://mister-hope.com\\\"}]}\"],[\"meta\",{\"property\":\"og:url\",\"content\":\"https://github.com/Yang-goat/MyBlog/link.html\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"Goat_Yang\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"宝藏站点\"}],[\"meta\",{\"property\":\"og:description\",\"content\":\"常用网址导航\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"article\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}]]},\"readingTime\":{\"minutes\":0.37,\"words\":111},\"filePathRelative\":\"link.md\",\"excerpt\":\"\\n<div id=\\\"link-container\\\"></div>\\n\",\"autoDesc\":true}")
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
