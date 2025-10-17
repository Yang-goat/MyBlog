<template><div><h1 id="进化算法-ea" tabindex="-1"><a class="header-anchor" href="#进化算法-ea"><span>进化算法（EA）</span></a></h1>
<p>进化算法（Evolutionary Algorithm，EA） 是一类基于自然界生物进化机制的随机优化算法，属于智能优化算法的重要分支。它通过 <strong>“选择—重组—变异”</strong> 等操作，模拟自然进化过程，用来寻找复杂问题的最优或近优解。</p>
<h2 id="一、目前典型算法" tabindex="-1"><a class="header-anchor" href="#一、目前典型算法"><span>一、目前典型算法</span></a></h2>
<ul>
<li>遗传算法（GA）</li>
<li>进化策略（ES）</li>
<li>进化规划（EP）</li>
<li>遗传规划（GP）</li>
</ul>
<Mermaid id="mermaid-31" code="eJxLL0osyFDwCeJSAALH6Bf7Zz/tmfZ83fRnm6cquDrGKujq2ik4Rb9snP5kzwKosLtjLEQ1WNIZpmfttOdTlyq4BiNLukAlXyxvedoxScE1AFnSFWosVNIdKukMlnSLdvZ11IWZ5gQWc4/2C3Z31PX0hAi6gAU9oh1TEgtKMstS4ca7giU8o92LEnNzE4t0kxKLU1PA5gMAV7pTng=="></Mermaid><p>核心思想概览</p>
<table>
<thead>
<tr>
<th>算法</th>
<th>主要优化对象</th>
<th>代表特征</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>GA（遗传算法）</strong></td>
<td>通用优化问题</td>
<td>二进制编码 + 交叉为主</td>
</tr>
<tr>
<td><strong>ES（进化策略）</strong></td>
<td>连续优化问题</td>
<td>实数编码 + 高斯变异 + 自适应步长</td>
</tr>
<tr>
<td><strong>EP（进化规划）</strong></td>
<td>状态机与连续优化</td>
<td>无交叉 + 自适应变异 + 竞争选择</td>
</tr>
<tr>
<td><strong>GP（遗传规划）</strong></td>
<td>程序/表达式结构</td>
<td>树结构编码 + 子树交叉 + 自动生成程序</td>
</tr>
</tbody>
</table>
<p>结构与操作机制对比</p>
<table>
<thead>
<tr>
<th>特征</th>
<th>GA</th>
<th>ES</th>
<th>EP</th>
<th>GP</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>编码方式</strong></td>
<td>二进制/实数向量</td>
<td>实数向量</td>
<td>实数向量</td>
<td>树结构（表达式）</td>
</tr>
<tr>
<td><strong>适用问题</strong></td>
<td>离散/组合优化</td>
<td>连续优化</td>
<td>连续优化/噪声优化</td>
<td>程序、表达式生成</td>
</tr>
<tr>
<td><strong>种群规模</strong></td>
<td>中</td>
<td>小-中</td>
<td>小</td>
<td>中</td>
</tr>
<tr>
<td><strong>主要算子</strong></td>
<td>交叉 + 变异</td>
<td>变异（高斯噪声）</td>
<td>变异（高斯噪声）</td>
<td>子树交叉 + 变异</td>
</tr>
<tr>
<td><strong>交叉操作</strong></td>
<td>关键操作</td>
<td>可选</td>
<td>无</td>
<td>树级交叉（核心）</td>
</tr>
<tr>
<td><strong>变异操作</strong></td>
<td>位翻转 / 实数扰动</td>
<td>高斯扰动（含自适应）</td>
<td>高斯扰动（含自适应）</td>
<td>子树替换</td>
</tr>
<tr>
<td><strong>选择策略</strong></td>
<td>轮盘赌 / 锦标赛</td>
<td>(μ, λ) 或 (μ+λ)</td>
<td>随机竞争</td>
<td>轮盘赌 / 精英保留</td>
</tr>
<tr>
<td><strong>参数自适应</strong></td>
<td>弱（人工设定）</td>
<td>强（全局 + 局部）</td>
<td>强（个体自适应）</td>
<td>无固定参数，可自动学习结构</td>
</tr>
<tr>
<td><strong>编码层级</strong></td>
<td>基因层</td>
<td>参数层</td>
<td>个体层</td>
<td>结构层</td>
</tr>
</tbody>
</table>
<p>典型应用领域对比</p>
<table>
<thead>
<tr>
<th>特征</th>
<th>GA</th>
<th>ES</th>
<th>EP</th>
<th>GP</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>编码方式</strong></td>
<td>二进制/实数向量</td>
<td>实数向量</td>
<td>实数向量</td>
<td>树结构（表达式）</td>
</tr>
<tr>
<td><strong>适用问题</strong></td>
<td>离散/组合优化</td>
<td>连续优化</td>
<td>连续优化/噪声优化</td>
<td>程序、表达式生成</td>
</tr>
<tr>
<td><strong>种群规模</strong></td>
<td>中</td>
<td>小-中</td>
<td>小</td>
<td>中</td>
</tr>
<tr>
<td><strong>主要算子</strong></td>
<td>交叉 + 变异</td>
<td>变异（高斯噪声）</td>
<td>变异（高斯噪声）</td>
<td>子树交叉 + 变异</td>
</tr>
<tr>
<td><strong>交叉操作</strong></td>
<td>关键操作</td>
<td>可选</td>
<td>无</td>
<td>树级交叉（核心）</td>
</tr>
<tr>
<td><strong>变异操作</strong></td>
<td>位翻转 / 实数扰动</td>
<td>高斯扰动（含自适应）</td>
<td>高斯扰动（含自适应）</td>
<td>子树替换</td>
</tr>
<tr>
<td><strong>选择策略</strong></td>
<td>轮盘赌 / 锦标赛</td>
<td>(μ, λ) 或 (μ+λ)</td>
<td>随机竞争</td>
<td>轮盘赌 / 精英保留</td>
</tr>
<tr>
<td><strong>参数自适应</strong></td>
<td>弱（人工设定）</td>
<td>强（全局 + 局部）</td>
<td>强（个体自适应）</td>
<td>无固定参数，可自动学习结构</td>
</tr>
<tr>
<td><strong>编码层级</strong></td>
<td>基因层</td>
<td>参数层</td>
<td>个体层</td>
<td>结构层</td>
</tr>
</tbody>
</table>
<h2 id="二、遗传算法-ga" tabindex="-1"><a class="header-anchor" href="#二、遗传算法-ga"><span>二、遗传算法（GA）</span></a></h2>
<p>遗传算法（Genetic Algorithm, GA）是一种基于 <strong>达尔文进化论</strong> 和 <strong>遗传学原理</strong> 的随机优化方法。<br>
它通过<strong>自然选择、交叉与变异</strong>等操作，在问题解空间中不断进化，最终获得最优或近似最优解。</p>
<h3 id="_2-1-基本思想" tabindex="-1"><a class="header-anchor" href="#_2-1-基本思想"><span>2.1 基本思想</span></a></h3>
<p>GA 的核心思想是：</p>
<div class="hint-container info">
<p class="hint-container-title">生物启发</p>
<p>“适者生存，优胜劣汰。”</p>
</div>
<p>通过模拟生物的进化过程（选择、交叉、变异），遗传算法不断优化个体的适应度，从而逼近全局最优解。</p>
<h3 id="_2-2-算法流程" tabindex="-1"><a class="header-anchor" href="#_2-2-算法流程"><span>2.2 算法流程</span></a></h3>
<p>遗传算法的基本执行过程如下：</p>
<ol>
<li>
<p><strong>初始化种群</strong><br>
随机生成若干个个体（候选解），形成初始种群。</p>
</li>
<li>
<p><strong>适应度评价</strong><br>
使用目标函数计算每个个体的适应度值。</p>
</li>
<li>
<p><strong>选择操作（Selection）</strong><br>
根据适应度值，选择优秀个体进入下一代（常用轮盘赌、锦标赛等方法）。</p>
</li>
<li>
<p><strong>交叉操作（Crossover）</strong><br>
模拟基因重组，将两个个体的信息交换生成新个体。</p>
</li>
<li>
<p><strong>变异操作（Mutation）</strong><br>
模拟基因突变，对个体的部分基因随机改变，以维持种群多样性。</p>
</li>
<li>
<p><strong>终止条件判断</strong><br>
若达到最大代数或适应度收敛，则终止算法，输出最优解。</p>
</li>
</ol>
<hr>
<h3 id="_2-3-算法流程图" tabindex="-1"><a class="header-anchor" href="#_2-3-算法流程图"><span>2.3 算法流程图</span></a></h3>
<Mermaid id="mermaid-516" code="eJxLy8kvT85ILCpRCHHhUgACx+inHXOfLu9+2jPt+fLe5/uWxCro6topOEW/WLfw+brpLxuanu6a8nTXsliwaiewpHP1sxnrn05Y9mz3whfbNj/f3fFs7aJncxc+2b3NvhaszBmoTAGoAKzaJfplQ+ez7pXPJvc+2TsHYo4LWMY1+smuJU/7O5FlXMEybtFP+2c83dOELOMGlnGPfj5l/rOOCc+mbYC6FyzpDnE1wnagC8FCHtEv9k1+2r7r2ZyGJ3tmvFi+OJYLAEgsdVc="></Mermaid><h3 id="_2-4-伪代码示例" tabindex="-1"><a class="header-anchor" href="#_2-4-伪代码示例"><span>2.4 伪代码示例</span></a></h3>
<div class="language-" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-"><span class="line"><span>Algorithm GeneticAlgorithm</span></span>
<span class="line"><span>Input: 种群规模 N, 最大迭代次数 T, 交叉概率 Pc, 变异概率 Pm</span></span>
<span class="line"><span>Output: 最优个体 best</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1: 初始化种群 P(0)</span></span>
<span class="line"><span>2: 计算每个个体的适应度 f(x)</span></span>
<span class="line"><span>3: t ← 0</span></span>
<span class="line"><span>4: while t &#x3C; T do</span></span>
<span class="line"><span>5:     选择操作：从 P(t) 中按适应度选择个体</span></span>
<span class="line"><span>6:     交叉操作：以概率 Pc 对个体进行交叉，生成新个体</span></span>
<span class="line"><span>7:     变异操作：以概率 Pm 对个体进行基因突变</span></span>
<span class="line"><span>8:     计算新个体的适应度</span></span>
<span class="line"><span>9:     更新种群 P(t+1)</span></span>
<span class="line"><span>10:    t ← t + 1</span></span>
<span class="line"><span>11: end while</span></span>
<span class="line"><span>12: 返回最优个体 best</span></span></code></pre>
</div><h3 id="_2-5-关键操作详解" tabindex="-1"><a class="header-anchor" href="#_2-5-关键操作详解"><span>2.5 关键操作详解</span></a></h3>
<h4 id="_2-5-1-编码方式-encoding" tabindex="-1"><a class="header-anchor" href="#_2-5-1-编码方式-encoding"><span>2.5.1 编码方式（Encoding）</span></a></h4>
<p>遗传算法首先要将问题的解空间映射为基因序列，不同编码方式适用于不同类型的问题：</p>
<table>
<thead>
<tr>
<th>编码类型</th>
<th>表示方式</th>
<th>适用场景</th>
<th>示例</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>二进制编码</strong></td>
<td>用 <code v-pre>0</code> 和 <code v-pre>1</code> 表示</td>
<td>组合优化、离散问题</td>
<td><code v-pre>101001</code></td>
</tr>
<tr>
<td><strong>实数编码</strong></td>
<td>直接用浮点数表示基因</td>
<td>连续优化问题</td>
<td><code v-pre>[1.2, 3.5, 0.9]</code></td>
</tr>
<tr>
<td><strong>符号或树结构编码</strong></td>
<td>表达式或树状结构</td>
<td>程序进化（GP）</td>
<td><code v-pre>(x + sin(y))</code></td>
</tr>
</tbody>
</table>
<div class="hint-container tip">
<p class="hint-container-title">说明</p>
<p>二进制编码是经典方法，易实现；实数编码更高效且避免了量化误差。</p>
</div>
<h4 id="_2-5-2-适应度函数-fitness-function" tabindex="-1"><a class="header-anchor" href="#_2-5-2-适应度函数-fitness-function"><span>2.5.2 适应度函数（Fitness Function）</span></a></h4>
<p>适应度函数用于衡量个体的优劣，即“生存能力”。</p>
<p v-pre class='katex-block'><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mi>F</mi><mi>i</mi><mi>t</mi><mi>n</mi><mi>e</mi><mi>s</mi><mi>s</mi><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo><mo>=</mo><mfrac><mn>1</mn><mrow><mn>1</mn><mo>+</mo><mi>f</mi><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo></mrow></mfrac></mrow><annotation encoding="application/x-tex">Fitness(x) = \frac{1}{1+f(x)}
</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.13889em;">F</span><span class="mord mathnormal">i</span><span class="mord mathnormal">t</span><span class="mord mathnormal">n</span><span class="mord mathnormal">ess</span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:2.2574em;vertical-align:-0.936em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.3214em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">1</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord mathnormal" style="margin-right:0.10764em;">f</span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mclose">)</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.936em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></span></p>
<p>或直接使用目标函数值（取决于是<strong>最小化</strong>还是<strong>最大化</strong>问题）。</p>
<div class="hint-container tip">
<p class="hint-container-title">设计技巧</p>
<ul>
<li>最小化问题：可用 1 / (1 + f(x)) 转化为最大化形式</li>
<li>归一化处理：确保不同量纲的变量能公平比较</li>
<li>惩罚函数法：对不满足约束的个体降低适应度</li>
</ul>
</div>
<h4 id="_2-5-3-选择操作-selection" tabindex="-1"><a class="header-anchor" href="#_2-5-3-选择操作-selection"><span>2.5.3 选择操作（Selection）</span></a></h4>
<p>目标：保留优秀个体，让其基因得以延续。<br>
常用方法如下：</p>
<table>
<thead>
<tr>
<th>方法</th>
<th>原理</th>
<th>特点</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>轮盘赌选择</strong></td>
<td>按适应度比例随机选取</td>
<td>实现简单，但可能早熟</td>
</tr>
<tr>
<td><strong>锦标赛选择</strong></td>
<td>随机抽取若干个体进行比较，选最优</td>
<td>控制选择压力方便</td>
</tr>
<tr>
<td><strong>排序选择</strong></td>
<td>按排名分配选择概率</td>
<td>稳定性好，防止过快收敛</td>
</tr>
</tbody>
</table>
<div class="hint-container info">
<p class="hint-container-title">小技巧</p>
<p>锦标赛选择（Tournament Selection）在现代 GA 中最常用，兼顾多样性与选择效率。</p>
</div>
<h4 id="_2-5-4-交叉操作-crossover" tabindex="-1"><a class="header-anchor" href="#_2-5-4-交叉操作-crossover"><span>2.5.4 交叉操作（Crossover）</span></a></h4>
<p>交叉是产生新解的主要手段，模拟生物基因的重组过程。<br>
它决定了算法的“探索能力”。</p>
<p>常见交叉算子：</p>
<table>
<thead>
<tr>
<th>算法类型</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>单点交叉</strong></td>
<td>随机选一点交换两段基因</td>
</tr>
<tr>
<td><strong>双点交叉</strong></td>
<td>选择两个点，交换中间部分</td>
</tr>
<tr>
<td><strong>均匀交叉</strong></td>
<td>按概率交换每个位</td>
</tr>
</tbody>
</table>
<div class="hint-container tip">
<p class="hint-container-title">参数建议</p>
<p>交叉概率 <span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>P</mi><mi>c</mi></msub></mrow><annotation encoding="application/x-tex">P_c</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8333em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.13889em;">P</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.1514em;"><span style="top:-2.55em;margin-left:-0.1389em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">c</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span> 一般取 0.6~0.9。<br>
过低 → 搜索缓慢；过高 → 稳定性下降。</p>
</div>
<h4 id="_2-5-5-变异操作-mutation" tabindex="-1"><a class="header-anchor" href="#_2-5-5-变异操作-mutation"><span>2.5.5 变异操作（Mutation）</span></a></h4>
<p>变异用于维持种群的多样性，防止陷入局部最优。</p>
<p>常见变异算子：</p>
<table>
<thead>
<tr>
<th>算法类型</th>
<th>原理</th>
<th>示例</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>位翻转变异（Binary Mutation）</strong></td>
<td>将某个基因 <code v-pre>0→1</code> 或 <code v-pre>1→0</code></td>
<td><code v-pre>1010 → 1110</code></td>
</tr>
<tr>
<td><strong>随机扰动（Real-valued Mutation）</strong></td>
<td>在实数基因上加随机微小噪声</td>
<td><code v-pre>3.45 → 3.47</code></td>
</tr>
<tr>
<td><strong>非均匀变异</strong></td>
<td>随迭代次数减小变异范围</td>
<td>适合精细搜索</td>
</tr>
</tbody>
</table>
<div class="hint-container tip">
<p class="hint-container-title">参数建议</p>
<p>变异概率 <span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>P</mi><mi>m</mi></msub></mrow><annotation encoding="application/x-tex">P_m</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8333em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.13889em;">P</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.1514em;"><span style="top:-2.55em;margin-left:-0.1389em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">m</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span> 一般取 0.01~0.1，太高会破坏优秀基因。</p>
</div>
<h4 id="_2-5-6-精英策略-elitism" tabindex="-1"><a class="header-anchor" href="#_2-5-6-精英策略-elitism"><span>2.5.6 精英策略（Elitism）</span></a></h4>
<p>为防止最优个体丢失，可在每一代保留适应度最高的若干个体直接进入下一代。<br>
这能显著提高算法稳定性和收敛性能。</p>
<h3 id="_2-6-常见变种" tabindex="-1"><a class="header-anchor" href="#_2-6-常见变种"><span>2.6 常见变种</span></a></h3>
<table>
<thead>
<tr>
<th>方法</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>自适应 GA</strong></td>
<td>动态调整交叉与变异概率</td>
</tr>
<tr>
<td><strong>混合 GA</strong></td>
<td>与局部搜索算法结合（如模拟退火）</td>
</tr>
<tr>
<td><strong>并行 GA</strong></td>
<td>利用多个子种群并行进化</td>
</tr>
<tr>
<td><strong>多目标 GA（NSGA-II）</strong></td>
<td>处理多目标优化问题</td>
</tr>
</tbody>
</table>
<h3 id="_2-7-优缺点" tabindex="-1"><a class="header-anchor" href="#_2-7-优缺点"><span>2.7 优缺点</span></a></h3>
<table>
<thead>
<tr>
<th>优点</th>
<th>缺点</th>
</tr>
</thead>
<tbody>
<tr>
<td>不依赖梯度信息</td>
<td>收敛速度较慢</td>
</tr>
<tr>
<td>全局搜索能力强</td>
<td>参数设置敏感</td>
</tr>
<tr>
<td>适用于复杂非线性问题</td>
<td>易陷入早熟收敛</td>
</tr>
<tr>
<td>易与其他算法结合</td>
<td>计算开销较大</td>
</tr>
</tbody>
</table>
<h2 id="三、进化策略-evolution-strategy-es" tabindex="-1"><a class="header-anchor" href="#三、进化策略-evolution-strategy-es"><span>三、进化策略（Evolution Strategy, ES）</span></a></h2>
<p>进化策略（Evolution Strategy, ES）是一类基于<strong>自然进化原理</strong>的优化算法，<br>
与遗传算法（GA）同属进化计算（EA）范畴。</p>
<p>ES 最初由德国学者 <strong>Ingo Rechenberg</strong> 和 <strong>Hans-Paul Schwefel</strong> 在 1960s 年代提出，<br>
主要用于<strong>连续参数优化问题</strong>，后来发展出多种形式（如 <span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mn>1</mn><mo>+</mo><mn>1</mn><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">(1+1)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord">1</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">1</span><span class="mclose">)</span></span></span></span>-ES、<span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mi>μ</mi><mo separator="true">,</mo><mi>λ</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">(μ,λ)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord mathnormal">μ</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">λ</span><span class="mclose">)</span></span></span></span>-ES、CMA-ES 等）。</p>
<hr>
<h3 id="_3-1-算法基本思想" tabindex="-1"><a class="header-anchor" href="#_3-1-算法基本思想"><span>3.1 算法基本思想</span></a></h3>
<div class="hint-container info">
<p class="hint-container-title">生物启发</p>
<p>进化策略强调“<strong>变异驱动搜索、选择引导进化</strong>”的思想。<br>
它模拟生物群体中个体通过<strong>随机变异</strong>、<strong>自然选择</strong>逐步适应环境的过程。</p>
</div>
<p>与遗传算法不同，ES 更注重：</p>
<ul>
<li><strong>个体自适应能力</strong>：每个个体可携带自身的“变异步长”参数；</li>
<li><strong>连续搜索空间</strong>：适合实数优化；</li>
<li><strong>无交叉或弱交叉机制</strong>：主要依靠变异与选择。</li>
</ul>
<hr>
<h3 id="_3-2-算法总体流程" tabindex="-1"><a class="header-anchor" href="#_3-2-算法总体流程"><span>3.2 算法总体流程</span></a></h3>
<Mermaid id="mermaid-949" code="eJxdj8FKw0AQhu99itBTe+grKLZp6wN4W3IQQTwIgggeRAi9mFqDgdQYocXGaIOVpAUhajbt0+zMJqe+gstuodA5zv99wz+n5xfXJ2fHl1fakV7RxBzUCFhjiAbw4PHI5qt3o641GntakxRJwJNn9jtjS7c0e5ANIZsa0mpKpEVw8od2wmOPP32UZh8Hn9xKGQ0V1ZKUTqrw6EPeQ9dmy9E6t/CHwv2k/PLRm8PLDMLFOu9XlaNLp0348BUtB2JHXFMVVN6WeWdTDr3FTrOOzLs36M/BmSINivSbUwvjNxwHjKb7txLrCkwTgPpjuxKaXB3WSLFy4S7Dkclyv4hCo175B6VKm84="></Mermaid><h3 id="_3-3-伪代码示例" tabindex="-1"><a class="header-anchor" href="#_3-3-伪代码示例"><span>3.3 伪代码示例</span></a></h3>
<div class="language-" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-"><span class="line"><span>Algorithm EvolutionStrategy</span></span>
<span class="line"><span>Input: 种群规模 μ, 子代数量 λ, 最大代数 T</span></span>
<span class="line"><span>Output: 最优个体 best</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1: 初始化 μ 个个体 Xi 及其步长 σi</span></span>
<span class="line"><span>2: for t = 1 to T do</span></span>
<span class="line"><span>3:     选择 μ 个父代</span></span>
<span class="line"><span>4:     对每个父代进行变异，生成 λ 个子代：</span></span>
<span class="line"><span>           X' = X + σ * N(0, I)</span></span>
<span class="line"><span>           σ' = σ * exp(τ * N(0,1))</span></span>
<span class="line"><span>5:     计算所有个体的适应度</span></span>
<span class="line"><span>6:     根据策略选择新一代：</span></span>
<span class="line"><span>           - (μ, λ)-ES：从子代中选前 μ 个最优</span></span>
<span class="line"><span>           - (μ + λ)-ES：从父代与子代中选前 μ 个最优</span></span>
<span class="line"><span>7: end for</span></span>
<span class="line"><span>8: 输出最优解 best</span></span></code></pre>
</div><h3 id="_3-4-关键机制详解" tabindex="-1"><a class="header-anchor" href="#_3-4-关键机制详解"><span>3.4 关键机制详解</span></a></h3>
<h4 id="_3-4-1-个体表示-representation" tabindex="-1"><a class="header-anchor" href="#_3-4-1-个体表示-representation"><span>3.4.1 个体表示（Representation）</span></a></h4>
<p>每个个体由两部分组成：</p>
<p v-pre class='katex-block'><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><msub><mi>X</mi><mi>i</mi></msub><mo>=</mo><mo stretchy="false">(</mo><msub><mi mathvariant="bold">x</mi><mi>i</mi></msub><mo separator="true">,</mo><msub><mi>σ</mi><mi>i</mi></msub><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">X_i=(\mathbf{x}_i, \sigma_i)
</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8333em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.07847em;">X</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:-0.0785em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord"><span class="mord mathbf">x</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.03588em;">σ</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:-0.0359em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mclose">)</span></span></span></span></span></p>
<ul>
<li><span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi mathvariant="bold">x</mi><mi>i</mi></msub></mrow><annotation encoding="application/x-tex">\mathbf{x}_i</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.5944em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathbf">x</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span>：解向量（即问题的变量）</li>
<li><span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mi>σ</mi><mi>i</mi></msub></mrow><annotation encoding="application/x-tex">\sigma_i</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.5806em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.03588em;">σ</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:-0.0359em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span>：变异强度（步长），控制搜索尺度</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">提示</p>
<p>相比 GA，ES 中的个体同时携带自适应参数（σ），<br>
使得搜索范围可自动调整。</p>
</div>
<h4 id="_3-4-2-变异操作-mutation" tabindex="-1"><a class="header-anchor" href="#_3-4-2-变异操作-mutation"><span>3.4.2 变异操作（Mutation）</span></a></h4>
<p>变异是 ES 的核心。<br>
通过在个体上添加高斯噪声来生成新解：</p>
<p v-pre class='katex-block'><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><msup><mi mathvariant="bold">x</mi><mo mathvariant="bold" lspace="0em" rspace="0em">′</mo></msup><mo>=</mo><mi mathvariant="bold">x</mi><mo>+</mo><mi>σ</mi><mo>⋅</mo><mi>N</mi><mo stretchy="false">(</mo><mn>0</mn><mo separator="true">,</mo><mn>1</mn><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">\mathbf{x&#x27;} = \mathbf{x}+\sigma\cdot N(0,1)
</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8019em;"></span><span class="mord"><span class="mord mathbf">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8019em;"><span style="top:-3.113em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathbf mtight">′</span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6667em;vertical-align:-0.0833em;"></span><span class="mord mathbf">x</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.4445em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">σ</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">⋅</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.10903em;">N</span><span class="mopen">(</span><span class="mord">0</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord">1</span><span class="mclose">)</span></span></span></span></span></p>
<p>步长 <span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>σ</mi></mrow><annotation encoding="application/x-tex">\sigma</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">σ</span></span></span></span> 也进行自适应调整：</p>
<p v-pre class='katex-block'><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><msup><mi>σ</mi><mo mathvariant="normal" lspace="0em" rspace="0em">′</mo></msup><mo>=</mo><mi>σ</mi><mo>⋅</mo><msup><mi>e</mi><mrow><msup><mi>τ</mi><mo mathvariant="normal" lspace="0em" rspace="0em">′</mo></msup><mo>⋅</mo><mi>N</mi><mo stretchy="false">(</mo><mn>0</mn><mo separator="true">,</mo><mn>1</mn><mo stretchy="false">)</mo><mo>+</mo><mi>τ</mi><mo>⋅</mo><msub><mi>N</mi><mi>i</mi></msub><mo stretchy="false">(</mo><mn>0</mn><mo separator="true">,</mo><mn>1</mn><mo stretchy="false">)</mo></mrow></msup></mrow><annotation encoding="application/x-tex">\sigma&#x27; = \sigma\cdot e^{\tau&#x27;\cdot N(0,1)+\tau\cdot N_i(0,1)}
</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8019em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.03588em;">σ</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8019em;"><span style="top:-3.113em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">′</span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.4445em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">σ</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">⋅</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.9925em;"></span><span class="mord"><span class="mord mathnormal">e</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.9925em;"><span style="top:-3.113em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1132em;">τ</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8278em;"><span style="top:-2.931em;margin-right:0.0714em;"><span class="pstrut" style="height:2.5em;"></span><span class="sizing reset-size3 size1 mtight"><span class="mord mtight"><span class="mord mtight">′</span></span></span></span></span></span></span></span></span><span class="mbin mtight">⋅</span><span class="mord mathnormal mtight" style="margin-right:0.10903em;">N</span><span class="mopen mtight">(</span><span class="mord mtight">0</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span><span class="mclose mtight">)</span><span class="mbin mtight">+</span><span class="mord mathnormal mtight" style="margin-right:0.1132em;">τ</span><span class="mbin mtight">⋅</span><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.10903em;">N</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3281em;"><span style="top:-2.357em;margin-left:-0.109em;margin-right:0.0714em;"><span class="pstrut" style="height:2.5em;"></span><span class="sizing reset-size3 size1 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.143em;"><span></span></span></span></span></span></span><span class="mopen mtight">(</span><span class="mord mtight">0</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span><span class="mclose mtight">)</span></span></span></span></span></span></span></span></span></span></span></span></span></p>
<p>其中：</p>
<ul>
<li><span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mi>τ</mi><mo mathvariant="normal" lspace="0em" rspace="0em">′</mo></msup><mo separator="true">,</mo><mi>τ</mi></mrow><annotation encoding="application/x-tex">\tau&#x27;, \tau</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.9463em;vertical-align:-0.1944em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.1132em;">τ</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.7519em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">′</span></span></span></span></span></span></span></span></span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.1132em;">τ</span></span></span></span> 为学习率参数；</li>
<li><span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>N</mi><mo stretchy="false">(</mo><mn>0</mn><mo separator="true">,</mo><mn>1</mn><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">N(0,1)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.10903em;">N</span><span class="mopen">(</span><span class="mord">0</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord">1</span><span class="mclose">)</span></span></span></span> 为标准正态随机变量；</li>
<li><span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>n</mi></mrow><annotation encoding="application/x-tex">n</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal">n</span></span></span></span> 为问题维度。</li>
</ul>
<div class="hint-container info">
<p class="hint-container-title">相关信息</p>
<p>这种“自适应步长变异”机制使算法能自动学习合适的搜索范围，<br>
早期粗略搜索、后期精细探索。</p>
</div>
<h4 id="_3-4-3-选择策略-selection" tabindex="-1"><a class="header-anchor" href="#_3-4-3-选择策略-selection"><span>3.4.3 选择策略（Selection）</span></a></h4>
<p>ES 常见两种选择模型：</p>
<table>
<thead>
<tr>
<th>策略</th>
<th>说明</th>
<th>特点</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong><span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mi>μ</mi><mo separator="true">,</mo><mi>λ</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">(μ, λ)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord mathnormal">μ</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">λ</span><span class="mclose">)</span></span></span></span>-ES</strong></td>
<td>从 λ 个子代中选出最优的 μ 个个体</td>
<td>强选择压力，探索性强</td>
</tr>
<tr>
<td><strong><span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mi>μ</mi><mo>+</mo><mi>λ</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">(μ + λ)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord mathnormal">μ</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">λ</span><span class="mclose">)</span></span></span></span>-ES</strong></td>
<td>从父代与子代共 <span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mi>μ</mi><mo>+</mo><mi>λ</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">(μ+λ)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord mathnormal">μ</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">λ</span><span class="mclose">)</span></span></span></span> 个体中选最优的 μ 个</td>
<td>保留精英个体，收敛更稳</td>
</tr>
</tbody>
</table>
<div class="hint-container tip">
<p class="hint-container-title">提示</p>
<ul>
<li><span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mi>μ</mi><mo separator="true">,</mo><mi>λ</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">(μ, λ)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord mathnormal">μ</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">λ</span><span class="mclose">)</span></span></span></span> 模式 → 适合探索性问题</li>
<li><span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo stretchy="false">(</mo><mi>μ</mi><mo>+</mo><mi>λ</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">(μ + λ)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord mathnormal">μ</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">λ</span><span class="mclose">)</span></span></span></span> 模式 → 适合需要保留优秀个体的情况</li>
</ul>
</div>
<h4 id="_3-4-4-重组操作-recombination-可选" tabindex="-1"><a class="header-anchor" href="#_3-4-4-重组操作-recombination-可选"><span>3.4.4 重组操作（Recombination, 可选）</span></a></h4>
<p>尽管 ES 主要依靠变异，但也可使用简单的“重组”操作：</p>
<ul>
<li>中值重组（Intermediate）<br>
<span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msup><mi mathvariant="bold">x</mi><mo mathvariant="bold" lspace="0em" rspace="0em">′</mo></msup><mo>=</mo><mfrac><mn>1</mn><mi>μ</mi></mfrac><msubsup><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>μ</mi></msubsup><msub><mi mathvariant="bold">x</mi><mi mathvariant="bold">i</mi></msub></mrow><annotation encoding="application/x-tex">\mathbf{x&#x27;}=\frac{1}{\mu}\sum^\mu_{i=1}\mathbf{x_i}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7519em;"></span><span class="mord"><span class="mord mathbf">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.7519em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathbf mtight">′</span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1.3262em;vertical-align:-0.4811em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8451em;"><span style="top:-2.655em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">μ</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.394em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.4811em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mop"><span class="mop op-symbol small-op" style="position:relative;top:0em;">∑</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8043em;"><span style="top:-2.4003em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">i</span><span class="mrel mtight">=</span><span class="mord mtight">1</span></span></span></span><span style="top:-3.2029em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">μ</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.2997em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord"><span class="mord mathbf">x</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3361em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathbf mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span></span></span></span></li>
<li>离散重组（Discrete）<br>
每个维度随机从不同父代中取值。</li>
</ul>
<p>作用：<strong>融合多个父代信息，提高搜索质量</strong>。</p>
<h3 id="_3-5-常见变种" tabindex="-1"><a class="header-anchor" href="#_3-5-常见变种"><span>3.5 常见变种</span></a></h3>
<table>
<thead>
<tr>
<th>算法</th>
<th>含义</th>
<th>特点</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>(1+1)-ES</strong></td>
<td>单父单子进化策略</td>
<td>简单、理论分析充分</td>
</tr>
<tr>
<td><strong>(μ,λ)-ES</strong></td>
<td>多父多子策略</td>
<td>群体搜索能力强</td>
</tr>
<tr>
<td><strong>CMA-ES</strong></td>
<td>协方差矩阵自适应 ES</td>
<td>自动学习搜索方向，性能最强</td>
</tr>
<tr>
<td><strong>Self-Adaptive ES</strong></td>
<td>自适应进化策略</td>
<td>步长参数自动调整</td>
</tr>
</tbody>
</table>
<h3 id="_3-6-优缺点" tabindex="-1"><a class="header-anchor" href="#_3-6-优缺点"><span>3.6 优缺点</span></a></h3>
<table>
<thead>
<tr>
<th>优点</th>
<th>缺点</th>
</tr>
</thead>
<tbody>
<tr>
<td>适合连续优化问题</td>
<td>不适用于离散问题</td>
</tr>
<tr>
<td>参数自适应能力强</td>
<td>参数设置相对复杂</td>
</tr>
<tr>
<td>理论分析成熟</td>
<td>计算代价较高</td>
</tr>
<tr>
<td>收敛平稳稳定</td>
<td>可能陷入局部极值</td>
</tr>
</tbody>
</table>
<h2 id="四、进化规划-evolutionary-programming-ep" tabindex="-1"><a class="header-anchor" href="#四、进化规划-evolutionary-programming-ep"><span>四、进化规划（Evolutionary Programming, EP）</span></a></h2>
<p>进化规划（Evolutionary Programming, EP）是<strong>进化算法家族</strong>中的重要成员，<br>
由美国学者 <strong>Lawrence J. Fogel</strong> 在 1960 年代提出，<br>
最初用于<strong>自动生成有限状态机</strong>，后来扩展为一种<strong>通用连续优化算法</strong>。</p>
<h3 id="_4-1-算法基本思想" tabindex="-1"><a class="header-anchor" href="#_4-1-算法基本思想"><span>4.1 算法基本思想</span></a></h3>
<div class="hint-container info">
<p class="hint-container-title">生物启发</p>
<p>EP 模拟生物在进化过程中个体<strong>变异与选择</strong>的自然过程，<br>
核心思想是：</p>
<blockquote>
<p>“随机变异 + 竞争选择 = 逐步适应环境。”</p>
</blockquote>
</div>
<p>与 GA、ES 的主要区别：</p>
<table>
<thead>
<tr>
<th>对比项</th>
<th>遗传算法（GA）</th>
<th>进化策略（ES）</th>
<th>进化规划（EP）</th>
</tr>
</thead>
<tbody>
<tr>
<td>编码</td>
<td>二进制/实数</td>
<td>实数</td>
<td>实数</td>
</tr>
<tr>
<td>核心操作</td>
<td>交叉 + 变异</td>
<td>变异</td>
<td>变异</td>
</tr>
<tr>
<td>选择机制</td>
<td>适应度比例</td>
<td>排序/淘汰</td>
<td>随机竞争（tournament）</td>
</tr>
<tr>
<td>自适应性</td>
<td>弱</td>
<td>强（步长自适应）</td>
<td>强（变异参数自学习）</td>
</tr>
</tbody>
</table>
<hr>
<h3 id="_4-2-算法流程图" tabindex="-1"><a class="header-anchor" href="#_4-2-算法流程图"><span>4.2 算法流程图</span></a></h3>
<Mermaid id="mermaid-1312" code="eJxdj0FKw0AUhvc9RciqXfQKim3aegB3QxYiiAtBEMGFCKEITlprAyk1SKvGSqOWNoIQNUl7mnlvklWv4HSmUOgwq/d/3/t5x6dnl0cnh+cX2oFR0MTbKxKgQwjacNfnQYcv3sySVi7vaBWSzXw+e8Cwy34/V3/u8seb3GpC3IN4bEq9Itkq0aHrQdpEt8Pmg2VK8SeB1ks+8bAfov0FrfdlauvKqUrHILz3jNSBqcOSkdqvckPmtXW/yrdqaxKpE51Pnlhs55aN7Q9Ry2kkl90rC8I/pN6muS61xhV6IThjTPws+uYJxekrDn2WRLvXEmsITBOAum0zEpoc7RdJtnDhNsaBxVIvC0ZmqfAPOnCvgw=="></Mermaid><h3 id="_4-3-伪代码示例" tabindex="-1"><a class="header-anchor" href="#_4-3-伪代码示例"><span>4.3 伪代码示例</span></a></h3>
<div class="language-" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-"><span class="line"><span>Algorithm EvolutionaryProgramming</span></span>
<span class="line"><span>Input: 种群规模 N, 最大代数 T</span></span>
<span class="line"><span>Output: 最优个体 best</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1: 初始化种群 Xi 及其变异参数 σi</span></span>
<span class="line"><span>2: 计算每个个体的适应度 f(Xi)</span></span>
<span class="line"><span>3: for t = 1 to T do</span></span>
<span class="line"><span>4:     for each Xi do</span></span>
<span class="line"><span>5:         生成子代 Yi：</span></span>
<span class="line"><span>                Yi = Xi + σi * N(0, 1)</span></span>
<span class="line"><span>                σi' = σi * exp(τ * N(0,1))</span></span>
<span class="line"><span>6:     计算所有子代适应度 f(Yi)</span></span>
<span class="line"><span>7:     将父代与子代合并</span></span>
<span class="line"><span>8:     使用随机锦标赛选择 N 个最优个体组成新种群</span></span>
<span class="line"><span>9: end for</span></span>
<span class="line"><span>10: 返回最优解 best</span></span></code></pre>
</div><h3 id="_4-4-关键机制详解" tabindex="-1"><a class="header-anchor" href="#_4-4-关键机制详解"><span>4.4 关键机制详解</span></a></h3>
<h4 id="_4-4-1-个体表示-representation" tabindex="-1"><a class="header-anchor" href="#_4-4-1-个体表示-representation"><span>4.4.1 个体表示（Representation）</span></a></h4>
<p>同ES：</p>
<p v-pre class='katex-block'><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><msub><mi>X</mi><mi>i</mi></msub><mo>=</mo><mo stretchy="false">(</mo><msub><mi mathvariant="bold">x</mi><mi>i</mi></msub><mo separator="true">,</mo><msub><mi>σ</mi><mi>i</mi></msub><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">X_i=(\mathbf{x}_i, \sigma_i)
</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8333em;vertical-align:-0.15em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.07847em;">X</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:-0.0785em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord"><span class="mord mathbf">x</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.03588em;">σ</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:-0.0359em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mclose">)</span></span></span></span></span></p>
<h4 id="_4-4-2-变异操作-mutation" tabindex="-1"><a class="header-anchor" href="#_4-4-2-变异操作-mutation"><span>4.4.2 变异操作（Mutation）</span></a></h4>
<p>EP 的搜索主要靠变异进行：</p>
<p v-pre class='katex-block'><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><msup><mi mathvariant="bold">x</mi><mo mathvariant="bold" lspace="0em" rspace="0em">′</mo></msup><mo>=</mo><mi mathvariant="bold">x</mi><mo>+</mo><mi>σ</mi><mo>⋅</mo><mi>N</mi><mo stretchy="false">(</mo><mn>0</mn><mo separator="true">,</mo><mn>1</mn><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">\mathbf{x&#x27;} = \mathbf{x}+\sigma\cdot N(0,1)
</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8019em;"></span><span class="mord"><span class="mord mathbf">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8019em;"><span style="top:-3.113em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathbf mtight">′</span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6667em;vertical-align:-0.0833em;"></span><span class="mord mathbf">x</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.4445em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">σ</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">⋅</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.10903em;">N</span><span class="mopen">(</span><span class="mord">0</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord">1</span><span class="mclose">)</span></span></span></span></span></p>
<p>并引入步长自适应机制：</p>
<p v-pre class='katex-block'><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><msup><mi>σ</mi><mo mathvariant="normal" lspace="0em" rspace="0em">′</mo></msup><mo>=</mo><mi>σ</mi><mo>⋅</mo><msup><mi>e</mi><mrow><mi>τ</mi><mo>⋅</mo><mi>N</mi><mo stretchy="false">(</mo><mn>0</mn><mo separator="true">,</mo><mn>1</mn><mo stretchy="false">)</mo></mrow></msup></mrow><annotation encoding="application/x-tex">\sigma&#x27; = \sigma\cdot e^{\tau\cdot N(0,1)}
</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8019em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.03588em;">σ</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8019em;"><span style="top:-3.113em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">′</span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.4445em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">σ</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">⋅</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.938em;"></span><span class="mord"><span class="mord mathnormal">e</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.938em;"><span style="top:-3.113em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.1132em;">τ</span><span class="mbin mtight">⋅</span><span class="mord mathnormal mtight" style="margin-right:0.10903em;">N</span><span class="mopen mtight">(</span><span class="mord mtight">0</span><span class="mpunct mtight">,</span><span class="mord mtight">1</span><span class="mclose mtight">)</span></span></span></span></span></span></span></span></span></span></span></span></span></p>
<ul>
<li><span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>σ</mi></mrow><annotation encoding="application/x-tex">\sigma</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">σ</span></span></span></span> 控制变异强度；</li>
<li>随代数变化，算法能自动调整搜索尺度。</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">提示</p>
<p>EP 的变异是多维高斯分布扰动，与 ES 十分类似，<br>
但它没有固定的(μ,λ)选择机制。</p>
</div>
<h4 id="_4-4-3-竞争选择-tournament-selection" tabindex="-1"><a class="header-anchor" href="#_4-4-3-竞争选择-tournament-selection"><span>4.4.3 竞争选择（Tournament Selection）</span></a></h4>
<p>EP 的选择方式独具特色——<strong>随机竞争选择</strong>：</p>
<ol>
<li>将父代和子代合并，共 <span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>2</mn><mi>N</mi></mrow><annotation encoding="application/x-tex">2N</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord">2</span><span class="mord mathnormal" style="margin-right:0.10903em;">N</span></span></span></span> 个体；</li>
<li>每个个体随机与 <span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>q</mi></mrow><annotation encoding="application/x-tex">q</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.625em;vertical-align:-0.1944em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">q</span></span></span></span> 个其他个体竞争（通常 <span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>q</mi><mo>=</mo><mn>10</mn></mrow><annotation encoding="application/x-tex">q=10</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.625em;vertical-align:-0.1944em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">q</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">10</span></span></span></span>）；</li>
<li>统计胜利次数，按胜场数排序；</li>
<li>选取前 <span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>N</mi></mrow><annotation encoding="application/x-tex">N</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord mathnormal" style="margin-right:0.10903em;">N</span></span></span></span> 个作为下一代。</li>
</ol>
<p>这种机制具有<strong>强鲁棒性和全局搜索能力</strong>，可以避免早熟收敛。</p>
<h4 id="_4-4-4-自适应机制-self-adaptation" tabindex="-1"><a class="header-anchor" href="#_4-4-4-自适应机制-self-adaptation"><span>4.4.4 自适应机制（Self-Adaptation）</span></a></h4>
<p>每个个体的 <span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>σ</mi></mrow><annotation encoding="application/x-tex">\sigma</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">σ</span></span></span></span> 参数会随着进化自动调整：</p>
<ul>
<li>若大步长变异有助于提高适应度，则 <span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>σ</mi></mrow><annotation encoding="application/x-tex">\sigma</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">σ</span></span></span></span> 会增大；</li>
<li>若小步长更有效，则 <span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>σ</mi></mrow><annotation encoding="application/x-tex">\sigma</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.4306em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">σ</span></span></span></span> 会逐步减小。</li>
</ul>
<p>这使得 EP 能自我学习搜索策略，无需人工调参。</p>
<h3 id="_4-5-常见变种" tabindex="-1"><a class="header-anchor" href="#_4-5-常见变种"><span>4.5 常见变种</span></a></h3>
<table>
<thead>
<tr>
<th>变体</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>原始 EP</strong></td>
<td>用于有限状态机演化</td>
</tr>
<tr>
<td><strong>实数编码 EP (REP)</strong></td>
<td>适合连续优化问题</td>
</tr>
<tr>
<td><strong>自适应 EP (AEP)</strong></td>
<td>变异参数自动调整</td>
</tr>
<tr>
<td><strong>混合 EP</strong></td>
<td>与局部搜索算法结合（如 SA, PSO）</td>
</tr>
</tbody>
</table>
<h3 id="_4-6-优缺点" tabindex="-1"><a class="header-anchor" href="#_4-6-优缺点"><span>4.6 优缺点</span></a></h3>
<table>
<thead>
<tr>
<th>优点</th>
<th>缺点</th>
</tr>
</thead>
<tbody>
<tr>
<td>结构简单，参数少</td>
<td>收敛速度较慢</td>
</tr>
<tr>
<td>无需梯度信息</td>
<td>对维度高问题较慢</td>
</tr>
<tr>
<td>适应连续与噪声问题</td>
<td>参数自适应不易控制</td>
</tr>
<tr>
<td>竞争选择鲁棒性强</td>
<td>不适合离散编码问题</td>
</tr>
</tbody>
</table>
<h2 id="五、遗传规划-genetic-programming-gp" tabindex="-1"><a class="header-anchor" href="#五、遗传规划-genetic-programming-gp"><span>五、遗传规划（Genetic Programming, GP）</span></a></h2>
<p>GP 的目标是通过模拟自然选择和遗传机制，<strong>自动生成计算机程序或数学表达式</strong>，<br>
因此也被称为“<strong>程序自动进化算法</strong>”。</p>
<div class="hint-container info">
<p class="hint-container-title">生物启发</p>
<p>遗传规划是遗传算法（GA）的扩展形式。<br>
它不再针对固定长度的染色体，而是直接在<strong>树状结构的程序表示</strong>上执行遗传操作。</p>
</div>
<h2 id="_5-1-典型应用领域" tabindex="-1"><a class="header-anchor" href="#_5-1-典型应用领域"><span>5.1 典型应用领域</span></a></h2>
<ul>
<li>符号回归（Symbolic Regression）<br>
自动生成数学公式拟合数据。</li>
<li>分类与预测模型构建<br>
自动演化决策规则或模型表达式。</li>
<li>控制与机器人策略生成<br>
自动演化控制逻辑或动作序列。</li>
<li>图像处理与特征生成<br>
自动生成图像滤波器或算子组合。</li>
<li>自动编程与算法生成<br>
“AI 编写程序”的早期形式。</li>
</ul>
</div></template>


