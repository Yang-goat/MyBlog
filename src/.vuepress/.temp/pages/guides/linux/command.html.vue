<template><div><h1 id="ubuntu-常用指令速查笔记" tabindex="-1"><a class="header-anchor" href="#ubuntu-常用指令速查笔记"><span>Ubuntu 常用指令速查笔记</span></a></h1>
<p>整理常见、实用的 Ubuntu 命令，按场景分类速查。</p>
<hr>
<h2 id="📁-文件与目录操作" tabindex="-1"><a class="header-anchor" href="#📁-文件与目录操作"><span>📁 文件与目录操作</span></a></h2>
<table>
<thead>
<tr>
<th>功能</th>
<th>命令示例</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>查看当前路径</td>
<td><code v-pre>pwd</code></td>
<td>打印当前工作目录</td>
</tr>
<tr>
<td>列出文件</td>
<td><code v-pre>ls -l</code> / <code v-pre>ls -al</code></td>
<td>显示详细列表 / 包含隐藏文件</td>
</tr>
<tr>
<td>进入目录</td>
<td><code v-pre>cd /path/to/dir</code></td>
<td>切换工作目录</td>
</tr>
<tr>
<td>返回上级目录</td>
<td><code v-pre>cd ..</code></td>
<td>返回上一级目录</td>
</tr>
<tr>
<td>创建目录</td>
<td><code v-pre>mkdir &quot;mydir&quot;</code></td>
<td>新建目录</td>
</tr>
<tr>
<td>创建多级目录</td>
<td><code v-pre>mkdir -p &quot;a/b/c&quot;</code></td>
<td>一次创建多层</td>
</tr>
<tr>
<td>删除文件</td>
<td><code v-pre>rm &quot;file.txt&quot;</code></td>
<td>删除单个文件</td>
</tr>
<tr>
<td>删除目录</td>
<td><code v-pre>rm -rf &quot;dirname&quot;</code></td>
<td>强制删除目录及内容</td>
</tr>
<tr>
<td>复制文件</td>
<td><code v-pre>cp file1 file2</code></td>
<td>复制文件</td>
</tr>
<tr>
<td>复制目录</td>
<td><code v-pre>cp -r dir1 dir2</code></td>
<td>递归复制目录</td>
</tr>
<tr>
<td>移动或重命名</td>
<td><code v-pre>mv old new</code></td>
<td>移动或重命名文件或目录</td>
</tr>
<tr>
<td>查看文件内容</td>
<td><code v-pre>cat file</code> / <code v-pre>less file</code> / <code v-pre>head -n 10 file</code></td>
<td>快速查看文件内容</td>
</tr>
<tr>
<td>搜索文件</td>
<td><code v-pre>find / -name &quot;*.conf&quot;</code></td>
<td>查找配置文件</td>
</tr>
<tr>
<td>查找文本</td>
<td><code v-pre>grep &quot;pattern&quot; filename</code></td>
<td>按内容搜索文件</td>
</tr>
<tr>
<td>压缩文件</td>
<td><code v-pre>tar -czvf archive.tar.gz folder</code></td>
<td>创建压缩包</td>
</tr>
<tr>
<td>解压文件</td>
<td><code v-pre>tar -xzvf archive.tar.gz</code></td>
<td>解压压缩包</td>
</tr>
</tbody>
</table>
<hr>
<h2 id="⚙️-系统管理与信息查看" tabindex="-1"><a class="header-anchor" href="#⚙️-系统管理与信息查看"><span>⚙️ 系统管理与信息查看</span></a></h2>
<table>
<thead>
<tr>
<th>功能</th>
<th>命令示例</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>查看系统信息</td>
<td><code v-pre>uname -a</code></td>
<td>显示内核信息</td>
</tr>
<tr>
<td>查看发行版版本</td>
<td><code v-pre>lsb_release -a</code> / <code v-pre>cat /etc/os-release</code></td>
<td>Ubuntu 版本信息</td>
</tr>
<tr>
<td>查看 CPU / 内存</td>
<td><code v-pre>lscpu</code> / <code v-pre>free -h</code></td>
<td>硬件与内存使用</td>
</tr>
<tr>
<td>磁盘使用情况</td>
<td><code v-pre>df -h</code></td>
<td>查看挂载磁盘空间</td>
</tr>
<tr>
<td>当前目录空间占用</td>
<td><code v-pre>du -sh .</code></td>
<td>查看目录大小</td>
</tr>
<tr>
<td>查看设备挂载</td>
<td><code v-pre>lsblk</code> / <code v-pre>mount</code></td>
<td>磁盘分区情况</td>
</tr>
<tr>
<td>查看时间与时区</td>
<td><code v-pre>date</code> / <code v-pre>timedatectl</code></td>
<td>当前系统时间</td>
</tr>
<tr>
<td>更新系统时间</td>
<td><code v-pre>sudo timedatectl set-timezone Asia/Shanghai</code></td>
<td>设置时区</td>
</tr>
<tr>
<td>关机 / 重启</td>
<td><code v-pre>sudo shutdown -h now</code> / <code v-pre>sudo reboot</code></td>
<td>系统关机或重启</td>
</tr>
</tbody>
</table>
<hr>
<h2 id="👤-用户与权限管理" tabindex="-1"><a class="header-anchor" href="#👤-用户与权限管理"><span>👤 用户与权限管理</span></a></h2>
<table>
<thead>
<tr>
<th>功能</th>
<th>命令示例</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>当前用户</td>
<td><code v-pre>whoami</code></td>
<td>查看当前用户名</td>
</tr>
<tr>
<td>切换用户</td>
<td><code v-pre>su username</code></td>
<td>切换到其他用户</td>
</tr>
<tr>
<td>以 root 执行命令</td>
<td><code v-pre>sudo command</code></td>
<td>提升权限执行</td>
</tr>
<tr>
<td>添加用户</td>
<td><code v-pre>sudo adduser newuser</code></td>
<td>创建新用户</td>
</tr>
<tr>
<td>删除用户</td>
<td><code v-pre>sudo deluser username</code></td>
<td>删除用户</td>
</tr>
<tr>
<td>修改密码</td>
<td><code v-pre>passwd username</code></td>
<td>修改用户密码</td>
</tr>
<tr>
<td>修改文件权限</td>
<td><code v-pre>chmod 755 file</code></td>
<td>设置执行权限</td>
</tr>
<tr>
<td>修改所有者</td>
<td><code v-pre>chown user:group file</code></td>
<td>更改文件归属</td>
</tr>
<tr>
<td>查看用户组</td>
<td><code v-pre>groups username</code></td>
<td>查看所属组</td>
</tr>
</tbody>
</table>
<hr>
<h2 id="🧩-软件包管理-apt" tabindex="-1"><a class="header-anchor" href="#🧩-软件包管理-apt"><span>🧩 软件包管理（APT）</span></a></h2>
<table>
<thead>
<tr>
<th>功能</th>
<th>命令示例</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>更新软件源</td>
<td><code v-pre>sudo apt update</code></td>
<td>更新可用软件列表</td>
</tr>
<tr>
<td>升级系统</td>
<td><code v-pre>sudo apt upgrade</code></td>
<td>升级已安装软件</td>
</tr>
<tr>
<td>安装软件</td>
<td><code v-pre>sudo apt install vim</code></td>
<td>安装指定软件</td>
</tr>
<tr>
<td>删除软件</td>
<td><code v-pre>sudo apt remove vim</code></td>
<td>卸载但保留配置</td>
</tr>
<tr>
<td>完全删除</td>
<td><code v-pre>sudo apt purge vim</code></td>
<td>连同配置删除</td>
</tr>
<tr>
<td>清理缓存</td>
<td><code v-pre>sudo apt autoremove</code> / <code v-pre>sudo apt clean</code></td>
<td>清理无用包</td>
</tr>
<tr>
<td>搜索软件</td>
<td><code v-pre>apt search nginx</code></td>
<td>查找软件包</td>
</tr>
</tbody>
</table>
<hr>
<h2 id="🌐-网络命令" tabindex="-1"><a class="header-anchor" href="#🌐-网络命令"><span>🌐 网络命令</span></a></h2>
<table>
<thead>
<tr>
<th>功能</th>
<th>命令示例</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>查看 IP</td>
<td><code v-pre>ip a</code> / <code v-pre>hostname -I</code></td>
<td>显示网络地址</td>
</tr>
<tr>
<td>测试连通性</td>
<td><code v-pre>ping 8.8.8.8</code></td>
<td>测试网络连接</td>
</tr>
<tr>
<td>查看端口占用</td>
<td><code v-pre>sudo netstat -tulnp</code> / <code v-pre>ss -tuln</code></td>
<td>查看服务端口</td>
</tr>
<tr>
<td>查看路由表</td>
<td><code v-pre>ip route</code></td>
<td>显示路由信息</td>
</tr>
<tr>
<td>下载文件</td>
<td><code v-pre>wget URL</code> / <code v-pre>curl -O URL</code></td>
<td>下载远程资源</td>
</tr>
<tr>
<td>查看 DNS 解析</td>
<td><code v-pre>nslookup example.com</code> / <code v-pre>dig example.com</code></td>
<td>域名解析信息</td>
</tr>
<tr>
<td>本机开放端口</td>
<td><code v-pre>sudo ufw allow 8080</code> / <code v-pre>sudo ufw status</code></td>
<td>防火墙管理</td>
</tr>
</tbody>
</table>
<hr>
<h2 id="🧠-进程与服务管理" tabindex="-1"><a class="header-anchor" href="#🧠-进程与服务管理"><span>🧠 进程与服务管理</span></a></h2>
<table>
<thead>
<tr>
<th>功能</th>
<th>命令示例</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>查看进程</td>
<td><code v-pre>ps aux</code> / <code v-pre>top</code> / <code v-pre>htop</code></td>
<td>监控进程状态</td>
</tr>
<tr>
<td>查找进程</td>
<td><code v-pre>ps aux | grep nginx</code></td>
<td>按名称查找</td>
</tr>
<tr>
<td>结束进程</td>
<td><code v-pre>kill PID</code> / <code v-pre>kill -9 PID</code></td>
<td>强制终止</td>
</tr>
<tr>
<td>查看后台任务</td>
<td><code v-pre>jobs</code> / <code v-pre>bg</code> / <code v-pre>fg</code></td>
<td>管理后台任务</td>
</tr>
<tr>
<td>查看系统服务</td>
<td><code v-pre>systemctl list-units --type=service</code></td>
<td>查看服务状态</td>
</tr>
<tr>
<td>启动服务</td>
<td><code v-pre>sudo systemctl start nginx</code></td>
<td>启动服务</td>
</tr>
<tr>
<td>停止服务</td>
<td><code v-pre>sudo systemctl stop nginx</code></td>
<td>停止服务</td>
</tr>
<tr>
<td>开机自启</td>
<td><code v-pre>sudo systemctl enable nginx</code></td>
<td>设置开机启动</td>
</tr>
</tbody>
</table>
<hr>
<h2 id="🔒-ssh-与远程管理" tabindex="-1"><a class="header-anchor" href="#🔒-ssh-与远程管理"><span>🔒 SSH 与远程管理</span></a></h2>
<table>
<thead>
<tr>
<th>功能</th>
<th>命令示例</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>连接远程服务器</td>
<td><code v-pre>ssh user@host</code></td>
<td>登录远程主机</td>
</tr>
<tr>
<td>指定端口</td>
<td><code v-pre>ssh -p 2222 user@host</code></td>
<td>自定义 SSH 端口</td>
</tr>
<tr>
<td>上传文件</td>
<td><code v-pre>scp file user@host:/path/</code></td>
<td>本地 → 远程</td>
</tr>
<tr>
<td>下载文件</td>
<td><code v-pre>scp user@host:/path/file .</code></td>
<td>远程 → 本地</td>
</tr>
<tr>
<td>使用密钥连接</td>
<td><code v-pre>ssh -i ~/.ssh/id_rsa user@host</code></td>
<td>免密登录</td>
</tr>
<tr>
<td>SSH 隧道转发</td>
<td><code v-pre>ssh -L 8080:localhost:80 user@host</code></td>
<td>本地端口转发</td>
</tr>
</tbody>
</table>
<hr>
<h2 id="🧾-日志与调试" tabindex="-1"><a class="header-anchor" href="#🧾-日志与调试"><span>🧾 日志与调试</span></a></h2>
<table>
<thead>
<tr>
<th>功能</th>
<th>命令示例</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>查看系统日志</td>
<td><code v-pre>sudo journalctl -xe</code></td>
<td>系统事件日志</td>
</tr>
<tr>
<td>查看服务日志</td>
<td><code v-pre>sudo journalctl -u nginx</code></td>
<td>查看特定服务日志</td>
</tr>
<tr>
<td>实时查看日志</td>
<td><code v-pre>tail -f /var/log/syslog</code></td>
<td>动态日志输出</td>
</tr>
<tr>
<td>查看最近启动记录</td>
<td><code v-pre>last</code></td>
<td>登录历史</td>
</tr>
<tr>
<td>查看登录失败</td>
<td><code v-pre>sudo cat /var/log/auth.log</code></td>
<td>登录安全日志</td>
</tr>
</tbody>
</table>
<hr>
<h2 id="🧰-实用工具命令" tabindex="-1"><a class="header-anchor" href="#🧰-实用工具命令"><span>🧰 实用工具命令</span></a></h2>
<table>
<thead>
<tr>
<th>功能</th>
<th>命令示例</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>查看命令路径</td>
<td><code v-pre>which python3</code></td>
<td>程序所在路径</td>
</tr>
<tr>
<td>查看命令说明</td>
<td><code v-pre>man ls</code> / <code v-pre>ls --help</code></td>
<td>帮助文档</td>
</tr>
<tr>
<td>清屏</td>
<td><code v-pre>clear</code> / <code v-pre>Ctrl + L</code></td>
<td>清空终端</td>
</tr>
<tr>
<td>历史命令</td>
<td><code v-pre>history</code></td>
<td>查看历史记录</td>
</tr>
<tr>
<td>重复上条命令</td>
<td><code v-pre>!!</code></td>
<td>执行上一条</td>
</tr>
<tr>
<td>比较文件</td>
<td><code v-pre>diff file1 file2</code></td>
<td>查看文件差异</td>
</tr>
<tr>
<td>生成哈希</td>
<td><code v-pre>md5sum file</code> / <code v-pre>sha256sum file</code></td>
<td>校验文件完整性</td>
</tr>
</tbody>
</table>
<hr>
<h2 id="🎮-nvidia-gpu-信息与性能监控" tabindex="-1"><a class="header-anchor" href="#🎮-nvidia-gpu-信息与性能监控"><span>🎮 NVIDIA GPU 信息与性能监控</span></a></h2>
<p>本节针对安装了 <strong>NVIDIA 显卡</strong> 的 Ubuntu 系统，涵盖查看信息、驱动管理、CUDA 环境检测与性能监控等常用命令。</p>
<hr>
<h3 id="🧩-基础信息查看" tabindex="-1"><a class="header-anchor" href="#🧩-基础信息查看"><span>🧩 基础信息查看</span></a></h3>
<table>
<thead>
<tr>
<th>功能</th>
<th>命令示例</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>查看显卡列表</td>
<td><code v-pre>lspci | grep -E &quot;VGA|3D&quot;</code></td>
<td>查看系统检测到的显卡型号</td>
</tr>
<tr>
<td>查看详细硬件信息</td>
<td><code v-pre>sudo lshw -C display</code></td>
<td>显卡硬件与驱动信息</td>
</tr>
<tr>
<td>查看当前渲染器</td>
<td><code v-pre>glxinfo | grep &quot;OpenGL renderer&quot;</code></td>
<td>查看当前使用的 GPU 渲染设备（需安装 mesa-utils）</td>
</tr>
<tr>
<td>检查驱动推荐版本</td>
<td><code v-pre>sudo ubuntu-drivers devices</code></td>
<td>自动检测并推荐合适的 NVIDIA 驱动</td>
</tr>
<tr>
<td>查看已安装驱动</td>
<td><code v-pre>nvidia-smi --query-gpu=driver_version --format=csv</code></td>
<td>输出当前驱动版本号</td>
</tr>
</tbody>
</table>
<hr>
<h3 id="⚙️-驱动与-cuda-工具链" tabindex="-1"><a class="header-anchor" href="#⚙️-驱动与-cuda-工具链"><span>⚙️ 驱动与 CUDA 工具链</span></a></h3>
<table>
<thead>
<tr>
<th>功能</th>
<th>命令示例</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>查看驱动版本</td>
<td><code v-pre>cat /proc/driver/nvidia/version</code></td>
<td>查看内核驱动版本</td>
</tr>
<tr>
<td>查看 CUDA 版本</td>
<td><code v-pre>nvcc -V</code></td>
<td>显示 CUDA 编译器版本（需安装 CUDA）</td>
</tr>
<tr>
<td>查看 cuDNN 版本</td>
<td><code v-pre>cat /usr/include/cudnn_version.h | grep CUDNN_MAJOR -A 2</code></td>
<td>查看 cuDNN 头文件版本</td>
</tr>
<tr>
<td>查看 GPU 名称</td>
<td><code v-pre>nvidia-smi --query-gpu=name --format=csv</code></td>
<td>输出 GPU 型号名称</td>
</tr>
<tr>
<td>查看 GPU 数量</td>
<td><code v-pre>nvidia-smi -L</code></td>
<td>列出所有 GPU</td>
</tr>
<tr>
<td>查看驱动模块状态</td>
<td><code v-pre>lsmod | grep nvidia</code></td>
<td>检查驱动是否加载成功</td>
</tr>
</tbody>
</table>
<hr>
<h3 id="📊-gpu-状态与性能监控" tabindex="-1"><a class="header-anchor" href="#📊-gpu-状态与性能监控"><span>📊 GPU 状态与性能监控</span></a></h3>
<table>
<thead>
<tr>
<th>功能</th>
<th>命令示例</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>查看总体状态</td>
<td><code v-pre>nvidia-smi</code></td>
<td>查看 GPU 温度、显存、进程、驱动版本等</td>
</tr>
<tr>
<td>实时刷新监控</td>
<td><code v-pre>watch -n 1 nvidia-smi</code></td>
<td>每秒刷新一次 GPU 状态</td>
</tr>
<tr>
<td>查看显存占用</td>
<td><code v-pre>nvidia-smi --query-gpu=memory.total,memory.used,memory.free --format=csv</code></td>
<td>显示显存使用情况</td>
</tr>
<tr>
<td>查看 GPU 利用率</td>
<td><code v-pre>nvidia-smi --query-gpu=utilization.gpu,utilization.memory --format=csv</code></td>
<td>输出 GPU 与显存使用率</td>
</tr>
<tr>
<td>查看显卡温度</td>
<td><code v-pre>nvidia-smi --query-gpu=temperature.gpu --format=csv</code></td>
<td>输出显卡温度</td>
</tr>
<tr>
<td>查看功耗情况</td>
<td><code v-pre>nvidia-smi --query-gpu=power.draw --format=csv</code></td>
<td>实时功率消耗（W）</td>
</tr>
<tr>
<td>查看 GPU 时钟频率</td>
<td><code v-pre>nvidia-smi --query-gpu=clocks.gr,clocks.mem --format=csv</code></td>
<td>查看核心与显存时钟频率</td>
</tr>
</tbody>
</table>
<hr>
<h3 id="🔍-进程与任务分析" tabindex="-1"><a class="header-anchor" href="#🔍-进程与任务分析"><span>🔍 进程与任务分析</span></a></h3>
<table>
<thead>
<tr>
<th>功能</th>
<th>命令示例</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>查看使用 GPU 的进程</td>
<td><code v-pre>nvidia-smi pmon -c 1</code></td>
<td>查看当前 GPU 进程活动</td>
</tr>
<tr>
<td>查看所有 GPU 进程</td>
<td><code v-pre>nvidia-smi --query-compute-apps=pid,process_name,used_memory --format=csv</code></td>
<td>输出使用 GPU 的程序</td>
</tr>
<tr>
<td>强制结束某进程</td>
<td><code v-pre>sudo kill -9 &lt;PID&gt;</code></td>
<td>终止占用显卡的进程</td>
</tr>
<tr>
<td>查看显卡占用统计</td>
<td><code v-pre>nvidia-smi dmon</code></td>
<td>实时动态监控 GPU 负载（性能模式）</td>
</tr>
</tbody>
</table>
<hr>
<h2 id="✅-小贴士" tabindex="-1"><a class="header-anchor" href="#✅-小贴士"><span>✅ 小贴士</span></a></h2>
<ul>
<li>使用 <code v-pre>Tab</code> 键可自动补全命令或文件名</li>
<li>使用 <code v-pre>Ctrl + C</code> 可中断当前命令</li>
<li>使用 <code v-pre>Ctrl + D</code> 可退出终端</li>
<li>使用 <code v-pre>Ctrl + R</code> 搜索命令历史</li>
</ul>
<hr>
</div></template>


