import comp from "D:/Project/Blog/my-blog_newtheme/src/.vuepress/.temp/pages/随笔/index.html.vue"
const data = JSON.parse("{\"path\":\"/%E9%9A%8F%E7%AC%94/\",\"title\":\"随笔\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"随笔\",\"index\":false,\"article\":false,\"icon\":\"laptop-code\",\"head\":[[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"WebPage\\\",\\\"name\\\":\\\"随笔\\\"}\"],[\"meta\",{\"property\":\"og:url\",\"content\":\"https://github.com/Yang-goat/MyBlog/MyBlog/%E9%9A%8F%E7%AC%94/\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"Goat_Yang\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"随笔\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"website\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}]]},\"git\":{},\"readingTime\":{\"minutes\":0.04,\"words\":12},\"filePathRelative\":\"随笔/README.md\",\"excerpt\":\"<!-- <Catalog /> -->\"}")
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
