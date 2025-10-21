---
icon: pen-to-square
date: 2025-10-20
order: 1
category:
  - 前端
tag:
  - html
---

# HTML

不分大小写、有单标签和双标签

```HTML
<!-- 注释信息 -->
```

基础格式

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>
```

## 标签

### head中

```html
<title>
<base>:页面上的所有链接规定默认地址或默认目标（使用这里指定的url解析所有相对url，而不是用文档的url）
<link>:最常用于链接样式表
<style>:用于HTML文档定义样式信息css
<script>:定义js脚本
```

```html
<meta http-equiv="refresh" content="秒数;url=地址">自动跳转
<meta>:
	charset="UTF-8"
```



### body中

#### 基础

```html
<h1>~<h6>
<img src="url" alt="鼠标放置显示内容"/>

<font size="" color="" face="字体样式">
<br/>换行
<hr/>水平标记线
    样式：
	size高度
	width宽度
	color颜色
	noshade无阴影
	align对齐方式
    
<p></p>
<pre></pre>使用原始排列

<b>加粗</b> <strong>加粗</strong>一般情况下<b>和<strong>都可以让文本进行加粗 但是<strong>语义是内容具有强调作用(让浏览器觉得重要)
<u>下划线</u> <ins>下划线</ins>
<i>倾斜</i> <em>倾斜</em>
<sup>上标</sup>
<sub>下标</sub>
```

#### 通用属性：

- 文字颜色属性 text
- 页面背景颜色 bgcolor
- 标题（鼠标放置显示）title
- 拖放属性 draggable="true"
- style css行内样式，分号隔开多个样式
- class 空格隔开多个
- id

#### 转义字符

```html
空格 &nbsp; 人民币 &yen; 
小于号 &lt; 大于号 &gt;
版权符号 &copy; 注册商标 &reg;
```

#### 超链接

```html
<a href="url">Link text</a>
属性：
	target="_blank另开网页;_self覆盖原网页"
	title
类别：锚链接：功能性链接；网页链接
	锚链接：
    	创建跳转标记<a name="marker"></a>
    	创建跳转链接<a href="#marker">点击跳转</a>
	功能性链接：
		<a herf="mailto:1700425119@qq.com">联系我们</a>
```

#### 列表

```html
有序列表
<ol type="1" reversed>排名	<!-- type:a\A\i小写罗马数字\I大写罗马数字\1(默认); reversed倒序 -->
    <li>小王</li>
    <li>小明</li>
</ol>

无序列表
<ul type="circle">王者荣耀	<!-- type:square方块 disc实心圆点 circle空心圆点 none不显示符号 -->
    <li>亚瑟
        <p>战士</p>
    </li>
    <li>海月</li>
</ul>	<!-- ui后只能跟li标签 li后随意 如ul嵌套 -->

定义列表
<dl>	 <!-- dd,dt标签同级 dd描述dt dd可多个 dl子标签只能为dt,dd -->
    <dt>1</dt>
    <dd>2</dd>
    <dd>2</dd>
</dl>
```

#### 层标记

```Html
<div>默认属于块级元素</div>
```

#### 范围标签

```html
<span>行内标签</span>
```

#### 表格

```html
<table border="2">粗细
    <caption>定义标题</caption>
    <thead>
    	<th>表头单元格</th>
    </thead>
    <tbody>
        colspan: 2;	/* 单元格水平合并,值为合并数量 */
    	rowspan: 2;	/* 单元格垂直合并,值为合并数量 */
        <tr>行
            <td>列</td>
        </tr>
        <tr>
            <td>列</td>
            <td>列</td>
        </tr>
    </tbody>
   	<!-- 表脚 -->
    <tfoot>
    	<tr>
        	<td>列</td>
            <td>列</td>
        </tr>
    </tfoot>
</table>
```

#### 表单

```html
<form action="url" method="get/post" onsubmit = "return false">   <!--action设置要将表单提交到何处（默认为当前页面）method设置使用哪种 HTTP 方法来提交表单数据（默认为 get）onsubmit可以阻止表单跳转-->
        <!-- from的功能控件 与label标签 -->
        <!-- label标签常做标题 点击标签时跳到指向的控件 -->
        <!-- input disable属性：禁用input元素，颜色变灰-->
        <label>账号：
        <input type="text" name="设置控件名" placeholder="默认显示内容" disabled><!--文本框-->
        </label><br>
        <label for="password">密码：</label>    <!--for属性表示控件服务对象-->
        <input type="password" id="password"><br><!--密码框-->
        <input type="checkbox" value="1">       <!--多选框-->
        <input type="radio" value="1" name="sex"><br>      <!--单选框 基于name判断是否为同一组单选框-->
		
    	<input type="button">					<!--按钮-->
        <input type="submit">                   <!--提交按钮-->
        <input type="file" required>            <!--文件上传-->
        <input type="reset"  value="清空"><br>   <!--重置表达内容，value设置显示文字-->
        <input type="url">                      <!--网址输入框-->

        <textarea name="txt" id="" cols="30" rows="10"></textarea><!--文本域-->
        <select name="" id="">          <!--下拉选项框--> 
            <option value="" style="display: none">选择一个问题</option>	<!--设置默认显示内容-->
            <option value="1">1</option>
            <option value="2">2</option>
        </select>
        <button>按我拯救世界</button>   <!--按钮-->
</form>
```

#### vedio

```html
video
```

#### iframe

```html
浮动框架：在浏览器窗口中嵌套子窗口
<iframe src="源文件地址" width="" height="" frameborder="边框大小：0" scrolling="no不显示滚动条；auto默认，左对齐根据情况显示；yes总是显示"></iframe>
```

