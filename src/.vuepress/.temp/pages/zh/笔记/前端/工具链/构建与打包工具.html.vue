<template><div><h1 id="构建与打包工具" tabindex="-1"><a class="header-anchor" href="#构建与打包工具"><span>构建与打包工具</span></a></h1>
<h2 id="一、核心概念" tabindex="-1"><a class="header-anchor" href="#一、核心概念"><span>一、核心概念</span></a></h2>
<ol>
<li>什么是前端构建与打包？
<ul>
<li><strong>构建（Build）</strong>：指将源代码经过转换、优化、合并等一系列处理，生成可运行代码的过程，包括语法转换（如 ES6→ES5）、资源处理（图片压缩、字体转换）、代码分割等。</li>
<li><strong>打包（Packaging）</strong>：将多个分散的模块（如 JavaScript、CSS、图片等）整合为少量文件，减少浏览器请求次数，提升加载性能。</li>
</ul>
</li>
<li>为什么需要构建与打包工具？
<ul>
<li><strong>解决技术栈复杂性</strong>：处理 ES6+、TypeScript、JSX/TSX、SASS/Less 等现代技术栈的兼容性问题。</li>
<li><strong>优化性能</strong>：压缩代码、Tree Shaking（移除未使用代码）、代码分割（按需加载）、资源缓存等。</li>
<li><strong>提升开发效率</strong>：自动化流程（如热更新、自动编译）、模块化管理、多环境部署（开发 / 测试 / 生产）。</li>
</ul>
</li>
</ol>
<h2 id="二、主流前端构建与打包工具" tabindex="-1"><a class="header-anchor" href="#二、主流前端构建与打包工具"><span>二、主流前端构建与打包工具</span></a></h2>
<h3 id="_1-webpack-最主流的模块化打包器" tabindex="-1"><a class="header-anchor" href="#_1-webpack-最主流的模块化打包器"><span>1. Webpack（最主流的模块化打包器）</span></a></h3>
<ul>
<li><strong>定位</strong>：适用于中大型应用开发，支持高度定制化。</li>
<li><strong>核心特点</strong>
<ul>
<li><strong>模块化处理</strong>：将任何资源（JS、CSS、图片等）视为模块，通过loader和plugin扩展能力。</li>
<li><strong>核心概念</strong>：
<ul>
<li><strong>入口（Entry）</strong>：定义打包起点（如index.js）。</li>
<li><strong>出口（Output）</strong>：指定打包后的文件路径和命名规则。</li>
<li><strong>Loader</strong>：转换文件类型（如babel-loader转 ES6，css-loader处理 CSS）。</li>
<li><strong>Plugin</strong>：扩展打包功能（如HtmlWebpackPlugin生成 HTML，MiniCssExtractPlugin提取 CSS）。</li>
</ul>
</li>
<li><strong>性能优化</strong>：代码分割（import()动态导入）、缓存（cache: true）、多线程构建（thread-loader）。</li>
</ul>
</li>
<li><strong>适用场景</strong>：复杂的单页应用（如 React、Vue 大型项目）、需要高度定制化的场景。</li>
</ul>
<h4 id="示例配置" tabindex="-1"><a class="header-anchor" href="#示例配置"><span>示例配置</span></a></h4>
<p>基本项目结构:</p>
<div class="language-lua line-numbers-mode" data-highlighter="shiki" data-ext="lua" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-lua"><span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">project</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">/</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">├── </span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">dist</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">/</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">├── </span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">src</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">/</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">│   ├── </span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">index</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.js</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">│   └── </span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">style</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.css</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">├── </span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">webpack</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.config.js</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">├── </span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">package</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.json</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>webpack.config.js</code> 配置:</p>
<div class="language-js line-numbers-mode" data-highlighter="shiki" data-ext="js" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-js"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">const</span><span style="--shiki-light:#986801;--shiki-dark:#E5C07B"> path</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> require</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">'path'</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">);</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">const</span><span style="--shiki-light:#986801;--shiki-dark:#E5C07B"> HtmlWebpackPlugin</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> require</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">'html-webpack-plugin'</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">);   </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 会帮我们自动生成 HTML 文件，并自动注入打包后的 JS 文件。</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">module</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">exports</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  entry</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> './src/index.js'</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,  </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 入口文件</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  output</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    filename</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> '[name].[contenthash].js'</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 输出文件名。[name] 是 chunk 名，[contenthash] 是防缓存用的哈希值。</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    path</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B"> path</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">resolve</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">(</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75">__dirname</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">'dist'</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">),  </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 输出目录，必须是绝对路径</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    clean</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> true</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 每次构建清理 dist</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">  },</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  module</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    rules</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> [</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">      {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">        test</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#0184BC;--shiki-dark:#E06C75"> /</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">\.</span><span style="--shiki-light:#0184BC;--shiki-dark:#E06C75">css</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">$</span><span style="--shiki-light:#0184BC;--shiki-dark:#E06C75">/</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">i</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,    </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 匹配所有 .css 文件</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">        use</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> [</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">'style-loader'</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">'css-loader'</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">], </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 顺序重要，先 css-loader 再 style-loader</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">        // 用 css-loader 解析 CSS 引入（如 @import），再由 style-loader 将 CSS 插入到 HTML 的 &#x3C;style> 标签中。</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">      },</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">      {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">        test</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#0184BC;--shiki-dark:#E06C75"> /</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">\.</span><span style="--shiki-light:#0184BC;--shiki-dark:#E06C75">js</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">$</span><span style="--shiki-light:#0184BC;--shiki-dark:#E06C75">/</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">        exclude</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#0184BC;--shiki-dark:#E06C75"> /node_modules/</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">        use</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> [</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">'babel-loader'</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">], </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// ES6+ 转译</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">        // 对所有 .js 文件（不包含 node_modules），使用 babel-loader 将 ES6+ 转成浏览器兼容代码。</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">      }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">    ]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">  },</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  plugins</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> [</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">    new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> HtmlWebpackPlugin</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">({</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">      template</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> './src/index.html'</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">    })</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">    // 生成 HTML 并自动引入打包后的 JS 文件，template 是指定使用哪个 HTML 模板。</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">  ],</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  devServer</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {  </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 配置开发服务器</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    static</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> './dist'</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,   </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 指定静态文件目录</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    open</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> true</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,         </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 启动后自动打开浏览器</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    hot</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> true</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">           // 启用热模块替换（HMR）</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">  },</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  mode</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> 'development'</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">   // 构建模式，可选值为 'development' | 'production' | 'none'。影响构建优化行为</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">};</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>生产构建模式：使用 <code v-pre>mode: 'production'</code> 会自动开启压缩、tree-shaking 等优化。</p>
<h3 id="_2-vite-新一代前端构建工具-主打快速开发" tabindex="-1"><a class="header-anchor" href="#_2-vite-新一代前端构建工具-主打快速开发"><span>2. Vite（新一代前端构建工具，主打快速开发）</span></a></h3>
<ul>
<li><strong>定位</strong>：适用于现代框架（Vue、React）的开发，尤其适合开发阶段的高效迭代。</li>
<li><strong>核心特点</strong>：
<ul>
<li><strong>基于 ES 模块（ES Modules）</strong>：开发时直接利用浏览器原生模块系统，无需打包，冷启动速度极快。</li>
<li><strong>高效热更新（HMR）</strong>：仅更新变化的模块，不刷新页面，更新速度与项目大小无关。</li>
<li><strong>构建阶段</strong>：使用esbuild（Go 语言编写，比 Webpack 快 20-100 倍）进行代码压缩和优化。</li>
</ul>
</li>
</ul>
<h4 id="示例配置-1" tabindex="-1"><a class="header-anchor" href="#示例配置-1"><span>示例配置</span></a></h4>
<p>项目初始化:</p>
<div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">npm</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> create</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> vite@latest</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> my-vite-app</span></span>
<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2">cd</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> my-vite-app</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">npm</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> install</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>vite.config.js</code> 基础配置:</p>
<div class="language-js line-numbers-mode" data-highlighter="shiki" data-ext="js" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-js"><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">import</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> { </span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">defineConfig</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> } </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">from</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> 'vite'</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;    </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// Vite 推荐用 defineConfig 包裹配置（提供类型提示）</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">import</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75"> vue</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> from</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> '@vitejs/plugin-vue'</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">;   </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 加载 Vue 插件支持 .vue 文件解析（如果是 React 则换成 @vitejs/plugin-react）</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">export</span><span style="--shiki-light:#E45649;--shiki-dark:#C678DD"> default</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF"> defineConfig</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">({</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  plugins</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> [</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">vue</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">()], </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 插件数组 Vite 依赖插件来实现各种编译能力，如 Vue 支持、自动压缩等</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  server</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> { </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 开发服务器配置</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    port</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> 3000</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 设置端口</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    open</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> true</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">, </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 自动打开浏览器</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    proxy</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {    </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 本地开发代理，避免跨域问题，将 /api 转发到后端服务</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">      '/api'</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">        target</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> 'http://localhost:8000'</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">        changeOrigin</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> true</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">      }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">    }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">  },</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  build</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {  </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 构建时相关配置</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    outDir</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> 'dist'</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,         </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 输出目录</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    assetsDir</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> 'assets'</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,    </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 静态资源目录名</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    sourcemap</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> true</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">         // 是否生成 .map 文件，用于调试源码</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">  },</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">  resolve</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {    </span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// 设置路径别名，@ 等于 /src，在导入模块时更简洁</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">    alias</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> {</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379">      '@'</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> '/src'</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">,</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">    }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">  }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">});</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>TS 支持配置（可选）</p>
<div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-bash"><span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">npm</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> install</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> -D</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379"> typescript</span></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF">tsc</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66"> --init</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>Vite 原生支持 TS，自动识别 .ts 和 .vue 文件中的类型。</p>
<h3 id="_3-esbuild" tabindex="-1"><a class="header-anchor" href="#_3-esbuild"><span>3. ESBuild</span></a></h3>
<p>基于 Go 语言开发的现代 JavaScript/TypeScript 构建工具，以极快的编译速度著称（比传统工具如 Webpack、Babel 快 10-100 倍），同时支持打包、压缩、代码分割等功能</p>
<h3 id="_4-工具对比" tabindex="-1"><a class="header-anchor" href="#_4-工具对比"><span>4. 工具对比</span></a></h3>
<table>
<thead>
<tr>
<th>功能/工具</th>
<th>Webpack</th>
<th>Vite</th>
<th>esbuild</th>
</tr>
</thead>
<tbody>
<tr>
<td>配置方式</td>
<td>JS 文件配置，模块化强</td>
<td>使用 <code v-pre>defineConfig</code>，简单明了</td>
<td>JS 脚本或 CLI 参数方式</td>
</tr>
<tr>
<td>静态资源</td>
<td>需要 loader 处理</td>
<td>原生支持</td>
<td>通过 loader 指定</td>
</tr>
<tr>
<td>热更新</td>
<td><code v-pre>webpack-dev-server</code> 较慢</td>
<td>原生超快 HMR</td>
<td>手动实现或借助第三方</td>
</tr>
<tr>
<td>插件生态</td>
<td>成熟但配置复杂</td>
<td>丰富且现代</td>
<td>较少，但支持基本场景</td>
</tr>
<tr>
<td>适合谁</td>
<td>自定义控制强、打包逻辑复杂的项目</td>
<td>日常 Vue/React 开发项目</td>
<td>极端追求性能的工具、库打包</td>
</tr>
</tbody>
</table>
</div></template>


