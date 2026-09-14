---
title: 概率分布的特征函数
icon: wave-square
date: 2026-09-03
category:
  - 数学
tag:
  - 概率论
  - 随机变量
  - 分布
---

# 概率分布的特征函数

概率分布可以由分布函数、概率质量函数或概率密度函数描述，也可以转换到“频域”研究。**特征函数（Characteristic Function）**就是概率分布的傅里叶变换。它始终存在，能够唯一确定分布，并且会把独立随机变量之和转化为函数的乘积，因此特别适合处理卷积、分布收敛与中心极限定理。

## 1. 定义

设 $X$ 是实值随机变量，其特征函数定义为

$$
\varphi_X(t)=\mathbb{E}\!\left[e^{itX}\right],\qquad t\in\mathbb{R},
$$

其中 $i^2=-1$。由欧拉公式 $e^{iu}=\cos u+i\sin u$，也可以写成

$$
\varphi_X(t)
=\mathbb{E}[\cos(tX)]+i\,\mathbb{E}[\sin(tX)].
$$

若 $X$ 的分布函数为 $F_X$，则更一般地有

$$
\varphi_X(t)=\int_{-\infty}^{\infty}e^{itx}\,\mathrm{d}F_X(x).
$$

离散型和连续型随机变量分别对应

$$
\varphi_X(t)=\sum_k e^{itx_k}\mathbb{P}(X=x_k),
$$

以及

$$
\varphi_X(t)=\int_{-\infty}^{\infty}e^{itx}f_X(x)\,\mathrm{d}x.
$$

这里最后一个式子要求 $X$ 有概率密度 $f_X$。

::: tip 为什么特征函数总是存在？
对任意实数 $x,t$，都有 $|e^{itx}|=1$。因此
$$
\mathbb{E}\!\left[|e^{itX}|\right]=1<\infty,
$$
无论 $X$ 是否具有有限期望、方差或矩母函数，$\varphi_X(t)$ 都有定义。
:::

## 2. 基本性质

### 2.1 原点取值、模长与共轭对称

由定义立即得到

$$
\varphi_X(0)=1,
\qquad
|\varphi_X(t)|\leq 1,
\qquad
\varphi_X(-t)=\overline{\varphi_X(t)}.
$$

第三个等式说明实部是偶函数、虚部是奇函数。若 $X$ 关于原点对称，则 $X$ 与 $-X$ 同分布，进而 $\varphi_X(t)$ 是实值偶函数。

特征函数还在整个实数轴上一致连续。并非每一个满足 $f(0)=1$、$|f(t)|\leq 1$ 的连续函数都是特征函数；完整刻画还需要**正定性**，这正是 Bochner 定理的内容。

### 2.2 线性变换

对常数 $a,b\in\mathbb{R}$，

$$
\varphi_{aX+b}(t)
=\mathbb{E}\!\left[e^{it(aX+b)}\right]
=e^{ibt}\varphi_X(at).
$$

平移 $b$ 对应乘上相位因子 $e^{ibt}$，缩放 $a$ 对应把自变量改为 $at$。

### 2.3 独立随机变量之和

若 $X$ 与 $Y$ 相互独立，则

$$
\begin{aligned}
\varphi_{X+Y}(t)
&=\mathbb{E}\!\left[e^{it(X+Y)}\right]\\
&=\mathbb{E}\!\left[e^{itX}e^{itY}\right]\\
&=\mathbb{E}\!\left[e^{itX}\right]
  \mathbb{E}\!\left[e^{itY}\right]\\
&=\varphi_X(t)\varphi_Y(t).
\end{aligned}
$$

因此，对相互独立的 $X_1,\ldots,X_n$，

$$
\varphi_{X_1+\cdots+X_n}(t)
=\prod_{k=1}^{n}\varphi_{X_k}(t).
$$

在分布一侧，随机变量相加需要计算卷积；在特征函数一侧，卷积变成了普通乘法。这是特征函数最重要的计算优势之一。

## 3. 特征函数与矩

如果 $\mathbb{E}[|X|^n]<\infty$，那么 $\varphi_X$ 至少可以求 $n$ 阶导数，且

$$
\varphi_X^{(n)}(t)
=\mathbb{E}\!\left[(iX)^n e^{itX}\right].
$$

令 $t=0$，得到

$$
\mathbb{E}[X^n]
=\frac{\varphi_X^{(n)}(0)}{i^n}
=i^{-n}\varphi_X^{(n)}(0).
$$

前两阶矩满足

