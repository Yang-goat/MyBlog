import comp from "D:/Project/Blog/my-blog_newtheme/src/.vuepress/.temp/pages/tag/vue/index.html.vue"
const data = JSON.parse("{\"path\":\"/tag/vue/\",\"title\":\"标签: Vue\",\"lang\":\"zh-CN\",\"frontmatter\":{\"dir\":{\"index\":false},\"index\":false,\"feed\":false,\"sitemap\":false,\"title\":\"标签: Vue\",\"blog\":{\"type\":\"category\",\"name\":\"Vue\",\"key\":\"tag\"},\"layout\":\"Blog\",\"head\":[[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"WebPage\\\",\\\"name\\\":\\\"标签: Vue\\\"}\"],[\"meta\",{\"property\":\"og:url\",\"content\":\"https://github.com/Yang-goat/MyBlog/tag/vue/\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"Goat_Yang\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"标签: Vue\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"website\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}]]},\"readingTime\":{\"minutes\":0,\"words\":0},\"filePathRelative\":null,\"excerpt\":\"\"}")
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
