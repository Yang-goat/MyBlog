---
icon: book
date: 2025-12-14
# order: 2
category:
  - docker
#   - Ubuntu
tag:
  - 命令行
  - Shell
---

# Docker 常用指令

> 说明：以下以 **Docker CLI（docker 命令）** 为主，按功能分块；每一块都用表格呈现，便于速查与复制。

---

## 1) 基础信息 & 帮助

| 目的 | 命令 | 常用参数/示例 | 备注 |
|---|---|---|---|
| 查看版本 | `docker version` |  | 同时显示 Client/Server |
| 查看系统信息 | `docker info` |  | 含存储驱动、root dir、插件等 |
| 帮助入口 | `docker --help` |  |  |
| 查看子命令帮助 | `docker <cmd> --help` | `docker run --help` |  |
| 查看 Docker 上下文 | `docker context ls` |  | 多 Docker 环境切换 |
| 切换上下文 | `docker context use <name>` |  |  |
| 当前登录信息 | `docker login` / `docker logout` | `docker login -u <user>` | Registry 认证 |

- 查询Docker运行状态
    - `sudo systemctl status docker --no-pager -l`
- 重启Docker
    - `sudo systemctl restart docker`

---

## 2) 镜像（Images）

| 目的 | 命令 | 常用参数/示例 | 备注 |
|---|---|---|---|
| 拉取镜像 | `docker pull <image>[:tag]` | `docker pull nginx:1.27` | 不写 tag 默认 `latest` |
| 推送镜像 | `docker push <image>[:tag]` |  | 需先 `docker login` |
| 列出镜像 | `docker images` | `docker images -a` | `-a` 显示中间层 |
| 更细粒度列出 | `docker image ls` | `docker image ls --digests` | 同 `images` |
| 查看镜像详情 | `docker inspect <image>` | `docker inspect nginx:1.27` | JSON 输出 |
| 查看历史层 | `docker history <image>` | `docker history --no-trunc <img>` | 构建排查 |
| 给镜像打 tag | `docker tag <src> <dst>` | `docker tag app:1 app:prod` | 常配合 push |
| 删除镜像 | `docker rmi <image>` | `docker rmi -f <img>` | `-f` 强制 |
| 清理悬空镜像 | `docker image prune` | `docker image prune -a` | `-a` 清理未被引用镜像 |
| 导出镜像（tar） | `docker save -o <file.tar> <img>` | `docker save -o app.tar app:1` | 迁移/离线 |
| 导入镜像（tar） | `docker load -i <file.tar>` |  | 与 save 配套 |
| 从 Dockerfile 构建 | `docker build -t <name:tag> <path>` | `docker build -t app:1 .` | 传统构建 |
| buildx 构建 | `docker buildx build ...` | `docker buildx build --platform linux/amd64,linux/arm64 -t app:1 .` | 多架构 |

---

## 3) 容器（Containers）生命周期

| 目的 | 命令 | 常用参数/示例 | 备注 |
|---|---|---|---|
| 创建并运行 | `docker run [opts] <image> [cmd]` | `docker run -d --name web -p 8080:80 nginx` | 最常用 |
| 创建但不启动 | `docker create [opts] <image>` | `docker create --name web nginx` | 后续 `start` |
| 启动已存在容器 | `docker start <container>` | `docker start web` |  |
| 停止容器 | `docker stop <container>` | `docker stop -t 5 web` | `-t` 超时秒 |
| 重启容器 | `docker restart <container>` | `docker restart web` |  |
| 暂停/恢复 | `docker pause <c>` / `docker unpause <c>` |  | 冻结进程 |
| 删除容器 | `docker rm <c>` | `docker rm -f web` | `-f` 强制（含 stop） |
| 删除停止的容器 | `docker container prune` |  | 清理 |
| 查看运行中容器 | `docker ps` | `docker ps -a` | `-a` 含停止 |
| 查看容器详情 | `docker inspect <c>` |  | JSON 输出 |
| 重命名容器 | `docker rename <old> <new>` |  |  |
| 查看进程 | `docker top <c>` |  | 容器内进程 |
| 查看资源统计 | `docker stats [c...]` | `docker stats --no-stream` | CPU/内存/IO |
| 查看端口映射 | `docker port <c>` |  |  |

---

## 4) `docker run` 常用参数速查（高频）

