---
icon: pen-to-square
date: 2024-01-01
category:
  - JavaFX
tag:
  - 框架
  - GUI
---

# JavaFX

## 零、项目创建

两种方式构建项目：

1. 使用javafxSDK+IDE
2. 使用maven

### module-info.java

模块化系统需要在模块根目录编辑该文件。

javafx的FXML项目的`module-info.java`编写要求如下：

```java
module com.example.myapp {
    requires javafx.controls;   // 导入 JavaFX 控件模块
    requires javafx.fxml;       // 导入 JavaFX FXML 模块

    exports com.example.main;   // 导出主包，包含主应用程序入口
    opens com.example.controller to javafx.fxml; // 打开 controller 包，允许 FXML 文件反射访问
}
```

## 一、基础结构

JavaFX 应用程序通常从 `Application` 类扩展，并重写 `start()` 方法来设置界面。

界面由场景（`Scene`）和节点（`Node`）构成，节点可以是按钮、标签、文本框等。

### 1.1 Application类

`Application` 类是 JavaFX 应用程序的核心类，所有 JavaFX 应用程序都需要继承这个类。它提供了启动和管理 JavaFX 应用程序的基本功能。

#### 主要方法

**`start(Stage primaryStage)`**：

- 这是每个 JavaFX 应用程序必须实现的方法。`Stage` 表示窗口，`primaryStage` 是主窗口。
- 在这个方法中，你可以设置场景（`Scene`）并显示窗口。

**`init()`**：

- 可选方法，在 `start()` 方法之前被调用。可以在此方法中执行初始化任务，比如加载资源或进行设置。

**`stop()`**：

- 可选方法，当应用程序关闭时调用。可以在此处释放资源或保存应用状态。

**`launch(args)`**:

- 静态方法，用于启动应用程序。

### 1.2 组成元素

![组成元素](\img\image-20240928140808455.png)

**Stage** 是最外层的容器，表示应用程序的窗口。

**Scene** 是 `Stage` 的内容，它承载了所有的 UI 元素。

**Parent (Pane/Control)** 是布局容器，负责将各个 `Node` 组织在一起，决定它们的排列方式。

**Nodes** 是最小的 UI 组件，放置在 `Parent` 容器中，构成用户界面。

#### 1.2.1 **Stage (舞台)**

- `Stage` 是 JavaFX 应用的最外层，代表一个窗口。你可以将 `Stage` 理解为浏览器或桌面应用中的窗口。
- 在 JavaFX 中，每个应用至少有一个 `Stage`，这个 `Stage` 是由**系统自动创建并传递给 `start()` 方法的**。
- 你可以设置 `Stage` 的标题、大小、位置，并通过 `stage.show()` 来显示窗口。

#### 1.2.2 **Scene (场景)**

- `Scene` 是 `Stage` 的内容，表示舞台上的所有界面元素。
- 一般来说，一个 `Stage` 只能同时显示一个 `Scene`，但你可以在程序运行过程中切换 `Scene`。
- `Scene` 中包含了所有的组件（称为节点），这些节点在场景中排列布局。

#### 1.2.3 **Parent (父级容器，Pane/Control)**

- 在 `Scene`内部，你会有一个或多个`Parent`，它们是容器类，负责包含和组织子组件。常见的父级容器类包括 `Pane`和 `Control`。
  - **Pane**：是最常见的布局容器，控制组件的排列方式，例如 `HBox`, `VBox`, `GridPane`。
  - **Control**：是指一些带有交互功能的组件，如 `Button`, `TextField`, `Label` 等。
- 这些父级容器会确定子组件的布局方式，例如，`VBox` 按垂直顺序排列组件，而 `GridPane` 按网格方式排列组件。

#### 1.2.4 **Nodes (节点)**

- `Node` 是 JavaFX 应用的最基本构建块。所有的 UI 组件，包括按钮、文本框、标签等，都是 `Node`。
- `Node` 可以是简单的 UI 组件（如 `Button`, `Label`），也可以是容器（如 `Pane`）。
- 这些节点嵌套在布局容器（父级）中，最终组成整个用户界面。

