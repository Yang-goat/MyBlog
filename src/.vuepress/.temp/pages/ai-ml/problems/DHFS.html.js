import comp from "/media/goat/双系统共享/project/Blog/myBlog/src/.vuepress/.temp/pages/ai-ml/problems/DHFS.html.vue"
const data = JSON.parse("{\"path\":\"/ai-ml/problems/DHFS.html\",\"title\":\"分布式异构混合流水车间调度问题（DHFS）\",\"lang\":\"zh-CN\",\"frontmatter\":{\"icon\":\"book\",\"date\":\"2025-10-20T00:00:00.000Z\",\"category\":[\"实际问题\"],\"tag\":[\"多目标优化\"],\"description\":\"分布式异构混合流水车间调度问题（DHFS） 一、问题描述 在智能制造与绿色生产的背景下，制造企业通常分布在不同的地理区域。为了实现多工厂协同生产与能源优化，提出了分布式异构混合流水车间调度问题（Distributed Heterogeneous Hybrid Flow Shop Scheduling, DHFS）。 该问题综合考虑多工厂协作、异构机器、...\",\"head\":[[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"Article\\\",\\\"headline\\\":\\\"分布式异构混合流水车间调度问题（DHFS）\\\",\\\"image\\\":[\\\"\\\"],\\\"datePublished\\\":\\\"2025-10-20T00:00:00.000Z\\\",\\\"dateModified\\\":null,\\\"author\\\":[{\\\"@type\\\":\\\"Person\\\",\\\"name\\\":\\\"Goat_Yang\\\",\\\"url\\\":\\\"../intro.html\\\"}]}\"],[\"meta\",{\"property\":\"og:url\",\"content\":\"https://github.com/Yang-goat/MyBlog/ai-ml/problems/DHFS.html\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"Goat_Yang\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"分布式异构混合流水车间调度问题（DHFS）\"}],[\"meta\",{\"property\":\"og:description\",\"content\":\"分布式异构混合流水车间调度问题（DHFS） 一、问题描述 在智能制造与绿色生产的背景下，制造企业通常分布在不同的地理区域。为了实现多工厂协同生产与能源优化，提出了分布式异构混合流水车间调度问题（Distributed Heterogeneous Hybrid Flow Shop Scheduling, DHFS）。 该问题综合考虑多工厂协作、异构机器、...\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"article\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"多目标优化\"}],[\"meta\",{\"property\":\"article:published_time\",\"content\":\"2025-10-20T00:00:00.000Z\"}]]},\"readingTime\":{\"minutes\":6,\"words\":1799},\"filePathRelative\":\"ai-ml/problems/DHFS.md\",\"excerpt\":\"\\n<h2>一、问题描述</h2>\\n<p>在智能制造与绿色生产的背景下，制造企业通常分布在不同的地理区域。为了实现多工厂协同生产与能源优化，提出了<strong>分布式异构混合流水车间调度问题（Distributed Heterogeneous Hybrid Flow Shop Scheduling, DHFS）</strong>。<br>\\n该问题综合考虑<strong>多工厂协作、异构机器、能耗优化与多目标决策</strong>，是对传统混合流水车间调度（Hybrid Flow Shop Scheduling, HFS）问题的拓展。</p>\\n<p>在 DHFS 问题中：</p>\\n<ul>\\n<li>存在多个地理分散的工厂，每个工厂包含多个加工阶段；</li>\\n<li>每个阶段拥有若干台性能不同的并行机器；</li>\\n<li>每个工件需经过所有阶段加工，且加工顺序固定；</li>\\n<li>需要确定：\\n<ol>\\n<li>每个工件分配到哪个工厂；</li>\\n<li>每个阶段使用哪台机器；</li>\\n<li>工件在每台机器上的加工顺序；</li>\\n</ol>\\n</li>\\n<li>目标是<strong>同时最小化最大完工时间（Makespan）和总能耗（Total Energy Consumption, TEC）</strong>。</li>\\n</ul>\",\"autoDesc\":true}")
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
