---
icon: book-bookmark
date: 2025-08-22
order: 1
category:
  - Latex
tag:
  - 基础

---

# LaTeX基础

## 一、LaTeX 简介

LaTeX 是一种基于 TeX 的排版系统，广泛用于学术界，尤其在数学、物理、工程与计算机科学中。它能精确控制排版细节，尤其擅长处理公式、图表与参考文献，输出的 PDF 文档质量极高。  
与所见即所得的编辑器不同，LaTeX 更像一种“写程序来排版”的语言，通过源代码生成文档。

---

## 二、基础文档结构

一个最小可运行的 LaTeX 文件如下：

```latex
\documentclass{article}

% 导言区：进行配置，包括加载宏包、定义命令、设置页面等

\begin{document}
Hello, world!
\end{document}
```

- `\documentclass{article}` 指定文档类型（或称“文档类”）。
- `\begin{document}` 与 `\end{document}` 包围正文内容。
- 导言区用于配置全局参数、加载宏包等。

---

## 三、常见文档类型

通过 `\documentclass[选项]{文档类}` 指定文档结构，常见类型如下：

| 类型                   | 说明         | 特点                       |
| ---------------------- | ------------ | -------------------------- |
| `article`              | 文章、短报告 | 从 `\section` 开始，无章节 |
| `report`               | 报告、论文   | 支持 `\chapter`            |
| `book`                 | 书籍         | 包含封面、部分、章节       |
| `beamer`               | 演示文稿     | 制作幻灯片                 |
| `letter`               | 信件         | 用于通信格式               |
| `ctexart` / `ctexbook` | 中文文档版本 | 自动支持中文               |

示例：

```latex
\documentclass[12pt,a4paper]{ctexart}
```

常见选项：

- 字号：`10pt`、`11pt`、`12pt`
- 纸张：`a4paper`、`letterpaper`
- 排版：`oneside`、`twoside`

---

## 四、导言区（理解模板的核心）

导言区就是配置区，决定了整个文档的“规则”。

```latex
\usepackage{geometry}    % 控制页面布局
\usepackage{graphicx}    % 插入图片
\usepackage{amsmath}     % 数学环境
\usepackage{hyperref}    % 超链接
```

### 常见宏包功能说明

- `geometry`：控制页面边距，如 `\geometry{margin=2cm}`。
- `graphicx`：用于插图，命令 `\includegraphics`。
- `amsmath`, `amssymb`：支持高级数学符号。
- `hyperref`：让目录与引用可点击跳转。
- `xcolor`：控制颜色。
- `caption`：修改图表标题样式。

示例设置：

```latex
\usepackage[bookmarks=true, colorlinks, citecolor=blue, linkcolor=black]{hyperref}
```

你不需要记住所有宏包，只要能看懂别人模板中的配置即可。

---

## 五、正文写作

### 5.1 文本排版

- **加粗**：`\textbf{加粗}`
- **斜体**：`\textit{斜体}`
- **下划线**：`\underline{下划线}`

**段落控制**

- 默认首行缩进
- 禁止缩进：`\noindent`
- 行距：`\linespread{1.5}`
- 段间距：`\setlength{\parskip}{1em}`

**对齐环境**

```latex
\begin{flushleft} 左对齐文本 \end{flushleft}
\begin{center} 居中内容 \end{center}
\begin{flushright} 右对齐文本 \end{flushright}
```

---

## 六、插图与表格

### 6.1 插入图片

```latex
\usepackage{graphicx} % 导言区引入
```

```latex
\begin{figure}[htbp]
  \centering
  \includegraphics[width=0.6\textwidth]{example-image}
  \caption{示例图片}
  \label{fig:example}
\end{figure}
```

- `[htbp]` 控制图片浮动位置（here, top, bottom, page）。
- `\caption` 为图片添加标题。
- `\label` 用于交叉引用，可用 `\ref{fig:example}` 调用。

### 6.2 制作表格

```latex
\begin{table}[htbp]
  \centering
  \caption{示例表格}
  \begin{tabular}{|c|c|c|}
    \hline
    姓名 & 年龄 & 城市 \\ \hline
    张三 & 25 & 北京 \\ 
    李四 & 30 & 上海 \\ \hline
  \end{tabular}
\end{table}
```

- `{|c|c|c|}` 表示三列居中并有竖线。
- `\hline` 插入横线。

更复杂的表格可使用宏包 `booktabs` 或 `multirow`，使表格更美观。

---

## 七、数学公式

数学公式是 LaTeX 的灵魂。

### 7.1 行内公式

```latex
爱因斯坦质能方程：$E = mc^2$
```

### 7.2 行间公式

```latex
\[
E = mc^2
\]
```

### 7.3 多行与对齐

```latex
\begin{align}
a^2 + b^2 &= c^2 \\
E &= mc^2
\end{align}
```

### 7.4 常用符号

| 表达 | 命令           | 效果             |
| ---- | -------------- | ---------------- |
| 上标 | `x^{2}`        | \(x^2\)          |
| 下标 | `a_{ij}`       | \(a_{ij}\)       |
| 分数 | `\frac{a}{b}`  | \(\frac{a}{b}\)  |
| 根号 | `\sqrt{x}`     | \(\sqrt{x}\)     |
| 求和 | `\sum_{i=1}^n` | \(\sum_{i=1}^n\) |

