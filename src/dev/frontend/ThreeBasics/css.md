---
icon: pen-to-square
date: 2025-10-20
order: 2
category:
  - 前端
tag:
  - css
---

# CSS

注释：/*  */

## 位置

内部样式：写在\<head>中\<style>内

行内样式：写在标签的style属性中

外部样式：写在.css文件中，在\<head>的\<link rel="stylesheet" href="路径">导入

> 作用顺序：行内样式 > 内部样式 > 外部样式表（就近原则）

## 选择器

### 基本选择器

标签选择器

```html
p{
	color: red;
}	<!-- 用于清除样式 -->
div{}
```

id选择器

```html
#id{}
```

类选择器

```html
.class{}
```

> 优先级：id > 类 > 标签

### 高级选择器

通配符选择器

```css
*{}	/* 选择网页所有元素，用于清除样式时使用 */
```

并集选择器

```css
ul, li{}	/* 选择多个目录 */
```

后代选择器

```css
.class p{}	/* 选中class类里面的所有p标签 */
```

子代选择器

````css
.class > p{}	/* 选择class类子标签中的p标签 */
````

兄弟选择器

```css
p+a{}	/* 相邻兄弟选择器，二者必须拥有同一个父元素,且相邻 */
p~a{}	/* 通用兄弟选择器，选择某元素之后的所有同级元素 */
```

属性选择器

```css
div[attr]{}			/* 选择有attr属性的标签 */
div[attr=value]{}	/* 且该属性的值=value的 */
div[attr~=value]{}	/* 且该属性的多个值中含有value的 */
div[attr^=value]{}	/* 且值以value开头 */
div[attr$=value]{}	/* 且值以value结尾 */
div[attr*=value]{}	/* 且值包含value的字符串 */
```

> 伪类：用于向某些选择器添加特殊的效果
>
> 伪元素：用于将特殊的效果添加到某些选择器

伪元素选择器

```css
/* 创建虚拟元素 性能好安全性更好简化html结构
	效果是在html代码中不显示具体内容
*/
.txt::before{
	content: '喜羊羊';   /*必须有content属性样式伪元素才会激活, 可以是字符串、url等*/
}
.txt::after{
	content: url("../xxx.jpg");	
}

/* 选择元素 */
.txt::first-letter{
    /* 选择指定对象内的第一个字符 */
    color: blue;
}
.txt::first-line{
    /* 选择指定对象内的第一行内容 */
}
```

伪类选择器

```css
img:hover{	/*鼠标经过悬停时触发*/
    
    /* 元素的缩放比例为1.5，并设置过渡时间为1秒 */
	transform: scale(1.5);	
	transition: 1s;
}
p:focus{}		/*获得聚焦时触发*/
img:active{}	/*按下元素时触发*/
a:visited{}		/*a标签被访问时触发*/
a:link{}		/*a标签未被访问时触发*/


/* 爱恨准则 LOVEHATE */
/* 按照这个顺序:link>:visited>:hover>:active 否则不生效 */
```

结构选择器(伪类)

```css
/* 根据下标选择父类的子标签 */
/* 对父类的所有子标签计数 若下标所指的标签不是目标标签则不生效 */
p:first-child{}			/*选择首个p标签的内容*/
p:last-child{}			/*选择最后*/
p:nth-child(2){}		/*选择指定下标*/
	可填参数: odd奇数下标 even偶数下标 3n选择3的倍数的下标 等
		p:nth-child(odd){}		/*选择指定下标*/
p:nth-last-child(3){}	/*选择倒数下标指定*/

/* 计数相同类型、同级的兄弟元素 */
/* 忽略非目标标签计数，只计数 */
p:first-of-type{}
p:nth-of-type(2){}
p:only-of-type(3){}
/* 其他的类似上一组，只改-of-type */

:empty{}	/* 选择空元素(什么都没有) */
```



## 样式

**元素类型分为：**

- 行内元素：无法设置宽高
  - 去除图片自带空格方法   `转换为块级元素`
- 块元素
- 行内块元素

查看与设置元素类型：`display`



属性单位：

> 长度：`px`(像素)，`%`(百分比)
>
> 颜色：`rgb(12,34,21)`，`blue`，`#ffffff`

防止属性被覆盖可以使用 `!important`

```css
.size1 {
	width: 10% !important;
}
```

```css
*{
    margin: 0px;	/* 外边距 */
    padding: 0px;	/* 内边距 */
}
```

### 背景、阴影

