<template><div><h1 id="多目标进化算法-moea" tabindex="-1"><a class="header-anchor" href="#多目标进化算法-moea"><span>多目标进化算法（MOEA）</span></a></h1>
<h2 id="代表性算法" tabindex="-1"><a class="header-anchor" href="#代表性算法"><span>代表性算法</span></a></h2>
<table>
<thead>
<tr>
<th>算法</th>
<th>核心思想</th>
<th>特点</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>NSGA-II (2002)</strong></td>
<td>非支配排序 + 拥挤距离选择</td>
<td>最经典，收敛快、分布均匀</td>
</tr>
<tr>
<td><strong>SPEA2 (2001)</strong></td>
<td>精英外部档案 + 适应度赋值</td>
<td>平衡性好，适合中小规模</td>
</tr>
<tr>
<td><strong>MOEA/D (2007)</strong></td>
<td>分解法：将多目标问题分为若干加权子问题</td>
<td>可并行，适合高维多目标</td>
</tr>
<tr>
<td><strong>NSGA-III (2014)</strong></td>
<td>基于参考点的高维扩展</td>
<td>适用于 4 个以上目标问题</td>
</tr>
<tr>
<td><strong>RVEA (2016)</strong></td>
<td>动态权重调整与角度选择</td>
<td>平衡收敛与多样性</td>
</tr>
</tbody>
</table>
<h2 id="性能评价指标" tabindex="-1"><a class="header-anchor" href="#性能评价指标"><span>性能评价指标</span></a></h2>
<table>
<thead>
<tr>
<th>指标</th>
<th>含义</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>GD (Generational Distance)</strong></td>
<td>衡量解集到真实帕累托前沿的距离（收敛性）</td>
</tr>
<tr>
<td><strong>SP (Spacing)</strong></td>
<td>解的分布均匀程度</td>
</tr>
<tr>
<td><strong>HV (Hypervolume)</strong></td>
<td>解集覆盖体积，综合考虑收敛性与多样性</td>
</tr>
<tr>
<td><strong>IGD (Inverted GD)</strong></td>
<td>从真实前沿到算法前沿的距离，综合指标</td>
</tr>
<tr>
<td><strong>Spread (Δ)</strong></td>
<td>衡量帕累托前沿的均匀性</td>
</tr>
</tbody>
</table>
</div></template>


