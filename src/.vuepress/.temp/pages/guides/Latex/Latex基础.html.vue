<template><div><h1 id="latex基础" tabindex="-1"><a class="header-anchor" href="#latex基础"><span>LaTeX基础</span></a></h1>
<h2 id="一、latex-简介" tabindex="-1"><a class="header-anchor" href="#一、latex-简介"><span>一、LaTeX 简介</span></a></h2>
<p>LaTeX 是一种基于 TeX 的排版系统，广泛用于学术界，尤其在数学、物理、工程与计算机科学中。它能精确控制排版细节，尤其擅长处理公式、图表与参考文献，输出的 PDF 文档质量极高。<br>
与所见即所得的编辑器不同，LaTeX 更像一种“写程序来排版”的语言，通过源代码生成文档。</p>
<hr>
<h2 id="二、基础文档结构" tabindex="-1"><a class="header-anchor" href="#二、基础文档结构"><span>二、基础文档结构</span></a></h2>
<p>一个最小可运行的 LaTeX 文件如下：</p>
<div class="language-latex line-numbers-mode" data-highlighter="shiki" data-ext="latex" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-latex"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">\documentclass</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">article</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">% 导言区：进行配置，包括加载宏包、定义命令、设置页面等</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">\begin</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic">document</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">Hello, world!</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">\end</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic">document</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>\documentclass{article}</code> 指定文档类型（或称“文档类”）。</li>
<li><code v-pre>\begin{document}</code> 与 <code v-pre>\end{document}</code> 包围正文内容。</li>
<li>导言区用于配置全局参数、加载宏包等。</li>
</ul>
<hr>
<h2 id="三、常见文档类型" tabindex="-1"><a class="header-anchor" href="#三、常见文档类型"><span>三、常见文档类型</span></a></h2>
<p>通过 <code v-pre>\documentclass[选项]{文档类}</code> 指定文档结构，常见类型如下：</p>
<table>
<thead>
<tr>
<th>类型</th>
<th>说明</th>
<th>特点</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>article</code></td>
<td>文章、短报告</td>
<td>从 <code v-pre>\section</code> 开始，无章节</td>
</tr>
<tr>
<td><code v-pre>report</code></td>
<td>报告、论文</td>
<td>支持 <code v-pre>\chapter</code></td>
</tr>
<tr>
<td><code v-pre>book</code></td>
<td>书籍</td>
<td>包含封面、部分、章节</td>
</tr>
<tr>
<td><code v-pre>beamer</code></td>
<td>演示文稿</td>
<td>制作幻灯片</td>
</tr>
<tr>
<td><code v-pre>letter</code></td>
<td>信件</td>
<td>用于通信格式</td>
</tr>
<tr>
<td><code v-pre>ctexart</code> / <code v-pre>ctexbook</code></td>
<td>中文文档版本</td>
<td>自动支持中文</td>
</tr>
</tbody>
</table>
<p>示例：</p>
<div class="language-latex line-numbers-mode" data-highlighter="shiki" data-ext="latex" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-latex"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">\documentclass</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">[</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic">12pt,a4paper</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">]{</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">ctexart</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>常见选项：</p>
<ul>
<li>字号：<code v-pre>10pt</code>、<code v-pre>11pt</code>、<code v-pre>12pt</code></li>
<li>纸张：<code v-pre>a4paper</code>、<code v-pre>letterpaper</code></li>
<li>排版：<code v-pre>oneside</code>、<code v-pre>twoside</code></li>
</ul>
<hr>
<h2 id="四、导言区-理解模板的核心" tabindex="-1"><a class="header-anchor" href="#四、导言区-理解模板的核心"><span>四、导言区（理解模板的核心）</span></a></h2>
<p>导言区就是配置区，决定了整个文档的“规则”。</p>
<div class="language-latex line-numbers-mode" data-highlighter="shiki" data-ext="latex" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-latex"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">\usepackage</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">geometry</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}    </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">% 控制页面布局</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">\usepackage</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">graphicx</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}    </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">% 插入图片</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">\usepackage</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">amsmath</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}     </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">% 数学环境</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">\usepackage</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">hyperref</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}    </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">% 超链接</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="常见宏包功能说明" tabindex="-1"><a class="header-anchor" href="#常见宏包功能说明"><span>常见宏包功能说明</span></a></h3>
<ul>
<li><code v-pre>geometry</code>：控制页面边距，如 <code v-pre>\geometry{margin=2cm}</code>。</li>
<li><code v-pre>graphicx</code>：用于插图，命令 <code v-pre>\includegraphics</code>。</li>
<li><code v-pre>amsmath</code>, <code v-pre>amssymb</code>：支持高级数学符号。</li>
<li><code v-pre>hyperref</code>：让目录与引用可点击跳转。</li>
<li><code v-pre>xcolor</code>：控制颜色。</li>
<li><code v-pre>caption</code>：修改图表标题样式。</li>
</ul>
<p>示例设置：</p>
<div class="language-latex line-numbers-mode" data-highlighter="shiki" data-ext="latex" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-latex"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">\usepackage</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">[</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic">bookmarks=true, colorlinks, citecolor=blue, linkcolor=black</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">]{</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">hyperref</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>你不需要记住所有宏包，只要能看懂别人模板中的配置即可。</p>
<hr>
<h2 id="五、正文写作" tabindex="-1"><a class="header-anchor" href="#五、正文写作"><span>五、正文写作</span></a></h2>
<h3 id="_5-1-文本排版" tabindex="-1"><a class="header-anchor" href="#_5-1-文本排版"><span>5.1 文本排版</span></a></h3>
<ul>
<li><strong>加粗</strong>：<code v-pre>\textbf{加粗}</code></li>
<li><strong>斜体</strong>：<code v-pre>\textit{斜体}</code></li>
<li><strong>下划线</strong>：<code v-pre>\underline{下划线}</code></li>
</ul>
<p><strong>段落控制</strong></p>
<ul>
<li>默认首行缩进</li>
<li>禁止缩进：<code v-pre>\noindent</code></li>
<li>行距：<code v-pre>\linespread{1.5}</code></li>
<li>段间距：<code v-pre>\setlength{\parskip}{1em}</code></li>
</ul>
<p><strong>对齐环境</strong></p>
<div class="language-latex line-numbers-mode" data-highlighter="shiki" data-ext="latex" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-latex"><span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">\begin</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic">flushleft</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">} 左对齐文本 </span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">\end</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic">flushleft</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">\begin</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic">center</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">} 居中内容 </span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">\end</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic">center</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">\begin</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic">flushright</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">} 右对齐文本 </span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">\end</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic">flushright</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr>
<h2 id="六、插图与表格" tabindex="-1"><a class="header-anchor" href="#六、插图与表格"><span>六、插图与表格</span></a></h2>
<h3 id="_6-1-插入图片" tabindex="-1"><a class="header-anchor" href="#_6-1-插入图片"><span>6.1 插入图片</span></a></h3>
<div class="language-latex line-numbers-mode" data-highlighter="shiki" data-ext="latex" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-latex"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">\usepackage</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">graphicx</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">} </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">% 导言区引入</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><div class="language-latex line-numbers-mode" data-highlighter="shiki" data-ext="latex" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-latex"><span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">\begin</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic">figure</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}[htbp]</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">  \centering</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">  \includegraphics</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">[width=0.6</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">\textwidth</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">]{example-image}</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">  \caption</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{示例图片}</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">  \label</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic">fig:example</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">\end</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic">figure</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>[htbp]</code> 控制图片浮动位置（here, top, bottom, page）。</li>
<li><code v-pre>\caption</code> 为图片添加标题。</li>
<li><code v-pre>\label</code> 用于交叉引用，可用 <code v-pre>\ref{fig:example}</code> 调用。</li>
</ul>
<h3 id="_6-2-制作表格" tabindex="-1"><a class="header-anchor" href="#_6-2-制作表格"><span>6.2 制作表格</span></a></h3>
<div class="language-latex line-numbers-mode" data-highlighter="shiki" data-ext="latex" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-latex"><span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">\begin</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic">table</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}[htbp]</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">  \centering</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">  \caption</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{示例表格}</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">  \begin</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic">tabular</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}{|c|c|c|}</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">    \hline</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">    姓名 </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">&#x26;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> 年龄 </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">&#x26;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> 城市 </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">\\</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2"> \hline</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">    张三 </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">&#x26;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> 25 </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">&#x26;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> 北京 </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">\\</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> </span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">    李四 </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">&#x26;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> 30 </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">&#x26;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> 上海 </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">\\</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2"> \hline</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">  \end</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic">tabular</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">\end</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic">table</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>{|c|c|c|}</code> 表示三列居中并有竖线。</li>
<li><code v-pre>\hline</code> 插入横线。</li>
</ul>
<p>更复杂的表格可使用宏包 <code v-pre>booktabs</code> 或 <code v-pre>multirow</code>，使表格更美观。</p>
<hr>
<h2 id="七、数学公式" tabindex="-1"><a class="header-anchor" href="#七、数学公式"><span>七、数学公式</span></a></h2>
<p>数学公式是 LaTeX 的灵魂。</p>
<h3 id="_7-1-行内公式" tabindex="-1"><a class="header-anchor" href="#_7-1-行内公式"><span>7.1 行内公式</span></a></h3>
<div class="language-latex line-numbers-mode" data-highlighter="shiki" data-ext="latex" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-latex"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">爱因斯坦质能方程：</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">$</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">E = mc^</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">2</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">$</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="_7-2-行间公式" tabindex="-1"><a class="header-anchor" href="#_7-2-行间公式"><span>7.2 行间公式</span></a></h3>
<div class="language-latex line-numbers-mode" data-highlighter="shiki" data-ext="latex" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-latex"><span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#61AFEF">\[</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#61AFEF">E = mc^</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">2</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#61AFEF">\]</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-3-多行与对齐" tabindex="-1"><a class="header-anchor" href="#_7-3-多行与对齐"><span>7.3 多行与对齐</span></a></h3>
<div class="language-latex line-numbers-mode" data-highlighter="shiki" data-ext="latex" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-latex"><span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">\begin</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic">align</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#61AFEF">a^</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">2</span><span style="--shiki-light:#C18401;--shiki-dark:#61AFEF"> + b^</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">2</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> &#x26;</span><span style="--shiki-light:#C18401;--shiki-dark:#61AFEF">= c^</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">2</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> \\</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#61AFEF">E </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">&#x26;</span><span style="--shiki-light:#C18401;--shiki-dark:#61AFEF">= mc^</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">2</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">\end</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic">align</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-4-常用符号" tabindex="-1"><a class="header-anchor" href="#_7-4-常用符号"><span>7.4 常用符号</span></a></h3>
<table>
<thead>
<tr>
<th>表达</th>
<th>命令</th>
<th>效果</th>
</tr>
</thead>
<tbody>
<tr>
<td>上标</td>
<td><code v-pre>x^{2}</code></td>
<td>(x^2)</td>
</tr>
<tr>
<td>下标</td>
<td><code v-pre>a_{ij}</code></td>
<td>(a_{ij})</td>
</tr>
<tr>
<td>分数</td>
<td><code v-pre>\frac{a}{b}</code></td>
<td>(\frac{a}{b})</td>
</tr>
<tr>
<td>根号</td>
<td><code v-pre>\sqrt{x}</code></td>
<td>(\sqrt{x})</td>
</tr>
<tr>
<td>求和</td>
<td><code v-pre>\sum_{i=1}^n</code></td>
<td>(\sum_{i=1}^n)</td>
</tr>
</tbody>
</table>
<hr>
<h2 id="八、参考文献-核心部分" tabindex="-1"><a class="header-anchor" href="#八、参考文献-核心部分"><span>八、参考文献（核心部分）</span></a></h2>
<h3 id="方法一-手动输入参考文献" tabindex="-1"><a class="header-anchor" href="#方法一-手动输入参考文献"><span>方法一：手动输入参考文献</span></a></h3>
<p>最简单的方式是在文档末尾使用 <code v-pre>thebibliography</code> 环境：</p>
<div class="language-latex line-numbers-mode" data-highlighter="shiki" data-ext="latex" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-latex"><span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">\begin</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic">thebibliography</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}{99}</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">  \bibitem</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{einstein1905} A. Einstein, “Zur Elektrodynamik bewegter Körper,” *Annalen der Physik*, 1905.</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">  \bibitem</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{knuth1984} D. E. Knuth, *The TeXbook*, Addison-Wesley, 1984.</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">\end</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic">thebibliography</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>正文中引用时使用：</p>
<div class="language-latex line-numbers-mode" data-highlighter="shiki" data-ext="latex" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-latex"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">爱因斯坦提出了相对论 </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">\cite</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">einstein1905</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}。</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>这种方式优点是简单、直观；缺点是难以维护、格式易错。</p>
<hr>
<h3 id="方法二-使用-bib-文献数据库-推荐" tabindex="-1"><a class="header-anchor" href="#方法二-使用-bib-文献数据库-推荐"><span>方法二：使用 <code v-pre>.bib</code> 文献数据库（推荐）</span></a></h3>
<ol>
<li>创建一个 <code v-pre>refs.bib</code> 文件，内容如下：</li>
</ol>
<div class="language-bibtex line-numbers-mode" data-highlighter="shiki" data-ext="bibtex" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-bibtex"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">@article</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">einstein1905</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">  author</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> = </span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">Einstein, Albert</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">  title</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> = </span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">Zur Elektrodynamik bewegter Körper</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">  journal</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> = </span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">Annalen der Physik</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">  year</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> = </span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">1905</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">  volume</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> = </span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">17</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">  pages</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> = </span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">891--921</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">@book</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">knuth1984</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">  author</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> = </span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">Knuth, Donald E.</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">  title</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> = </span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">The TeXbook</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">  publisher</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> = </span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">Addison-Wesley</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">  year</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> = </span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">1984</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2">
<li>在主文件中添加：</li>
</ol>
<div class="language-latex line-numbers-mode" data-highlighter="shiki" data-ext="latex" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-latex"><span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">\bibliographystyle</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{plain} </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">% 参考文献格式</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">\bibliography</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{refs}       </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">% 加载 bib 文件</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3">
<li>在正文中引用：</li>
</ol>
<div class="language-latex line-numbers-mode" data-highlighter="shiki" data-ext="latex" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-latex"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">如文献 </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">\cite</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">einstein1905</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">} 所述，质能等价公式...</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p><strong>编译顺序</strong>：</p>
<div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">pdflatex</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> main.tex</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">bibtex</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> main</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">pdflatex</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> main.tex</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">pdflatex</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> main.tex</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>或使用 VSCode、TexStudio 等工具自动运行。</p>
<hr>
<h2 id="九、latex-编译流程与推荐工具" tabindex="-1"><a class="header-anchor" href="#九、latex-编译流程与推荐工具"><span>九、LaTeX 编译流程与推荐工具</span></a></h2>
<h3 id="常见编译方式" tabindex="-1"><a class="header-anchor" href="#常见编译方式"><span>常见编译方式</span></a></h3>
<table>
<thead>
<tr>
<th>编译器</th>
<th>特点</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>pdflatex</code></td>
<td>生成 PDF，兼容性好</td>
</tr>
<tr>
<td><code v-pre>xelatex</code></td>
<td>支持中文与系统字体</td>
</tr>
<tr>
<td><code v-pre>lualatex</code></td>
<td>现代化、速度快</td>
</tr>
<tr>
<td><code v-pre>latexmk</code></td>
<td>自动判断依赖，多轮编译</td>
</tr>
</tbody>
</table>
<p>推荐中文环境使用 <code v-pre>xelatex</code>，因为它对 UTF-8 字符支持良好。</p>
<h3 id="推荐编辑器" tabindex="-1"><a class="header-anchor" href="#推荐编辑器"><span>推荐编辑器</span></a></h3>
<ul>
<li><strong>TeX Live / MikTeX</strong>：完整编译环境</li>
<li><strong>TeXstudio / Overleaf / VSCode + LaTeX Workshop 插件</strong></li>
</ul>
<hr>
<h2 id="十、使用别人的模板-cls-文件" tabindex="-1"><a class="header-anchor" href="#十、使用别人的模板-cls-文件"><span>十、使用别人的模板（.cls 文件）</span></a></h2>
<p>在实际写作中，我们常使用学校或期刊提供的模板。模板的核心文件是 <code v-pre>.cls</code>，它定义了文档的排版样式。</p>
<h3 id="_10-1-模板结构" tabindex="-1"><a class="header-anchor" href="#_10-1-模板结构"><span>10.1 模板结构</span></a></h3>
<p>一个典型模板项目包含如下文件：</p>
<div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-"><span class="line"><span>template/</span></span>
<span class="line"><span>├── main.tex</span></span>
<span class="line"><span>├── template.cls</span></span>
<span class="line"><span>├── ref.bib</span></span>
<span class="line"><span>├── figures/</span></span>
<span class="line"><span>├── example.pdf</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在主文件中：</p>
<div class="language-latex line-numbers-mode" data-highlighter="shiki" data-ext="latex" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-latex"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">\documentclass</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">[</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic">12pt,a4paper</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">]{</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">template</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>表示当前文档将使用 <code v-pre>template.cls</code> 作为文档类。</p>
<h3 id="_10-2-cls-文件的作用" tabindex="-1"><a class="header-anchor" href="#_10-2-cls-文件的作用"><span>10.2 <code v-pre>.cls</code> 文件的作用</span></a></h3>
<p><code v-pre>.cls</code> 文件定义了：</p>
<ul>
<li>页面格式（边距、字号、页眉页脚）</li>
<li>加载的宏包</li>
<li>定义的新命令，如 <code v-pre>\advisor{}</code>、<code v-pre>\school{}</code></li>
<li>特殊环境，如封面、摘要、致谢</li>
</ul>
<p>示例：</p>
<div class="language-latex line-numbers-mode" data-highlighter="shiki" data-ext="latex" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-latex"><span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">\LoadClass</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">[12pt]{report}</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">\RequirePackage</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{geometry}</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">\geometry</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{left=2.5cm, right=2.5cm, top=3cm, bottom=3cm}</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">\newcommand</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">\advisor</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}[1]{</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">\def\@advisor</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{#1}}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_10-3-使用模板的步骤" tabindex="-1"><a class="header-anchor" href="#_10-3-使用模板的步骤"><span>10.3 使用模板的步骤</span></a></h3>
<ol>
<li>
<p><strong>放在同目录下</strong></p>
<div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-"><span class="line"><span>project/</span></span>
<span class="line"><span>  ├── main.tex</span></span>
<span class="line"><span>  ├── mythesis.cls</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 <code v-pre>main.tex</code> 顶部：</p>
<div class="language-latex line-numbers-mode" data-highlighter="shiki" data-ext="latex" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-latex"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">\documentclass</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B">mythesis</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>或放入系统路径</strong><br>
Windows 用户：</p>
<div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-"><span class="line"><span>C:\Users\\&#x3C;用户名>\\texmf\\tex\\latex\\</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>放入后运行 <code v-pre>texhash</code> 更新索引。</p>
</li>
<li>
<p><strong>使用模板定义的命令</strong><br>
模板通常提供自定义命令：</p>
<div class="language-latex line-numbers-mode" data-highlighter="shiki" data-ext="latex" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-latex"><span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">\title</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{硕士论文}</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">\author</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{李雷}</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">\advisor</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{韩梅梅教授}</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">\school</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{电子信息学院}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ol>
<h3 id="_10-4-修改模板外观" tabindex="-1"><a class="header-anchor" href="#_10-4-修改模板外观"><span>10.4 修改模板外观</span></a></h3>
<table>
<thead>
<tr>
<th>修改目标</th>
<th>方法</th>
</tr>
</thead>
<tbody>
<tr>
<td>页边距</td>
<td>使用 <code v-pre>\geometry{}</code> 覆盖</td>
</tr>
<tr>
<td>行距</td>
<td><code v-pre>\linespread{1.5}</code></td>
</tr>
<tr>
<td>缩进</td>
<td><code v-pre>\setlength{\parindent}{2em}</code></td>
</tr>
<tr>
<td>标题编号</td>
<td><code v-pre>\renewcommand{\thesection}{第\arabic{section}章}</code></td>
</tr>
<tr>
<td>参考文献样式</td>
<td><code v-pre>\bibliographystyle{}</code> 更改样式</td>
</tr>
<tr>
<td>页眉页脚</td>
<td>使用 <code v-pre>fancyhdr</code> 宏包修改</td>
</tr>
</tbody>
</table>
<p>如模板太复杂，可创建自定义覆盖文件：</p>
<div class="language-latex line-numbers-mode" data-highlighter="shiki" data-ext="latex" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-latex"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">\input</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{custom_settings.tex}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="_10-5-注意事项" tabindex="-1"><a class="header-anchor" href="#_10-5-注意事项"><span>10.5 注意事项</span></a></h3>
<ul>
<li>文件名需与 <code v-pre>\documentclass{}</code> 匹配。</li>
<li>模板命令不可随意删除。</li>
<li>出现 “Undefined control sequence” 多为缺少宏包。</li>
</ul>
<hr>
<h2 id="十一、小结" tabindex="-1"><a class="header-anchor" href="#十一、小结"><span>十一、小结</span></a></h2>
<p>你现在应该已经掌握：</p>
<ul>
<li>LaTeX 文档结构与模板含义；</li>
<li>插入图、表、公式的写法；</li>
<li>手动与 bib 数据库管理参考文献；</li>
<li>如何使用 <code v-pre>.cls</code> 模板完成规范排版。</li>
</ul>
<p>LaTeX 的魅力在于可扩展与可控制。学会阅读模板，即学会了“理解文档的语言”。</p>
<hr>
<blockquote>
<p>“LaTeX 是理性的诗，它让文字的秩序拥有美学。”<br>
—— Donald Knuth（TeX 之父）</p>
</blockquote>
</div></template>


