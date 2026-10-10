---
title: Humanizer：辅助 AI 论文写作的文风校对技能
icon: pen-to-square
date: 2026-10-10
category:
  - github项目
tag:
  - GitHub
  - Agent Skills
  - AI写作
  - 学术写作
  - 文本润色
---

# Humanizer：辅助 AI 论文写作的文风校对技能

用 AI 帮忙写论文，常见的问题是文字变得流畅了，论述却变得空泛：引言反复强调研究意义，相关工作只剩笼统评价，实验分析把一项有限的结果写成“显著优势”。这些句子看起来像论文，读者却很难从中找到具体问题、证据和适用条件。

[Humanizer](https://github.com/blader/humanizer) 是 blader 开源的写作校对技能，供 Claude Code、Codex 等支持 Agent Skills 的工具使用。它能帮助检查 AI 草稿中的模板化表达、重复总结和夸张措辞。对于已经有文献、方法和实验结果，只想让论文表述更清楚的作者，可以把它放在初稿完成后的语言校对环节。

Humanizer 本身是通用文风技能。用到论文中时，需要额外约束专业术语、公式、引用和结论范围，避免润色把学术表达中的必要细节删掉。

本文于 2026 年 10 月 10 日根据项目 README 和 `SKILL.md` 整理。下面的命令来自官方安装说明，未在本文编写过程中重新安装或测试。

## 对论文初稿有哪些帮助

Humanizer 的规则参考了维基百科的 [Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)，当前技能列出 26 类模式。它检查句子的表达，也检查段落之间是否重复、整篇文章是否被固定节奏牵着走。放到论文里，我更关注下面这些用途。

| 论文中的常见写法 | 问题 | 修改方向 |
| --- | --- | --- |
| 引言反复写“具有重要意义”“推动领域发展” | 研究问题迟迟没有出现 | 删减空泛评价，把已有的研究问题提前 |
| 相关工作写“现有方法普遍存在不足” | 没有指出是哪类方法、什么条件和哪项不足 | 保留文献能够支持的具体比较；缺证据时标出待补之处 |
| 实验分析写“充分证明了方法的优越性” | 结论超过测试范围 | 保留数据集、对照方法与实验条件，按已有结果表述 |
| 每段都按“首先、其次、最后”展开 | 论证被固定模板切碎 | 按方法依赖或证据关系组织段落 |
| 每节末尾再概括一次刚讲过的结果 | 增加篇幅，缺少新的讨论 | 合并重复内容，保留解释和限制 |
| 用多个近义词形容同一项贡献 | 贡献显得很大，却难以核对 | 写清新增了哪个机制、解决了什么问题 |

对摘要和引言，它可以帮助压缩重复背景，让问题与贡献更早出现。方法部分则要收紧修改范围，只调整语句和衔接，保留定义与推导顺序。实验讨论中，最有用的是去掉空泛评价，让观察结果和解释之间的关系更清楚。

这些是把通用校对规则用于论文的建议，项目没有据此验证论文质量或发表效果。文献是否准确、方法是否成立、实验是否支持结论，仍需要作者逐项核对。

### 一个实验分析的改写示例

下面的段落是虚构的写作示例，不代表真实实验结果，也未运行模型测试。

原句：

> 在本文采用的数据集与实验设置下，加入模块 A 后，模型的准确率有所提高。这一结果充分彰显了模块 A 的卓越价值，为该领域的持续发展提供了有力支撑。

改成：

> 在本文采用的数据集与实验设置下，加入模块 A 后，模型的准确率有所提高。

修改保留了原句的观察和适用条件，删掉了没有证据的评价。若要进一步写出提升幅度、波动情况或原因，需要提供实际数据。不能在润色时把“有所提高”改成“显著提高”，也不能从准确率变化直接推出模块的作用机制。

Humanizer 的规则要求保留有依据的信息，并禁止编造事实。论文校对时，应把这条约束落实到数值、引用和限定词上。

### 中英文论文段落：降低模板感，保留学术信息

下面用同一段实验讨论展示中文和英文的修改。方法、数据与数值均为教学示例，未引用真实论文，也不代表 Humanizer 的实测输出。

#### 中文对比

润色前：

> 随着深度学习技术的持续发展，如何提升模型性能已成为一个值得深入探索的重要问题。在这一背景下，本文引入特征融合模块，以进一步增强模型的分类能力。值得注意的是，在固定训练预算下，我们在三个公开数据集上进行了实验，每个数据集使用五个随机种子，加入该模块后，平均分类准确率从 87.2% 提升至 88.1%，平均推理时间增加了 8%。这一结果表明，在上述实验设置下，该模块有助于改善分类准确率，同时带来了额外的推理开销。需要强调的是，本研究尚未评估其在跨域数据上的表现。

润色后：

> 本文引入特征融合模块，以改善模型的分类准确率。在固定训练预算下，我们在三个公开数据集上开展实验，每个数据集使用五个随机种子。加入该模块后，平均分类准确率从 87.2% 提升至 88.1%，平均推理时间增加了 8%。结果表明，该模块在上述实验设置下改善了分类准确率，但增加了推理开销。其在跨域数据上的表现尚未评估。

#### 英文对比

润色前：

> In the rapidly evolving landscape of deep learning, improving model performance has become a crucial issue that warrants in-depth exploration. Against this backdrop, we introduce a feature fusion module to further enhance the model's classification capability. Notably, under a fixed training budget, we conducted experiments on three public datasets with five random seeds per dataset. Adding the module increased the mean classification accuracy from 87.2% to 88.1%, while the mean inference time increased by 8%. These results underscore that the module helps improve classification accuracy under the evaluated settings, while also introducing additional inference overhead. It is important to emphasize that its performance on cross-domain data has not yet been evaluated.

润色后：

> We introduce a feature fusion module to improve classification accuracy. Under a fixed training budget, we evaluated the module on three public datasets with five random seeds per dataset. Adding the module increased the mean classification accuracy from 87.2% to 88.1% and the mean inference time by 8%. The results indicate improved classification accuracy at the cost of additional inference time under the evaluated settings. Performance on cross-domain data has not been evaluated.

两种语言都删去了泛泛的背景开场和“值得注意”“需要强调”等提示语，直接进入方法与结果。英文中的 `rapidly evolving landscape`、`crucial` 和 `underscore` 也换成了具体陈述。数字、技术内容和限制没有随文字压缩而减少：

| 需要保留的内容 | 两个版本中的对应信息 |
| --- | --- |
| 方法与术语 | 特征融合模块（feature fusion module），分类准确率（classification accuracy） |
| 实验条件 | 固定训练预算、三个公开数据集、每个数据集五个随机种子 |
| 结果与代价 | 平均分类准确率由 87.2% 提高到 88.1%，平均推理时间增加 8% |
| 结论范围 | 判断限于已评估的实验设置，跨域表现尚未评估 |

这里保留了“在上述实验设置下”和 `under the evaluated settings`，也保留了性能与推理开销之间的取舍。原段落没有给出显著性检验，因此润色后仍使用“提高”和 `increased`，没有加入“统计显著”或 `statistically significant`。更自然的行文可以减少套话，必要的术语与限定条件则应当继续写清楚。

## 安装到常用 Agent

Humanizer 的主体是一份 `SKILL.md`，运行时由宿主 Agent 读取规则，再调用模型改写文字。仓库采用 MIT 协议。

### Codex

官方给出的全局安装命令如下。Windows 下使用 `npx.cmd`，需要本机已有 Node.js 和 npm：

```powershell
npx.cmd skills add blader/humanizer --global --agent codex
```

只想在当前项目使用，可以在项目目录执行并去掉 `--global`：

```powershell
npx.cmd skills add blader/humanizer --agent codex
```

安装后先检查技能列表中是否出现 `humanizer`，再用一小段草稿确认 Agent 能读取它。全局安装便于跨项目使用，项目安装则更适合与仓库自己的写作约定一起维护。

### Claude Code

在 Claude Code 会话里执行：

```text
/plugin marketplace add blader/humanizer
/plugin install humanizer@humanizer
```

通过插件安装时，调用名是 `/humanizer:humanizer`。README 要求 Claude Code 2.1.142 或更新版本；较旧版本可按官方说明使用 Skills CLI 安装。

其他支持技能的 Agent 可以参考 [README 的安装部分](https://github.com/blader/humanizer#installation)。宿主能否自动发现技能、是否支持斜杠命令，需要看对应工具的实现。

## 给论文润色时，先写清修改边界

建议每次交给 Agent 一个小节，并同时提供论文主题、读者和修改范围。下面的提示词适合校对已经完成事实核查的正文：

```text
使用 humanizer 技能校对下面这段论文正文，保持正式、克制的学术语气。
读者是本领域研究者，不需要增加通识背景。
只改善表达、段落衔接和重复内容。
保留专业术语、符号、数值、引用及结论的适用条件。
不要添加文献、实验结果、因果解释或新的贡献。
没有证据支持的表述请单独指出，不要自行补全。
```

如果希望与其他章节保持一致，可以附上两三段已经定稿的文字，作为句长、术语和论述节奏的样例。学术正文应保持中性表达，不必为了“像人写的”加入口语、感叹或个人经历。

对已有 Markdown 论文草稿，可以指定文件与小节：

```text
使用 humanizer 校对 paper/discussion.md 的“实验讨论”部分。
保持标题结构、公式、表格、引用标记和链接目标不变。
保留“在本实验设置下”“可能”“部分”等必要限定。
不把相关性改成因果关系，不扩大结论范围。
修改后列出需要作者核查的语义变化。
```

技能的文件模式要求只改正文，保留代码、数据和元信息；公式与引用等论文约束也应在任务里明确写出。执行后查看文件差异，重点核对数字、否定词、比较对象与引用位置。删掉一个“部分”或“在这个测试集上”，结论的范围就可能变了。

## 放在事实核查之后，定稿之前

我更愿意在文献、方法和实验结果已经确定后使用它。先写清每一节要回答的问题，把引用和数据放到对应论述附近，再检查语言。这样，润色时有一份可以逐句对照的底稿。

可以先试一个段落，确认修改是否保留原意，再扩展到整个小节。初稿中如果还有占位引用、未经核对的数据或尚未解释的实验现象，应先解决这些问题。文风校对无法补上缺失的研究证据。

官方 README 明确说明，Humanizer 的目标是改善人的阅读体验，并不承诺通过 AI 检测。用于论文时，更值得检查的是：读者能否找到研究问题，引用是否支持相邻论述，实验结论是否保留了必要条件。把这些内容说清楚，才是这类技能对论文写作的实际帮助。

## 参考资料

- [blader/humanizer：项目介绍与安装说明](https://github.com/blader/humanizer)
- [Humanizer SKILL.md：修改规则与执行流程](https://github.com/blader/humanizer/blob/main/SKILL.md)
- [Wikipedia：Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