### 1.3 简单程序

```java
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.layout.StackPane;
import javafx.stage.Stage;

public class SimpleApp extends Application {
    @Override
    public void start(Stage primaryStage) {
        // 创建一个 Button 节点
        Button button = new Button("Click Me");

        // 使用 StackPane 作为父级容器
        StackPane root = new StackPane();
        root.getChildren().add(button); // 将 Button 节点添加到父级容器中

        // 创建一个 Scene，并将 StackPane 作为 Scene 的根节点
        Scene scene = new Scene(root, 300, 200);

        // 将 Scene 设置到 Stage
        primaryStage.setTitle("JavaFX Example");
        primaryStage.setScene(scene);

        // 显示 Stage
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);   // 启动应用程序
    }
}
```

## 二、事件基础

JavaFX 中的事件处理是开发 GUI 应用程序的核心部分。JavaFX 提供了一个基于事件驱动的编程模型，允许用户与 GUI 组件交互。

### 1. 事件类型

JavaFX 中的事件是从 `javafx.event.Event` 类派生的，事件分为三大类：

- 输入事件（Input Event）：由用户的输入操作触发，比如鼠标点击、键盘输入等。这些事件的类包括：
  - `MouseEvent`：鼠标点击、移动等操作。
  - `KeyEvent`：键盘按下、释放等事件。
  - `ScrollEvent`：滚动操作。
- 窗口事件（Window Event）：涉及窗口的显示、隐藏、关闭等操作，比如：
  - `WindowEvent`：窗口被关闭、最小化等。
- 动作事件（Action Event）：通常由按钮、菜单等组件触发，比如：
  - `ActionEvent`：按钮被点击，菜单项被选择等。

对应的事件对象封装了事件的各种信息，可以通过相应函数进行获取。

> javafx.event.Event 来源于 java 事件类根类 java.util.EventObject

### 3. 事件类

事件对象通常是 `Event` 类及其子类的实例，每种事件类型（例如鼠标事件、键盘事件等）都有特定的属性和方法，用来获取有关事件的信息。通过事件对象，可以捕获并处理用户的交互行为，如鼠标点击、键盘输入、触摸等。

#### 3.1 Event 类

`Event` 是所有事件对象的基类，许多常用的事件对象都继承自它。`Event` 类本身有一些通用的方法和属性。

| **方法/属性** | **描述** |
| ------------- | -------- |
| `getEventType()` | 获取事件的类型。返回 `EventType` 对象，可以用来区分不同类型的事件。 |
| `consume()` | 标记事件为“已消费”，消费后的事件不会再继续传播到其他事件处理器。 |
| `isConsumed()` | 判断事件是否已被消费。 |
| `getTarget()` | 获取事件的目标对象，通常是触发事件的控件或节点。 |
| `getSource()` | 获取触发事件的源头对象，通常与 `getTarget()` 相同。 |
| `getEventTarget()` | 获取事件的目标，这里使用的是 JavaFX 的内部接口 `EventTarget`。 |
| `getTimestamp()` | 获取事件发生的时间戳，通常用于处理需要精确时间的事件（单位为毫秒）。 |

#### 3.2 MouseEvent 类

任意节点均可添加