```css
.box{
    width: 300px; 	/*默认浏览器100%,也可以使用百分比*/
  	height: 300px; 	/*默认内容高度*/
    
    background-color: rgb(255, 0, 191);	/* 快速书写：w300+h300+bgc */
    background-image: url(./img/图片1.jpg);
    background-position: left;
    background-size: cover;			/* 等比缩放 */
    background-repeat: no-repeat;	/* 不重复，repeat-x，repeat-y */
    /* 背景图片复合写法 */
    /* background: url()/color size position; */
    
    box-shadow: 4px -4px 50px #b6b6b6; /*偏右值 偏下值 虚化平铺范围 颜色*/ 
}
```

### div、边框

> 当相邻元素都有margin时，实际margin为两者最大值

```css
.box1{
    /* 1值:上下左右 2值:上下,左右 3值:上,左右,下 4值:上,右,下,左 */
    margin: 10px auto;/* auto居中 */
    margin-top: 10px; /* 单独设置 */

    /* 边框设置 */
    border-width: 5px;	/* 粗细 */
    border-color: red;
    border-style: none;	/* none无样式 solid实线 double双实线 dashed虚线 dotted点线 */
    border-radius: 15px;/* 弧度 */
    /* 复合写法 */
    border: 1px solid #069; /*粗细 样式 颜色*/
    border-top: 0px;	/* 单个边框设置 */
    
    /* 实现三角: 边框本身是梯形，当内容为0为三角形 */
    border: 50px solid transparent;		/* 边框颜色需全设置为透明色 */
	border-left-color: #cc0000;	/* 朝右的三角形 */
    
    /* 溢出处理 */
    overflow: scroll; /*hidden隐藏 visible正常显示(默认) scroll滚动显示 auto浏览器自动(一般为scroll) */
}
```

### 文本字体样式

```css
.font{
    color: black;
    font-size: 70px;
    text-indent: 2em;	/* 缩进 */
    font-family: 'SimSun';	/* 设置字体 */
    font-weight: blod;	/* 粗细：bold粗体，lighter细体，数字也可以表示大小 */

    font-style: italic; /* 字体样式 倾斜 */
    line-height: 30px;	/* 行高 */
    					/* 垂直对齐 */
    text-align: center;	/* 水平对齐 */
    
    
    /* 文本样式 */
    text-decoration: none;	/*划线 none可清除链接的下划线;underline;overline;line-through */ 
    text-indent: 2em; 		/*首行缩进2字符 1em:一个文字的高度，作用于块级元素，行内元素不可以*/
}
```

### 表格样式

```css
.table{
    cellpadding: 0px;	/* 边框与内容之间的空白 */
    cellspacing: 5%;	/* 设置单元格之间空白 */
    colspan: 2;	/* 单元格水平合并,值为合并数量 */
    rowspan: 2;	/* 单元格垂直合并,值为合并数量 */
}
```

### 其他样式

```css
/* 缩放元素(可设置过渡时间)：见伪类选择器部分代码 */
{
    outline: red solid 5px;	/* 轮廓样式 */
    list-style-type: none;	/* 列表去点 */
}
```

#### 图片清除底部空白

- 法一：`display: block`
- 法二：img的样式 `vertical-align: bottom`

#### 居中汇总

```css
div{
    /* 文字 */
    text-align: center;		/* 文本内容水平居中 */
    height: 30px;
    line-height: 30px;		/* 垂直居中:两者相同 */
    
    /* 图片 */
    text-align: center;		/* 水平居中 */
    /* 垂直居中(3行) */
    height: 30px;			/* 图片的父类中设置 */
    line-height: 30px;		
    vertical-align: middle;	/* img中设置 */
    
    /* 盒子(文字图片通用) */
    display: flex;
    justify-content: center;	/* 内部所有元素水平居中 */
    align-items: center;		/* 垂直居中 */
}
```





## 布局

### 文档流式布局

块级元素独占一行、相邻行内元素在同一行

与html文档顺序相同

```
设置元素类型
display: inline-block;
```

### 浮动布局

```css
/* 无解析空格 一行排列不下自动换行 脱离文档流 */
/* 易产生父元素高度塌陷(相当于浮动元素的父级元素没有内容) 解决方法：定父元素高 或 为父元素设置overflow:hidden 或 在父类内写一个空盒子添加clear:both */
float的属性:
1.left 向左浮动
2.right 向右浮动
3.none 默认值 所有元素默认不浮动

clear的值: (用于指定一个元素是否应该清除其前面的浮动元素)
1.none: 不清除浮动 默认值
2.left: 清除左侧的浮动元素
3.right: 清除右侧的浮动元素
4.both: 清除两侧的浮动元素

.float{
	height: 300px;
	border: 10px solid blue;
	overflow:hidden
}
.float1{
	float: left;
	height: 200px;
	width: 200px;
	background-color: yellow;
}
.float2{
	float: left;
	height: 200px;
	width: 200px;
	background-color: red;
}
.float3{
	float: left;
	height: 200px;
	width: 200px;
	background-color: green;
}

.float4{
    clear: left;	/* 清除浮动 */
}
```

