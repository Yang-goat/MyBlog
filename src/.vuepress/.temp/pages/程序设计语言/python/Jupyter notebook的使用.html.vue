<template><div><h1 id="jupyter-notebook" tabindex="-1"><a class="header-anchor" href="#jupyter-notebook"><span>Jupyter notebook</span></a></h1>
<h2 id="一-认识jupyter-notebook" tabindex="-1"><a class="header-anchor" href="#一-认识jupyter-notebook"><span>一，认识jupyter notebook</span></a></h2>
<p><strong>Jupyter Notebook（此前被称为 IPython notebook）是一个交互式笔记本，支持运行 40 多种编程语言。</strong></p>
<p>1，jupyter notebook是一款编程/文档/笔记/展示软件</p>
<p>2，ipynb后缀结尾的文件并不是一个py文件</p>
<p>3，跟markdown一样 #是一级标题，两个#是二级标题</p>
<p>4，原生NBConvert就是原生的 没有任何格式，跟文本文档一样 写什么是什么</p>
<h3 id="二-安装使用" tabindex="-1"><a class="header-anchor" href="#二-安装使用"><span>二，安装使用</span></a></h3>
<p>安装Jupyter Notebook的前提是需要安装了Python环境（3.3版本及以上，或2.7版本）</p>
<p>1，通过pip管理工具直接下载 输入指令 <strong>pip install  jupyter notebook</strong></p>
<p>​		pip install jupyter notebook -i <a href="https://pypi.tuna.tsinghua.edu.cn/simple/" target="_blank" rel="noopener noreferrer">https://pypi.tuna.tsinghua.edu.cn/simple/</a></p>
<p><strong>以上这种安装方式大部分人可能会失败，请严格按照一下顺序下载：</strong></p>
<p>1，先安装老师上面发给你们的微软的exe程序</p>
<p>2，打开cmd窗口     <strong>强调：一定要把cmd以管理员身份运行</strong></p>
<p>3，在cmd窗口输入命令：python -m pip install --upgrade pip 将python的pip升级<br>
4，最后再输入notbooke安装命令（换源安装），例如：pip install jupyter notebook -i <a href="https://pypi.tuna.tsinghua.edu.cn/simple/" target="_blank" rel="noopener noreferrer">https://pypi.tuna.tsinghua.edu.cn/simple/</a></p>
<p>5，如果继续报错的同学：可以利用国内镜像源安装：pip install jupyterthemes -i <a href="http://pypi.douban.com/simple/" target="_blank" rel="noopener noreferrer">http://pypi.douban.com/simple/</a> --trusted-host <a href="http://pypi.douban.com" target="_blank" rel="noopener noreferrer">pypi.douban.com</a></p>
<p><strong>如何使用</strong>：</p>
<ul>
<li>打开cmd窗口，输入jupyter notebook</li>
<li>安装脚本</li>
</ul>
<h3 id="三-运行jupyter-notebook" tabindex="-1"><a class="header-anchor" href="#三-运行jupyter-notebook"><span>三，运行Jupyter Notebook</span></a></h3>
<ol>
<li>成功安装Jupyter Notebook后，在Terminal (Mac / Linux)或Command Prompt(Windows)中运行以下命令就可打开Jupyter Notebook</li>
<li>输入 ：jupyter notebook</li>
<li>执行上面命令之后， Jupyter Notebook 将在你的默认浏览器中打开，网址为：<a href="http://localhost:8888/tree" target="_blank" rel="noopener noreferrer">http://localhost:8888/tree</a></li>
</ol>
<h4 id="_1-主面板-notebook-dashboard" tabindex="-1"><a class="header-anchor" href="#_1-主面板-notebook-dashboard"><span>1，主面板(Notebook Dashboard)</span></a></h4>
<p>打开Notebook，可以看到主面板。在菜单栏中有Files（文件）、Running（运行）、Clusters（集群）、三个选项。用到最多的是Files，我们可以在这里完成notebook的新建、重命名、复制等操作。</p>
<ul>
<li>
<p><strong>Files 基本上列出了所有的文件，</strong></p>
</li>
<li>
<p><strong>Running 显示你当前已经打开的终端和Notebooks，</strong></p>
</li>
<li>
<p><strong>Clusters 由 IPython parallel 包提供，用于并行计算。</strong></p>
</li>
</ul>
<p>要打开一个新的 Jupyter Notebook，请单击页面右侧的“New”选项卡。在这里，你有四个选项可供选择：</p>
<p>⦁	Python 3<br>
⦁	Text File (文本文件)<br>
⦁	Folder (文件夹)<br>
⦁	Terminal (终端)</p>
<ol>
<li>在 &quot;Text File&quot; 选项中，你会得到一个空白的文档。输入你喜欢的任何字母，单词和数字。它基本上是一个文本编辑器（类似于 Ubuntu 上的应用程序）。你也可以选择一种语言（支持非常多的语言），然后用该语言来写一个脚本。你还可以查找和替换文件中的单词。</li>
<li>在 &quot;Folder&quot; 选项中， 顾名思义它的功能就是创建文件夹。你可以创建一个新文件夹来放入文件，重新命名或者删除它。</li>
<li>&quot;Terminal&quot; 的工作方式与你的 Mac 电脑或 Linux 电脑上的终端完全相同（或者 Windows 上的 cmd ）。它在你的Web浏览器中支持终端会话。在这个终端中输入 python ，瞧！现在你已经可以开始写 python 脚本了。</li>
</ol>
<h4 id="_2-创建python文件" tabindex="-1"><a class="header-anchor" href="#_2-创建python文件"><span>2，创建python文件</span></a></h4>
<p>从“New”选项中选择 &quot;Python 3&quot; 选项。你会看到如下的截图：</p>
<p>代码上方的菜单栏提供了操作单元格的各种选项：</p>
<ul>
<li>edit (编辑)，</li>
<li>insert (添加)，</li>
<li>cut (剪切)，</li>
<li>move cell up/down (上下移动单元格)，</li>
<li>run cells(在单元格中运行代码)，</li>
<li>interupt (停止代码)，</li>
<li>save (保存工作)，</li>
<li>以及 restart (重新启动内核)</li>
</ul>
<p>在下拉菜单中（如上所示），你有四个选项：</p>
<ul>
<li>Code - 这是你输入代码的地方</li>
<li>Markdown - 这是你输入文本的地方。你可以在运行代码后添加结论，添加注释等。</li>
<li>Raw NBConvert - 这是一个命令行工具，可将你的笔记本转换为另一种格式（如 HTML）</li>
<li>Heading - 你可以将标题添加到单独的小节并使你的 Notebook 看起来干净整洁。这个选项现在已经集成到 Markdown 选项中。添加一个“##”，以确保在你之后输入的内容将被视为标题</li>
</ul>
<p>其他详细使用可以访问 ： <a href="https://www.jianshu.com/p/061c6e5c4b0d" target="_blank" rel="noopener noreferrer">https://www.jianshu.com/p/061c6e5c4b0d</a></p>
</div></template>