| 分类 | 参数 | 示例 | 说明 |
|---|---|---|---|
| 后台/交互 | `-d` | `docker run -d nginx` | 后台运行 |
| 交互终端 | `-it` | `docker run -it ubuntu bash` | `-i` stdin，`-t` tty |
| 容器命名 | `--name` | `--name api` | 便于管理 |
| 自动删除 | `--rm` | `docker run --rm alpine echo hi` | 退出即删 |
| 端口映射 | `-p host:cont` | `-p 8080:80` | 可多次 |
| 暴露端口 | `--expose` | `--expose 80` | 只声明不映射 |
| 环境变量 | `-e` / `--env-file` | `-e TZ=Asia/Shanghai` / `--env-file .env` |  |
| 工作目录 | `-w` | `-w /app` |  |
| 挂载卷 | `-v` | `-v data:/var/lib/app` | 命名卷 |
| 挂载绑定 | `-v host:cont` | `-v $PWD:/work` | 绑定挂载 |
| 新挂载语法 | `--mount` | `--mount type=bind,src=$PWD,dst=/work` | 更清晰可读 |
| 网络 | `--network` | `--network mynet` | 同网络可互访 |
| 额外 hosts | `--add-host` | `--add-host api.local:1.2.3.4` | 修改 /etc/hosts |
| DNS | `--dns` | `--dns 8.8.8.8` |  |
| 重启策略 | `--restart` | `--restart=always` | `no/on-failure/unless-stopped/always` |
| 资源限制 | `--cpus` | `--cpus=1.5` | CPU 配额 |
| 资源限制 | `-m` | `-m 512m` | 内存上限 |
| 共享内存 | `--shm-size` | `--shm-size=1g` | 解决 Chrome/ML 场景 |
| 权限 | `--privileged` |  | 高权限（慎用） |
| 用户 | `-u` | `-u 1000:1000` | 以指定 UID/GID 运行 |
| 容器主机名 | `-h` | `-h myhost` |  |
| 日志驱动 | `--log-driver` | `--log-driver json-file` | 依环境而定 |
| 设备映射 | `--device` | `--device /dev/sda:/dev/xvdc` |  |
| 入口点 | `--entrypoint` | `--entrypoint /bin/sh` | 覆盖 ENTRYPOINT |
| 安全选项 | `--security-opt` | `--security-opt no-new-privileges` |  |

---

## 5) 进入容器 & 执行命令

| 目的 | 命令 | 常用参数/示例 | 备注 |
|---|---|---|---|
| 进入容器（新进程） | `docker exec` | `docker exec -it web sh` | 常用 |
| 以 root 进入 | `docker exec -it -u 0 web sh` |  |  |
| 查看环境变量 | `docker exec web env` |  |  |
| 附加到主进程 | `docker attach <c>` |  | 注意可能影响 stdin |
| 从容器获取退出码 | `docker wait <c>` |  | 等待容器结束 |

---

## 6) 日志 & 事件

| 目的 | 命令 | 常用参数/示例 | 备注 |
|---|---|---|---|
| 查看日志 | `docker logs <c>` | `docker logs -f --tail 200 web` | `-f` 跟随 |
| 查看事件流 | `docker events` | `docker events --since 1h` | 排障 |
| 查看容器变更（文件） | `docker diff <c>` |  | 看哪些文件被改了 |

---

## 7) 文件拷贝

| 目的 | 命令 | 常用参数/示例 | 备注 |
|---|---|---|---|
| 容器 → 主机 | `docker cp <c>:/path /host/path` | `docker cp web:/etc/nginx/nginx.conf .` |  |
| 主机 → 容器 | `docker cp /host/path <c>:/path` |  |  |

---

## 8) 网络（Networks）

| 目的 | 命令 | 常用参数/示例 | 备注 |
|---|---|---|---|
| 列出网络 | `docker network ls` |  |  |
| 创建网络 | `docker network create <net>` | `docker network create mynet` | 默认 bridge |
| 指定驱动 | `docker network create -d bridge mynet` |  | 常见：bridge/host/none/overlay |
| 查看网络详情 | `docker network inspect <net>` |  |  |
| 连接容器到网络 | `docker network connect <net> <c>` |  |  |
| 断开网络连接 | `docker network disconnect <net> <c>` |  |  |
| 删除网络 | `docker network rm <net>` |  |  |
| 清理未使用网络 | `docker network prune` |  |  |

---

## 9) 存储卷（Volumes）

| 目的 | 命令 | 常用参数/示例 | 备注 |
|---|---|---|---|
| 列出卷 | `docker volume ls` |  |  |
| 创建卷 | `docker volume create <vol>` | `docker volume create data` |  |
| 查看卷详情 | `docker volume inspect <vol>` |  |  |
| 删除卷 | `docker volume rm <vol>` |  |  |
| 清理未使用卷 | `docker volume prune` |  | 危险：会删未引用卷 |

---

## 10) 构建（Build）/ Dockerfile 常用指令速查