```html
<div class="float">
   	<div class="float1"></div>
    <div class="float2"></div>
    <div class="float3"></div>
</div>
```

### 定位布局 position

```
四个方向:
top:顶部偏移
right:右侧偏移
bottom:底部偏移
left:左边偏移

左上为尊 左上的优先级比较高 
```

```html
<div class="relation">
    <div class="absolute"></div>
</div>
<div class="fixed"></div>
```

#### 相对定位(relative)

> 不会脱离文档流，对父类等无影响

```css
.relation{
	position: relative;
	width: 200px;
	height: 200px;
	background-color: rgb(0, 179, 255);
	/* 保持文档流同时 通过方位属性 对原位置偏移 */
	top: 50px;
	left: 50px;
	/* 不设置偏移值无变化 */
}
```

#### 绝对定位(absolute)

> 脱离文档流

```css
.absolute{
	position: absolute;
	width: 100px;
	height: 100px;
	background-color: rgb(115, 0, 128);
	/* 脱离文档流 使用方位属性相对与最近的有定位的父级元素进行偏移(就近原则) */
	/* 一般与相对定位配合使用(参照物) */
	top: 10px;
	}
```

#### 固定定位

```css
.fixed{
	position: fixed;
	width: 70px;
	height: 200px;
	background-color: rgb(68, 255, 0);
	/* 固定元素在浏览器可视位置 */
	top: 30%;
	right: 0;
}
```

### flex布局（较为灵活）

一种弹性布局，全称Flexible Box（弹性盒子）。容器内的子元素能够自动排列，并根据不同的屏幕尺寸进行调整。

#### 基本概念

1. 容器与项目：

   - 容器：使用`display: flex`或`display: inline-flex`定义的元素，包含内容。
   - 项目：容器内部的**直接**子元素
   - 容器允许嵌套

2. 坐标轴

   以容器左上角为原点，自原点往右、往下两条坐标轴。

   默认水平方向为主轴（Main Axis)（从右往左），垂直方向为交叉轴（Cross Axis)（从上往下）

![](img/e865ba3efe82e0ec7275936983497082.png)

3. 起点与终点

#### 容器的属性

| 属性            | 说明                                     | 默认值     | 其他有效值                                                   |
| --------------- | ---------------------------------------- | ---------- | ------------------------------------------------------------ |
| flex-direction  | 设置项目的排列方向                       | row        | row-reverse\|column\|column-reverse                          |
| flex-wrap       | 设置项目是否换行                         | nowrap     | wrap\|wrap-reverse                                           |
| justify-content | 设置项目在主轴方向上的对齐方式           | flex-start | flex-end\|center\|space-between\|space-around\|space-evenly  |
| align-items     | 设置水平方向上的对齐方式                 | stretch    | center\|flex-end\|baseline\|flex-start                       |
| align-content   | 当多行排列时，设置行在交叉轴上的对齐方式 | stretch    | flex-start\|flex-end\|center\|space-between\|space-around\|space-evenly |

#### 项目的属性

| 属性        | 说明                           | 默认值        | 其他有效值 |
| ----------- | ------------------------------ | ------------- | ---------- |
| order       | 设置项目在主轴上的排列顺序0    | 0             | \<integer> |
| flex-shrink | 收缩在主轴上溢出的项目         | 1（收缩因子） | \<integer> |
| flex-grow   | 扩张在主轴方向上还有空间的项目 | 0             | \<integer> |

弹性：

flex-shrink：$\text{最终长度} =\text{原长度}\times(1-\frac{\text{溢出长度}\times\text{收缩因子}}{\text{压缩总权重}})$，$\text{压缩总长度}=\text{长度1}\times\text{收缩因子1}+···+\text{长度N}\times\text{收缩因子N}$

flex-grow同上

```css
.flex{
    /* 交换主轴与交叉轴, 默认为row */
    flex-direction: column;
}

.flex{
    display: flex;
    justify-content: center;	/* 主轴方向居中：水平居中 */
    align-items: center;		/* 垂直居中 */
}

.flex{
    display: flex;
    /* 设置主轴 */
    flex-direction: row;
    
	/* 设置主轴对齐方式 */
   	justify-content: flex-start;    /*默认起点对齐 左上*/
    /* flex-end终点对齐右下 space-between两端对齐 space-around均分对齐 */

	/* 设置副轴对齐 */
    align-items: center;    /*居中*/
    /* flex-start靠起点 flex-end靠终点 */

	/* 设置换行 */
	flex-wrap: nowrap;      /*缩放不换行*/
}

.box3{
	/* 项目属性 */
    order: -1;   /*默认0 值越小 越靠前*/
}
```