| **方法/属性** | **描述** |
| ------------- | -------- |
| `getX()` | 获取鼠标指针在节点的局部坐标系中的 x 坐标。 |
| `getY()` | 获取鼠标指针在节点的局部坐标系中的 y 坐标。 |
| `getScreenX()` | 获取鼠标指针在屏幕坐标系中的 x 坐标。 |
| `getScreenY()` | 获取鼠标指针在屏幕坐标系中的 y 坐标。 |
| `getClickCount()` | 获取点击次数（例如双击则返回 2）。 |
| `isPrimaryButtonDown()` | 判断鼠标主键（通常是左键）是否按下。 |
| `isSecondaryButtonDown()` | 判断鼠标副键（通常是右键）是否按下。 |
| `isMiddleButtonDown()` | 判断鼠标中键是否按下。 |
| `isShiftDown()` | 判断事件发生时，Shift 键是否按下。 |
| `isControlDown()` | 判断事件发生时，Ctrl 键是否按下。 |
| `isAltDown()` | 判断事件发生时，Alt 键是否按下。 |
| `isMetaDown()` | 判断事件发生时，Meta 键（通常是 Mac 的 Command 键）是否按下。 |
| `isDragDetect()` | 判断是否正在进行拖动检测，通常用于判断是否正在执行拖放操作。 |
| `getButton()` | 获取触发事件的鼠标按钮，返回 `MouseButton`（`PRIMARY`, `SECONDARY`, `MIDDLE` 之一）。 |
| `getPickResult()` | 返回 `PickResult` 对象，包含有关鼠标事件在 3D 场景中点击的信息。 |

案例

```java
button.addEventHandler(MouseEvent.MOUSE_CLICKED, event -> {
    System.out.println("Mouse clicked at: " + event.getX() + ", " + event.getY());
});
```

#### 3.3 KeyEvent 类

键盘事件需要组件获取焦点，即不能在无法获取焦点的组件上使用。

| **方法/属性** | **描述** |
| ------------- | -------- |
| `getCode()` | 获取按下或释放的按键对应的 `KeyCode`（例如 `KeyCode.A`、`KeyCode.ENTER`）。 |
| `getText()` | 获取按下键所代表的字符（例如按下 `A` 键时返回 "a"，Shift+`A` 返回 "A"）。 |
| `getCharacter()` | 获取用户输入的字符，仅在 `KEY_TYPED` 事件时有效。 |
| `isShiftDown()` | 判断事件发生时，Shift 键是否按下。 |
| `isControlDown()` | 判断事件发生时，Ctrl 键是否按下。 |
| `isAltDown()` | 判断事件发生时，Alt 键是否按下。 |
| `isMetaDown()` | 判断事件发生时，Meta 键是否按下（通常是 Mac 的 Command 键）。 |
| `isShortcutDown()` | 判断事件发生时，快捷键是否按下（在 Windows 上通常为 Ctrl，Mac 上为 Command）。 |

![](\img\image-20241007115536708.png)
![](\img\image-20241007115609425.png)

案例

```java
scene.setOnKeyPressed(event -> {
    if (event.getCode() == KeyCode.ENTER) {
        System.out.println("Enter key pressed");
    }
});
```

> 其他不常用事件类暂不给出

##### 设置焦点

焦点通常会放置在第一个可聚焦的组件上。如果没有明确设置，通常是 `Scene` 的根节点，但根节点本身可能不是可聚焦的。

使用 `requestFocus()` 方法来显式请求一个组件获得焦点。

```java
root.requestFocus();
```

> 其他焦点操作略

### 4. 事件源(Event Source)

事件源是生成事件的对象，通常是用户界面的组件。例如，按钮 `Button` 是一个常见的事件源，当用户点击按钮时会触发 `ActionEvent`。

```java
Button button = new Button("Click Me!");
```

### 5. **常用事件处理方法**(注册事件)

为了处理事件源（控件）产生的事件，JavaFX 中的很多控件都提供了方便的事件处理方法，下面列出一些常见的：

- `setOnAction(EventHandler)`：通常用于按钮等可以触发操作的控件。
- `setOnMouseClicked(EventHandler)`：用于捕获鼠标点击事件。
- `setOnKeyPressed(EventHandler)`：用于捕获键盘按下事件。
- `addEventHandler(EventType, EventHandler)`：通用写法（建议使用）与上面`setOnXxx`不同的是它允许在一个节点上添加多个事件处理器，且不覆盖已有的处理器。这使得你可以对同一个事件类型添加多个处理逻辑。

