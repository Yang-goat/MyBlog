import comp from "/media/goat/data/project/Blog/myBlog/src/.vuepress/.temp/pages/notes/Math/HypothesisTesting/Friedman.html.vue"
const data = JSON.parse("{\"path\":\"/notes/Math/HypothesisTesting/Friedman.html\",\"title\":\"Friedman Test（弗里德曼检验）\",\"lang\":\"zh-CN\",\"frontmatter\":{\"icon\":\"pen-to-square\",\"date\":\"2025-12-04T00:00:00.000Z\",\"category\":[\"数学\"],\"tag\":[\"随笔\",\"假设检验\",\"非参数检验\"],\"description\":\"Friedman Test（弗里德曼检验） 1. 适用场景 Friedman Test 用于比较三个或以上的算法在多个实例上的整体性能差异。 适用条件： 有 k 个算法（k ≥ 3） 在 N 个相同的实例上测试 数据不要求服从正态分布 2. 基本思想 Friedman 不关心具体数值，而是比较每个实例中算法的相对排名（Rank）。 如果某算法在多数实例...\",\"head\":[[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"Article\\\",\\\"headline\\\":\\\"Friedman Test（弗里德曼检验）\\\",\\\"image\\\":[\\\"\\\"],\\\"datePublished\\\":\\\"2025-12-04T00:00:00.000Z\\\",\\\"dateModified\\\":\\\"2025-12-04T05:04:39.000Z\\\",\\\"author\\\":[{\\\"@type\\\":\\\"Person\\\",\\\"name\\\":\\\"Goat_Yang\\\",\\\"url\\\":\\\"../intro.html\\\"}]}\"],[\"meta\",{\"property\":\"og:url\",\"content\":\"https://github.com/Yang-goat/MyBlog/notes/Math/HypothesisTesting/Friedman.html\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"Goat_Yang\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"Friedman Test（弗里德曼检验）\"}],[\"meta\",{\"property\":\"og:description\",\"content\":\"Friedman Test（弗里德曼检验） 1. 适用场景 Friedman Test 用于比较三个或以上的算法在多个实例上的整体性能差异。 适用条件： 有 k 个算法（k ≥ 3） 在 N 个相同的实例上测试 数据不要求服从正态分布 2. 基本思想 Friedman 不关心具体数值，而是比较每个实例中算法的相对排名（Rank）。 如果某算法在多数实例...\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"article\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}],[\"meta\",{\"property\":\"og:updated_time\",\"content\":\"2025-12-04T05:04:39.000Z\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"非参数检验\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"假设检验\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"随笔\"}],[\"meta\",{\"property\":\"article:published_time\",\"content\":\"2025-12-04T00:00:00.000Z\"}],[\"meta\",{\"property\":\"article:modified_time\",\"content\":\"2025-12-04T05:04:39.000Z\"}]]},\"git\":{\"createdTime\":1764824679000,\"updatedTime\":1764824679000,\"contributors\":[{\"name\":\"Yang-goat\",\"username\":\"Yang-goat\",\"email\":\"1700425119@qq.com\",\"commits\":1,\"url\":\"https://github.com/Yang-goat\"}]},\"readingTime\":{\"minutes\":1.61,\"words\":482},\"filePathRelative\":\"notes/Math/HypothesisTesting/Friedman.md\",\"excerpt\":\"\\n<h2>1. 适用场景</h2>\\n<p>Friedman Test 用于比较三个或以上的算法在多个实例上的整体性能差异。</p>\\n<p>适用条件：</p>\\n<ul>\\n<li>有 k 个算法（k ≥ 3）</li>\\n<li>在 N 个相同的实例上测试</li>\\n<li>数据不要求服从正态分布</li>\\n</ul>\\n<hr>\\n<h2>2. 基本思想</h2>\\n<p>Friedman 不关心具体数值，而是比较每个实例中算法的相对排名（Rank）。</p>\\n<p>如果某算法在多数实例中排名持续靠前，则其平均秩统计上显著更低。</p>\\n<hr>\\n<h2>3. 操作步骤</h2>\\n<h3>Step 1：对每个实例对算法进行排序（按某指标如 GD）</h3>\",\"autoDesc\":true}")
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
