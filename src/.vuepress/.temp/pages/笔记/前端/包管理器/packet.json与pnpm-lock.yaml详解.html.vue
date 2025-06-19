<template><div><h1 id="packet-json-与-pnpm-lock-yaml-开发文档" tabindex="-1"><a class="header-anchor" href="#packet-json-与-pnpm-lock-yaml-开发文档"><span>packet.json 与 pnpm-lock.yaml 开发文档</span></a></h1>
<h2 id="packet-json" tabindex="-1"><a class="header-anchor" href="#packet-json"><span>packet.json</span></a></h2>
<h3 id="一、文件样例" tabindex="-1"><a class="header-anchor" href="#一、文件样例"><span>一、文件样例</span></a></h3>
<div class="language-json line-numbers-mode" data-highlighter="shiki" data-ext="json" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-json"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">{</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  "name"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"my-project"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  "version"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"1.0.0"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  "description"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"A sample Node.js project for demonstrating packet.json usage"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  "main"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"index.js"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  "scripts"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    "start"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"node index.js"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    "build"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"webpack --config webpack.config.js"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    "test"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"jest"</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">  },</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  "keywords"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: [</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">    "nodejs"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">    "example"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">    "packetjson"</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">  ],</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  "author"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"John Doe"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  "license"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"MIT"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  "dependencies"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    "express"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"^4.18.2"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    "mysql"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"^2.3.3"</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">  },</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  "devDependencies"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    "webpack"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"^5.75.0"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    "jest"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"^29.5.0"</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">  },</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  "engines"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    "node"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">">=14.0.0"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    "npm"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">">=6.0.0"</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">  },</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  "repository"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    "type"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"git"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    "url"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"https://github.com/user/my-project.git"</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">  }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="二、文件结构与字段详解" tabindex="-1"><a class="header-anchor" href="#二、文件结构与字段详解"><span>二、文件结构与字段详解</span></a></h3>
<h4 id="_2-1-基础信息字段" tabindex="-1"><a class="header-anchor" href="#_2-1-基础信息字段"><span>2.1 基础信息字段</span></a></h4>
<ol>
<li><strong>name</strong>
<ul>
<li><strong>在样例中的体现</strong>：<code v-pre>&quot;name&quot;: &quot;my-project&quot;</code></li>
<li><strong>描述</strong>：项目的名称，在 npm 仓库中必须是唯一的（如果项目要发布到 npm）。名称只能包含小写字母、数字、连字符和下划线，不能以<code v-pre>.</code>或<code v-pre>_</code>开头。该字段用于标识项目，在 npm 相关操作和依赖管理中起到关键作用。</li>
</ul>
</li>
<li><strong>version</strong>
<ul>
<li><strong>在样例中的体现</strong>：<code v-pre>&quot;version&quot;: &quot;1.0.0&quot;</code></li>
<li><strong>描述</strong>：项目的版本号，遵循<a href="https://semver.org/" target="_blank" rel="noopener noreferrer">语义化版本控制（SemVer）</a>规范，格式为<code v-pre>主版本号.次版本号.修订号</code>（如<code v-pre>1.0.0</code>）。主版本号的变更表示不兼容的 API 修改，次版本号的变更表示增加功能且保持向后兼容，修订号的变更表示修复 bug 且保持向后兼容。版本号有助于管理项目的迭代和依赖的稳定性。</li>
</ul>
</li>
<li><strong>description</strong>
<ul>
<li><strong>在样例中的体现</strong>：<code v-pre>&quot;description&quot;: &quot;A sample Node.js project for demonstrating packet.json usage&quot;</code></li>
<li><strong>描述</strong>：项目的简短描述，帮助他人快速了解项目的用途。在 npm 仓库或项目介绍中，该描述能让潜在使用者或贡献者快速知晓项目的核心功能和应用场景。</li>
</ul>
</li>
<li><strong>main</strong>
<ul>
<li><strong>在样例中的体现</strong>：<code v-pre>&quot;main&quot;: &quot;index.js&quot;</code></li>
<li><strong>描述</strong>：指定项目的入口文件，当其他项目引入当前项目时，默认会从该文件开始执行。如果没有设置该字段，npm 会根据约定查找<code v-pre>index.js</code>等常见入口文件，但显式设置可以避免歧义。</li>
</ul>
</li>
<li><strong>keywords</strong>
<ul>
<li><strong>在样例中的体现</strong>：</li>
</ul>
<div class="language-json line-numbers-mode" data-highlighter="shiki" data-ext="json" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-json"><span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"keywords"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: [</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">  "nodejs"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">  "example"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">  "packetjson"</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">]</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><strong>描述</strong>：是一个字符串数组，用于设置项目的关键词，方便在 npm 仓库或搜索引擎中通过关键词搜索到项目。这些关键词应能准确概括项目的核心特点、技术领域或应用方向。</li>
</ul>
</li>
<li><strong>author</strong>
<ul>
<li><strong>在样例中的体现</strong>：<code v-pre>&quot;author&quot;: &quot;John Doe&quot;</code></li>
<li><strong>描述</strong>：记录项目的作者信息，通常是作者的姓名。也可以写成更详细的格式，如<code v-pre>&quot;author&quot;: &quot;John Doe &lt;johndoe@example.com&gt; (https://www.example.com/johndoe)&quot;</code>，包含作者邮箱和个人网站。</li>
</ul>
</li>
<li><strong>license</strong>
<ul>
<li><strong>在样例中的体现</strong>：<code v-pre>&quot;license&quot;: &quot;MIT&quot;</code></li>
<li><strong>描述</strong>：指定项目的开源许可证，明确他人使用、修改和分发项目代码的权限。常见的许可证如<code v-pre>MIT</code>、<code v-pre>Apache - 2.0</code>等。如果项目是闭源的，可以使用<code v-pre>UNLICENSED</code>。</li>
</ul>
</li>
</ol>
<h4 id="_2-2-依赖管理字段" tabindex="-1"><a class="header-anchor" href="#_2-2-依赖管理字段"><span>2.2 依赖管理字段</span></a></h4>
<ol>
<li><strong>dependencies</strong>
<ul>
<li><strong>在样例中的体现</strong>：</li>
</ul>
<div class="language-json line-numbers-mode" data-highlighter="shiki" data-ext="json" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-json"><span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"dependencies"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  "express"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"^4.18.2"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  "mysql"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"^2.3.3"</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><strong>描述</strong>：记录项目运行时所依赖的包及其版本号。这些依赖在生产环境中是必需的。版本号可以使用精确版本号（如<code v-pre>&quot;lodash&quot;: &quot;4.17.21&quot;</code>）、范围版本号（如<code v-pre>&quot;react&quot;: &quot;^18.2.0&quot;</code>，表示大于等于 18.2.0 且小于 19.0.0 的版本）等多种形式。例如在样例中，项目运行时依赖<code v-pre>express</code>框架和<code v-pre>mysql</code>数据库驱动包。</li>
</ul>
</li>
<li><strong>devDependencies</strong>
<ul>
<li><strong>在样例中的体现</strong>：</li>
</ul>
<div class="language-json line-numbers-mode" data-highlighter="shiki" data-ext="json" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-json"><span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"devDependencies"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  "webpack"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"^5.75.0"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  "jest"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"^29.5.0"</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><strong>描述</strong>：记录项目开发过程中所依赖的包，如构建工具（如<code v-pre>webpack</code>）、测试框架（如<code v-pre>jest</code>）等。这些依赖在生产环境中通常不需要。样例中，<code v-pre>webpack</code>用于项目的打包构建，<code v-pre>jest</code>用于编写和运行测试用例，它们仅在开发阶段发挥作用。</li>
</ul>
</li>
<li><strong>peerDependencies</strong>
<ul>
<li><strong>在样例中未体现，补充示例</strong>：</li>
</ul>
<div class="language-json line-numbers-mode" data-highlighter="shiki" data-ext="json" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-json"><span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"peerDependencies"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  "react"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"^18.0.0"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  "react-dom"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"^18.0.0"</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><strong>描述</strong>：指定当前包所依赖的其他包的版本范围，这些依赖由使用当前包的项目来安装和管理，而不是当前包本身。常用于插件类库，确保插件与宿主环境的兼容性。</li>
</ul>
</li>
</ol>
<h4 id="_2-3-脚本命令字段" tabindex="-1"><a class="header-anchor" href="#_2-3-脚本命令字段"><span>2.3 脚本命令字段</span></a></h4>
<ol>
<li><strong>scripts</strong>
<ul>
<li><strong>在样例中的体现</strong>：</li>
</ul>
<div class="language-json line-numbers-mode" data-highlighter="shiki" data-ext="json" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-json"><span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"scripts"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  "start"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"node index.js"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  "build"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"webpack --config webpack.config.js"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  "test"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"jest"</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><strong>描述</strong>：定义一系列可通过<code v-pre>npm</code>命令执行的脚本。常见的脚本如<code v-pre>start</code>（启动项目）、<code v-pre>build</code>（构建项目）、<code v-pre>test</code>（运行测试）等。脚本可以使用<code v-pre>&amp;&amp;</code>、<code v-pre>||</code>等逻辑运算符组合多个命令。例如在样例中，<code v-pre>npm run start</code>会执行<code v-pre>node index.js</code>启动项目，<code v-pre>npm run build</code>会使用<code v-pre>webpack</code>进行项目构建，<code v-pre>npm run test</code>会运行<code v-pre>jest</code>进行测试。</li>
<li><strong>特殊脚本</strong>：
<ul>
<li><code v-pre>pre</code>和<code v-pre>post</code>前缀：可以为已有的脚本添加前置和后置脚本。例如，定义<code v-pre>&quot;pretest&quot;: &quot;eslint src&quot;</code>和<code v-pre>&quot;test&quot;: &quot;jest&quot;</code>，在执行<code v-pre>npm test</code>时，会先执行<code v-pre>eslint src</code>，然后再执行<code v-pre>jest</code>。</li>
</ul>
</li>
</ul>
</li>
</ol>
<h4 id="_2-4-其他字段" tabindex="-1"><a class="header-anchor" href="#_2-4-其他字段"><span>2.4 其他字段</span></a></h4>
<ol>
<li><strong>engines</strong>
<ul>
<li><strong>在样例中的体现</strong>：</li>
</ul>
<div class="language-json line-numbers-mode" data-highlighter="shiki" data-ext="json" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-json"><span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"engines"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  "node"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">">=14.0.0"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  "npm"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">">=6.0.0"</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><strong>描述</strong>：指定项目运行所需的 Node.js 版本、npm 版本等环境要求。例如，<code v-pre>&quot;engines&quot;: {&quot;node&quot;: &quot;&gt;=14.0.0&quot;, &quot;npm&quot;: &quot;&gt;=6.0.0&quot;}</code>表示项目需要在 Node.js 14.0.0 及以上版本和 npm 6.0.0 及以上版本的环境中运行。这有助于确保项目在合适的运行环境中稳定执行，避免因环境版本不兼容导致的问题。</li>
</ul>
</li>
<li><strong>repository</strong>
<ul>
<li><strong>在样例中的体现</strong>：</li>
</ul>
<div class="language-json line-numbers-mode" data-highlighter="shiki" data-ext="json" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-json"><span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"repository"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  "type"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"git"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  "url"</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">"https://github.com/user/my-project.git"</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><strong>描述</strong>：指定项目的代码仓库地址，方便他人获取项目源代码。可以是 Git 仓库、Subversion 仓库等。如果是 Git 仓库，常见的格式为<code v-pre>{ &quot;type&quot;: &quot;git&quot;, &quot;url&quot;: &quot;https://github.com/user/repo.git&quot; }</code>。通过该字段，开发者可以快速定位到项目的代码仓库，进行代码查看、下载和贡献等操作。</li>
</ul>
</li>
</ol>
<h3 id="三、操作命令" tabindex="-1"><a class="header-anchor" href="#三、操作命令"><span>三、操作命令</span></a></h3>
<h4 id="_3-1-初始化packet-json" tabindex="-1"><a class="header-anchor" href="#_3-1-初始化packet-json"><span>3.1 初始化<code v-pre>packet.json</code></span></a></h4>
<p>在项目根目录下运行<code v-pre>npm init</code>命令，按照提示输入项目相关信息，即可生成<code v-pre>packet.json</code>文件。也可以使用<code v-pre>npm init -y</code>命令，快速生成一个包含默认值的<code v-pre>packet.json</code>文件。</p>
<h4 id="_3-2-安装依赖" tabindex="-1"><a class="header-anchor" href="#_3-2-安装依赖"><span>3.2 安装依赖</span></a></h4>
<ol>
<li><strong>安装生产环境依赖</strong>：使用<code v-pre>npm install &lt;package-name&gt; --save</code>（npm 5 之前）或<code v-pre>npm install &lt;package-name&gt;</code>（npm 5 及之后），安装的包会自动添加到<code v-pre>dependencies</code>字段中。</li>
<li><strong>安装开发环境依赖</strong>：使用<code v-pre>npm install &lt;package-name&gt; --save-dev</code>，安装的包会添加到<code v-pre>devDependencies</code>字段中。</li>
</ol>
<h4 id="_3-3-更新依赖" tabindex="-1"><a class="header-anchor" href="#_3-3-更新依赖"><span>3.3 更新依赖</span></a></h4>
<ol>
<li><strong>更新单个依赖</strong>：使用<code v-pre>npm update &lt;package-name&gt;</code>，会将依赖更新到符合版本范围的最新版本。</li>
<li><strong>更新所有依赖</strong>：使用<code v-pre>npm update</code>，会更新所有符合版本范围的依赖。</li>
</ol>
<h4 id="_3-4-运行脚本" tabindex="-1"><a class="header-anchor" href="#_3-4-运行脚本"><span>3.4 运行脚本</span></a></h4>
<p>使用<code v-pre>npm run &lt;script-name&gt;</code>命令运行在<code v-pre>scripts</code>字段中定义的脚本。例如，运行<code v-pre>start</code>脚本，可执行<code v-pre>npm run start</code>。</p>
<h3 id="四、注意事项" tabindex="-1"><a class="header-anchor" href="#四、注意事项"><span>四、注意事项</span></a></h3>
<ol>
<li><strong>版本管理</strong>：在更新依赖版本时，要谨慎操作，尤其是主版本号的变更，可能会导致项目出现不兼容问题。建议在更新前进行充分的测试。</li>
<li><strong>依赖冲突</strong>：当安装多个依赖时，可能会出现依赖版本冲突的情况。可以通过调整依赖版本范围或使用<code v-pre>npm-force-resolutions</code>等工具来解决冲突。</li>
<li><strong>安全问题</strong>：定期检查和更新依赖包，以修复可能存在的安全漏洞。可以使用<code v-pre>npm audit</code>命令检查项目依赖中的安全问题，并按照提示进行修复。</li>
</ol>
<h2 id="pnpm-lock-yaml" tabindex="-1"><a class="header-anchor" href="#pnpm-lock-yaml"><span>pnpm-lock.yaml</span></a></h2>
<h3 id="一、文件样例-1" tabindex="-1"><a class="header-anchor" href="#一、文件样例-1"><span>一、文件样例</span></a></h3>
<div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-yaml"><span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">lockfileVersion</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">5.4</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">specifiers</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  express</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">^4.18.2</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  mysql</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">^2.3.3</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  webpack</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">^5.75.0</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  jest</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">^29.5.0</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">dependencies</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  express</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">4.18.2</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  mysql</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">2.3.3</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">devDependencies</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  webpack</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">5.75.0_jest@29.5.0+tslib@2.6.2</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  jest</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">29.5.0+tslib@2.6.2</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">packages</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  /accepts/1.3.8</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    resolution</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: {</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">integrity</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">sha512-PYAthTa2m2VKxuvSD3DPC/Gy+U+sOA1LAuT8mkmRuvw+NACSaeXEQ+NHcVF7rK6jdmv+DHqW0g/7LbPO/Q==</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    dependencies</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">      mime-types</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">2.1.35</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">      negotiator</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">0.6.3</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    dev</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">false</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  /express/4.18.2</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    resolution</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: {</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">integrity</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">sha512-JJ8rS9wP5pz8Q8lQl2pB1xqF985bH2nQJQ+q5l7W3w7W3W3W3W3W3W3W3W3W3==</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">} </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic"># 示例哈希值</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    engines</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: {</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">node</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">'>=0.10.0'</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    dependencies</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">      accepts</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">1.3.8</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">      array-flatten</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">1.1.1</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">      content-disposition</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">0.5.4</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">      # 其他依赖...</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    dev</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">false</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">  # 其他包...</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="二、文件结构与字段详解-1" tabindex="-1"><a class="header-anchor" href="#二、文件结构与字段详解-1"><span>二、文件结构与字段详解</span></a></h3>
<h4 id="_2-1-元数据字段" tabindex="-1"><a class="header-anchor" href="#_2-1-元数据字段"><span>2.1 元数据字段</span></a></h4>
<ol>
<li>
<p><strong>lockfileVersion</strong></p>
<ul>
<li><strong>在样例中的体现</strong>：<code v-pre>lockfileVersion: 5.4</code></li>
<li><strong>描述</strong>：指定锁文件的版本格式。不同版本的pnpm可能使用不同的锁文件格式，该字段确保pnpm能够正确解析锁文件。升级pnpm时，该版本号可能会变化。</li>
</ul>
</li>
<li>
<p><strong>specifiers</strong></p>
<ul>
<li><strong>在样例中的体现</strong>：<div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-yaml"><span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">specifiers</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  express</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">^4.18.2</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  mysql</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">^2.3.3</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  webpack</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">^5.75.0</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  jest</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">^29.5.0</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li><strong>描述</strong>：记录package.json中声明的依赖及其版本范围（semver规范）。这反映了开发者期望使用的依赖版本，而不是实际安装的版本。</li>
</ul>
</li>
</ol>
<h4 id="_2-2-依赖列表字段" tabindex="-1"><a class="header-anchor" href="#_2-2-依赖列表字段"><span>2.2 依赖列表字段</span></a></h4>
<ol>
<li>
<p><strong>dependencies</strong></p>
<ul>
<li><strong>在样例中的体现</strong>：<div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-yaml"><span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">dependencies</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  express</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">4.18.2</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  mysql</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">2.3.3</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li><strong>描述</strong>：记录生产环境依赖的实际安装版本。这些版本是根据specifiers中的范围和依赖树解析后确定的具体版本。</li>
</ul>
</li>
<li>
<p><strong>devDependencies</strong></p>
<ul>
<li><strong>在样例中的体现</strong>：<div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-yaml"><span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">devDependencies</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  webpack</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">5.75.0_jest@29.5.0+tslib@2.6.2</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  jest</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">29.5.0+tslib@2.6.2</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li><strong>描述</strong>：记录开发环境依赖的实际安装版本。版本号后的后缀（如<code v-pre>_jest@29.5.0+tslib@2.6.2</code>）表示该包的特定依赖组合，确保复现相同的依赖树。</li>
</ul>
</li>
</ol>
<h4 id="_2-3-包详情字段" tabindex="-1"><a class="header-anchor" href="#_2-3-包详情字段"><span>2.3 包详情字段</span></a></h4>
<ol>
<li>
<p><strong>packages</strong></p>
<ul>
<li><strong>在样例中的体现</strong>：<div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-yaml"><span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">packages</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  /accepts/1.3.8</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    resolution</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: {</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">integrity</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">sha512-...</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">}</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    dependencies</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">:</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">      mime-types</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">2.1.35</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">      negotiator</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">0.6.3</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    dev</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">: </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">false</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li><strong>描述</strong>：详细记录每个安装包的信息，采用<code v-pre>/包名/版本号</code>的路径格式组织。每个包包含以下关键子字段：</li>
</ul>
</li>
<li>
<p><strong>resolution</strong></p>
<ul>
<li><strong>在样例中的体现</strong>：<code v-pre>resolution: {integrity: sha512-PYAthTa2m2VKxuvSD3DPC/Gy+U+sOA1LAuT8mkmRuvw+NACSaeXEQ+NHcVF7rK6jdmv+DHqW0g/7LbPO/Q==}</code></li>
<li><strong>描述</strong>：包含包的完整性校验信息（如SHA-512哈希值），确保下载的包与发布时的内容一致，防止篡改或损坏。</li>
</ul>
</li>
<li>
<p><strong>dependencies</strong></p>
<ul>
<li><strong>描述</strong>：记录该包自身依赖的其他包及其版本。这是递归构建整个依赖树的关键信息。</li>
</ul>
</li>
<li>
<p><strong>dev</strong></p>
<ul>
<li><strong>描述</strong>：布尔值，表示该包是否仅用于开发环境。<code v-pre>false</code>表示生产环境依赖，<code v-pre>true</code>表示开发环境依赖。</li>
</ul>
</li>
<li>
<p><strong>engines</strong></p>
<ul>
<li><strong>描述</strong>：指定包运行所需的Node.js版本或其他环境要求，与package.json中的engines字段类似。</li>
</ul>
</li>
</ol>
<h3 id="三、操作命令-1" tabindex="-1"><a class="header-anchor" href="#三、操作命令-1"><span>三、操作命令</span></a></h3>
<h4 id="_3-1-生成pnpm-lock-yaml" tabindex="-1"><a class="header-anchor" href="#_3-1-生成pnpm-lock-yaml"><span>3.1 生成pnpm-lock.yaml</span></a></h4>
<ul>
<li>在项目中首次执行<code v-pre>pnpm install</code>时会自动生成或更新该文件。</li>
<li>使用<code v-pre>pnpm install --lockfile-only</code>仅更新锁文件而不安装依赖。</li>
</ul>
<h4 id="_3-2-锁定依赖版本" tabindex="-1"><a class="header-anchor" href="#_3-2-锁定依赖版本"><span>3.2 锁定依赖版本</span></a></h4>
<ul>
<li>默认情况下，pnpm会根据package.json中的版本范围安装最新可用版本，并将确切版本写入锁文件。</li>
<li>使用<code v-pre>pnpm install --save-exact</code>安装精确版本（无版本范围符号）。</li>
</ul>
<h4 id="_3-3-重现依赖环境" tabindex="-1"><a class="header-anchor" href="#_3-3-重现依赖环境"><span>3.3 重现依赖环境</span></a></h4>
<ul>
<li>在新环境中执行<code v-pre>pnpm install</code>时，pnpm会严格按照lock文件中的版本和依赖关系安装，确保环境一致性。</li>
</ul>
<h4 id="_3-4-更新依赖" tabindex="-1"><a class="header-anchor" href="#_3-4-更新依赖"><span>3.4 更新依赖</span></a></h4>
<ul>
<li>使用<code v-pre>pnpm update &lt;package-name&gt;</code>更新单个依赖，会更新lock文件。</li>
<li>使用<code v-pre>pnpm update --latest</code>更新所有依赖到最新版本（遵循package.json中的版本范围）。</li>
</ul>
<h3 id="四、注意事项-1" tabindex="-1"><a class="header-anchor" href="#四、注意事项-1"><span>四、注意事项</span></a></h3>
<ol>
<li>
<p><strong>版本锁定</strong></p>
<ul>
<li>pnpm-lock.yaml确保团队成员和生产环境使用完全相同的依赖版本，避免因版本差异导致的问题。</li>
</ul>
</li>
<li>
<p><strong>提交到版本控制</strong></p>
<ul>
<li>建议将pnpm-lock.yaml提交到版本控制系统（如Git），确保所有环境使用一致的依赖。</li>
</ul>
</li>
<li>
<p><strong>依赖冲突</strong></p>
<ul>
<li>pnpm使用内容可寻址存储（CAS）和硬链接技术，同一依赖的相同版本只会存储一次，节省磁盘空间。</li>
</ul>
</li>
<li>
<p><strong>安全审计</strong></p>
<ul>
<li>使用<code v-pre>pnpm audit</code>检查依赖中的安全漏洞，该命令会参考lock文件中的版本信息。</li>
</ul>
</li>
<li>
<p><strong>与其他包管理器的兼容性</strong></p>
<ul>
<li>pnpm-lock.yaml是pnpm特有的格式，与npm或yarn的锁文件不兼容。混合使用可能导致依赖不一致。</li>
</ul>
</li>
</ol>
</div></template>