> 所有的EventType见附录一

### 6. 事件处理器(Event Handler)

事件处理器用于响应事件。JavaFX 使用 `EventHandler< T extends Event>` 接口处理事件，需要通过重写 `handle(事件对象)` 方法来实现具体的响应逻辑。事件对象自动从事件源产生并传入事件处理器对象的handle方法中。

四种由繁到简的写法：

#### 6.1 外部类写法（最朴素）

```java
public class SimpleApp extends Application {
    @Override
    public void start(Stage stage) {
        Button button = new Button("Click Me");
        
        // 创建事件处理器对象
        ButtonHandler handler = new ButtonHandler();
        // 传入对象
        button.setOnAction(handler);
        
        Scene scene = new Scene(button, 300, 200);
        stage.setScene(scene);
        stage.show();
    }
    public static void main(String[] args) {launch(args);}
}
// 事件处理器类
class ButtonHandler implements EventHandler<ActionEvent> {
	@Override
	public void handle(ActionEvent e) {
        System.out.println("Button Clicked!");
	}
}
```

#### 6.2 内部类写法

内部类(嵌套类)，是一个定义在另外一个类范围中的类。

```java
public class SimpleApp extends Application {
    @Override
    public void start(Stage stage) {
        Button button = new Button("Click Me");
        
        // 把内部类的对象传入事件处理方法
        button.setOnAction(new ButtonHandler());
        
        Scene scene = new Scene(button, 300, 200);
        stage.setScene(scene);
        stage.show();
    }
    public static void main(String[] args) {launch(args);}
    
    // 内部事件处理器类
    class ButtonHandler implements EventHandler<ActionEvent> {
 		@Override
 		public void handle(ActionEvent e) {
            System.out.println("Button Clicked!");
    	}
    }
}
```

#### 6.3 匿名类写法

是 Java 中的一种特殊类，它没有显式的类名，通常用于简化代码，尤其是在只需要某个类的一个实例时，且这个类只在一次性使用的情况下。

语法：`new 父类或接口() {类的实现代码};`

```java
Button button = new Button("Click Me!");
button.setOnAction(new EventHandler<ActionEvent>() {
    @Override
    public void handle(ActionEvent event) {
        System.out.println("Button Clicked!");
    }
});
```

#### 6.4 lambda表达式写法（最简洁）

只有接口为函数式接口（含有注解@FunctionalInterface的），也就是只有一个抽象方法的接口时可以使用。可以直接实现上述代码功能。

语法：`(参数列表) -> {方法体}`

>  Java 8 及其之后的版本，可以使用更简洁的 Lambda 表达式来代替匿名类

```java
Button button = new Button("Click Me");
button.setOnAction(event -> {
    System.out.println("Button Clicked!");
});
```

> 后续学习FXML后事件处理更简单

总结：

![](\img\image-20241006222340410.png)


## 三、Stage（舞台）

### 一般方法

stage对象的方法，可以进行舞台的相关设置。下面是简单的设置：

| 方法                                | 作用                                                         |
| ----------------------------------- | ------------------------------------------------------------ |
| setTitle(String)                    | 设置舞台标题                                                 |
| setScene(Scene)                     | 将场景添加进舞台                                             |
| setX(Double)、setY(Double)          | 设置启动时窗口在屏幕中的位置                                 |
| setWidth(Double)、setHeight(Double) | 设置舞台宽高                                                 |
| initStyle(StageStyle)               | 设置舞台风格，可选值`DECORATED（默认）` |`UNDECORATED`|`TRANSPARENT`|`UTILITY`|`UNIFIED` |
| setFullScreen(Boolean)              | 设置全屏，默认false                                          |