$$
\mathbb{E}[X]=\frac{\varphi_X'(0)}{i}=-i\varphi_X'(0),
\qquad
\mathbb{E}[X^2]=-\varphi_X''(0),
$$

所以

$$
\operatorname{Var}(X)
=-\varphi_X''(0)+\bigl(\varphi_X'(0)\bigr)^2.
$$

::: warning 导数与矩不能无条件互推
“$n$ 阶矩存在”足以推出上述求导公式，但仅知道特征函数在原点存在某阶导数，通常不能直接断言对应阶绝对矩存在。偶数阶存在更强的逆向结论；使用逆推时必须核对具体条件。
:::

若各阶矩存在且相应展开确实收敛，可以在原点附近写出

$$
\varphi_X(t)
=\sum_{n=0}^{\infty}\frac{(it)^n}{n!}\mathbb{E}[X^n].
$$

但“所有阶矩都存在”本身并不总能保证这个级数唯一恢复分布，因此不能把上式当作无条件成立的全局公式。

## 4. 常见分布的特征函数

| 分布 | 参数约定 | 特征函数 $\varphi_X(t)$ |
|---|---|---|
| 退化分布 | $\mathbb{P}(X=c)=1$ | $e^{ict}$ |
| Bernoulli 分布 | $X\sim\operatorname{Bernoulli}(p)$ | $1-p+pe^{it}$ |
| 二项分布 | $X\sim\operatorname{Binomial}(n,p)$ | $(1-p+pe^{it})^n$ |
| Poisson 分布 | $X\sim\operatorname{Poisson}(\lambda)$ | $\exp\{\lambda(e^{it}-1)\}$ |
| 均匀分布 | $X\sim U(a,b)$ | $\dfrac{e^{itb}-e^{ita}}{it(b-a)}$，$t\neq0$；$t=0$ 时为 $1$ |
| 正态分布 | $X\sim N(\mu,\sigma^2)$ | $\exp\!\left(i\mu t-\dfrac{\sigma^2t^2}{2}\right)$ |
| 指数分布 | $X\sim\operatorname{Exp}(\lambda)$，$\lambda>0$ 为率参数 | $\dfrac{\lambda}{\lambda-it}$ |
| Cauchy 分布 | 位置 $x_0$、尺度 $\gamma>0$ | $\exp(ix_0t-\gamma|t|)$ |

Cauchy 分布没有有限期望和方差，矩母函数也不在原点附近存在，但其特征函数仍对所有实数 $t$ 有定义。这很好地体现了特征函数相对于矩母函数的适用范围优势。

## 5. 一个推导：正态分布

先取标准正态随机变量 $Z\sim N(0,1)$。其特征函数为

$$
\varphi_Z(t)
=\frac{1}{\sqrt{2\pi}}
\int_{-\infty}^{\infty}
e^{itx}e^{-x^2/2}\,\mathrm{d}x.
$$

不必直接处理复积分。对 $t$ 求导，并利用 $x e^{-x^2/2}=-\dfrac{\mathrm{d}}{\mathrm{d}x}e^{-x^2/2}$，分部积分可得

$$
\varphi_Z'(t)=-t\varphi_Z(t).
$$

结合初值 $\varphi_Z(0)=1$，解这个微分方程得到

$$
\varphi_Z(t)=e^{-t^2/2}.
$$

若 $X=\mu+\sigma Z$，利用线性变换性质便有

$$
\varphi_X(t)
=e^{i\mu t}\varphi_Z(\sigma t)
=\exp\!\left(i\mu t-\frac{\sigma^2t^2}{2}\right).
$$

## 6. 特征函数能唯一确定分布

若两个随机变量 $X$ 和 $Y$ 满足

$$
\varphi_X(t)=\varphi_Y(t),\qquad \forall t\in\mathbb{R},
$$

那么它们具有相同的分布，即 $X\overset{d}{=}Y$。因此，证明两个随机变量同分布时，可以不直接比较分布函数或密度，只需证明它们的特征函数相同。

在特征函数绝对可积，即

$$
\int_{-\infty}^{\infty}|\varphi_X(t)|\,\mathrm{d}t<\infty
$$

时，$X$ 存在连续密度，并可由傅里叶反演公式恢复：

$$
f_X(x)=\frac{1}{2\pi}
\int_{-\infty}^{\infty}e^{-itx}\varphi_X(t)\,\mathrm{d}t.
$$

绝对可积是这条简洁密度反演公式的一个充分条件，而不是所有分布都必须满足的条件。更一般的反演定理可以直接恢复分布在区间上的概率。

## 7. 用特征函数判断分布收敛

Lévy 连续性定理建立了特征函数收敛与依分布收敛之间的联系。常用形式是：若 $X_n$ 的特征函数满足

$$
\varphi_{X_n}(t)\longrightarrow \varphi(t),
\qquad \forall t\in\mathbb{R},
$$

并且极限函数 $\varphi$ 在 $t=0$ 处连续，那么 $\varphi$ 是某个随机变量 $X$ 的特征函数，并且

$$
X_n\xrightarrow{d}X.
$$

反过来，若 $X_n\xrightarrow{d}X$，则对每个 $t$ 都有 $\varphi_{X_n}(t)\to\varphi_X(t)$。

### 中心极限定理中的典型用法

设 $X_1,X_2,\ldots$ 独立同分布，满足

$$
\mathbb{E}[X_k]=\mu,
\qquad
\operatorname{Var}(X_k)=\sigma^2>0.
$$

令

$$
Z_n=\frac{\sum_{k=1}^{n}X_k-n\mu}{\sigma\sqrt{n}}.
$$

对标准化变量 $Y_k=(X_k-\mu)/\sigma$，其特征函数在原点附近满足

$$
\varphi_Y(u)=1-\frac{u^2}{2}+o(u^2).
$$

由独立性，

$$
\varphi_{Z_n}(t)
=\left[\varphi_Y\!\left(\frac{t}{\sqrt n}\right)\right]^n
=\left[1-\frac{t^2}{2n}+o\!\left(\frac{1}{n}\right)\right]^n
\longrightarrow e^{-t^2/2}.
$$

$e^{-t^2/2}$ 正是标准正态分布的特征函数。由 Lévy 连续性定理，得到

$$
Z_n\xrightarrow{d}N(0,1).
$$

这段推导展示了特征函数方法的核心思路：**先把随机变量之和转化为特征函数的乘积，再通过函数极限识别极限分布。**

## 8. 与矩母函数、概率生成函数的区别

| 工具 | 定义 | 主要适用对象 | 是否总存在 |
|---|---|---|---|
| 特征函数 | $\varphi_X(t)=\mathbb{E}[e^{itX}]$ | 任意实值随机变量 | 是，对所有 $t\in\mathbb{R}$ |
| 矩母函数 | $M_X(t)=\mathbb{E}[e^{tX}]$ | 在原点邻域内指数矩有限的随机变量 | 否 |
| 概率生成函数 | $G_X(s)=\mathbb{E}[s^X]$ | 非负整数值随机变量 | 至少在 $|s|\leq1$ 内存在 |

三者都能把独立随机变量之和转化为乘积，但适用范围不同。若 $X$ 为非负整数值随机变量，则

$$
\varphi_X(t)=G_X(e^{it}).
$$

如果矩母函数在 $0$ 的某个邻域内存在，则在允许复数代入的意义下有 $\varphi_X(t)=M_X(it)$。反向使用时要谨慎：特征函数总存在，并不意味着矩母函数也存在。

## 9. 多维情形

对随机向量 $\boldsymbol{X}\in\mathbb{R}^d$，其特征函数定义为

$$
\varphi_{\boldsymbol{X}}(\boldsymbol{t})
=\mathbb{E}\!\left[e^{i\boldsymbol{t}^{\mathsf T}\boldsymbol{X}}\right],
\qquad \boldsymbol{t}\in\mathbb{R}^d.
$$

一维情形中的唯一性、独立和乘积以及连续性定理都有相应的多维版本。特别地，向量各分量 $X_1,\ldots,X_d$ 相互独立，当且仅当联合特征函数可以分解为

$$
\varphi_{\boldsymbol{X}}(t_1,\ldots,t_d)
=\prod_{k=1}^{d}\varphi_{X_k}(t_k).
$$

## 10. 常见误区

1. **特征函数不是概率密度。**它一般是复值函数，也不要求非负。
2. **独立性不可省略。**$\varphi_{X+Y}=\varphi_X\varphi_Y$ 通常只在 $X,Y$ 独立时成立。
3. **特征函数存在不代表矩存在。**Cauchy 分布就是典型反例。
4. **点态极限还要检查原点连续性。**应用 Lévy 连续性定理时，这一条件保证极限确实对应某个概率分布。
5. **傅里叶变换的符号约定可能不同。**本文采用 $e^{itx}$ 定义特征函数，因此密度反演中使用 $e^{-itx}$ 和系数 $1/(2\pi)$。

## 参考资料

- [MIT OpenCourseWare：Probability and Random Variables, Lecture 27](https://ocw.mit.edu/courses/18-440-probability-and-random-variables-spring-2014/resources/mit18_440s14_lecture27/)
- [MIT OpenCourseWare：Theory of Probability, Lecture 15](https://ocw.mit.edu/courses/18-175-theory-of-probability-spring-2014/resources/mit18_175s14_lecture15/)
- [UC Berkeley Statistics 205A：Characteristic Functions](https://www.stat.berkeley.edu/~pitman/s205f02/lecture12.pdf)
- [Encyclopedia of Mathematics：Characteristic function](https://encyclopediaofmath.org/wiki/Characteristic_function)
