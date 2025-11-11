---
icon: pen-to-square
date: 2025-10-20
order: 3
category:
  - 前端
tag:
  - javascript
---

# JavaScript

## 书写位置

内部：\<body>最后，\<script>内

外部：\<script src=".js">\</script>

注释：`//`,`/*  */`

## 一、基础

**注意：**javascript使用小驼峰命名方式，即getElementById（第一个单词首字母小写，后面单词首字母大写）

```js
// 输出
document.write(666,'<p>111</p>')	// 网页输出，标签可被识别
console.log(666)	// 控制台输出
alert('666')		// 弹窗

// 输入
prompt('请输入您的名字')

//确认框
confirm('确认是否打开')

// 变量
var a	// 声明符 标识符
let b='fe'	// es6新出 作用域中比var更严谨
console.log(typeof b)   //typeof查看数据类型

// 转义字符
\n换行 \t制表符 \\输出斜杠 \'输出引号

// 运算符
        // 算数运算符 + - * / ** // &
        // 逻辑运算符 &&与 ||或 !非
        // 赋值运算符 = += -= *= /=
        // 关系运算符 == > < >= <=
        // 单目运算符 ++ --自增/减
let i =1
console.log(i++)
console.log(++i)
        // 三目运算符 语法糖 双分支的快捷写法
let age = 18
alert(age>=18? '成年了' : '未成年')
```

## 二、数据类型

```js
字符串 String    用 "" '' ``(反引号，作为模板字符串类f-str)包裹
        console.log(`jfeiwo${b}`)
数值 Number      不分整数、浮点数等
布尔 Boolean     值：true/false首字母不大写
未定义 Undefined 声明的变量未赋值时值和类型均为未定义
空 Null          值为空

// 数据类型转换
// 隐式转换
        //字符串与数值进行运算时 +会优先识别为拼接
        console.log(1 + '1')    //'11'
// 强制转换
        Number('31')            //若失败则返回NaN(也是number类型)
        parseInt('547829.423')  //把数据转化为数值，只保留整数
    	parseFloat(0.1421)      //把数值转化为数值，保留小数
        String(4213)
        Boolean(25)             //有值为真 无值为假(0,-0,null,undefined)

isNaN();	// 判断参数是否是非数据
```

## 三、流程控制

```js
// 分支语句if
if(i=1){
}else if(i=2){
}else{}
// 分支语句switch
let a=prompt('请输入数字：')
switch(a){
	case '1':
        document.write('你输入了1')
	case '2':
        document.write('你输入了2')
        break   // 出现break才跳出选择，否则穿透执行下去
	default:
		document.write('无法识别你输入的数字')
		break
}
// 循环语句while
while(i<=10){}
// 循环语句do while
do{}while();
// 循环语句for
for(let b=1;b<=10;b++){}
for(var i in array){}
// break,continue
```

## 四、函数

```js
// 定义
function fun(){
    return 1;	// 返回值
}
// 调用
fun();
// 输出函数
alert(fun())	// 调用函数并返回返回值 若无则返回nudefined
let fun1 = fun()	// 调用函数 并将返回值赋值给变量

// 函数参数
形参 定义时的参数
实参 调用时的含具体数据的参数
function actor(a,b){
	// 几个形参就传几个实参
	document.write(`我是${a},我喜欢${b}`)
}
// 默认参数
function num(a=666){}
// 匿名函数(自动执行函数)
// 只执行一次，不用命名，不用()调用
!(function(name){
	document.write(`我是${name}`)
})('帅哥');	// 单独使用匿名函数时加 !; 嵌套使用不用

// 作用域
{}
let 块级作用域 ({}内部)
var 局部作用域 (函数内部)
```

### 常用方法

```js
num.toFixed(n)	// 保留小数点后n位
```



## 五、对象

面向对象：封装 继承 多态

### 5.1 自定义对象

```js
let people = {
    name:'蔡徐坤',
	age:20,
	play:function(){	// 方法
		document.write('打篮球')
	}
}
alert(people.name)
people.play()
console.log(typeof people)
```

### 5.2 内置对象

#### 5.2.1 数组Array

数据类型任意

