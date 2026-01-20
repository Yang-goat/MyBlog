<template><div><h1 id="linux-推荐编辑器" tabindex="-1"><a class="header-anchor" href="#linux-推荐编辑器"><span>linux 推荐编辑器</span></a></h1>
<p>在 Linux 系统中，文本编辑器是最重要的工具之一。无论是修改配置文件、写脚本、查看日志，还是写代码，都离不开它。最常见、最实用的两个终端编辑器是：</p>
<ul>
<li>Vim：功能强大、学习曲线陡峭、效率极高</li>
<li>Nano：简单直观、即学即用、适合新手</li>
</ul>
<h2 id="文件操作" tabindex="-1"><a class="header-anchor" href="#文件操作"><span>文件操作</span></a></h2>
<h3 id="新建空文件" tabindex="-1"><a class="header-anchor" href="#新建空文件"><span>新建空文件</span></a></h3>
<div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-shell"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">touch</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> 文件名</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="新建并写入内容" tabindex="-1"><a class="header-anchor" href="#新建并写入内容"><span>新建并写入内容</span></a></h3>
<div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-shell"><span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">echo</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> "hello world"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> > </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">文件名</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="新建-打开" tabindex="-1"><a class="header-anchor" href="#新建-打开"><span>新建+打开</span></a></h3>
<div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-shell"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">vim</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> 文件名</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">nano</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> 文件名</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="vim-入门指令" tabindex="-1"><a class="header-anchor" href="#vim-入门指令"><span>vim 入门指令</span></a></h2>
<div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-"><span class="line"><span>i       进入插入模式</span></span>
<span class="line"><span>Esc     回普通模式</span></span>
<span class="line"><span>:w      保存</span></span>
<span class="line"><span>:q      退出</span></span>
<span class="line"><span>:wq     保存退出</span></span>
<span class="line"><span>:q!     强制退出</span></span>
<span class="line"><span>dd      删除行</span></span>
<span class="line"><span>yy      复制行</span></span>
<span class="line"><span>p       粘贴</span></span>
<span class="line"><span>/xxx    搜索</span></span>
<span class="line"><span>:%s/a/b/g   替换</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="nano入门" tabindex="-1"><a class="header-anchor" href="#nano入门"><span>nano入门</span></a></h2>
<p>使用 nano 打开文件好哦后底部会有几乎所有的快捷键，无需额外学习。</p>
</div></template>


