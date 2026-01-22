<template><div><h1 id="创建文件模板" tabindex="-1"><a class="header-anchor" href="#创建文件模板"><span>创建文件模板</span></a></h1>
<p>实现新建一个文件后能快速写出这个文件的基本固定内容，即文件模板或代码片段</p>
<p>推荐使用VS Code内置<code v-pre>Snippet</code>功能实现。</p>
<div class="hint-container info">
<p class="hint-container-title">相关信息</p>
<p>本文以 markdown 文件为例</p>
</div>
<h2 id="_1-创建指定语言的用户-snippet" tabindex="-1"><a class="header-anchor" href="#_1-创建指定语言的用户-snippet"><span>1）创建指定语言的用户 snippet</span></a></h2>
<p>VS Code：<code v-pre>Ctrl/Cmd + Shift + P</code> → 输入：<code v-pre>Snippets: Configure Snippets</code>→ 选择markdown语言 或者 点击<code v-pre>新建全局代码片段文件</code>并输入<code v-pre>markdown.json</code></p>
<p>最终打开 <code v-pre>markdown.json</code> 文件</p>
<h2 id="_2-编辑模板" tabindex="-1"><a class="header-anchor" href="#_2-编辑模板"><span>2）编辑模板</span></a></h2>
<p>如：</p>
<div class="language-json line-numbers-mode" data-highlighter="shiki" data-ext="json" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-json"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">	"VuePress Hope Frontmatter"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">		"prefix"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"vp"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">		"body"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: [</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">		"---"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">		"icon: pen-to-square"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">		"title: $1"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">		"date: $CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">		"#order: 1"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">		"#category:"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">		"# - "</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">		"#tag:"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">		"#  - "</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">		"---"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">		""</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">		"# $1"</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">		],</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">		"description"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"Insert VuePress Theme Hope frontmatter"</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">	}</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>各项含义如下：</p>
<ul>
<li><code v-pre>VuePress Hope Frontmatter</code>：这个 snippet 的名字，只用于显示，不影响使用。</li>
<li><code v-pre>prefix</code>: &quot;vp&quot;：触发词，片段名。</li>
<li><code v-pre>body</code>：真正插入到文件里的内容，每个字符串是一行。</li>
</ul>
<p>body 里的特殊写法：</p>
<ul>
<li><code v-pre>$1</code>：光标占位符。触发后光标会停在这里，你输入的内容会同步到所有 $1 的位置。
<ul>
<li>最后的 <code v-pre># $1</code>：Markdown 一级标题，会和上面的 title: $1 同步。</li>
</ul>
</li>
<li><code v-pre>$CURRENT_YEAR</code>，<code v-pre>$CURRENT_MONTH</code>，<code v-pre>$CURRENT_DATE</code>：VS Code 内置变量，会自动替换为当天日期。</li>
<li>以 # 开头的行：被注释的可选项，默认不生效，想用时删掉 # 即可。</li>
</ul>
<h2 id="_3-使用" tabindex="-1"><a class="header-anchor" href="#_3-使用"><span>3）使用</span></a></h2>
<p>在markdown文件下 <code v-pre>Ctrl/Cmd + Shift + P</code> → 输入：<code v-pre>Snippets: Insert Snippets</code> → 点击<code v-pre>vp</code></p>
</div></template>