```js
let num = [1,2,3,4,5]
// 属性
num[2]	// 索引(从零开始，无负下标， 无切片)
num.length
num[2] = 0
// 方法
num.push(6, 7)	// 最后追加数据(可多个) 返回追加后数组长度
num.pop()		// 删除最后数据 返回删除的数据
num.unshith(-1, -2)	// 前面添加数据(可多个) 返回追加后数组长度
num.shift()		// 删除第一个元素 返回删除的数据
// 增删数据 取出数组内一部分数据
num.splice(1,1)     // 从下标1开始删除1个数据
num.splice(1,0,0,1) // 从下标1开始删除0个数据 并添加数据2个
num.toString()		// 把数组转为字符串 返回转换的结果
num.reverse()		// 数组数据反转
// sort 排序
// 字母
 let fruits = ["Banana", "Orange", "Apple", "Mango"];
document.write(fruits.sort())           // 字母升序（降序:先升后反转数组）
// 数字
num.sort(function(a,b){return a-b})     // 数字升序
num.sort(function(a,b){return b-a})     // 数字降序
num.indexOf(1)		// 获取指定元素下标
fruits.join(",")    // 把数组连接为字符串 连接符可选 默认','
```

#### 5.2.2 字符串String

```js
// 声明
let str1 = 'hello'
let str2 = new String('hello')
// 属性
str1.length
// 方法
str1.toUpperCase()	// 字母转化为大写
str2.toLowerCase()	// 字母转化为小写
        
str1.substring(0,2)	// 截取字符串(切片 包头不包尾)
str2.split('e')		// 分割字符串 通过指定字符(删除)分割为数组
str1.indexOf('l',0) // 获取指定元素下标 从下标0开始往后寻找l 找到一个就结束
str1.charCodeAt(0)	// 获取字符对应的编码
```

#### 5.2.3数学Math

```js
// 属性
Math.PI
// 方法
let num1 = Math.random()	// random 生成0-1之间的随机数
let num2 = parseInt (Math.random()*10)  // 生成0-10的整数       
Math.ceil(num1)		// 数据向上取整
Math.floor(num1)   	// 数据向下取整
Math.round(num1) 	// 四舍五入取整
Math.max(3412,443) 	// 只能比较数字
Math.min(...num)    // ...数组名 表示拆分数组中数据
```

#### 5.2.4 日期Date

```JS
// 声明
let now_time = new Date()
let now_time = new Date('2023-2-13 21:47')
// 方法
now_time.getTime()	// 获得格林威治时间戳1970.1.1距今多少秒
// 获取当前时间的一部分
now_time.getFullYear()  // 年
now_time.getMonth()     // 月 从零开始计算，获得本月要+1
now_time.getDate()      // 日
now_time.getHours()
now_time.getMinutes()
now_time.getSeconds()
```

#### 5.2.5 locate 对象

#### 5.2.6 history对象

#### 5.2.7 存储对象

Web 存储 API 提供了 sessionStorage （会话存储） 和 localStorage（本地存储）两个存储对象来对网页的数据进行添加、删除、修改、查询操作。

- localStorage 用于长久保存整个网站的数据，保存的数据没有过期时间，直到手动去除。
- sessionStorage 用于临时保存同一窗口(或标签页)的数据，在关闭窗口或标签页之后将会删除这些数据。

##### 存储对象属性

| 属性   | 描述                           |
| :----- | :----------------------------- |
| length | 返回存储对象中包含多少条数据。 |

##### 存储对象方法

| 方法                        | 描述                                               |
| :-------------------------- | :------------------------------------------------- |
| key(*n*)                    | 返回存储对象中第 *n* 个键的名称                    |
| getItem(*keyname*)          | 返回指定键的值                                     |
| setItem(*keyname*, *value*) | 添加键和值，如果对应的值存在，则更新该键对应的值。 |
| removeItem(*keyname*)       | 移除键                                             |
| clear()                     | 清除存储对象中所有的键                             |

```js
localStorage.clear();
```

#### 5.2.8 JSON对象

| 函数             | 描述                                           |
| :--------------- | :--------------------------------------------- |
| JSON.parse()     | 用于将一个 JSON 字符串转换为 JavaScript 对象。 |
| JSON.stringify() | 用于将 JavaScript 值转换为 JSON 字符串。       |

