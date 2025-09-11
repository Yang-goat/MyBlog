import comp from "D:/Project/Blog/my-blog_newtheme/src/.vuepress/.temp/pages/category/latex/index.html.vue"
const data = JSON.parse("{\"path\":\"/category/latex/\",\"title\":\"Latex 分类\",\"lang\":\"zh-CN\",\"frontmatter\":{\"dir\":{\"index\":false},\"index\":false,\"feed\":false,\"sitemap\":false,\"title\":\"Latex 分类\",\"blog\":{\"type\":\"category\",\"name\":\"Latex\",\"key\":\"category\"},\"layout\":\"Blog\",\"head\":[[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"WebPage\\\",\\\"name\\\":\\\"Latex 分类\\\"}\"],[\"meta\",{\"property\":\"og:url\",\"content\":\"https://github.com/Yang-goat/MyBlog/category/latex/\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"Goat_Yang\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"Latex 分类\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"website\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}]]},\"git\":{},\"readingTime\":{\"minutes\":0,\"words\":0},\"filePathRelative\":null,\"excerpt\":\"\"}")
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