```java
public class SimpleApp extends Application {
    /*
    重写start方法，形参为Stage，系统自动调用传入Stage
    */
    @Override
    public void start(Stage stage) {
        // 创建一个 Button 节点
        Button button = new Button("Click Me");
        // 创建一个 Scene场景，把按钮放入场景，场景 宽300，高200
        Scene scene = new Scene(button, 300, 200);
        // 设置舞台标题（应用名称）
        stage.setTitle("JavaFX Example");
        // 把场景添加到舞台
        stage.setScene(scene);
        // 显示 Stage
        stage.show();
    }
    public static void main(String[] args) {launch(args);}
}
```

### 生命周期事件方法

| 方法                                            | 声明周期   |
| ----------------------------------------------- | ---------- |
| setOnCloseRequest( EventHandler\<WindowEvent> ) | 关闭舞台时 |
| setOnHidden( EventHandler\<WindowEvent> )       | 被隐藏后   |
| setOnHiding( EventHandler\<WindowEvent> )       | 被隐藏前   |
| setOnShown(EventHandler\<WindowEvent> )         | 展示事件   |
| addEventHandler( EventType, EventHandler )      | 添加事件   |

## 四、组件

### 1 节点

#### 1.1 文本 Text

```java
Text message = new Text("Hello, this is a modal message!");

boolean b = message.isVisible();
message.setVisible(false);
```

#### 1.2 按钮 Button

```java
Button button = new Button("Click Me");	// 创建含初始文本的按钮
button.setOnAction(e -> System.out.println("Button clicked!"));	// 按钮的点击事件
```

#### 1.3 标签 Label

```java
Label label = new Label("This is a Label");	// 创建一个含初始文本的标签
label.setText("动态修改文本");
String s = label.getText();	// 获取当前文本
```

#### 1.4 文本框 TextField

```java
TextField textField = new TextField();
textField.setPromptText("Enter your name");	// 设置提示文本

String s = textField.getText();	// 获取当前文本
boolean b = textField.isDisabled();
textField.setDisabled(true);

textField.setOnAction(e -> System.out.println("Input: " + textField.getText()));	// 回车后触发
```

#### 1.5 复选框 CheckBox

```java
CheckBox checkBox = new CheckBox("Accept Terms and Conditions");
boolean b = checkBox.isSelected();	// 判断是否被选中
checkBox.setOnAction(e -> System.out.println("Checked: " + checkBox.isSelected()));	// 点击后触发
```

#### 1.6 单选按钮 RadioButton

```java
ToggleGroup group = new ToggleGroup();	// 创建一个选项组
RadioButton option1 = new RadioButton("Option 1");
RadioButton option2 = new RadioButton("Option 2");
option1.setToggleGroup(group);	// 将按钮添加到组，同组的受只能选一个的限制
option2.setToggleGroup(group);

group.selectedToggleProperty().addListener((obs, oldVal, newVal) -> {
	if (newVal != null) {
		RadioButton selected = (RadioButton) newVal;
		System.out.println("Selected: " + selected.getText());
	}
});	// 点击选项后触发 原理调用函数式接口ChangeListener
```

#### 1.7 下拉框 ComboBox

`ChoiceBox` 或` ComboBox`（多用）

注意：

1. 需要手动添加元素（在控制器中初始化）
2. `ComboBox`可以使用`OnAction`事件

```java
ComboBox<String> comboBox = new ComboBox<>();	// 创建指定内容数据类型的下拉框
// 向ChoiceBox添加选项        
choiceBox.getItems().addAll("选项 A", "选项 B", "选项 C");        
choiceBox.setValue("选项 A"); // 设置默认值

choiceBox.getValue(); // 获取当前选项

comboBox.setOnAction(e -> System.out.println("Selected: " + comboBox.getValue()));
```

#### 1.8 形状

`circle`，`rectangle`等

注意：

1. 不可获得焦点  ->  不能使用键盘事件
2. 填充颜色使用Paint类或其子类Color类

### 2 面板

#### 2.1 VBox 