| Dockerfile 指令 | 作用 | 示例 | 备注 |
|---|---|---|---|
| `FROM` | 基础镜像 | `FROM ubuntu:24.04` | 多阶段可多 FROM |
| `RUN` | 构建时执行 | `RUN apt-get update && apt-get install -y curl` | 会生成新层 |
| `COPY` | 拷贝文件 | `COPY . /app` | 推荐替代 ADD |
| `ADD` | 拷贝/解压/URL | `ADD app.tar.gz /` | 功能多但不透明 |
| `WORKDIR` | 工作目录 | `WORKDIR /app` | 自动创建 |
| `ENV` | 环境变量 | `ENV NODE_ENV=production` |  |
| `ARG` | 构建参数 | `ARG VERSION` | 仅构建期 |
| `EXPOSE` | 声明端口 | `EXPOSE 8080` | 不等于映射 |
| `CMD` | 默认命令 | `CMD ["node","server.js"]` | 可被 run 覆盖 |
| `ENTRYPOINT` | 入口点 | `ENTRYPOINT ["bash","-lc"]` | 与 CMD 配合 |
| `USER` | 运行用户 | `USER 1000` | 最佳实践 |
| `VOLUME` | 声明卷 | `VOLUME /data` |  |
| `HEALTHCHECK` | 健康检查 | `HEALTHCHECK CMD curl -f http://localhost/ \|\| exit 1` |  |
| `LABEL` | 元数据 | `LABEL org.opencontainers.image.source="..."` |  |

---

## 11) Compose（docker compose）常用命令

| 目的 | 命令 | 常用参数/示例 | 备注 |
|---|---|---|---|
| 启动服务 | `docker compose up` | `docker compose up -d` | `-d` 后台 |
| 停止并移除 | `docker compose down` | `docker compose down -v` | `-v` 同时删卷 |
| 查看服务状态 | `docker compose ps` |  |  |
| 查看日志 | `docker compose logs` | `docker compose logs -f --tail 200` |  |
| 构建 | `docker compose build` | `docker compose build --no-cache` |  |
| 拉取镜像 | `docker compose pull` |  |  |
| 重启服务 | `docker compose restart` |  |  |
| 执行命令 | `docker compose exec <svc> <cmd>` | `docker compose exec api sh` |  |
| 运行一次性容器 | `docker compose run <svc> <cmd>` | `docker compose run --rm api bash` | 不依赖已有容器 |
| 配置展开 | `docker compose config` |  | 排查变量/合并 |
| 停止服务 | `docker compose stop` |  | 容器仍保留 |
| 启动已停止服务 | `docker compose start` |  |  |

---

## 12) Registry / 镜像仓库相关

| 目的 | 命令 | 示例 | 备注 |
|---|---|---|---|
| 登录 | `docker login [registry]` | `docker login registry.example.com` |  |
| 登出 | `docker logout [registry]` |  |  |
| 为私有仓库打 tag | `docker tag <img> <registry>/<repo>:<tag>` | `docker tag app:1 reg.io/team/app:1` |  |
| 推送 | `docker push <registry>/<repo>:<tag>` |  |  |

---

## 13) 清理 & 诊断（常用一把梭）

| 目的 | 命令 | 常用参数/示例 | 风险提示 |
|---|---|---|---|
| 清理构建缓存 | `docker builder prune` | `docker builder prune -a` | 可能很大 |
| 清理系统无用资源 | `docker system prune` | `docker system prune -a --volumes` | **危险**：会删未使用镜像/卷 |
| 查看磁盘占用 | `docker system df` | `docker system df -v` |  |

---

## 14) 导出/导入容器（与镜像不同）

| 目的 | 命令 | 示例 | 备注 |
|---|---|---|---|
| 导出容器文件系统 | `docker export <c> -o <file.tar>` | `docker export web -o webfs.tar` | 不含镜像层历史 |
| 导入为镜像 | `docker import <file.tar> <name:tag>` | `docker import webfs.tar web:imported` | 与 export 配套 |

---

## 15) 常用排障组合（命令清单）

| 场景 | 命令组合 | 说明 |
|---|---|---|
| 容器起不来 | `docker ps -a` → `docker logs <c>` → `docker inspect <c>` | 先状态，再日志，再配置 |
| 端口不通 | `docker port <c>` / `docker inspect` / `ss -lntp`(宿主机) | 确认映射与监听 |
| DNS/网络问题 | `docker exec -it <c> cat /etc/resolv.conf` / `docker network inspect <net>` | 检查 DNS/网络 |
| 磁盘爆了 | `docker system df -v` → `docker system prune`（慎用） | 先看占用再清理 |
| 文件被改了 | `docker diff <c>` | 定位变更 |

---

## 16) 常用格式化输出（`--format`）

| 目的 | 命令 | 示例 | 备注 |
|---|---|---|---|
| 格式化 ps | `docker ps --format ...` | `docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"` | Go template |
| 格式化 images | `docker images --format ...` | `docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"` |  |
| 只输出 ID | `docker ps -q` / `docker images -q` | `docker rm -f $(docker ps -aq)` | 批量操作谨慎 |

---