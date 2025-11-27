<template><div><h1 id="分布估计算法-edas" tabindex="-1"><a class="header-anchor" href="#分布估计算法-edas"><span>分布估计算法（EDAs）</span></a></h1>
<p>EDAs（Estimation of Distribution Algorithms）是一类基于概率模型的进化优化算法。与传统遗传算法（Genetic Algorithms，GA）相比，EDAs 用<strong>分布学习 + 采样</strong>替代了交叉与变异算子，因此在结构表示能力、稳定性与全局搜索性能方面具有显著优势。</p>
<MarkMap id="markmap-6" content="eJxdUF1qwzAMfu8pDHkOO0PSljYwZ4WtB1ASLRNTbCM77bLTTzYURt8kfdL3o8ocD03cVZW5RXNqdrWxfkI2EwZ0E7qRMOrwPcFATGnTuvdmAbcCGx9QIHkp9x9b0NVKq6ujGwhBQt2+2kNmvbTdawEvQHKnmCHb2W5fhnbl9O/maPt80741BT1vg9Ckg5O1tdrVaqGftArW/rNu+2xwZj8Av7Af1ddXOXgky5oCzMi610UGN9UDRMyMD8QsJTUjiCM3Z3MQE0p99/KNkqlyxiYEphESeZdF934ZyJW2fCPRQr+lzSHcTA5RlO4ZOuurJKj0gqph0lo0/wBfR32S"></MarkMap><h2 id="eda-vs-ga" tabindex="-1"><a class="header-anchor" href="#eda-vs-ga"><span>EDA vs GA</span></a></h2>
<p>虽然 EDAs 与 GA 均属于基于种群的随机优化算法，但 EDAs 引入概率模型后具备了一系列关键优势：</p>
<ul>
<li><strong>模型驱动搜索</strong>：GA 依赖交叉与变异等随机操作，而 EDA 明确构建概率模型来描述优秀解的结构，使搜索方向更具信息性。</li>
<li><strong>减少参数与操作复杂度</strong>：无需复杂的交叉/变异设计，也避免不合适的操作对变量依赖关系造成破坏。</li>
<li><strong>更容易捕捉变量之间的依赖关系</strong>：通过模型（如多变量分布）自动学习特征间关联，而 GA 通常无法显式表达。</li>
<li><strong>更适合集成机器学习思想</strong>：EDA 使用“学习—采样”循环，可自然融合统计、ML、图模型等方法。</li>
<li><strong>更稳定的收敛行为</strong>：基于概率模型的更新通常比 GA 的随机算子更稳定，可提高全局搜索能力。</li>
</ul>
<h2 id="_1-基本思想" tabindex="-1"><a class="header-anchor" href="#_1-基本思想"><span>1. 基本思想</span></a></h2>
<p>EDAs 的核心思想是：</p>
<ol>
<li><strong>生成初始种群</strong>；</li>
<li><strong>选择优秀个体</strong>；</li>
<li><strong>从优秀个体中估计概率分布 <span v-pre class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>p</mi><mo stretchy="false">(</mo><mi mathvariant="bold">x</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">p(\mathbf{x})</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">p</span><span class="mopen">(</span><span class="mord mathbf">x</span><span class="mclose">)</span></span></span></span></strong>；</li>
<li><strong>依据分布采样新种群</strong>；</li>
<li><strong>迭代更新直至收敛</strong>。</li>
</ol>
<p>这种“学习 → 采样 → 更新”的范式使得 EDA 能够显式地捕捉变量结构与依赖关系。</p>
<h2 id="_2-基本流程" tabindex="-1"><a class="header-anchor" href="#_2-基本流程"><span>2. 基本流程</span></a></h2>
<p>EDAs 的通用流程如下：</p>
<p v-pre class='katex-block'><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mtext>Learn distribution</mtext><mo>⇒</mo><mtext>Sample population</mtext><mo>⇒</mo><mtext>Evaluate</mtext><mo>⇒</mo><mtext>Select</mtext></mrow><annotation encoding="application/x-tex">\text{Learn distribution} \Rightarrow \text{Sample population} \Rightarrow \text{Evaluate} \Rightarrow \text{Select}
</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord text"><span class="mord">Learn distribution</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">⇒</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord text"><span class="mord">Sample population</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">⇒</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord text"><span class="mord">Evaluate</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">⇒</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord text"><span class="mord">Select</span></span></span></span></span></span></p>
<p>伪代码：</p>
<div class="language-pseudo line-numbers-mode" data-highlighter="shiki" data-ext="pseudo" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-pseudo"><span class="line"><span>初始化种群 P</span></span>
<span class="line"><span>重复直到满足终止条件：</span></span>
<span class="line"><span>    从 P 中选择优秀个体 S</span></span>
<span class="line"><span>    基于 S 估计概率模型 M</span></span>
<span class="line"><span>    由模型 M 采样生成新个体集合 P_new</span></span>
<span class="line"><span>    将 P_new 替换或合并入 P</span></span>
<span class="line"><span>返回最优解</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr>
<h2 id="_3-按概率模型分类的-eda-类型" tabindex="-1"><a class="header-anchor" href="#_3-按概率模型分类的-eda-类型"><span>3. 按概率模型分类的 EDA 类型</span></a></h2>
<p>以下根据模型的依赖能力与复杂度分类，伪代码以二元编码为例。</p>
<hr>
<h3 id="_3-1-无依赖模型-univariate-edas" tabindex="-1"><a class="header-anchor" href="#_3-1-无依赖模型-univariate-edas"><span>3.1 无依赖模型（Univariate EDAs）</span></a></h3>
<p>假设变量独立：</p>
<p v-pre class='katex-block'><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mi>p</mi><mo stretchy="false">(</mo><msub><mi>x</mi><mn>1</mn></msub><mo separator="true">,</mo><mo>…</mo><mo separator="true">,</mo><msub><mi>x</mi><mi>n</mi></msub><mo stretchy="false">)</mo><mo>=</mo><munderover><mo>∏</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi></munderover><mi>p</mi><mo stretchy="false">(</mo><msub><mi>x</mi><mi>i</mi></msub><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">p(x_1,\ldots,x_n) = \prod_{i=1}^n p(x_i)
</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">p</span><span class="mopen">(</span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="minner">…</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.1514em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">n</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:2.9291em;vertical-align:-1.2777em;"></span><span class="mop op-limits"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.6514em;"><span style="top:-1.8723em;margin-left:0em;"><span class="pstrut" style="height:3.05em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">i</span><span class="mrel mtight">=</span><span class="mord mtight">1</span></span></span></span><span style="top:-3.05em;"><span class="pstrut" style="height:3.05em;"></span><span><span class="mop op-symbol large-op">∏</span></span></span><span style="top:-4.3em;margin-left:0em;"><span class="pstrut" style="height:3.05em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">n</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:1.2777em;"><span></span></span></span></span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">p</span><span class="mopen">(</span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3117em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">i</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mclose">)</span></span></span></span></span></p>
<p>代表算法：</p>
<ul>
<li>UMDA</li>
<li>PBIL</li>
</ul>
<h4 id="_3-1-1-umda" tabindex="-1"><a class="header-anchor" href="#_3-1-1-umda"><span>3.1.1 UMDA</span></a></h4>
<p>UMDA（Univariate Marginal Distribution Algorithm）单变量边缘分布算法：假设各维度独立，对每个维度估计边缘分布。</p>
<div class="language-vbnet line-numbers-mode" data-highlighter="shiki" data-ext="vbnet" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-vbnet"><span class="line"><span>初始化种群规模 N、选择比例 τ</span></span>
<span class="line"><span>随机初始化种群 P</span></span>
<span class="line"><span></span></span>
<span class="line"><span>循环直到满足终止条件：</span></span>
<span class="line"><span>    评估种群适应度</span></span>
<span class="line"><span>    选择前 τ·N 个优秀个体作为 S</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    对于每个变量 i：</span></span>
<span class="line"><span>        统计 S 中变量 i = 1 的频率 p_i</span></span>
<span class="line"><span>        若 p_i = 0 或 1，则进行平滑处理 p_i ← 修正值</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    根据 {p_i} 采样产生新种群 P</span></span>
<span class="line"><span>返回最优个体</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-1-2-pbil" tabindex="-1"><a class="header-anchor" href="#_3-1-2-pbil"><span>3.1.2 PBIL</span></a></h4>
<p>PBIL（Population-Based Incremental Learning）基于增量学习的概率模型：维护一个概率向量，并以“学习率”向优秀样本更新。</p>
<div class="language-vbnet line-numbers-mode" data-highlighter="shiki" data-ext="vbnet" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-vbnet"><span class="line"><span>初始化概率向量 p_i = 0.5</span></span>
<span class="line"><span>设定学习率 α、负学习率 β</span></span>
<span class="line"><span>设定最佳样本选择规则</span></span>
<span class="line"><span></span></span>
<span class="line"><span>循环直到终止：</span></span>
<span class="line"><span>    根据 p_i 采样得到种群 P</span></span>
<span class="line"><span>    评估适应度并选择最佳样本 B</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    对于每个变量 i：</span></span>
<span class="line"><span>        p_i ← p_i * (1 - α) + B_i * α    # 正向学习</span></span>
<span class="line"><span>        若采用负学习：</span></span>
<span class="line"><span>            对最差样本 W：</span></span>
<span class="line"><span>                p_i ← p_i * (1 - β) + W_i * β（反向远离最差）</span></span>
<span class="line"><span>返回最优解</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr>
<h3 id="_3-2-简单依赖模型-pairwise-chain-structured-edas" tabindex="-1"><a class="header-anchor" href="#_3-2-简单依赖模型-pairwise-chain-structured-edas"><span>3.2 简单依赖模型（Pairwise / Chain-structured EDAs）</span></a></h3>
<p>通过互信息或二阶统计量建模局部依赖。</p>
<p>典型算法：</p>
<ul>
<li>MIMIC（链式结构）</li>
<li>BMDA（双变量依赖）</li>
</ul>
<h4 id="_3-2-1-mimic" tabindex="-1"><a class="header-anchor" href="#_3-2-1-mimic"><span>3.2.1 MIMIC</span></a></h4>
<p>MIMIC（Mutual-Information Maximizing Input Clustering）最大化互信息输入聚类算法：使用排序样本，通过最小化 KL 散度的有向链结构建模，等价于一个基于互信息的排序链式模型。</p>
<div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-"><span class="line"><span>初始化种群规模 N</span></span>
<span class="line"><span>随机生成初始样本集 P</span></span>
<span class="line"><span></span></span>
<span class="line"><span>循环直到终止：</span></span>
<span class="line"><span>    评估个体适应度</span></span>
<span class="line"><span>    选出前 τ·N 个优秀样本 </span></span>
<span class="line"><span>    将 S 按目标函数值排序</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    通过互信息计算变量之间的依赖关系</span></span>
<span class="line"><span>    构建最优的链式结构（最小化KL散度）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    根据链式模型估计条件概率</span></span>
<span class="line"><span>    采样产生新样本集合 P</span></span>
<span class="line"><span>返回最优解</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-2-2-bmda" tabindex="-1"><a class="header-anchor" href="#_3-2-2-bmda"><span>3.2.2 BMDA</span></a></h4>
<p>BMDA（Bivariate Marginal Distribution Algorithm）双变量边缘分布算法：通过相关性将变量分组，每组内用二元分布建模，组间假设独立。</p>
<div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-"><span class="line"><span>初始化种群 P</span></span>
<span class="line"><span></span></span>
<span class="line"><span>循环直到终止：</span></span>
<span class="line"><span>    评估适应度</span></span>
<span class="line"><span>    选择优秀样本 S</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    计算变量之间的相关性矩阵</span></span>
<span class="line"><span>    将变量按相关性成对分组（贪心或最小生成树法）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    对于每一对变量 (i, j)：</span></span>
<span class="line"><span>        统计 S 中两变量的联合概率 P(x_i, x_j)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    依据所有二元联合概率采样生成新种群 P</span></span>
<span class="line"><span>返回最优解</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr>
<h3 id="_3-3-全依赖模型-multivariate-edas" tabindex="-1"><a class="header-anchor" href="#_3-3-全依赖模型-multivariate-edas"><span>3.3 全依赖模型（Multivariate EDAs）</span></a></h3>
<p>能够表达完整依赖结构，如高斯模型或贝叶斯网络。</p>
<p>代表：</p>
<ul>
<li>EMNA（多元正态分布）</li>
<li>BOA（贝叶斯网络）</li>
<li>hBOA（层次贝叶斯网络）</li>
</ul>
<h4 id="_3-3-1-emna" tabindex="-1"><a class="header-anchor" href="#_3-3-1-emna"><span>3.3.1 EMNA</span></a></h4>
<p>EMNA（Estimation of Multivariate Normal Algorithm）多元正态分布估计算法：连续变量的 EDA，用多元高斯分布来建模。</p>
<div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-"><span class="line"><span>初始化连续解的种群 P</span></span>
<span class="line"><span></span></span>
<span class="line"><span>循环直到终止：</span></span>
<span class="line"><span>    评估适应度</span></span>
<span class="line"><span>    选择优秀样本 S</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    估计均值向量 μ</span></span>
<span class="line"><span>    估计协方差矩阵 Σ</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    使用多元正态分布 N(μ, Σ) 采样生成新的 P</span></span>
<span class="line"><span>返回最佳解</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-3-2-boa与hboa" tabindex="-1"><a class="header-anchor" href="#_3-3-2-boa与hboa"><span>3.3.2 BOA与hBOA</span></a></h4>
<blockquote>
<p>暂时略过</p>
</blockquote>
<hr>
<h2 id="_4-分布参数估计方法" tabindex="-1"><a class="header-anchor" href="#_4-分布参数估计方法"><span>4. 分布参数估计方法</span></a></h2>
<h3 id="_4-1-最大似然估计-mle" tabindex="-1"><a class="header-anchor" href="#_4-1-最大似然估计-mle"><span>4.1 最大似然估计（MLE）</span></a></h3>
<p>对 elite 样本直接估计参数，如高斯模型：</p>
<p v-pre class='katex-block'><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mi>μ</mi><mo>=</mo><mfrac><mn>1</mn><mi>m</mi></mfrac><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>m</mi></munderover><msup><mi>x</mi><mrow><mo stretchy="false">(</mo><mi>i</mi><mo stretchy="false">)</mo></mrow></msup><mo separator="true">,</mo><mspace width="1em"/><mi mathvariant="normal">Σ</mi><mo>=</mo><mfrac><mn>1</mn><mi>m</mi></mfrac><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>m</mi></munderover><mo stretchy="false">(</mo><msup><mi>x</mi><mrow><mo stretchy="false">(</mo><mi>i</mi><mo stretchy="false">)</mo></mrow></msup><mo>−</mo><mi>μ</mi><mo stretchy="false">)</mo><mo stretchy="false">(</mo><msup><mi>x</mi><mrow><mo stretchy="false">(</mo><mi>i</mi><mo stretchy="false">)</mo></mrow></msup><mo>−</mo><mi>μ</mi><msup><mo stretchy="false">)</mo><mi>T</mi></msup></mrow><annotation encoding="application/x-tex">\mu=\frac{1}{m}\sum_{i=1}^m x^{(i)},\quad
\Sigma=\frac{1}{m}\sum_{i=1}^m (x^{(i)}-\mu)(x^{(i)}-\mu)^T
</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.625em;vertical-align:-0.1944em;"></span><span class="mord mathnormal">μ</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:2.9291em;vertical-align:-1.2777em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.3214em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal">m</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.686em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mop op-limits"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.6514em;"><span style="top:-1.8723em;margin-left:0em;"><span class="pstrut" style="height:3.05em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">i</span><span class="mrel mtight">=</span><span class="mord mtight">1</span></span></span></span><span style="top:-3.05em;"><span class="pstrut" style="height:3.05em;"></span><span><span class="mop op-symbol large-op">∑</span></span></span><span style="top:-4.3em;margin-left:0em;"><span class="pstrut" style="height:3.05em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">m</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:1.2777em;"><span></span></span></span></span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.938em;"><span style="top:-3.113em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mopen mtight">(</span><span class="mord mathnormal mtight">i</span><span class="mclose mtight">)</span></span></span></span></span></span></span></span></span><span class="mpunct">,</span><span class="mspace" style="margin-right:1em;"></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord">Σ</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:2.9291em;vertical-align:-1.2777em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.3214em;"><span style="top:-2.314em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord mathnormal">m</span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.677em;"><span class="pstrut" style="height:3em;"></span><span class="mord"><span class="mord">1</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.686em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mop op-limits"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.6514em;"><span style="top:-1.8723em;margin-left:0em;"><span class="pstrut" style="height:3.05em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">i</span><span class="mrel mtight">=</span><span class="mord mtight">1</span></span></span></span><span style="top:-3.05em;"><span class="pstrut" style="height:3.05em;"></span><span><span class="mop op-symbol large-op">∑</span></span></span><span style="top:-4.3em;margin-left:0em;"><span class="pstrut" style="height:3.05em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">m</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:1.2777em;"><span></span></span></span></span></span><span class="mopen">(</span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.938em;"><span style="top:-3.113em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mopen mtight">(</span><span class="mord mathnormal mtight">i</span><span class="mclose mtight">)</span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1.188em;vertical-align:-0.25em;"></span><span class="mord mathnormal">μ</span><span class="mclose">)</span><span class="mopen">(</span><span class="mord"><span class="mord mathnormal">x</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.938em;"><span style="top:-3.113em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mopen mtight">(</span><span class="mord mathnormal mtight">i</span><span class="mclose mtight">)</span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1.1413em;vertical-align:-0.25em;"></span><span class="mord mathnormal">μ</span><span class="mclose"><span class="mclose">)</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.8913em;"><span style="top:-3.113em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight" style="margin-right:0.13889em;">T</span></span></span></span></span></span></span></span></span></span></span></span></p>
<h3 id="_4-2-增量式更新-pbil" tabindex="-1"><a class="header-anchor" href="#_4-2-增量式更新-pbil"><span>4.2 增量式更新（PBIL）</span></a></h3>
<p>使用学习率更新分布参数：</p>
<p v-pre class='katex-block'><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><msub><mi>p</mi><mrow><mi>t</mi><mo>+</mo><mn>1</mn></mrow></msub><mo>=</mo><mo stretchy="false">(</mo><mn>1</mn><mo>−</mo><mi>η</mi><mo stretchy="false">)</mo><msub><mi>p</mi><mi>t</mi></msub><mo>+</mo><mi>η</mi><mover accent="true"><mi>p</mi><mo>^</mo></mover></mrow><annotation encoding="application/x-tex">p_{t+1} = (1 - \eta)p_t + \eta \hat{p}
</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6389em;vertical-align:-0.2083em;"></span><span class="mord"><span class="mord mathnormal">p</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3011em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">t</span><span class="mbin mtight">+</span><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.2083em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mopen">(</span><span class="mord">1</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">−</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">η</span><span class="mclose">)</span><span class="mord"><span class="mord mathnormal">p</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.2806em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">t</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">+</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">η</span><span class="mord accent"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.6944em;"><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="mord mathnormal">p</span></span><span style="top:-3em;"><span class="pstrut" style="height:3em;"></span><span class="accent-body" style="left:-0.1667em;"><span class="mord">^</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.1944em;"><span></span></span></span></span></span></span></span></span></span></p>
<hr>
<h2 id="_5-混合分布估计算法-hybrid-edas" tabindex="-1"><a class="header-anchor" href="#_5-混合分布估计算法-hybrid-edas"><span>5. 混合分布估计算法（Hybrid EDAs）</span></a></h2>
<p>混合分布 EDA（Hybrid EDAs 或 Mixture-based EDAs）旨在提高模型表达能力，使算法既能保持探索性，又能抓住不同模式的结构信息。</p>
<p>常见的混合 EDA 模型包括：</p>
<h3 id="_5-1-高斯混合模型-gmm-eda" tabindex="-1"><a class="header-anchor" href="#_5-1-高斯混合模型-gmm-eda"><span>5.1 高斯混合模型（GMM-EDA）</span></a></h3>
<p>使用 GMM 建模多个模式：</p>
<p v-pre class='katex-block'><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mi>p</mi><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo><mo>=</mo><munderover><mo>∑</mo><mrow><mi>k</mi><mo>=</mo><mn>1</mn></mrow><mi>K</mi></munderover><msub><mi>π</mi><mi>k</mi></msub><mi mathvariant="script">N</mi><mo stretchy="false">(</mo><mi>x</mi><mi mathvariant="normal">∣</mi><msub><mi>μ</mi><mi>k</mi></msub><mo separator="true">,</mo><msub><mi mathvariant="normal">Σ</mi><mi>k</mi></msub><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">p(x) = \sum_{k=1}^K \pi_k \mathcal{N}(x|\mu_k, \Sigma_k)
</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">p</span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:3.1304em;vertical-align:-1.3021em;"></span><span class="mop op-limits"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.8283em;"><span style="top:-1.8479em;margin-left:0em;"><span class="pstrut" style="height:3.05em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.03148em;">k</span><span class="mrel mtight">=</span><span class="mord mtight">1</span></span></span></span><span style="top:-3.05em;"><span class="pstrut" style="height:3.05em;"></span><span><span class="mop op-symbol large-op">∑</span></span></span><span style="top:-4.3em;margin-left:0em;"><span class="pstrut" style="height:3.05em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight" style="margin-right:0.07153em;">K</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:1.3021em;"><span></span></span></span></span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.03588em;">π</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3361em;"><span style="top:-2.55em;margin-left:-0.0359em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight" style="margin-right:0.03148em;">k</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mord mathcal" style="margin-right:0.14736em;">N</span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mord">∣</span><span class="mord"><span class="mord mathnormal">μ</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3361em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight" style="margin-right:0.03148em;">k</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord"><span class="mord">Σ</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3361em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight" style="margin-right:0.03148em;">k</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mclose">)</span></span></span></span></span></p>
<p>优势：</p>
<ul>
<li>能同时表示多个高质量区域（多峰优化问题中尤为重要）</li>
<li>采样时能够保持种群多样性</li>
<li>自适应学习不同群体结构</li>
</ul>
<p>典型程序包括：</p>
<ul>
<li>Elite 样本聚类</li>
<li>使用 EM 算法估计各组件参数</li>
<li>从混合模型采样生成下一代</li>
</ul>
<p>缺点：</p>
<ul>
<li>高维时 GMM 学习成本较高</li>
<li>需要确定簇数 K（可使用 BIC/MDL 自动选择）</li>
</ul>
<h3 id="_5-2-混合贝叶斯网络-eda" tabindex="-1"><a class="header-anchor" href="#_5-2-混合贝叶斯网络-eda"><span>5.2 混合贝叶斯网络 EDA</span></a></h3>
<p>将不同结构的贝叶斯网组合形成 mixture-of-BNs：</p>
<p v-pre class='katex-block'><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mi>p</mi><mo stretchy="false">(</mo><mi>x</mi><mo stretchy="false">)</mo><mo>=</mo><munderover><mo>∑</mo><mrow><mi>k</mi><mo>=</mo><mn>1</mn></mrow><mi>K</mi></munderover><msub><mi>π</mi><mi>k</mi></msub><msub><mi>p</mi><mi>k</mi></msub><mo stretchy="false">(</mo><mi>x</mi><mi mathvariant="normal">∣</mi><msub><mtext>BN</mtext><mi>k</mi></msub><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">p(x)=\sum_{k=1}^K \pi_k p_k(x|\text{BN}_k)
</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">p</span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mclose">)</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:3.1304em;vertical-align:-1.3021em;"></span><span class="mop op-limits"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.8283em;"><span style="top:-1.8479em;margin-left:0em;"><span class="pstrut" style="height:3.05em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.03148em;">k</span><span class="mrel mtight">=</span><span class="mord mtight">1</span></span></span></span><span style="top:-3.05em;"><span class="pstrut" style="height:3.05em;"></span><span><span class="mop op-symbol large-op">∑</span></span></span><span style="top:-4.3em;margin-left:0em;"><span class="pstrut" style="height:3.05em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight" style="margin-right:0.07153em;">K</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:1.3021em;"><span></span></span></span></span></span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.03588em;">π</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3361em;"><span style="top:-2.55em;margin-left:-0.0359em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight" style="margin-right:0.03148em;">k</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mord"><span class="mord mathnormal">p</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3361em;"><span style="top:-2.55em;margin-left:0em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight" style="margin-right:0.03148em;">k</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mopen">(</span><span class="mord mathnormal">x</span><span class="mord">∣</span><span class="mord"><span class="mord text"><span class="mord">BN</span></span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.3361em;"><span style="top:-2.55em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight" style="margin-right:0.03148em;">k</span></span></span></span><span class="vlist-s">​</span></span><span class="vlist-r"><span class="vlist" style="height:0.15em;"><span></span></span></span></span></span></span><span class="mclose">)</span></span></span></span></span></p>
<p>适合多模式、组合依赖强的问题。</p>
<h3 id="_5-3-混合策略-局部-eda-全局-eda" tabindex="-1"><a class="header-anchor" href="#_5-3-混合策略-局部-eda-全局-eda"><span>5.3 混合策略（局部 EDA + 全局 EDA）</span></a></h3>
<p>例如：</p>
<ul>
<li>全局：高斯或贝叶斯网络学习全局趋势</li>
<li>局部：UMDA 或 PBIL 专注局部搜索</li>
</ul>
<p>这种“双层结构”能在探索和利用之间取得更好平衡。</p>
<hr>
<h2 id="_6-并行分布估计算法-parallel-edas" tabindex="-1"><a class="header-anchor" href="#_6-并行分布估计算法-parallel-edas"><span>6. 并行分布估计算法（Parallel EDAs）</span></a></h2>
<p>随着高维优化和大规模计算需求的增加，并行化 EDA 成为重要方向。</p>
<p>以下是两大类并行技术：</p>
<hr>
<h3 id="_6-1-种群划分-island-based-parallel-edas" tabindex="-1"><a class="header-anchor" href="#_6-1-种群划分-island-based-parallel-edas"><span>6.1 种群划分（Island-based Parallel EDAs）</span></a></h3>
<p>将种群划分为多个“岛屿”：</p>
<ul>
<li>每个岛独立运行一个 EDA</li>
<li>使用不同的模型或参数</li>
<li>周期性迁移部分个体以共享信息</li>
</ul>
<p>优势：</p>
<ul>
<li>高性能扩展性强</li>
<li>不同岛屿可探索不同分布结构</li>
<li>抵抗早熟收敛</li>
</ul>
<p>典型框架：</p>
<ul>
<li>Island UMDA</li>
<li>Island BOA</li>
<li>Island EMNA</li>
</ul>
<hr>
<h3 id="_6-2-分布学习并行化-parallel-model-learning" tabindex="-1"><a class="header-anchor" href="#_6-2-分布学习并行化-parallel-model-learning"><span>6.2 分布学习并行化（Parallel Model Learning）</span></a></h3>
<p>针对模型学习成本高的问题（如 BOA、GMM、EMNA），可对以下步骤并行化：</p>
<h4 id="_1-统计量并行计算" tabindex="-1"><a class="header-anchor" href="#_1-统计量并行计算"><span>1. 统计量并行计算</span></a></h4>
<p>例如均值、协方差、计数统计可通过 Map-Reduce 实现。</p>
<h4 id="_2-模型学习并行化" tabindex="-1"><a class="header-anchor" href="#_2-模型学习并行化"><span>2. 模型学习并行化</span></a></h4>
<ul>
<li>EM 算法的 E/M 步并行</li>
<li>贝叶斯网络结构搜索（评分可拆分为局部结构评分）</li>
</ul>
<h4 id="_3-并行采样" tabindex="-1"><a class="header-anchor" href="#_3-并行采样"><span>3. 并行采样</span></a></h4>
<p>从概率分布采样天然可并行。</p>
<hr>
<h3 id="_6-3-主–从-master–worker-并行-eda" tabindex="-1"><a class="header-anchor" href="#_6-3-主–从-master–worker-并行-eda"><span>6.3 主–从（Master–Worker）并行 EDA</span></a></h3>
<ul>
<li>Master 负责模型学习</li>
<li>Worker 负责采样与适应度计算</li>
</ul>
<p>适用于计算代价非常大的适应度评估任务（例如工程仿真优化）。</p>
<hr>
<h3 id="_6-4-优势与应用" tabindex="-1"><a class="header-anchor" href="#_6-4-优势与应用"><span>6.4 优势与应用</span></a></h3>
<p>并行化 EDA 可极大加速：</p>
<ul>
<li>工程领域的大规模模拟优化（如 CFD、材料建模）</li>
<li>深度学习超参数搜索</li>
<li>基因组计算、大型组合优化</li>
</ul>
<hr>
</div></template>


