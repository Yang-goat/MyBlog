<template><div><h1 id="硕士复试c-面向对象笔记" tabindex="-1"><a class="header-anchor" href="#硕士复试c-面向对象笔记"><span>硕士复试C++面向对象笔记</span></a></h1>
<h2 id="零、结构化程序设计方法" tabindex="-1"><a class="header-anchor" href="#零、结构化程序设计方法"><span>零、结构化程序设计方法</span></a></h2>
<h3 id="_1-数据类型、运算符与表达式" tabindex="-1"><a class="header-anchor" href="#_1-数据类型、运算符与表达式"><span>1. 数据类型、运算符与表达式</span></a></h3>
<ul>
<li>基本数据类型（int、char、float、double、bool）与存储形式（补码表示、浮点数表示）</li>
<li>运算符优先级、结合性与表达式求值
<ul>
<li>运算符的结合性：多个同优先级运算符连续出现时的计算顺序</li>
</ul>
</li>
<li>位运算（与、或、异或、移位）的应用（掩码操作、判断奇偶、交换变量等）</li>
<li>typedef、using 类型别名；auto、decltype 类型推断</li>
<li><code v-pre>#define</code>是字符串替换 。</li>
</ul>
<h3 id="_2-程序基本结构" tabindex="-1"><a class="header-anchor" href="#_2-程序基本结构"><span>2. 程序基本结构</span></a></h3>
<ul>
<li>顺序结构</li>
<li>分支结构：if-else、switch-case</li>
<li>循环结构：for、while、do-while、循环控制（break/continue）</li>
</ul>
<h3 id="_3-指针与引用" tabindex="-1"><a class="header-anchor" href="#_3-指针与引用"><span>3. 指针与引用</span></a></h3>
<ul>
<li>指针定义、解引用、空指针与野指针
<ul>
<li>指针：变量的地址</li>
<li>指针变量：存放地址的变量</li>
<li><code v-pre>int* p = &amp;a</code>: 指针变量的声明，<code v-pre>&amp;</code> 为取地址运算符</li>
<li><code v-pre>*p = 20</code>: 将p所指的变量a的值设置为20，<code v-pre>*</code> 为指针运算符（间接访问运算符）</li>
</ul>
</li>
<li>指针数组 vs 数组指针</li>
<li>函数指针（回调函数）</li>
<li>引用分类：左值引用、右值引用；引用与指针区别</li>
</ul>
<div class="language-cpp line-numbers-mode" data-highlighter="shiki" data-ext="cpp" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34"><pre class="shiki shiki-themes one-light one-dark-pro vp-code" v-pre=""><code class="language-cpp"><span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">// [] 优先级高于 *</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">int</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD"> *</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B">p</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">[</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">3</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">];</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">  // 指针数组，三个指针</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">int</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF"> (</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD">*</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">p)[</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66">3</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF">];</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic">//</span></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-数组" tabindex="-1"><a class="header-anchor" href="#_4-数组"><span>4. 数组</span></a></h3>
<ul>
<li>一维数组、二维数组、字符数组
<ul>
<li>字符数组：需要 <code v-pre>\0</code> 表示字符串结束，否则继续输出。字符数组会自动生成填充，除非作为局部变量，且字符数组大小不够自动填。</li>
</ul>
</li>
<li>指针与数组的关系</li>
<li>多重指针、指针数组的使用</li>
</ul>
<ol start="5">
<li>函数</li>
</ol>
<p>定义、调用、值传递 vs 引用传递<br>
作用域与生命周期（局部、全局、静态变量）<br>
内联函数、默认参数、函数重载<br>
递归与尾递归</p>
<ol start="6">
<li>结构体与共用体</li>
</ol>
<p>struct 定义与嵌套<br>
union 的存储共享特性与应用场景</p>
<ol start="7">
<li>程序设计方法</li>
</ol>
<p>程序 = 算法 + 数据结构<br>
模块化设计与流程图<br>
穷举法、迭代法</p>
<p>二、面向对象程序设计</p>
<ol>
<li>类与对象</li>
</ol>
<p>类的定义，对象的创建<br>
访问权限（public / private / protected）<br>
构造函数（默认、重载）、析构函数、初始化列表<br>
深拷贝与浅拷贝<br>
静态成员变量与静态成员函数<br>
常对象、常函数、常引用<br>
this 指针<br>
组合与聚合<br>
new/delete 动态内存管理<br>
运算符重载（算术、关系、输入输出、赋值、类型转换）<br>
友元函数、友元类</p>
<ol start="2">
<li>继承与派生</li>
</ol>
<p>基类、派生类定义<br>
访问控制（public、protected、private 继承）<br>
构造与析构的执行顺序<br>
虚基类解决菱形继承<br>
Upcasting（向上转型）</p>
<ol start="3">
<li>多态</li>
</ol>
<p>编译时多态（函数重载、运算符重载）</p>
<p>运行时多态（虚函数机制、vtable）</p>
<p>纯虚函数、抽象类</p>
<p>面向抽象编程思想</p>
<ol start="4">
<li>模板</li>
</ol>
<p>函数模板（泛型函数）</p>
<p>类模板（泛型类）</p>
<ol start="5">
<li>STL 与泛型编程</li>
</ol>
<p>STL 容器：顺序容器（vector、list、deque）、关联容器（set、map）、容器适配器（stack、queue、priority_queue）</p>
<p>迭代器：输入、输出、前向、双向、随机访问；pointer-like-class</p>
<p>仿函数、函数对象</p>
<p>STL 算法：sort、find、for_each、accumulate 等</p>
<ol start="6">
<li>流（stream）</li>
</ol>
<p>iostream、fstream、sstream</p>
<p>文件读写（文本、二进制）</p>
<ol start="7">
<li>异常处理</li>
</ol>
<p>try-catch-throw 基本机制</p>
<p>异常传播与处理流程</p>
<p>构造与析构中的异常安全</p>
<ol start="8">
<li>OOP 设计方法</li>
</ol>
<p>类与对象的关系</p>
<p>OOA → OOD → OOP</p>
<p>UML 类图</p>
<p>面向抽象编程、面向接口编程思想</p>
<p>三、数据结构</p>
<ol>
<li>线性表</li>
</ol>
<p>顺序存储 vs 链式存储（单链表、双链表、循环链表）</p>
<p>应用（如多项式表示）</p>
<ol start="2">
<li>栈、队列、数组</li>
</ol>
<p>栈：顺序栈、链栈，应用（括号匹配、表达式求值）</p>
<p>队列：顺序队列、循环队列、链队列</p>
<p>特殊矩阵压缩存储（对称矩阵、三角矩阵、稀疏矩阵）</p>
<ol start="3">
<li>树与二叉树</li>
</ol>
<p>二叉树的存储（顺序存储、链式存储）</p>
<p>遍历：前序、中序、后序、层序</p>
<p>一般树与森林的存储与遍历</p>
<p>应用：Huffman 树等</p>
<ol start="4">
<li>图</li>
</ol>
<p>图的存储（邻接矩阵、邻接表）</p>
<p>遍历：DFS、BFS</p>
<p>应用：最小生成树（Prim、Kruskal）、最短路径（Dijkstra、Floyd、Bellman-Ford）、拓扑排序、关键路径</p>
<ol start="5">
<li>排序</li>
</ol>
<p>插入排序（直接、折半）</p>
<p>冒泡排序</p>
<p>选择排序</p>
<p>快速排序</p>
<p>时间复杂度、空间复杂度比较</p>
<ol start="6">
<li>查找</li>
</ol>
<p>顺序查找</p>
<p>折半（二分）查找</p>
<p>哈希表（冲突处理：链地址法、开放定址法）</p>
<p>字符串匹配：BF 算法、KMP 算法</p>
</div></template>


