import comp from "D:/Project/Blog/myBlog/src/.vuepress/.temp/pages/ai-ml/optimization/MOO/MOEA/info.html.vue"
const data = JSON.parse("{\"path\":\"/ai-ml/optimization/MOO/MOEA/info.html\",\"title\":\"多目标进化算法（MOEA）\",\"lang\":\"zh-CN\",\"frontmatter\":{\"icon\":\"book\",\"date\":\"2025-10-18T00:00:00.000Z\",\"category\":[\"智能优化算法\"],\"tag\":[\"多目标优化算法\",\"导论\"],\"description\":\"多目标进化算法（MOEA） 代表性算法 性能评价指标\"},\"git\":{},\"readingTime\":{\"minutes\":0.87,\"words\":262},\"filePathRelative\":\"ai-ml/optimization/MOO/MOEA/info.md\",\"excerpt\":\"\\n<h2>代表性算法</h2>\\n<table>\\n<thead>\\n<tr>\\n<th>算法</th>\\n<th>核心思想</th>\\n<th>特点</th>\\n</tr>\\n</thead>\\n<tbody>\\n<tr>\\n<td><strong>NSGA-II (2002)</strong></td>\\n<td>非支配排序 + 拥挤距离选择</td>\\n<td>最经典，收敛快、分布均匀</td>\\n</tr>\\n<tr>\\n<td><strong>SPEA2 (2001)</strong></td>\\n<td>精英外部档案 + 适应度赋值</td>\\n<td>平衡性好，适合中小规模</td>\\n</tr>\\n<tr>\\n<td><strong>MOEA/D (2007)</strong></td>\\n<td>分解法：将多目标问题分为若干加权子问题</td>\\n<td>可并行，适合高维多目标</td>\\n</tr>\\n<tr>\\n<td><strong>NSGA-III (2014)</strong></td>\\n<td>基于参考点的高维扩展</td>\\n<td>适用于 4 个以上目标问题</td>\\n</tr>\\n<tr>\\n<td><strong>RVEA (2016)</strong></td>\\n<td>动态权重调整与角度选择</td>\\n<td>平衡收敛与多样性</td>\\n</tr>\\n</tbody>\\n</table>\",\"autoDesc\":true}")
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
