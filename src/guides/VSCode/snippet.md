---
icon: book
title: 创建文件模板
date: 2026-01-22
#order: 1
#category:
# - 
#tag:
#  - 
---

# 创建文件模板

实现新建一个文件后能快速写出这个文件的基本固定内容，即文件模板或代码片段

推荐使用VS Code内置`Snippet`功能实现。

:::info
本文以 markdown 文件为例
:::

## 1）创建指定语言的用户 snippet

VS Code：`Ctrl/Cmd + Shift + P` → 输入：`Snippets: Configure Snippets`→ 选择markdown语言 或者 点击`新建全局代码片段文件`并输入`markdown.json`

最终打开 `markdown.json` 文件

## 2）编辑模板

如：
```json
{
	"VuePress Hope Frontmatter": {
		"prefix": "vp",
		"body": [
		"---",
		"icon: pen-to-square",
		"title: $1",
		"date: $CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE",
		"#order: 1",
		"#category:",
		"# - ",
		"#tag:",
		"#  - ",
		"---",
		"",
		"# $1"
		],
		"description": "Insert VuePress Theme Hope frontmatter"
	}
}
```

各项含义如下：

- `VuePress Hope Frontmatter`：这个 snippet 的名字，只用于显示，不影响使用。
- `prefix`: "vp"：触发词，片段名。
- `body`：真正插入到文件里的内容，每个字符串是一行。

body 里的特殊写法：

- `$1`：光标占位符。触发后光标会停在这里，你输入的内容会同步到所有 $1 的位置。
  - 最后的 `# $1`：Markdown 一级标题，会和上面的 title: $1 同步。
- `$CURRENT_YEAR`，`$CURRENT_MONTH`，`$CURRENT_DATE`：VS Code 内置变量，会自动替换为当天日期。
- 以 # 开头的行：被注释的可选项，默认不生效，想用时删掉 # 即可。


## 3）使用

在markdown文件下 `Ctrl/Cmd + Shift + P` → 输入：`Snippets: Insert Snippets` → 点击`vp`