```js
var a = JSON.parse(notes);
```



## 六、DOM（重点）

Document Object Model 文档对象模型，通过js与网页内容交互

DOM树：一个网页文档里面的所有部分(图片 文字 样式)在html底层中,是以树形结构保存 树里面每个分支终点node(节点) 每个节点都属于一个对象(属性/方法)

document对象是DOM树的根茎 是所有节点的根节点,通过document就可以访问html里所有的内容

操作步骤：1.选中 找出元素	2.对元素实施操作

### 6.1 获取元素

相当于css的选择器，但在js中使用另一种写法。

格式：

- 通过选择器获取一个元素，**没有s**
  - `getElementByXxx`
- 通过选择器获取一组元素，**有s**，获取具体元素时需要下标索引
  - `getElementsByXxx`

方法：

- 通过id获取  `getElementById`
- 通过name获取 `getElementsByName`
- 通过标签名 `getElementsByTagName`
- 通过类名 `getElementsByClassName`
- 获取html的方法 `documentElement`
- 获取body的方法

> 没有返回null

```js
// 通过id获取
let pic = document.getElementById('img')
// 通过class获取 (操作时必须有下标)
let box1 = document.getElementsByClassName('box1')  // 获取后变量类型为伪数组
// 通过标签获取 (操作时必须有下标)
let p = document.getElementsByTagName('p')[0]   // 可直接获取对应的元素
```

### 6.2 操作元素

#### 6.2.1 操作文本内容

```js
box1[0].innerText = '<u>这是第二个</u>'	// innerText
p.innerHTML = '<b>666</b>'				// innerHTML可识别标签语法
```

#### 6.2.2 获取值

```js
p.value
```

#### 6.2.3 操作元素属性/样式

相当于css，但写法不同

> 元素名.属性
>
> 元素名.style.样式名

```js
pic.src = 'img/图片1.jpg' // 修改图片路径
box1[2].className = 'add'
box1[0].style.height = '50px'
box1[0].style.backgroundColor = 'pink'  // css中样式名有-的改为小驼峰写法
```

#### 6.2.4 元素的增删改查

元素的增删改查操作是基于Node节点来实现的

```js
// 创建节点 createElement()
let newNode = document.createElement('b')	// 创建一个b标签
newNode.innerText = '这是新建的节点'
// 添加节点 appendChild()元素最后添加子节点 insertBefore(新节点, 已有的节点)在元素某子节点前添加新子节点
box1[0].appendChild(newNode)
// 删除节点 removeChild()
box1[0].removeChild(newNode)
// 替换节点 replaceChild(新节点, 已存在节点)
```



### 6.3 DOM事件（Events）

- 事件是用户或浏览器对某个元素的交互，比如点击、鼠标悬停、按键按下、页面加载完成等。
- 事件处理是指在特定事件发生时执行特定的代码。

传统事件流程：

1. **获取DOM对象**（见6.1）
2. **绑定监听事件**

| 事件                       | 含义                     |
| -------------------------- | ------------------------ |
| onclick                    | 鼠标点击事件             |
| onmouserover（onmouseout） | 鼠标悬停在元素之上（外） |
| onfocus（onblur）          | 聚焦（失焦）             |
| onload                     | 元素加载好后             |

##### 事件绑定（四种）

- ```js
  // 事件对象.监听事件 = function()
  box1[1].onclick = function(){
      this.className = 'add';	// 获取元素后内部可以使用this标签替换对象
  }
  ```

- ```html
  <button type="button" onclick="myBtn()">按钮</button>
  <script>
  	function myBtn(){} 
  </script>
  ```

- ```js
  function sayHello() {}
  document.getElementById("myBtn").onclick = sayHello;
  ```

- ```html
  <a herf="javascript:btn1()"></a>
  <script>
  	function btn1(){}
  </script>
  ```

## 七、事件监听器

现代开发中推荐使用**事件监听器**（Event Listeners）来实现事件处理，因为它更清晰、可维护性更好。

特点：