将子节点垂直排列，从上到下
```java
VBox vBox = new VBox(10); // 设置节点间的间距为10像素

Button button1 = new Button("Button 1");
Button button2 = new Button("Button 2");
vBox.getChildren().addAll(button1, button2);	// 添加节点

vBox.setSpacing(20);	// 动态设置间隔
vBox.setAlignment(Pos.CENTER);	// 设置对齐方式 对齐方式由枚举类Pos提供，如Pos.CENTER、Pos.LEFT等
```

#### 2.2 HBox

将子节点水平排列， 从左到又

```java
 HBox hBox = new HBox(10); // 设置节点间的间距为10像素

Button button1 = new Button("Button 1");
Button button2 = new Button("Button 2");
hBox.getChildren().addAll(button1, button2);	// 添加节点

hBox.setSpacing(20);	// 动态设置间隔
hBox.setAlignment(Pos.CENTER);	// 设置对齐方式 对齐方式由枚举类Pos提供，如Pos.CENTER、Pos.LEFT等
```

#### 2.3 **StackPane**

将所有子节点堆叠在一起，默认从中心开始排列。

```JAVA
StackPane stackPane = new StackPane();

Button button1 = new Button("Button 1");
Button button2 = new Button("Button 2");
stackPane.getChildren().addAll(button1, button2);
```

**特点：**

- 子节点按堆叠顺序排列。
- 可通过`StackPane.setAlignment()`调整子节点对齐方式。

#### 2.4 BorderPane

有五个区域：**Top、Bottom、Left、Right、Center**，适合用于分区布局。

```java
BorderPane borderPane = new BorderPane();

borderPane.setTop(new Button("Top"));
borderPane.setBottom(new Button("Bottom"));
borderPane.setLeft(new Button("Left"));
borderPane.setRight(new Button("Right"));
borderPane.setCenter(new Button("Center"));
```

#### 2.5 GridPane

将子节点按网格排列。

```java
GridPane gridPane = new GridPane();

Button button1 = new Button("Button 1");
Button button2 = new Button("Button 2");
Button button3 = new Button("Button 3");

gridPane.add(button1, 0, 0); // 第1行第1列
gridPane.add(button2, 1, 0); // 第1行第2列
gridPane.add(button3, 0, 1); // 第2行第1列

gridPane.setHgap(10);	// 设置行间距
gridPane.setVgap(10);	// 设置列间距
```

#### 2.6 AnchorPane 

精确控制每个子节点的锚点位置。

```java
AnchorPane anchorPane = new AnchorPane();

Button button = new Button("Button");
AnchorPane.setTopAnchor(button, 20.0);
AnchorPane.setLeftAnchor(button, 50.0);
anchorPane.getChildren().add(button);
```



## 五、样式

这里给出常用的javafx样式，不包括css样式

### 5.1 颜色

javafx颜色基类为 `Paint` 类，子类常用的为 `Color` 类

#### 使用 `Color` 类创建颜色

```java
// 使用预定义颜色
Color.RED;  // 红色
Color.BLUE; // 蓝色
Color.GREEN; // 绿色

// 使用RGB创建颜色
Color.rgb(255, 0, 0); // 纯红色
Color.rgb(255, 0, 0, 0.5); // 半透明红色

// 透明度
Color.TRANSPARENT;	// 预定义明色
Color.rgb(255, 0, 0, 0.5); // rgb设置透明度
```

#### 应用颜色

可以应用到背景、边框或文本颜色等地方

```java
setFill(Color.BLUE);
setTextFill(Color.BLUE);
// 等等
```

### 5.2 字体

`Font` 类

#### 创建字体

```java
Font.font(20); // 设置字体大小为 20 像素
Font.font("Arial", 24); // 使用 Arial 字体，大小为 24
Font.font("Verdana", FontWeight.BOLD, FontPosture.ITALIC, 18); // 使用加粗和斜体的 Verdana 字体
```

##### 常用字体样式

- **FontWeight**（字体粗细）
  - `FontWeight.NORMAL`: 普通字体
  - `FontWeight.BOLD`: 加粗字体
  - `FontWeight.LIGHT`: 轻字体
  - 其他：`FontWeight.BLACK`, `FontWeight.MEDIUM`, `FontWeight.SEMI_BOLD` 等
