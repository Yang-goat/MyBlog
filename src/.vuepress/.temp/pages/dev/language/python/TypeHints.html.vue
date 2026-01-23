<template><div><h1 id="类型提示" tabindex="-1"><a class="header-anchor" href="#类型提示"><span>类型提示</span></a></h1>
<p>类型提示（Type Hints） 是 Python 在语法层面提供的一种 静态类型标注机制，用于描述：</p>
<ul>
<li>变量类型</li>
<li>函数参数类型</li>
<li>函数返回值类型</li>
<li>复杂数据结构的组成类型</li>
</ul>
<div class="hint-container info">
<p class="hint-container-title">相关信息</p>
<p>类型提示 不会影响 Python 的运行时行为，其主要作用对象是：</p>
<ul>
<li>开发者</li>
<li>IDE</li>
<li>静态类型检查工具</li>
</ul>
</div>
<p>提高代码<strong>可读性</strong>，提供更强的 <strong>IDE 辅助能力</strong>，支持<strong>静态类型检查</strong>，降低大型项目与科研代码中的隐性错误。</p>
<h2 id="基本语法" tabindex="-1"><a class="header-anchor" href="#基本语法"><span>基本语法</span></a></h2>
<p><strong>变量类型标注</strong></p>
<div class="language-py line-numbers-mode" data-highlighter="shiki" data-ext="py" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-py"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">x: </span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">int</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> 10</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">y: </span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">float</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> 3.14</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">name: </span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">str</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> "alice"</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">flag: </span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">bool</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> True</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>函数参数与返回值</strong></p>
<div class="language-py line-numbers-mode" data-highlighter="shiki" data-ext="py" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-py"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">def</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> add</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#D19A66;--shiki-dark-font-style:italic">a</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2"> int</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#D19A66;--shiki-dark-font-style:italic"> b</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2"> int</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">) -> </span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">int</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">    return</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> a </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">+</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> b</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>参数类型位于参数名后</li>
<li>返回值类型位于 -&gt; 之后</li>
</ul>
<h2 id="内置类型与容器类型" tabindex="-1"><a class="header-anchor" href="#内置类型与容器类型"><span>内置类型与容器类型</span></a></h2>
<p><strong>内置类型</strong></p>
<table>
<thead>
<tr>
<th>类型</th>
<th>含义</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>int</code></td>
<td>整数</td>
</tr>
<tr>
<td><code v-pre>float</code></td>
<td>浮点数</td>
</tr>
<tr>
<td><code v-pre>str</code></td>
<td>字符串</td>
</tr>
<tr>
<td><code v-pre>bool</code></td>
<td>布尔值</td>
</tr>
<tr>
<td><code v-pre>None</code></td>
<td>空值</td>
</tr>
</tbody>
</table>
<p><strong>容器类型</strong></p>
<div class="language-py line-numbers-mode" data-highlighter="shiki" data-ext="py" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-py"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">numbers: list[</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">int</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">mapping: dict[</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">str</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">int</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">coords: tuple[</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">int</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">int</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">flags: set[</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">bool</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">]</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning">
<p class="hint-container-title">注意</p>
<p>Python 3.9 之前需使用 <code v-pre>typing.List</code>、<code v-pre>typing.Dict</code> 等。</p>
</div>
<h2 id="union-与-optional" tabindex="-1"><a class="header-anchor" href="#union-与-optional"><span>Union 与 Optional</span></a></h2>
<p><strong>Union（多类型之一）</strong></p>
<div class="language-py line-numbers-mode" data-highlighter="shiki" data-ext="py" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-py"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">from</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> typing </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">import</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> Union</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">def</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> parse</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#D19A66;--shiki-dark-font-style:italic">x</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF"> Union[</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">int</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">str</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF">]</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">) -> </span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">int</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">    return</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2"> int</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(x)</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>Optional（可为 None）</strong></p>
<div class="language-py line-numbers-mode" data-highlighter="shiki" data-ext="py" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-py"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">from</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> typing </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">import</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> Optional</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">def</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> find</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#D19A66;--shiki-dark-font-style:italic">name</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2"> str</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">) -> Optional[</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">int</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">]:</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#D19A66">    ...</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Python 3.10+ 推荐写法</p>
<div class="language-py line-numbers-mode" data-highlighter="shiki" data-ext="py" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-py"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">def</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> find</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#D19A66;--shiki-dark-font-style:italic">name</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2"> str</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">) -> </span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">int</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2"> |</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> None</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#D19A66">    ...</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="callable-函数类型" tabindex="-1"><a class="header-anchor" href="#callable-函数类型"><span>Callable（函数类型）</span></a></h2>
<div class="language-py line-numbers-mode" data-highlighter="shiki" data-ext="py" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-py"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">from</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> typing </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">import</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> Callable</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">def</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> apply</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#D19A66;--shiki-dark-font-style:italic">    func</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF"> Callable[[</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">int</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">int</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF">], </span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">int</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF">]</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#D19A66;--shiki-dark-font-style:italic">    x</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2"> int</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#D19A66;--shiki-dark-font-style:italic">    y</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2"> int</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">) -> </span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">int</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">    return</span><span style="--shiki-light:#383A42;--shiki-dark:#61AFEF"> func</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(x, y)</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>语义说明：</p>
<ul>
<li>Callable[[A, B], C]</li>
<li>表示参数类型为 (A, B)，返回类型为 C 的可调用对象</li>
</ul>
<h2 id="泛型-generic-programming" tabindex="-1"><a class="header-anchor" href="#泛型-generic-programming"><span>泛型（Generic Programming）</span></a></h2>
<p><strong>TypeVar</strong></p>
<div class="language-py line-numbers-mode" data-highlighter="shiki" data-ext="py" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-py"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">from</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> typing </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">import</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> TypeVar</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">T </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2">=</span><span style="--shiki-light:#383A42;--shiki-dark:#61AFEF"> TypeVar</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"T"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">def</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> first</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#986801;--shiki-light-font-style:inherit;--shiki-dark:#D19A66;--shiki-dark-font-style:italic">xs</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#986801;--shiki-dark:#ABB2BF"> list[T]</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">) -> T:</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">    return</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> xs[</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">0</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">]</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>T</code> 表示任意类型</li>
<li>返回值类型与输入元素类型保持一致</li>
</ul>
</div></template>


