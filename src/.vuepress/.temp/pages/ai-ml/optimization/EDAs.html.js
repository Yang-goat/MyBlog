import comp from "/media/goat/双系统共享/project/Blog/myBlog/src/.vuepress/.temp/pages/ai-ml/optimization/EDAs.html.vue"
const data = JSON.parse("{\"path\":\"/ai-ml/optimization/EDAs.html\",\"title\":\"分布估计算法（EDAs）\",\"lang\":\"zh-CN\",\"frontmatter\":{\"icon\":\"e\",\"date\":\"2025-11-27T00:00:00.000Z\",\"category\":[\"智能优化算法\"],\"tag\":[\"分布估计算法\"],\"description\":\"分布估计算法（EDAs） EDAs（Estimation of Distribution Algorithms）是一类基于概率模型的进化优化算法。与传统遗传算法（Genetic Algorithms，GA）相比，EDAs 用分布学习 + 采样替代了交叉与变异算子，因此在结构表示能力、稳定性与全局搜索性能方面具有显著优势。 EDA vs GA 虽然 ED...\"},\"readingTime\":{\"minutes\":7.32,\"words\":2197},\"filePathRelative\":\"ai-ml/optimization/EDAs.md\",\"excerpt\":\"\\n<p>EDAs（Estimation of Distribution Algorithms）是一类基于概率模型的进化优化算法。与传统遗传算法（Genetic Algorithms，GA）相比，EDAs 用<strong>分布学习 + 采样</strong>替代了交叉与变异算子，因此在结构表示能力、稳定性与全局搜索性能方面具有显著优势。</p>\\n<h2>EDA vs GA</h2>\\n<p>虽然 EDAs 与 GA 均属于基于种群的随机优化算法，但 EDAs 引入概率模型后具备了一系列关键优势：</p>\\n<ul>\\n<li><strong>模型驱动搜索</strong>：GA 依赖交叉与变异等随机操作，而 EDA 明确构建概率模型来描述优秀解的结构，使搜索方向更具信息性。</li>\\n<li><strong>减少参数与操作复杂度</strong>：无需复杂的交叉/变异设计，也避免不合适的操作对变量依赖关系造成破坏。</li>\\n<li><strong>更容易捕捉变量之间的依赖关系</strong>：通过模型（如多变量分布）自动学习特征间关联，而 GA 通常无法显式表达。</li>\\n<li><strong>更适合集成机器学习思想</strong>：EDA 使用“学习—采样”循环，可自然融合统计、ML、图模型等方法。</li>\\n<li><strong>更稳定的收敛行为</strong>：基于概率模型的更新通常比 GA 的随机算子更稳定，可提高全局搜索能力。</li>\\n</ul>\",\"autoDesc\":true}")
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
