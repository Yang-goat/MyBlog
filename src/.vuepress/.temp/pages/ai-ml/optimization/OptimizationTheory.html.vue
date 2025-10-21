<template><div><h1 id="优化理论" tabindex="-1"><a class="header-anchor" href="#优化理论"><span>优化理论</span></a></h1>
<h2 id="一、优化问题的基本概念" tabindex="-1"><a class="header-anchor" href="#一、优化问题的基本概念"><span>一、优化问题的基本概念</span></a></h2>
<p><strong>优化（Optimization）</strong> 指在给定约束条件下，寻找使目标函数达到最优（最小或最大）的决策变量值。</p>
<p>一般形式：</p>
<p v-pre class='katex-block'><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mtable rowspacing="0.25em" columnalign="right left" columnspacing="0em"><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><munder><mrow><mi>min</mi><mo>⁡</mo></mrow><mrow><mi>x</mi><mo>∈</mo><mi>S</mi></mrow></munder><mtext>  </mtext><mi>f</mi><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mtext>s.t.</mtext><mspace width="1em"/><msub><mi>g</mi><mi>i</mi></msub><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo><mo>≤</mo><mn>0</mn><mo separator="true">,</mo><mtext>  </mtext><mi>i</mi><mo>=</mo><mn>1</mn><mo separator="true">,</mo><mo>…</mo><mo separator="true">,</mo><mi>m</mi></mrow></mstyle></mtd></mtr><mtr><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow></mrow></mstyle></mtd><mtd><mstyle scriptlevel="0" displaystyle="true"><mrow><mrow></mrow><mspace width="2em"/><mtext>  </mtext><mtext>  </mtext><mtext>  </mtext><msub><mi>h</mi><mi>j</mi></msub><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo><mo>=</mo><mn>0</mn><mo separator="true">,</mo><mtext>  </mtext><mi>j</mi><mo>=</mo><mn>1</mn><mo separator="true">,</mo><mo>…</mo><mo separator="true">,</mo><mi>p</mi></mrow></mstyle></mtd></mtr></mtable><annotation encoding="application/x-tex">\begin{aligned}
&amp;\min_{x \in S} \; f(x) \\
&amp;\text{s.t.}\quad g_i(x) \le 0,\; i=1,\dots,m \\
&amp;\qquad\;\;\; h_j(x) = 0,\; j=1,\dots,p
\end{aligned}
</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:4.9117em;vertical-align:-2.2059em;"></span><span class="mord"><span class="mtable"><span class="col-align-r"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:2.7059em;"><span style="top:-4.7059em;"><span class="pstrut" style="height:2.84em;"></span><span class="mord"></span></span><span style="top:-2.7941em;"><span class="pstrut" style="height:2.84em;"></span><span class="mord"></span></span><span style="top:-1.2941em;"><span class="pstrut" style="height:2.84em;"></span><span class="mord"></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:2.2059em;"><span></span></span></span></span></span><span class="col-align-l"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:2.7059em;"><span style="top:-4.8659em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mop op-limits"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.6679em;"><span style="top:-2.3557em;margin-left:0em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">x</span><span class="mrel mtight">∈</span><span class="mord mathnormal mtight" style="margin-right:0.05764em;">S</span></span></span></span><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span><span class="mop">min</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.7717em;"><span></span></span></span></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.10764em;">f</span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mclose">)</span></span></span><span style="top:-2.9541em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"></span><span class="mord text"><span class="mord">s.t.</span></span><span class="mspace" style="margin-right:1em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:-0.0359em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">≤</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord">0</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">i</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord">1</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="minner">…</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">m</span></span></span><span style="top:-1.4541em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord"></span><span class="mspace" style="margin-right:2em;"></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord"><span class="mord mathnormal">h</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight" style="margin-right:0.05724em;">j</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.2861em;"><span></span></span></span></span></span></span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord">0</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.05724em;">j</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mord">1</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="minner">…</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">p</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:2.2059em;"><span></span></span></span></span></span></span></span></span></span></span></span></p>
<p>其中 <span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>x</mi><mo>=</mo><mo stretchy="false">[</mo><msub><mi>x</mi><mn>1</mn></msub><mo separator="true">,</mo><mo>…</mo><mo separator="true">,</mo><msub><mi>x</mi><mi>n</mi></msub><msup><mo stretchy="false">]</mo><mi mathvariant="normal">⊤</mi></msup></mrow><annotation encoding="application/x-tex">x=[x_1,\dots,x_n]^\top</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal">x</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1.0991em;vertical-align:-0.25em;"></span><span class="mopen">[</span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="minner">…</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.1514em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">n</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mclose"><span class="mclose">]</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8491em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">⊤</span></span></span></span></span></span></span></span></span></span></span> 为决策变量，<span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>f</mi><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">f(x)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.10764em;">f</span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mclose">)</span></span></span></span> 为目标函数，<span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>S</mi></mrow><annotation encoding="application/x-tex">S</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.05764em;">S</span></span></span></span> 为可行域。</p>
<hr>
<h2 id="二、优化问题的分类" tabindex="-1"><a class="header-anchor" href="#二、优化问题的分类"><span>二、优化问题的分类</span></a></h2>
<p>优化问题可从多个维度划分：</p>
<table>
<thead>
<tr>
<th>维度</th>
<th>主要类型</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>① 目标数量</td>
<td>单目标、多目标</td>
<td>一个或多个需优化的目标</td>
</tr>
<tr>
<td>② 变量类型</td>
<td>连续、离散、混合</td>
<td>决策变量取值域</td>
</tr>
<tr>
<td>③ 约束条件</td>
<td>无约束、有约束</td>
<td>是否存在限制条件</td>
</tr>
<tr>
<td>④ 函数特性</td>
<td>凸/非凸、单/多模态</td>
<td>函数形态及极值结构</td>
</tr>
<tr>
<td>⑤ 动态性</td>
<td>静态、动态</td>
<td>问题是否随时间变化</td>
</tr>
<tr>
<td>⑥ 随机性</td>
<td>确定性、随机</td>
<td>是否含噪声或不确定性</td>
</tr>
<tr>
<td>⑦ 维度规模</td>
<td>低维、高维</td>
<td>变量数量与复杂度</td>
</tr>
<tr>
<td>⑧ 可导性</td>
<td>可微、黑箱</td>
<td>是否可求导</td>
</tr>
</tbody>
</table>
<hr>
<h2 id="三、求解方法与运用原则" tabindex="-1"><a class="header-anchor" href="#三、求解方法与运用原则"><span>三、求解方法与运用原则</span></a></h2>
<h3 id="一-数学规划-mathematical-programming" tabindex="-1"><a class="header-anchor" href="#一-数学规划-mathematical-programming"><span>（一）数学规划（Mathematical Programming）</span></a></h3>
<p>以数学分析为基础，利用凸性、导数或 KKT 条件等精确求解。</p>
<table>
<thead>
<tr>
<th>类型</th>
<th>特点</th>
<th>代表方法</th>
</tr>
</thead>
<tbody>
<tr>
<td>线性规划</td>
<td>线性目标与约束</td>
<td>单纯形法、内点法</td>
</tr>
<tr>
<td>非线性规划</td>
<td>可微函数</td>
<td>梯度法、牛顿法</td>
</tr>
<tr>
<td>整数/混合整数规划</td>
<td>离散/混合变量</td>
<td>分支定界、割平面</td>
</tr>
<tr>
<td>动态规划</td>
<td>多阶段决策</td>
<td>贝尔曼方程</td>
</tr>
<tr>
<td>凸优化</td>
<td>任意局部最优即全局最优</td>
<td>内点法、投影梯度</td>
</tr>
</tbody>
</table>
<p><strong>优缺点：</strong><br>
✅ 理论严谨、结果精确；❌ 依赖可微/凸性与规则结构。</p>
<h3 id="二-进化计算-evolutionary-computation" tabindex="-1"><a class="header-anchor" href="#二-进化计算-evolutionary-computation"><span>（二）进化计算（Evolutionary Computation）</span></a></h3>
<p>以自然进化、群体智能或物理机制为启发，通过随机搜索近似全局最优。</p>
<table>
<thead>
<tr>
<th>类别</th>
<th>启发机制</th>
<th>代表算法</th>
</tr>
</thead>
<tbody>
<tr>
<td>进化算法</td>
<td>生物进化</td>
<td>GA、ES、EP、DE</td>
</tr>
<tr>
<td>群体智能</td>
<td>群体协同</td>
<td>PSO、ACO、ABC</td>
</tr>
<tr>
<td>物理启发</td>
<td>物理过程</td>
<td>SA、FA</td>
</tr>
<tr>
<td>混合/自适应</td>
<td>组合与参数自调</td>
<td>CMA-ES、Memetic、BO+EC</td>
</tr>
</tbody>
</table>
<p><strong>优缺点：</strong><br>
✅ 不需梯度，适于非凸/离散/黑箱；❌ 随机性强、收敛速率依参数而异。</p>
<h3 id="三-比较与融合" tabindex="-1"><a class="header-anchor" href="#三-比较与融合"><span>（三）比较与融合</span></a></h3>
<table>
<thead>
<tr>
<th>对比项</th>
<th>数学规划</th>
<th>进化计算</th>
</tr>
</thead>
<tbody>
<tr>
<td>搜索方式</td>
<td>确定性、梯度驱动</td>
<td>随机性、群体驱动</td>
</tr>
<tr>
<td>适用问题</td>
<td>凸、连续、可微</td>
<td>非凸、离散、黑箱</td>
</tr>
<tr>
<td>结果性质</td>
<td>精确解</td>
<td>近似解</td>
</tr>
<tr>
<td>典型优势</td>
<td>可证明的最优性</td>
<td>全局探索与鲁棒性</td>
</tr>
</tbody>
</table>
<p><strong>融合趋势（Hybrid）</strong>：用进化法找“好起点”，再以数学规划局部精修；或用代理模型/贝叶斯优化辅助昂贵评估。</p>
<hr>
<h2 id="四、搜索优化算法的一般流程-八步法" tabindex="-1"><a class="header-anchor" href="#四、搜索优化算法的一般流程-八步法"><span>四、搜索优化算法的一般流程（八步法）</span></a></h2>
<blockquote>
<p>适用于 GA/PSO/DE/SA/ACO 等通用“搜索—评价—记忆—迭代”范式。</p>
</blockquote>
<h3 id="步骤1-优化问题建模" tabindex="-1"><a class="header-anchor" href="#步骤1-优化问题建模"><span>步骤1：优化问题建模</span></a></h3>
<p><strong>完成三要素的数学表达，并明确可计算方式：</strong></p>
<ul>
<li><strong>决策变量</strong>：<span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>x</mi><mo>∈</mo><msup><mi mathvariant="double-struck">R</mi><mi>n</mi></msup></mrow><annotation encoding="application/x-tex">x \in \mathbb{R}^n</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.5782em;vertical-align:-0.0391em;"></span><span class="mord mathnormal">x</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">∈</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6889em;"></span><span class="mord"><span class="mord mathbb">R</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.6644em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">n</span></span></span></span></span></span></span></span></span></span></span> 或 <span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>x</mi><mo>∈</mo><msup><mi mathvariant="double-struck">Z</mi><mi>n</mi></msup></mrow><annotation encoding="application/x-tex">x \in \mathbb{Z}^n</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.5782em;vertical-align:-0.0391em;"></span><span class="mord mathnormal">x</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">∈</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6889em;"></span><span class="mord"><span class="mord mathbb">Z</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.6644em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">n</span></span></span></span></span></span></span></span></span></span></span> 或混合。</li>
<li><strong>目标函数</strong>：<span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>f</mi><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">f(x)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.10764em;">f</span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mclose">)</span></span></span></span>（或多目标 <span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>F</mi><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo><mo>=</mo><mo stretchy="false">[</mo><msub><mi>f</mi><mn>1</mn></msub><mo separator="true">,</mo><mo>…</mo><mo separator="true">,</mo><msub><mi>f</mi><mi>k</mi></msub><mo stretchy="false">]</mo></mrow><annotation encoding="application/x-tex">F(x)=[f_1,\dots,f_k]</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.13889em;">F</span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">[</span><span class="mord"><span class="mord mathnormal" style="margin-right:0.10764em;">f</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-left:-0.1076em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="minner">…</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.10764em;">f</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3361em;"><span style="top:-2.55em;margin-left:-0.1076em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight" style="margin-right:0.03148em;">k</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mclose">]</span></span></span></span>），给出数值评估路径（解析、仿真、实验）。</li>
<li><strong>约束函数</strong>：<span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>g</mi><mi>i</mi></msub><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo><mo>≤</mo><mn>0</mn><mo separator="true">,</mo><mtext>  </mtext><msub><mi>h</mi><mi>j</mi></msub><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo><mo>=</mo><mn>0</mn></mrow><annotation encoding="application/x-tex">g_i(x)\le 0,\; h_j(x)=0</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:-0.0359em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">≤</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1.0361em;vertical-align:-0.2861em;"></span><span class="mord">0</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord"><span class="mord mathnormal">h</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight" style="margin-right:0.05724em;">j</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.2861em;"><span></span></span></span></span></span></span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">0</span></span></span></span>，确定<strong>可行性判定</strong>与<strong>惩罚/修复</strong>策略。</li>
<li><strong>注意</strong>：若为黑箱/噪声评估，说明采样次数、复评估/方差估计与缓存复用策略。</li>
</ul>
<h3 id="步骤2-确定解的编-解码方法" tabindex="-1"><a class="header-anchor" href="#步骤2-确定解的编-解码方法"><span>步骤2：确定解的编／解码方法</span></a></h3>
<p><strong>将“数学解”与“算法内部表示”互相映射：</strong></p>
<ul>
<li><strong>编码</strong>：实数向量、二进制串、排列、混合基因等。</li>
<li><strong>解码</strong>：从表示还原到可评估的 <span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>x</mi></mrow><annotation encoding="application/x-tex">x</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal">x</span></span></span></span>，必要时做<strong>可行化修复</strong>（投影、启发式纠偏）。</li>
<li><strong>建议</strong>：选择<strong>闭合性强</strong>（算子作用后仍有效）、<strong>表达力足</strong>、<strong>便于邻域操作</strong>的表示。</li>
</ul>
<h3 id="步骤3-确定解的评价方法" tabindex="-1"><a class="header-anchor" href="#步骤3-确定解的评价方法"><span>步骤3：确定解的评价方法</span></a></h3>
<p><strong>定义适应度/质量评分与约束处理：</strong></p>
<ul>
<li><strong>单目标</strong>：<span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mtext>fitness</mtext><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo><mo>=</mo><mi>f</mi><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">\text{fitness}(x) = f(x)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord text"><span class="mord">fitness</span></span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.10764em;">f</span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mclose">)</span></span></span></span> 或其单调变换（越小越好/越大越好统一）。</li>
<li><strong>多目标</strong>：帕累托支配、拥挤距离、加权和或 <span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>ϵ</mi></mrow><annotation encoding="application/x-tex">\epsilon</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal">ϵ</span></span></span></span>-约束等。</li>
<li><strong>约束处理</strong>：罚函数 <span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>F</mi><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo><mo>=</mo><mi>f</mi><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo><mo>+</mo><mi>ρ</mi><mo>⋅</mo><mtext>violation</mtext><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">F(x)=f(x)+\rho\cdot\text{violation}(x)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.13889em;">F</span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.10764em;">f</span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.6389em;vertical-align:-0.1944em;"></span><span class="mord mathnormal">ρ</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">⋅</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord text"><span class="mord">violation</span></span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mclose">)</span></span></span></span>、可行性优先、分级排序、修复算子。</li>
<li><strong>噪声</strong>：多次评估求均值/置信区间；使用方差自适应采样；启用评价记忆（见步骤4）。</li>
</ul>
<h3 id="步骤4-建立记忆信息的数据结构" tabindex="-1"><a class="header-anchor" href="#步骤4-建立记忆信息的数据结构"><span>步骤4：建立记忆信息的数据结构</span></a></h3>
<p><strong>存储搜索状态与知识，提升效率与稳定性：</strong></p>
<ul>
<li><strong>历史最优</strong>：全局最优 <span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mi>x</mi><mo>∗</mo></msup></mrow><annotation encoding="application/x-tex">x^\ast</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6887em;"></span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.6887em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mbin mtight">∗</span></span></span></span></span></span></span></span></span></span></span> 与其 <span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>f</mi><mo stretchy="false">(</mo><msup><mi>x</mi><mo>∗</mo></msup><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">f(x^\ast)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.10764em;">f</span><span class="mopen">(</span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.6887em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mbin mtight">∗</span></span></span></span></span></span></span></span><span class="mclose">)</span></span></span></span>；多目标存档（Pareto Archive）。</li>
<li><strong>个体级记忆</strong>：PSO 的个体最优、禁忌搜索的禁忌表、SA 的当前解等。</li>
<li><strong>多样性/重复检测</strong>：哈希集合、KD-Tree/LSH 近似查重。</li>
<li><strong>评价缓存（Memoization）</strong>：键为编码或解码后 <span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>x</mi></mrow><annotation encoding="application/x-tex">x</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal">x</span></span></span></span> 的哈希，值为评估结果（含方差/时间戳）。</li>
</ul>
<h3 id="步骤5-生成初始解并评价-更新记忆" tabindex="-1"><a class="header-anchor" href="#步骤5-生成初始解并评价-更新记忆"><span>步骤5：生成初始解并评价，更新记忆</span></a></h3>
<ul>
<li><strong>初始化</strong>：随机均匀采样、拉丁超立方、问题特定启发式、可行化构造。</li>
<li><strong>首轮评价</strong>：计算适应度并写入缓存；对多目标填充分布良好的初始前沿。</li>
<li><strong>更新记忆</strong>：刷新全局/个体最优、存档、统计量（均值、方差、协方差矩阵用于自适应算子）。</li>
</ul>
<h3 id="步骤6-为搜索算子选择作用对象" tabindex="-1"><a class="header-anchor" href="#步骤6-为搜索算子选择作用对象"><span>步骤6：为搜索算子选择作用对象</span></a></h3>
<ul>
<li><strong>个体选择</strong>：锦标赛、轮盘赌、排序选择、基于等级/拥挤距离的选择。</li>
<li><strong>邻域/交互选择</strong>：拓扑结构（全连通/环形/网格）、亲和度/相似度配对、精英与探索者分工。</li>
<li><strong>目标导向</strong>：利用记忆信息（如档案、领导者集）决定被操作的解子集。</li>
</ul>
<h3 id="步骤7-运用搜索算子迭代生成新解-并评价与更新记忆" tabindex="-1"><a class="header-anchor" href="#步骤7-运用搜索算子迭代生成新解-并评价与更新记忆"><span>步骤7：运用搜索算子迭代生成新解，并评价与更新记忆</span></a></h3>
<ul>
<li><strong>生成</strong>：交叉/变异（GA/DE）、速度与位置更新（PSO）、外加扰动（SA）、信息素更新（ACO）。</li>
<li><strong>约束处理</strong>：产生后立即修复/投影，或在评价时采用罚函数。</li>
<li><strong>自适应/自调参</strong>：如 CMA-ES 协方差学习、DE 的 <span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>F</mi></mrow><annotation encoding="application/x-tex">F</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.13889em;">F</span></span></span></span>/<span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>C</mi><mi>R</mi></mrow><annotation encoding="application/x-tex">CR</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.00773em;">CR</span></span></span></span> 调节、退火温度日程、学习率退火。</li>
<li><strong>评价与写回</strong>：对新解进行（去重后）评估，更新缓存与记忆；维护多样性（拥挤距离/熵度量/重采样）。</li>
<li><strong>生存选择</strong>：<span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mi>μ</mi><mo>+</mo><mi>λ</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">(\mu+\lambda)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord mathnormal">μ</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">λ</span><span class="mclose">)</span></span></span></span>、<span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mi>μ</mi><mo separator="true">,</mo><mi>λ</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">(\mu,\lambda)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord mathnormal">μ</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">λ</span><span class="mclose">)</span></span></span></span>、精英保留、年龄淘汰、档案裁剪等策略。</li>
</ul>
<h3 id="步骤8-终止判断与输出" tabindex="-1"><a class="header-anchor" href="#步骤8-终止判断与输出"><span>步骤8：终止判断与输出</span></a></h3>
<ul>
<li><strong>判据</strong>：达到最大评估次数/代数；目标函数改进停滞；达到阈值；预算/时间上限。</li>
<li><strong>输出</strong>：单目标输出当前最佳解 <span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mi>x</mi><mo>∗</mo></msup></mrow><annotation encoding="application/x-tex">x^\ast</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6887em;"></span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.6887em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mbin mtight">∗</span></span></span></span></span></span></span></span></span></span></span> 与 <span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>f</mi><mo stretchy="false">(</mo><msup><mi>x</mi><mo>∗</mo></msup><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">f(x^\ast)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.10764em;">f</span><span class="mopen">(</span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.6887em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mbin mtight">∗</span></span></span></span></span></span></span></span><span class="mclose">)</span></span></span></span>；多目标输出近似帕累托前沿及代表解集。</li>
<li><strong>可复现实验信息</strong>：随机种子、参数配置、评估次数、收敛曲线与档案。</li>
</ul>
<hr>
</div></template>


