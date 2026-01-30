---
icon: equals
title: 残差连接和归一化层 Add & Norm
date: 2026-01-30
#order: 1
category:
- 深度学习
tag:
 - 网络结构
---

# 残差连接和归一化层 Add & Norm

## 残差连接（Residual Connection / Skip Connection）

解决问题：

1. **梯度消失 / 梯度爆炸**
2. **退化问题（Degradation Problem）：** 前面训练的不好，后面层数训练没有效果，更难训练

### 基本结构

$$
y = x + F(x)
$$

其中：

- $x$  ：输入
- $F(x)$  ：若干层（Conv / Linear / Attention + 激活）
- $x$   与  $F(x)$   维度需一致（否则需要 projection）

### 常见残差形式

#### 恒等残差（Identity Skip）

$$
y = x + F(x)
$$

直接相加。最常见、最稳定

#### 投影残差（Projection Skip）

当维度不匹配时：

$$
y = W_s x + F(x)
$$

用于：

- 通道数变化
- 特征维度变化

***

## 归一化层（Normalization Layer）

解决问题：

训练深度网络时，存在 **Internal Covariate Shift（内部协变量偏移）**：

- 前一层参数更新
- 导致后一层输入分布不断变化
- 学习过程不稳定

归一化的目标：

- **稳定分布**
- **加快收敛**
- **允许更大学习率**

### 常见归一化类型

#### Batch Normalization（BN）

对一个 batch 内的特征做归一化：

$$
\hat{x} = \frac{x - \mu_{\text{batch}}}{\sqrt{\sigma^2_{\text{batch}} + \epsilon}}
$$

然后引入可学习参数：

$$
y = \gamma \hat{x} + \beta
$$

特点

- 统计维度：**batch**
- 依赖 batch size
- 训练 / 推理行为不同（running mean / var）

优点

- CNN 中效果极好
- 强正则化效果

局限

- 小 batch 不稳定
- RNN / Transformer 中不适合
- 分布式训练复杂

#### Layer Normalization（LN）

对**单个样本的特征维度**归一化：

$$
\hat{x} = \frac{x - \mu_{\text{feature}}}{\sqrt{\sigma^2_{\text{feature}} + \epsilon}}
$$

特点

- 与 batch size **无关**
- 训练和推理行为一致
- Transformer 标配

***

# Add & Norm

## Post-Norm（早期 Transformer）

$$
y = \text{LN}(x + F(x))
$$

问题：

- 深层 Transformer 不稳定
- 梯度传播受限

## Pre-Norm（现代主流）

$$
y = x + F(\text{LN}(x))
$$

优点：

- 梯度更稳定
- 深度可扩展性更好
- GPT / LLaMA 等默认使用
