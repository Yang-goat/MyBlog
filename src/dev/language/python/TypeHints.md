---
icon: pen-to-square
title: 类型提示
date: 2026-01-23
order: 5
category:
    - python 
#tag:
#  - 
---

# 类型提示

类型提示（Type Hints） 是 Python 在语法层面提供的一种 静态类型标注机制，用于描述：

- 变量类型
- 函数参数类型
- 函数返回值类型
- 复杂数据结构的组成类型

:::info
类型提示 不会影响 Python 的运行时行为，其主要作用对象是：

- 开发者
- IDE
- 静态类型检查工具
:::

提高代码**可读性**，提供更强的 **IDE 辅助能力**，支持**静态类型检查**，降低大型项目与科研代码中的隐性错误。

## 基本语法

**变量类型标注**

```py
x: int = 10
y: float = 3.14
name: str = "alice"
flag: bool = True
```

**函数参数与返回值**

```py
def add(a: int, b: int) -> int:
    return a + b
```

- 参数类型位于参数名后
- 返回值类型位于 -> 之后

## 内置类型与容器类型

**内置类型**

| 类型      | 含义  |
| ------- | --- |
| `int`   | 整数  |
| `float` | 浮点数 |
| `str`   | 字符串 |
| `bool`  | 布尔值 |
| `None`  | 空值  |

**容器类型**

```py
numbers: list[int]
mapping: dict[str, int]
coords: tuple[int, int]
flags: set[bool]
```

:::warning
Python 3.9 之前需使用 `typing.List`、`typing.Dict` 等。
:::

## Union 与 Optional

**Union（多类型之一）**

```py
from typing import Union

def parse(x: Union[int, str]) -> int:
    return int(x)
```

**Optional（可为 None）**

```py
from typing import Optional

def find(name: str) -> Optional[int]:
    ...
```

Python 3.10+ 推荐写法

```py
def find(name: str) -> int | None:
    ...
```

## Callable（函数类型）

```py
from typing import Callable

def apply(
    func: Callable[[int, int], int],
    x: int,
    y: int
) -> int:
    return func(x, y)
```

语义说明：

- Callable[[A, B], C]
- 表示参数类型为 (A, B)，返回类型为 C 的可调用对象

## 泛型（Generic Programming）

**TypeVar**

```py
from typing import TypeVar

T = TypeVar("T")

def first(xs: list[T]) -> T:
    return xs[0]
```

- `T` 表示任意类型
- 返回值类型与输入元素类型保持一致
