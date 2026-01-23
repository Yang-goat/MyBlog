---
icon: pen-to-square
title: dataclass 用法
date: 2026-01-22
order: 6
category:
    - python 
#tag:
#  - 
---

# dataclass 用法

## 介绍

`dataclass` 是 Python 3.7+ 引入的一个装饰器，用来简化“数据类”的定义。

传统写法：

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
```

用 `dataclass`：

```python
from dataclasses import dataclass

@dataclass
class Person:
    name: str
    age: int
```

自动生成：

- `__init__`
- `__repr__`
- `__eq__`

以及可选的 `__hash__`, `__lt__` 等

## 1. 基本用法

```python
from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int
```

使用：

```python
p = Point(1, 2)
print(p)          # Point(x=1, y=2)
print(p.x, p.y)  # 1 2
```

自动支持比较：

```python
Point(1, 2) == Point(1, 2)  # True
```

## 2. 默认值

(1) 普通默认值
```python
@dataclass
class Person:
    name: str
    age: int = 18
```

(2) 可变默认值要用 default_factory

❌ 错误写法：

```py
@dataclass
class A:
    lst: list = []
```


✅ 正确写法：

```py
from dataclasses import dataclass, field

@dataclass
class A:
    lst: list = field(default_factory=list)
```

否则多个实例会共享同一个 list。

## 3. field 的常见参数

```py
from dataclasses import field
```

(1) default
```py
x: int = field(default=0)
```
(2) default_factory
```py
lst: list = field(default_factory=list)
```
(3) init=False（不出现在构造函数中）
```py
@dataclass
class A:
    x: int
    y: int = field(init=False)

    def __post_init__(self):
        self.y = self.x * 2
```
(4) repr=False（不显示在 repr 中）
```py
password: str = field(repr=False)
```
(5) compare=False（不参与比较）
```py
id: int = field(compare=False)
```

## 4. __post_init__：构造后的处理

dataclass 自动生成 __init__，如果你想在初始化后做额外处理，用：
```py
@dataclass
class Person:
    name: str
    birth_year: int
    age: int = field(init=False)

    def __post_init__(self):
        self.age = 2025 - self.birth_year
```

## 5. 冻结 dataclass（不可变）

```py
@dataclass(frozen=True)
class Point:
    x: int
    y: int
```

此时：

```py
p = Point(1, 2)
p.x = 3  # ❌ 报错
```

类似于“只读对象”。

## 6. 排序支持

```py
@dataclass(order=True)
class Person:
    age: int
    name: str
```

支持：

```py
p1 < p2
p1 > p2
```

比较顺序按字段定义顺序。

## 7. asdict / astuple

转为字典或元组

```py
from dataclasses import asdict, astuple

p = Point(1, 2)

asdict(p)   # {'x': 1, 'y': 2}
astuple(p) # (1, 2)
```