- **FontPosture**（字体形态）
  - `FontPosture.REGULAR`: 正常字体
  - `FontPosture.ITALIC`: 斜体

> 注意：部分字体可能没有加粗或者斜体样式

##### 系统字体

通过 `Font.getFamilies()` 方法获取系统中可用的所有字体家族

#### 应用字体

文本控件`Text` 或 `Label` 等控件的 `setFont()`方法

```java
text.setFont(Font.font("Arial", FontWeight.BOLD, 24));  // 设置字体为 Arial，加粗，大小 24 像
```

### 5.3 css样式

#### 设置方法

1. 通过`setStyle(String)`方法设置样式
2. 导入外部css文件

#### 格式

```java
"-fx-xxx-xxx"
    
"-fx-border-color"  // 设置边框颜色
    
 hbox.setStyle("-fx-border-color: black;");
```




## 六、FXML

​	使用 FXML，可以通过 XML 描述用户界面，分离界面设计和应用逻辑，简化开发过程（MVC架构）。

### 1 Scene Builder教程

可视化软件（Scene Builder）可以方便快捷编写FXML文件。

> 本文以idea内置 Scene Builder 为例（编辑好界面后，对应FXML文件立即生效，较为方便）

#### 界面介绍

![Scene Builder界面解释](\img\f859c666fdc3965d0021d917a6860e50.png)

元素库主要包含：容器、控件、菜单、混合组合、图形形状、图表。在日常使用过程中，容器、控件、菜单就能满足我们绝大部分的需求。其次是图形和图标，然而混合类别使用较少，在一些切换按钮、单选等组合控件中可能会使用到。

属性区域主要包含三部分：元素属性、元素布局、元素动作。

层次结构区域能够清晰的展示容器之间的关系，以及容器与控件之间的父子关系。能够让设计者清楚的找到某一控件的位置，以方便修改。

#### 使用方法

选择要使用的对象，拖进效果预览区，再对控件属性进行调整即可。

![](img\image-20241007132936688.png)


### 2 使用fxml的基本步骤

#### 2.1 创建FXML文件：使用 FXML 文件定义用户界面。

**使用 Scene Builder 设计界面**

**在 Scene Builder 中添加事件处理：**

- 选择你需要添加事件处理的组件，比如按钮。
- 在 "Code" 面板中，你会看到一个 "On Action" 属性（对于按钮）。在这里你可以输入事件处理方法的名称，比如 `handleButtonAction`。
- 此时 Scene Builder 会在 FXML 文件中自动生成一个 `fx:id` 和 `onAction` 属性。

```xml
<?xml version="1.0" encoding="UTF-8"?>

<?import javafx.scene.control.*?>
<?import javafx.scene.layout.*?>

<VBox xmlns:fx="http://javafx.com/fxml/1" alignment="CENTER" spacing="10">
    <!-- fx:id 属性，以指定控制器的id名 -->
    <Button fx:id="myButton" text="点击我!" onAction="#handleButtonAction"/>
</VBox>
```

> 这里的 `onAction` 属性指定了点击按钮时将调用 `handleButtonAction` 方法。

#### 2.2 创建控制器类：控制器类用于处理界面事件。

```java
import javafx.fxml.FXML;
import javafx.scene.control.Button;

public class MyController {
    @FXML	// 通过注解 @FXML 绑定界面元素
    private Button myButton; // 对应 FXML 中的 fx:id

    @FXML	// 通过注解 @FXML 绑定事件处理方法
    private void handleButtonAction(ActionEvent event) {
        System.out.println("按钮被点击!");
       	myButton.setText("Clicked!");  // 可以通过控制器直接修改按钮的文本
    }
    
    // 初始化方法：用于初始化添加下拉选项框元素
    public void initialize() {}
}
```

