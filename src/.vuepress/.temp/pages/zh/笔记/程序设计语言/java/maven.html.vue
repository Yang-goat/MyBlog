<template><div><h1 id="maven安装教程" tabindex="-1"><a class="header-anchor" href="#maven安装教程"><span>maven安装教程</span></a></h1>
<h2 id="一、maven下载与安装" tabindex="-1"><a class="header-anchor" href="#一、maven下载与安装"><span>一、maven下载与安装</span></a></h2>
<p><a href="https://maven.apache.org/download.cgi" target="_blank" rel="noopener noreferrer">maven官网</a></p>
<h3 id="_1-下载" tabindex="-1"><a class="header-anchor" href="#_1-下载"><span>1. 下载</span></a></h3>
<p>下载官网中两者选其一，下载后解压到你想放的位置上，安装就成功了：</p>
<figure><img src="@source/zh/笔记/程序设计语言/java/img/maven下载.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<h3 id="_2-环境变量配置" tabindex="-1"><a class="header-anchor" href="#_2-环境变量配置"><span>2. 环境变量配置</span></a></h3>
<p>先在系统环境变量中配置<code v-pre>MAVEN_HOME</code>变量，值为解压后的文件夹路径：</p>
<figure><img src="@source/zh/笔记/程序设计语言/java/img/mavenhome.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<p>然后配置path变量:</p>
<div class="language-txt line-numbers-mode" data-highlighter="shiki" data-ext="txt" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-txt"><span class="line"><span>%MAVEN_HOME%\bin</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><figure><img src="@source/zh/笔记/程序设计语言/java/img/mavenbin.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<h2 id="二、设置-maven-默认本地仓库位置" tabindex="-1"><a class="header-anchor" href="#二、设置-maven-默认本地仓库位置"><span>二、设置 Maven 默认本地仓库位置</span></a></h2>
<p>默认本地仓库是：</p>
<div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-"><span class="line"><span>C:\Users\&#x3C;你的用户名>\.m2\repository</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>如果想自定义路径（例如 D 盘），需要修改 <code v-pre>settings.xml</code>：</p>
<ol>
<li>
<p>找到 Maven 的配置文件：（建议）</p>
<div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-"><span class="line"><span>%MAVEN_HOME%\conf\settings.xml</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>或在用户目录下：</p>
<div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-"><span class="line"><span>C:\Users\&#x3C;用户名>\.m2\settings.xml   （如果没有，可以自己复制一份）</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p>编辑，找到 <code v-pre>&lt;localRepository&gt;</code> 标签（默认是注释掉的），改成你想要的路径，例如：</p>
<div class="language-xml line-numbers-mode" data-highlighter="shiki" data-ext="xml" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-xml"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">&#x3C;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">localRepository</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">>D:/maven/repository&#x3C;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">localRepository</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ol>
<h2 id="三、国内镜像仓库配置" tabindex="-1"><a class="header-anchor" href="#三、国内镜像仓库配置"><span>三、国内镜像仓库配置</span></a></h2>
<p>如果下载依赖太慢，可以在 <code v-pre>settings.xml</code> 中添加国内镜像，比如阿里云：</p>
<div class="language-xml line-numbers-mode" data-highlighter="shiki" data-ext="xml" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-xml"><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">&#x3C;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">mirrors</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">></span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">  &#x3C;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">mirror</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">></span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">    &#x3C;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">id</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">>aliyunmaven&#x3C;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">id</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">></span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">    &#x3C;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">mirrorOf</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">>*&#x3C;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">mirrorOf</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">></span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">    &#x3C;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">name</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">>阿里云公共仓库&#x3C;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">name</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">></span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">    &#x3C;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">url</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">>https://maven.aliyun.com/repository/public&#x3C;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">url</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">></span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">  &#x3C;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">mirror</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">></span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">&#x3C;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75">mirrors</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">></span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


