<template><div><h1 id="包管理器" tabindex="-1"><a class="header-anchor" href="#包管理器"><span>包管理器</span></a></h1>
<p>包管理器是现代前端开发中至关重要的工具，用于自动化依赖管理、版本控制和构建流程。</p>
<h2 id="一、核心功能与作用" tabindex="-1"><a class="header-anchor" href="#一、核心功能与作用"><span>一、核心功能与作用</span></a></h2>
<ol>
<li>依赖管理
<ul>
<li>自动下载和安装项目所需的第三方库（如 React、Vue、Lodash）。</li>
<li>解决依赖冲突（如多个包依赖同一库的不同版本）。</li>
</ul>
</li>
<li>版本控制
<ul>
<li>通过 <code v-pre>package.json</code> 锁定依赖版本，确保团队成员和生产环境使用相同的版本。</li>
<li>支持语义化版本（SemVer），如 <code v-pre>^1.2.3</code> 表示兼容主版本，<code v-pre>~1.2.3</code> 表示兼容次版本。</li>
</ul>
</li>
<li>脚本自动化
<ul>
<li>通过 <code v-pre>package.json</code> 中的 <code v-pre>scripts</code> 字段定义命令（如 <code v-pre>npm run build</code>），简化构建、测试、部署流程。</li>
</ul>
</li>
<li>缓存机制
<ul>
<li>本地缓存已下载的包，加速后续安装过程。</li>
</ul>
</li>
</ol>
<h2 id="二、主流包管理器" tabindex="-1"><a class="header-anchor" href="#二、主流包管理器"><span>二、主流包管理器</span></a></h2>
<h3 id="_1-npm-node-package-manager" tabindex="-1"><a class="header-anchor" href="#_1-npm-node-package-manager"><span>1. npm（Node Package Manager）</span></a></h3>
<ul>
<li>特点：
<ul>
<li>历史悠久：随 Node.js 诞生，生态系统最庞大。</li>
<li>支持范围广：不仅管理前端依赖，还支持后端和 CLI 工具。</li>
<li>默认平铺安装：npm v3+ 将依赖平铺在 node_modules 中，减少嵌套层级。</li>
</ul>
</li>
<li>缺点：
<ul>
<li>安装速度较慢（依赖树深时尤甚）。</li>
<li>依赖重复安装导致体积庞大。</li>
</ul>
</li>
<li>适用场景：初学者、需要访问全量 npm 包的项目。</li>
</ul>
<h3 id="_2-pnpm-performant-npm-优先考虑使用" tabindex="-1"><a class="header-anchor" href="#_2-pnpm-performant-npm-优先考虑使用"><span>2. <mark>pnpm（Performant npm） 优先考虑使用</mark></span></a></h3>
<ul>
<li>特点：
<ul>
<li>空间效率高：通过硬链接复用包，磁盘占用减少 70%+。</li>
<li>安装速度极快：依赖预构建和增量更新。</li>
<li>严格依赖隔离：默认禁止访问未声明的依赖，避免幽灵依赖（Ghost Dependencies）。</li>
</ul>
</li>
<li>缺点：
<ul>
<li>兼容性问题：部分工具（如 Webpack 5）需额外配置。</li>
</ul>
</li>
<li>适用场景：大型单体应用、Monorepo（多包仓库）。</li>
</ul>
<h3 id="_3-yarn-yet-another-resource-negotiator" tabindex="-1"><a class="header-anchor" href="#_3-yarn-yet-another-resource-negotiator"><span>3. Yarn（Yet Another Resource Negotiator）</span></a></h3>
<h3 id="_4-bun" tabindex="-1"><a class="header-anchor" href="#_4-bun"><span>4. Bun</span></a></h3>
</div></template>