---

## 八、参考文献（核心部分）

### 方法一：手动输入参考文献

最简单的方式是在文档末尾使用 `thebibliography` 环境：

```latex
\begin{thebibliography}{99}
  \bibitem{einstein1905} A. Einstein, “Zur Elektrodynamik bewegter Körper,” *Annalen der Physik*, 1905.
  \bibitem{knuth1984} D. E. Knuth, *The TeXbook*, Addison-Wesley, 1984.
\end{thebibliography}
```

正文中引用时使用：

```latex
爱因斯坦提出了相对论 \cite{einstein1905}。
```

这种方式优点是简单、直观；缺点是难以维护、格式易错。

---

### 方法二：使用 `.bib` 文献数据库（推荐）

1. 创建一个 `refs.bib` 文件，内容如下：

```bibtex
@article{einstein1905,
  author = {Einstein, Albert},
  title = {Zur Elektrodynamik bewegter Körper},
  journal = {Annalen der Physik},
  year = {1905},
  volume = {17},
  pages = {891--921}
}

@book{knuth1984,
  author = {Knuth, Donald E.},
  title = {The TeXbook},
  publisher = {Addison-Wesley},
  year = {1984}
}
```

2. 在主文件中添加：

```latex
\bibliographystyle{plain} % 参考文献格式
\bibliography{refs}       % 加载 bib 文件
```

3. 在正文中引用：

```latex
如文献 \cite{einstein1905} 所述，质能等价公式...
```

**编译顺序**：

```bash
pdflatex main.tex
bibtex main
pdflatex main.tex
pdflatex main.tex
```

或使用 VSCode、TexStudio 等工具自动运行。

---

## 九、LaTeX 编译流程与推荐工具

### 常见编译方式

| 编译器     | 特点                   |
| ---------- | ---------------------- |
| `pdflatex` | 生成 PDF，兼容性好     |
| `xelatex`  | 支持中文与系统字体     |
| `lualatex` | 现代化、速度快         |
| `latexmk`  | 自动判断依赖，多轮编译 |

推荐中文环境使用 `xelatex`，因为它对 UTF-8 字符支持良好。

### 推荐编辑器

- **TeX Live / MikTeX**：完整编译环境
- **TeXstudio / Overleaf / VSCode + LaTeX Workshop 插件**

---

## 十、使用别人的模板（.cls 文件）

在实际写作中，我们常使用学校或期刊提供的模板。模板的核心文件是 `.cls`，它定义了文档的排版样式。

### 10.1 模板结构

一个典型模板项目包含如下文件：

```
template/
├── main.tex
├── template.cls
├── ref.bib
├── figures/
├── example.pdf
```

在主文件中：

```latex
\documentclass[12pt,a4paper]{template}
```

表示当前文档将使用 `template.cls` 作为文档类。

### 10.2 `.cls` 文件的作用

`.cls` 文件定义了：

- 页面格式（边距、字号、页眉页脚）
- 加载的宏包
- 定义的新命令，如 `\advisor{}`、`\school{}`
- 特殊环境，如封面、摘要、致谢

示例：

```latex
\LoadClass[12pt]{report}
\RequirePackage{geometry}
\geometry{left=2.5cm, right=2.5cm, top=3cm, bottom=3cm}
\newcommand{\advisor}[1]{\def\@advisor{#1}}
```

### 10.3 使用模板的步骤

1. **放在同目录下**

   ```
   project/
     ├── main.tex
     ├── mythesis.cls
   ```

   在 `main.tex` 顶部：

   ```latex
   \documentclass{mythesis}
   ```

2. **或放入系统路径**
   Windows 用户：

   ```
   C:\Users\\<用户名>\\texmf\\tex\\latex\\
   ```

   放入后运行 `texhash` 更新索引。

3. **使用模板定义的命令**
   模板通常提供自定义命令：

   ```latex
   \title{硕士论文}
   \author{李雷}
   \advisor{韩梅梅教授}
   \school{电子信息学院}
   ```

### 10.4 修改模板外观

| 修改目标     | 方法                                               |
| ------------ | -------------------------------------------------- |
| 页边距       | 使用 `\geometry{}` 覆盖                            |
| 行距         | `\linespread{1.5}`                                 |
| 缩进         | `\setlength{\parindent}{2em}`                      |
| 标题编号     | `\renewcommand{\thesection}{第\arabic{section}章}` |
| 参考文献样式 | `\bibliographystyle{}` 更改样式                    |
| 页眉页脚     | 使用 `fancyhdr` 宏包修改                           |

如模板太复杂，可创建自定义覆盖文件：

```latex
\input{custom_settings.tex}
```

### 10.5 注意事项

- 文件名需与 `\documentclass{}` 匹配。
- 模板命令不可随意删除。
- 出现 “Undefined control sequence” 多为缺少宏包。

---

## 十一、小结

你现在应该已经掌握：

- LaTeX 文档结构与模板含义；
- 插入图、表、公式的写法；
- 手动与 bib 数据库管理参考文献；
- 如何使用 `.cls` 模板完成规范排版。

LaTeX 的魅力在于可扩展与可控制。学会阅读模板，即学会了“理解文档的语言”。

---

> “LaTeX 是理性的诗，它让文字的秩序拥有美学。”  
> —— Donald Knuth（TeX 之父）