<template><div><h1 id="npm-和-pnpm-常用命令开发文档" tabindex="-1"><a class="header-anchor" href="#npm-和-pnpm-常用命令开发文档"><span>npm 和 pnpm 常用命令开发文档</span></a></h1>
<h2 id="一、概述" tabindex="-1"><a class="header-anchor" href="#一、概述"><span>一、概述</span></a></h2>
<p>npm（Node Package Manager）和 pnpm（Performant npm）是 Node.js 生态系统中用于管理项目依赖、运行脚本的工具。本文档详细列出两者在不同开发场景下的常用命令，帮助开发者快速上手和切换使用。</p>
<h2 id="二、项目初始化" tabindex="-1"><a class="header-anchor" href="#二、项目初始化"><span>二、项目初始化</span></a></h2>
<table>
<thead>
<tr>
<th>操作</th>
<th>npm 命令</th>
<th>pnpm 命令</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>交互式初始化项目</td>
<td><code v-pre>npm init</code></td>
<td><code v-pre>pnpm init</code></td>
<td>生成 package.json 文件，配置项目元数据</td>
</tr>
<tr>
<td>快速初始化项目</td>
<td><code v-pre>npm init -y</code></td>
<td><code v-pre>pnpm init -y</code></td>
<td>使用默认配置，跳过交互步骤</td>
</tr>
</tbody>
</table>
<h2 id="三、依赖管理" tabindex="-1"><a class="header-anchor" href="#三、依赖管理"><span>三、依赖管理</span></a></h2>
<h3 id="_3-1-安装依赖" tabindex="-1"><a class="header-anchor" href="#_3-1-安装依赖"><span>3.1 安装依赖</span></a></h3>
<table>
<thead>
<tr>
<th>操作</th>
<th>npm 命令</th>
<th>pnpm 命令</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>安装所有依赖</td>
<td><code v-pre>npm install</code> 或 <code v-pre>npm i</code></td>
<td><code v-pre>pnpm install</code> 或 <code v-pre>pnpm i</code></td>
<td>安装 package.json 中定义的所有依赖</td>
</tr>
<tr>
<td>安装生产依赖</td>
<td><code v-pre>npm install &lt;包名&gt;</code></td>
<td><code v-pre>pnpm add &lt;包名&gt;</code></td>
<td>安装包并添加到 dependencies</td>
</tr>
<tr>
<td>安装开发依赖</td>
<td><code v-pre>npm install -D &lt;包名&gt;</code></td>
<td><code v-pre>pnpm add -D &lt;包名&gt;</code></td>
<td>安装包并添加到 devDependencies</td>
</tr>
<tr>
<td>安装指定版本</td>
<td><code v-pre>npm install &lt;包名&gt;@&lt;版本号&gt;</code></td>
<td><code v-pre>pnpm add &lt;包名&gt;@&lt;版本号&gt;</code></td>
<td>安装指定版本的包</td>
</tr>
<tr>
<td>全局安装</td>
<td><code v-pre>npm install -g &lt;包名&gt;</code></td>
<td><code v-pre>pnpm add -g &lt;包名&gt;</code></td>
<td>全局安装包，可在任意项目中使用</td>
</tr>
</tbody>
</table>
<h3 id="_3-2-卸载依赖" tabindex="-1"><a class="header-anchor" href="#_3-2-卸载依赖"><span>3.2 卸载依赖</span></a></h3>
<table>
<thead>
<tr>
<th>操作</th>
<th>npm 命令</th>
<th>pnpm 命令</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>卸载指定包</td>
<td><code v-pre>npm uninstall &lt;包名&gt;</code></td>
<td><code v-pre>pnpm remove &lt;包名&gt;</code> 或 <code v-pre>pnpm rm &lt;包名&gt;</code></td>
<td>从项目中移除指定包</td>
</tr>
<tr>
<td>卸载全局包</td>
<td><code v-pre>npm uninstall -g &lt;包名&gt;</code></td>
<td><code v-pre>pnpm remove -g &lt;包名&gt;</code></td>
<td>从全局环境中移除指定包</td>
</tr>
</tbody>
</table>
<h3 id="_3-3-更新依赖" tabindex="-1"><a class="header-anchor" href="#_3-3-更新依赖"><span>3.3 更新依赖</span></a></h3>
<table>
<thead>
<tr>
<th>操作</th>
<th>npm 命令</th>
<th>pnpm 命令</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>更新所有依赖</td>
<td><code v-pre>npm update</code></td>
<td><code v-pre>pnpm update</code> 或 <code v-pre>pnpm up</code></td>
<td>更新所有依赖到最新兼容版本</td>
</tr>
<tr>
<td>更新指定包</td>
<td><code v-pre>npm update &lt;包名&gt;</code></td>
<td><code v-pre>pnpm update &lt;包名&gt;</code> 或 <code v-pre>pnpm up &lt;包名&gt;</code></td>
<td>更新指定包到最新兼容版本</td>
</tr>
<tr>
<td>查看可更新的依赖</td>
<td><code v-pre>npm outdated</code></td>
<td><code v-pre>pnpm outdated</code></td>
<td>列出所有可更新的依赖</td>
</tr>
</tbody>
</table>
<h2 id="四、脚本执行" tabindex="-1"><a class="header-anchor" href="#四、脚本执行"><span>四、脚本执行</span></a></h2>
<table>
<thead>
<tr>
<th>操作</th>
<th>npm 命令</th>
<th>pnpm 命令</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>运行自定义脚本</td>
<td><code v-pre>npm run &lt;脚本名&gt;</code></td>
<td><code v-pre>pnpm run &lt;脚本名&gt;</code> 或 <code v-pre>pnpm &lt;脚本名&gt;</code></td>
<td>执行 package.json 中 scripts 定义的脚本</td>
</tr>
<tr>
<td>运行测试脚本</td>
<td><code v-pre>npm test</code></td>
<td><code v-pre>pnpm test</code></td>
<td>运行测试脚本，通常对应 <code v-pre>test</code> 脚本</td>
</tr>
<tr>
<td>运行启动脚本</td>
<td><code v-pre>npm start</code></td>
<td><code v-pre>pnpm start</code></td>
<td>启动项目，通常对应 <code v-pre>start</code> 脚本</td>
</tr>
</tbody>
</table>
<h2 id="五、依赖查看与清理" tabindex="-1"><a class="header-anchor" href="#五、依赖查看与清理"><span>五、依赖查看与清理</span></a></h2>
<table>
<thead>
<tr>
<th>操作</th>
<th>npm 命令</th>
<th>pnpm 命令</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>查看依赖树</td>
<td><code v-pre>npm list</code> 或 <code v-pre>npm ls</code></td>
<td><code v-pre>pnpm list</code> 或 <code v-pre>pnpm ls</code></td>
<td>查看项目依赖结构</td>
</tr>
<tr>
<td>查看包详情</td>
<td><code v-pre>npm info &lt;包名&gt;</code></td>
<td><code v-pre>pnpm info &lt;包名&gt;</code></td>
<td>查看指定包的详细信息</td>
</tr>
<tr>
<td>清理缓存</td>
<td><code v-pre>npm cache clean --force</code></td>
<td><code v-pre>pnpm store prune</code></td>
<td>清理缓存，释放磁盘空间</td>
</tr>
<tr>
<td>查看全局存储路径</td>
<td>-</td>
<td><code v-pre>pnpm store path</code></td>
<td>查看 pnpm 全局存储路径</td>
</tr>
</tbody>
</table>
<h2 id="六、版本控制" tabindex="-1"><a class="header-anchor" href="#六、版本控制"><span>六、版本控制</span></a></h2>
<table>
<thead>
<tr>
<th>操作</th>
<th>npm 命令</th>
<th>pnpm 命令</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>更新包版本</td>
<td><code v-pre>npm version patch/minor/major</code></td>
<td><code v-pre>pnpm version patch/minor/major</code></td>
<td>按规则更新包版本号</td>
</tr>
<tr>
<td>查看包版本信息</td>
<td><code v-pre>npm view &lt;包名&gt; versions</code></td>
<td><code v-pre>pnpm view &lt;包名&gt; versions</code></td>
<td>查看包的所有可用版本</td>
</tr>
</tbody>
</table>
<h2 id="七、工作空间管理-多包项目" tabindex="-1"><a class="header-anchor" href="#七、工作空间管理-多包项目"><span>七、工作空间管理（多包项目）</span></a></h2>
<table>
<thead>
<tr>
<th>操作</th>
<th>npm 命令</th>
<th>pnpm 命令</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>初始化工作空间</td>
<td>在 package.json 配置<code v-pre>workspaces</code>字段后执行<code v-pre>npm install</code></td>
<td>在 pnpm-workspace.yaml 配置后执行<code v-pre>pnpm install</code></td>
<td>初始化多包项目工作空间</td>
</tr>
<tr>
<td>对所有包执行命令</td>
<td><code v-pre>npm run &lt;脚本名&gt; -w</code></td>
<td><code v-pre>pnpm recursive &lt;脚本名&gt;</code></td>
<td>对工作空间内所有包执行脚本</td>
</tr>
</tbody>
</table>
<h2 id="八、其他命令" tabindex="-1"><a class="header-anchor" href="#八、其他命令"><span>八、其他命令</span></a></h2>
<table>
<thead>
<tr>
<th>操作</th>
<th>npm 命令</th>
<th>pnpm 命令</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>登录 npm 账户</td>
<td><code v-pre>npm login</code></td>
<td><code v-pre>pnpm login</code></td>
<td>登录 npm 账户，用于发布包</td>
</tr>
<tr>
<td>发布包到 npm 仓库</td>
<td><code v-pre>npm publish</code></td>
<td><code v-pre>pnpm publish</code></td>
<td>将包发布到 npm 仓库</td>
</tr>
<tr>
<td>检查依赖安全漏洞</td>
<td><code v-pre>npm audit</code></td>
<td><code v-pre>pnpm audit</code></td>
<td>扫描项目依赖的安全漏洞</td>
</tr>
</tbody>
</table>
<h2 id="九、注意事项" tabindex="-1"><a class="header-anchor" href="#九、注意事项"><span>九、注意事项</span></a></h2>
<ol>
<li><strong>配置文件差异</strong>：npm 生成<code v-pre>package-lock.json</code>，pnpm 生成<code v-pre>pnpm-lock.yaml</code>，两者格式不同但均用于锁定依赖版本。</li>
<li><strong>性能差异</strong>：pnpm 采用内容可寻址存储，安装速度更快，磁盘占用更低；npm 依赖结构可能存在幽灵依赖问题。</li>
<li><strong>命令兼容性</strong>：大部分 npm 命令在 pnpm 中可直接使用，但部分参数和行为可能存在细微差异，如 pnpm 的<code v-pre>pnpm store</code>系列命令为特有功能。</li>
</ol>
</div></template>


