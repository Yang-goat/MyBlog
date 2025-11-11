---
icon: pen-to-square
date: 2025-09-27
category:
  - Java
tag:
  - maven
---

# maven安装教程

## 一、maven下载与安装

[maven官网](https://maven.apache.org/download.cgi)

### 1. 下载

下载官网中两者选其一，下载后解压到你想放的位置上，安装就成功了：

![](\img\maven下载.png)

### 2. 环境变量配置

先在系统环境变量中配置`MAVEN_HOME`变量，值为解压后的文件夹路径：

![](img/mavenhome.png)

然后配置path变量:

```txt
%MAVEN_HOME%\bin
```

![](img/mavenbin.png)

## 二、设置 Maven 默认本地仓库位置

默认本地仓库是：

```
C:\Users\<你的用户名>\.m2\repository
```

如果想自定义路径（例如 D 盘），需要修改 `settings.xml`：

1. 找到 Maven 的配置文件：（建议）

   ```
   %MAVEN_HOME%\conf\settings.xml
   ```

   或在用户目录下：

   ```
   C:\Users\<用户名>\.m2\settings.xml   （如果没有，可以自己复制一份）
   ```

2. 编辑，找到 `<localRepository>` 标签（默认是注释掉的），改成你想要的路径，例如：

   ```xml
   <localRepository>D:/maven/repository</localRepository>
   ```

## 三、国内镜像仓库配置

如果下载依赖太慢，可以在 `settings.xml` 中添加国内镜像，比如阿里云：

```xml
<mirrors>
  <mirror>
    <id>aliyunmaven</id>
    <mirrorOf>*</mirrorOf>
    <name>阿里云公共仓库</name>
    <url>https://maven.aliyun.com/repository/public</url>
  </mirror>
</mirrors>
```
