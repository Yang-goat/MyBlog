---
icon: book-bookmark
date: 2025-12-14
order: 1
category:
  - docker
tag:
  - 安装下载
---

# Docker 的国内下载安装教程

## Linux下安装 Docker

### 1. 下载 Docker

[Docker官方安装教程](https://get.docker.com/)

安装 Docker CLI、Docker Engine 以及它们的依赖项的最新稳定版本：

1. 下载脚本

```shell
curl -fsSL https://get.docker.com -o install-docker.sh
```

::: tip
网络超时则需要科学上网
:::

2. 验证脚本内容

```shell
cat install-docker.sh
```

4. 以 root 身份运行脚本，或使用 sudo 执行安装

```shell
sudo sh install-docker.sh
```

### 2. 配置 Docker 镜像源

1. 编辑 `daemon.json`

```shell
sudo vi /etc/docker/daemon.json

#或者

sudo nano /etc/docker/daemon.json
```

2. 输入下列内容，添加镜像源并保存：

```json
{
    "registry-mirrors": [
        "https://docker.m.daocloud.io",
        "https://docker.1panel.live",
        "https://hub.rat.dev"
    ]
}
```

3. 重启 Docker：

```shell
sudo service docker restart
```

### 3. 配置终端 Docker 指令无需每次 sudo：

执行以下代码后从从重启系统或注销再的登陆用户即可

```shell
sudo usermod -aG docker $USER
```

### 4. 修改 Docker 镜像存储位置（可选）

默认的 Docker 镜像存储路径为`/var/lib/docker/`，若root目录存储空间不足可考虑修改

:::warning
Docker Desktop（Mac/Windows）不建议修改，官方不支持
Linux可修改
:::

1. 停止 Docker
```shell
sudo systemctl stop docker
```

2. 同步旧数据到新目录
```shell
sudo rsync -aP /var/lib/docker/ /data/docker/
```

3. 修改配置
```shell
sudo nano /etc/docker/daemon.json
```

新增如下信息：
```json
{
  "data-root": "/data/docker"
}
```

4. 启动 Docker
```shell
sudo systemctl start docker
```

5. 测试镜像是否迁移成功
```shell
docker images   # 原镜像都在
docker ps -a    # 原容器都在
```

### 4. 测试成果

1. 拉取 hello-world 镜像

```shell
docker pull hello-world
```

2. 运行镜像

```shell
docker run hello-world
```

若出现类似如下信息则安装配置成功：

```txt
Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```