# 使用多架构支持的 nginx 基础镜像
FROM nginx:alpine

# Docker Buildx 会自动注入这些变量
ARG TARGETOS
ARG TARGETARCH

# 安装 curl 用户下载二进制文件
RUN apk add --no-cache curl

# 演示：根据 TARGETARCH 自动下载对应 CPU 架构的二进制依赖 (以 dumb-init 为例)
# 如果是 amd64 (x86_64) 或 arm64 (aarch64)，下载对应的二进制包
RUN DUMB_INIT_VERSION="1.2.5" && \
    if [ "${TARGETARCH}" = "amd64" ]; then \
        BINARY_ARCH="x86_64"; \
    elif [ "${TARGETARCH}" = "arm64" ]; then \
        BINARY_ARCH="aarch64"; \
    else \
        BINARY_ARCH="x86_64"; \
    fi && \
    curl -Lo /usr/local/bin/dumb-init "https://github.com/Yelp/dumb-init/releases/download/v${DUMB_INIT_VERSION}/dumb-init_${DUMB_INIT_VERSION}_${BINARY_ARCH}" && \
    chmod +x /usr/local/bin/dumb-init

# 复制前端静态资源到 Nginx 运行目录
COPY index.html /usr/share/nginx/html/index.html
COPY style.css /usr/share/nginx/html/style.css
COPY app.js /usr/share/nginx/html/app.js

EXPOSE 80

# 使用 dumb-init 启动 Nginx
ENTRYPOINT ["/usr/local/bin/dumb-init", "--"]
CMD ["nginx", "-g", "daemon off;"]