#### 2.3 将控制器与 FXML 文件关联

为了让 JavaFX 知道哪个控制器类与 FXML 文件关联，你需要在 FXML 文件的**根元素**中设置 `fx:controller` 属性。

```xml
<VBox fx:controller="mypackage.MyController" xmlns:fx="http://javafx.com/fxml/1" alignment="CENTER" spacing="10">
    <Button fx:id="myButton" text="点击我!" onAction="#handleButtonAction"/>
</VBox>
```

#### 2.4 加载FXML文件：在主应用程序中加载 FXML 文件，并设置场景。

```java
public class HelloApplication extends Application {
    @Override
    public void start(Stage stage) throws IOException {
        FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource("hello-view.fxml"));
        
        
        Scene scene = new Scene(fxmlLoader.load());
        stage.setTitle("Hello!");
        stage.setScene(scene);
        stage.show();
    }

    public static void main(String[] args) {
        launch();
    }
}
```



# 附录一

| 动作事件类型         | 描述                                         |
| -------------------- | -------------------------------------------- |
| `ActionEvent.ACTION` | 动作事件，通常用于按钮、菜单项等触发的事件。 |

| 鼠标事件类型                | 描述                                             |
| --------------------------- | ------------------------------------------------ |
| `MouseEvent.MOUSE_CLICKED`  | 鼠标点击事件，表示鼠标单击（按下并释放）的动作。 |
| `MouseEvent.MOUSE_PRESSED`  | 鼠标按下事件，表示按下鼠标按钮的动作。           |
| `MouseEvent.MOUSE_RELEASED` | 鼠标释放事件，表示释放鼠标按钮的动作。           |
| `MouseEvent.MOUSE_MOVED`    | 鼠标移动事件，表示鼠标在组件上移动时触发。       |
| `MouseEvent.MOUSE_DRAGGED`  | 鼠标拖动事件，表示按住鼠标按钮并拖动鼠标时触发。 |
| `MouseEvent.MOUSE_ENTERED`  | 鼠标进入事件，表示鼠标指针进入组件时触发。       |
| `MouseEvent.MOUSE_EXITED`   | 鼠标退出事件，表示鼠标指针离开组件时触发。       |

| 键盘事件类型            | 描述                                                         |
| ----------------------- | ------------------------------------------------------------ |
| `KeyEvent.KEY_PRESSED`  | 键盘按下事件，表示按下某个键时触发。                         |
| `KeyEvent.KEY_RELEASED` | 键盘释放事件，表示释放某个键时触发。                         |
| `KeyEvent.KEY_TYPED`    | 键盘输入事件，表示键盘字符输入时触发（常用于捕获文本输入，区别于具体按键）。 |

| 滚动事件类型         | 描述                                         |
| -------------------- | -------------------------------------------- |
| `ScrollEvent.SCROLL` | 滚动事件，通常由鼠标滚轮或触摸板滚动时触发。 |

| 窗口事件类型                       | 描述                                                         |
| ---------------------------------- | ------------------------------------------------------------ |
| `WindowEvent.WINDOW_SHOWING`       | 窗口显示事件，表示窗口即将显示时触发。                       |
| `WindowEvent.WINDOW_SHOWN`         | 窗口已显示事件，表示窗口已被显示时触发。                     |
| `WindowEvent.WINDOW_HIDING`        | 窗口隐藏事件，表示窗口即将被隐藏时触发。                     |
| `WindowEvent.WINDOW_HIDDEN`        | 窗口已隐藏事件，表示窗口已被隐藏时触发。                     |
| `WindowEvent.WINDOW_CLOSE_REQUEST` | 窗口关闭请求事件，表示用户请求关闭窗口时触发（例如点击关闭按钮） |

> 还有拖放事件、触摸事件、手势事件省略

示例：

```java
Button button = new Button("Click Me");
button.addEventHandler(MouseEvent.MOUSE_CLICKED, e -> {
    System.out.println("Button clicked!");
});
```
