---
icon: book
date: 2025-08-22
category:
  - Latex
tag:
  - 基础
---

# Latex基础

## 一、LaTeX 简介

LaTeX 是一种基于 TeX 的排版系统，广泛用于学术界，特别是数学、物理学和计算机科学等领域。它非常适合处理复杂的数学公式，并可以生成高质量的 PDF 文档。



## 二、基础文档结构

一个基本的 LaTeX 文档由以下部分组成：

```latex
\documentclass{article}

% 导言区：进行配置，包括加载宏包、定义命令、设定文档的全局属性等

\begin{document}
Hello, world!
\end{document}
```

- `\documentclass{article}`：指定文档类型，常见的有 `article`、`report`、`book`。
- `\begin{document}` 和 `\end{document}`：文档的开始和结束。



## 三、设置文档类型

文档类型（或称为文档类）决定了你的文档的基本结构和可用的命令。通过 `\documentclass` 命令来指定文档类，这个命令位于源文件的最顶部，是每个 LaTeX 文件的必备元素。

1. article
   用途：适用于科学期刊文章、演示文稿、短报告、程序文档、邀请函等。
   特点：没有章节（chapters），从节（sections）开始。

2. report
   用途：适用于较长的报告包含多个章节，小册子，学位论文等。
   特点：包括章节，通常不需要部分（parts）。
3. book
   用途：适用于真正的书籍，包括小说和许多学术出版物。
   特点：开始于部分和章节，提供了特别的章节如前言和索引。
4. beamer
   用途：用于制作演示文稿。
   特点：提供了广泛的工具和模板，以制作视觉效果吸引人的幻灯片。
5. letter
   用途：用于编写信件。
   特点：具有专门的命令用于处理信件格式，如地址、日期、开头和结尾等。

`ctexbook`、`ctexart`和`ctexbeamer`，这些类型自带了对中文的支持

```latex
\documentclass[options]{class-name}
```

其中 `class` 是文档类名称，`options` 可以包括文档的一些全局设置，如字体大小（10pt、11pt、12pt）、纸张大小（a4paper、letterpaper等）、双面打印（twoside）等。

```latex
\documentclass[12pt, a4paper]{article}
```



## 四、导言区

### 4.1 加载宏包

```latex
\usepackage{graphicx}	% 插入图片
\usepackage{hyperref}	% 创建超链接
\usepackage{amsmath, amsthm, amssymb}	% 与数学公式与定理环境相关宏包

% 加载宏包时设置基本参数
\usepackage[bookmarks=true, colorlinks, citecolor=blue, linkcolor=black]{hyperref}
```

### 4.2 定义或重新定义命令

#### 定义新命令

```latex
\newcommand{\新命令大小写字母}[命令参数个数，可省略][默认参数，可省略]{命令的定义，形参#1，#2···}
```

案例

```latex
\usepackage{xcolor} % 必须加载 color 或 xcolor 宏包
\newcommand{\note}[2][blue]{\textcolor{#1}{#2}}

\note{这是一个蓝色的注释}
\note[red]{这是一个红色的注释}
```

#### 重新定义命令

```latex
\renewcommand		% 新定义的命令与已有命令重名,重新定义命令
\providecommand		% 命令不存在则定义新的，若存在则使用已有的
```

案例

```latex
\renewcommand{\section}[1]{\textbf{\Large #1}}	% 修改默认的章节标题样式 使所有的节标题变为粗体和大字号
\renewcommand{\abstractname}{摘要}	% 修改Abstract为摘要
```

### 4.3 页面布局

```latex
\usepackage{geometry}	% 设置页面尺寸和边距的宏包
\geometry{a4paper, total={170mm,257mm}, left=20mm, top=20mm}
```

### 4.4 标题、日期、作者

```latex
\title{我的第一个\LaTeX 文档}
\author{Dylaaan}
\date{\today}

\begin{document}
\maketitle	% 文档中显示标题
```

## 五、正文

### 5.1 文本排版

- **加粗**：`\textbf{text}`
- **斜体**：`\textit{text}`
- **下划线**：`\underline{text}`

#### 对齐方式

- **左对齐**：`\begin{flushleft} ... \end{flushleft}`
- **居中**：`\begin{center} ... \end{center}`
- **右对齐**：`\begin{flushright} ... \end{flushright}`

#### 段落控制

- **缩进**：默认首行缩进，可以通过 `\noindent` 禁止当前段落缩进。
- **行间距**：可以使用 `\linespread{factor}` 调整，如 `\linespread{1.5}` 实现1.5倍行距。
- **段间距**：通过调整 `\parskip` 和 `\parindent` 控制段间距和段首缩进。





### 5.2 列表

在 LaTeX 中，列表分为项目列表和枚举列表。

**项目列表**：无序列表

```latex
\begin{itemize}
  \item First item
  \item Second item
\end{itemize}
```

**枚举列表**：有序列表

```latex
\begin{enumerate}
  \item First item
  \item Second item
\end{enumerate}
```

### 5.3 数学模式

使用 `$...$` 进入行内数学模式，使用 `\[...\]`或`$$...$$` 进入行间数学模式。见latex公式笔记。

```latex
Einstein's famous equation $E=mc^2$ expresses the equivalence of mass and energy.
```