- **分离结构与行为**：将HTML结构与JavaScript行为分离，代码更清晰、更易维护。
- **支持多个监听器**：可以为同一元素添加多个事件监听器。
- **更灵活**：可以在运行时动态添加或移除事件监听器，适应更复杂的需求。



### 7.1 事件监听

#### addEventListener()

```js
element.addEventListener(event, function, useCapture);
```

##### 参数

1. **event**：字符串，指定要监听的事件类型，例如 `'click'`、`'mouseover'`、`'keydown'` 等。
2. **listener**：当指定事件触发时，会调用这个函数。这个函数可以是普通函数或箭头函数。
3. **useCapture**（可选）：布尔值，指定事件是否在捕获阶段执行。默认为 `false`，表示在冒泡阶段执行。

```js
document.getElementById('myButton').addEventListener('click', function() {
  alert('Button clicked!');
});
```

### 7.2 事件对象

当事件被触发时，**事件处理函数**会接收一个**事件对象（event）**作为参数。这个对象包含了与事件相关的所有信息。

| 常见属性          | 含义                  |
| ----------------- | --------------------- |
| type              | 事件类型（如`click`） |
| target            | 触发事件的元素        |
| stopPropagation() | 阻止事件冒泡          |
|                   |                       |
|                   |                       |
|                   |                       |

鼠标事件的额外属性



```js
// 传入event
document.getElementById('myBtn').addEventListener('click', function(event) {
    console.log('事件类型:', event.type);
    console.log('触发事件的元素:', event.target);
    console.log('事件绑定的元素:', event.currentTarget);
    console.log('事件阶段:', event.eventPhase);
    console.log('事件是否冒泡:', event.bubbles);
    console.log('事件是否可取消:', event.cancelable);
    console.log('事件时间戳:', event.timeStamp);

    // 检查是否按下了修饰键
    if (event.altKey) {
      console.log('Alt 键被按下');
    }
    if (event.ctrlKey) {
      console.log('Ctrl 键被按下');
    }
    if (event.shiftKey) {
      console.log('Shift 键被按下');
    }
    if (event.metaKey) {
      console.log('Meta 键被按下');
    }

    // 阻止默认行为
    event.preventDefault();

    // 阻止事件传播
    event.stopPropagation();
  });
```



## 八、BOM

Browser Object Model  浏览器对象模型

- dom简单来说就是通过js和网页内容进行交互
- bom简单来说就是通过js和浏览器进行交互(弹窗 刷新 加载)

alert、prompt 都是属于bom操作 --> 控制浏览器弹出一个窗口再进行操作 -->他们都是属于同一个对象 叫做window (当前页面窗口)











# 其他效果

### 定时器

```js
// 周期定时器 setInterval(要执行的功能函数, 时间间隔)	隔一段时间就运行
// 一次性定时器 setTimeOut()	执行一次就结束
window.onload = function(){
	setInterval(dayBetween, 1000)
}
```

### 级联下拉列表

```html
<form action="" method="" name='myform'>
	<select name="" id='selProvince' onchange="changeCity()">
		<option value="">---选择省份---</option>
	</select>
	<select name="" id='selCity'>
		<option value="">---选择城市---</option>
	</select>
</form>

<script type="text/javascript">
    // 创建数组
	var cityList=new Array();
	cityList['河北省']=['石家庄市','保定市']
	cityList['河南省']=['郑州市','洛阳市']
	cityList['江苏省']=['南京市','苏州市']
    // 添加母选项的内容
	function allCity () {
		var province=document.getElementById('selProvince');
		for(var i in cityList){
			province.add(new Option(i,i),null);
		}
	}
    // 页面加载时执行函数
	window.onload=allCity;
    
    // 定义母选项的onchange事件函数
	function changeCity () {
        // 获取母选项的值
		var province=document.getElementById('selProvince').value;
        // 获取子选项
		var city=document.getElementById('selCity');
		city.options.length=0;
		for (var i in cityList){
            // 寻找选择的母选项的内容
			if(i==province){
				for (var j in cityList[i]){
                    // 给子选项添加选项对象
					city.add(new Option(cityList[i][j],cityList[i][j]),null);
				}
			}
		}
	}
</script>
```







