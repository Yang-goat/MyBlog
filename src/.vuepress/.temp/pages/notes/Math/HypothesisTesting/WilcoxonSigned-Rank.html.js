import comp from "/media/goat/双系统共享/project/Blog/myBlog/src/.vuepress/.temp/pages/notes/Math/HypothesisTesting/WilcoxonSigned-Rank.html.vue"
const data = JSON.parse("{\"path\":\"/notes/Math/HypothesisTesting/WilcoxonSigned-Rank.html\",\"title\":\"Wilcoxon Signed-Rank Test（威尔科克森符号秩检验）\",\"lang\":\"zh-CN\",\"frontmatter\":{\"icon\":\"pen-to-square\",\"date\":\"2025-12-04T00:00:00.000Z\",\"category\":[\"数学\"],\"tag\":[\"随笔\",\"假设检验\",\"非参数检验\"],\"description\":\"Wilcoxon Signed-Rank Test（威尔科克森符号秩检验） 1. 适用场景 Wilcoxon Signed-Rank Test 用于比较两个相关算法/模型在多次实验（如多个实例）上的性能是否存在显著差异。 适用条件： 数据是成对的（如算法 A 与算法 B 在同一个实例上的值） 不要求数据服从正态分布（非参数方法） 检验差值的符号与秩是否...\",\"head\":[[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"Article\\\",\\\"headline\\\":\\\"Wilcoxon Signed-Rank Test（威尔科克森符号秩检验）\\\",\\\"image\\\":[\\\"\\\"],\\\"datePublished\\\":\\\"2025-12-04T00:00:00.000Z\\\",\\\"dateModified\\\":null,\\\"author\\\":[{\\\"@type\\\":\\\"Person\\\",\\\"name\\\":\\\"Goat_Yang\\\",\\\"url\\\":\\\"../intro.html\\\"}]}\"],[\"meta\",{\"property\":\"og:url\",\"content\":\"https://github.com/Yang-goat/MyBlog/notes/Math/HypothesisTesting/WilcoxonSigned-Rank.html\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"Goat_Yang\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"Wilcoxon Signed-Rank Test（威尔科克森符号秩检验）\"}],[\"meta\",{\"property\":\"og:description\",\"content\":\"Wilcoxon Signed-Rank Test（威尔科克森符号秩检验） 1. 适用场景 Wilcoxon Signed-Rank Test 用于比较两个相关算法/模型在多次实验（如多个实例）上的性能是否存在显著差异。 适用条件： 数据是成对的（如算法 A 与算法 B 在同一个实例上的值） 不要求数据服从正态分布（非参数方法） 检验差值的符号与秩是否...\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"article\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"非参数检验\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"假设检验\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"随笔\"}],[\"meta\",{\"property\":\"article:published_time\",\"content\":\"2025-12-04T00:00:00.000Z\"}]]},\"readingTime\":{\"minutes\":1.94,\"words\":583},\"filePathRelative\":\"notes/Math/HypothesisTesting/WilcoxonSigned-Rank.md\",\"excerpt\":\"\\n<h2>1. 适用场景</h2>\\n<p>Wilcoxon Signed-Rank Test 用于比较两个相关算法/模型在多次实验（如多个实例）上的性能是否存在显著差异。</p>\\n<p>适用条件：</p>\\n<ul>\\n<li>数据是成对的（如算法 A 与算法 B 在同一个实例上的值）</li>\\n<li>不要求数据服从正态分布（非参数方法）</li>\\n<li>检验差值的符号与秩是否有系统性偏向</li>\\n</ul>\\n<p>非常适合用于两个优化算法的性能对比。</p>\\n<hr>\\n<h2>2. 基本思想</h2>\\n<p>该检验检查两组成对数据差值的：</p>\\n<ul>\\n<li>方向性（正负）</li>\\n<li>差异大小的排序（绝对值秩）</li>\\n</ul>\",\"autoDesc\":true}")
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
