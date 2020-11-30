# 使用超小的node:alpine镜像作为基础镜像编译
FROM node:alpine
# 将dist目录下的文件复制到容器dist目录下
COPY /build/ /build/
# 安装http-server服务器
# http-server是一个简单的零配置命令行HTTP服务器，基于nodejs。
# 如果你不想重复的写nodejs的web-server.js，则可以使用这个。
RUN npm install -g serve
# 设置容器的工作目录
WORKDIR /build/
# 设置容器工作目录执行的命令
CMD ["serve -s build"]

# http-server参数说明:
# -p 端口号 (默认 8080)
# -a IP 地址 (默认 0.0.0.0)
# -d 显示目录列表 (默认 'True')
# -i 显示 autoIndex (默认 'True')
# -e or --ext 如果没有提供默认的文件扩展名(默认 'html')
# -s or --silent 禁止日志信息输出
# --cors 通过Access-Control-Allow-0rigin标题启用CORS
# -o 在开始服务后打开浏览器
# -c 设置缓存控制最大年龄标头的缓存时间(以秒为单位)，例如-c10为10秒(默认为“3600”)。要禁用缓存，请使用-c-1。
# -U 或 --utc 使用UTC time 格式化log消息
# -P or --proxy 代理不能在本地解析给定ur的所有请求。例如:-P http://someurl.com
# -S or --ssl 启用 https
# -C or --cert 证书文件的路径( 默认: cert.pem)。
# -K or --key keyssl密钥文件的路径( 默认值: key.pem)。
# -r or --robots 提供/robots.bxt (其内容默认为'User-agent:* \nDisallow: I')
# -h or --help 打印以上列表并退出 