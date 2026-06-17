# MathSheety - 口算练习纸生成器

MathSheety 是一个专为家长和小学低年级学生设计的纯前端口算练习纸生成工具。支持自定义题型、数字范围和题数，支持显示/隐藏答案，版面完美适配 A4 纸张排版，可直接调用系统打印或导出 PDF。

提供两个练习页面：
* **口算练习**：加法、减法、加减混合；乘法、除法（九九乘法表内，除法整除无余数）、乘除混合；三数加减运算（连加、连减、加减混合，逐步运算中间结果不为负）。
* **元角分换算**：人民币单位换算与等值兑换（元、角，符合现行面值规范）。

---

## 🚀 快速使用

### 方式 1：本地离线运行（推荐）
本项目为纯前端项目，无任何后台和构建依赖。
1. 下载或解压项目中的 `MathSheety.zip`（包含 `index.html`、`app.js`、`currency.html`、`currency.js`、`style.css` 共 5 个文件）。
2. 在本地计算机双击 `index.html` 即可直接在浏览器中运行。
   > 备注：「导出 PDF」依赖 CDN 加载 `html2pdf.js`，需联网；其余功能（生成、显示答案、打印）可完全离线使用。

### 方式 2：使用 Docker 部署运行
我们已经构建了多架构支持的 Docker 镜像，您可以直接使用 Docker 进行一键部署：

```bash
# 启动容器并映射到 8080 端口
docker run -d \
  --name mathsheety \
  -p 8080:80 \
  --restart always \
  lulalulaluobo/mathsheety:v1.0.0
```
部署完成后，在浏览器访问 `http://localhost:8080` 即可使用。

---

## 🛠️ Docker 镜像构建与发布

本项目的 Dockerfile 已完成多架构构建适配（支持 `linux/amd64` 和 `linux/arm64` 芯片架构），同时内置了基于 `TARGETARCH` 动态下载架构二进制依赖（以 `dumb-init` 作为演示）的安全机制。

### 1. 本地单架构构建（开发测试）
```bash
# 本地构建
docker build -t mathsheety:dev .

# 运行测试
docker run -d -p 8080:80 --name mathsheety-test mathsheety:dev
```

### 2. 多架构 Buildx 交叉构建并发布到 Docker Hub
若要同时发布支持 x86 和 ARM (如 Apple M 系列芯片、树莓派等) 的多架构镜像：

```bash
# 创建并激活一个支持多架构的 builder 实例
docker buildx create --name multi-builder --use
docker buildx inspect --bootstrap

# 登录 Docker Hub
docker login

# 构建多架构并直接推送 (Push) 到 Docker Hub
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t lulalulaluobo/mathsheety:v1.0.0 \
  --push .
```

### 3. 验证多架构镜像清单
构建推送完毕后，使用 imagetools 验证远程镜像是否成功包含双架构 Manifest：
```bash
docker buildx imagetools inspect lulalulaluobo/mathsheety:v1.0.0
```

---

## 🎨 核心版面设计亮点
*   **无序号极简风格**：剔除传统序号带来的排版对齐干扰，界面极简大方。
*   **双边 Flex 对齐**：算式左对齐，等号与输入区 `= ____` 右对齐，纵向排版宛如表格，清晰美观。
*   **虚线纵向阻隔**：4 列题目格网之间配有轻量级灰色虚线列分隔线，左右空间留白极具呼吸感。
*   **A4 比例垂直平铺**：采用 A4 黄金长宽比（1:1.414）容器渲染，且题目随总数在垂直方向柔和撑满整张纸，底部无尴尬空白。
*   **打印自动无缝过滤**：内置 `@media print` 样式，在调用 `window.print()` 打印时会自动隐藏所有顶端配置卡片与交互按钮，只保留纯净的白底黑字练习纸。
