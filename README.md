# 香港租房網 🏢

> 香港商業物業租賃平台 — Hong Kong Commercial Rental Platform

![GitHub repo](https://img.shields.io/badge/repo-hk--rental--site-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📖 项目简介

**香港租房網** 是一个专注于香港商业物业租赁的在线平台，参考 28hse.com 的功能设计，提供办公室、零售店铺、仓库、工业大厦、餐厅及共享办公等多元化商业物业租盘信息。

### ✨ 核心功能

- 🔍 **智能搜索** — 支持关键词、地区、物业类型、租金范围多维度筛选
- 🗺️ **地图找盘** — 基于 Leaflet.js 的交互式地图，可视化展示物业位置
- 📋 **放盘管理** — 业主/地产代理可发布盘源，管理已发布的租盘
- 💰 **付费套餐** — 免费/基础/专业三档套餐，提升盘源曝光率
- 👨‍💼 **代理入驻** — 认证地产代理入驻，获取更多客源
- 🌐 **双语支持** — 繁体中文 / English 一键切换
- 📱 **响应式设计** — 完美适配桌面端和移动端

---

## 🎨 设计风格

采用 **X.com 暗色主题** 设计：
- 背景色：`#000000`
- 主题色：`#1d9bf0`
- 边框色：`#2F3336`
- 文字色：`#e7e9ea`

---

## 🛠️ 技术栈

| 技术 | 说明 |
|------|------|
| **前端** | HTML5 / CSS3 / Vanilla JavaScript |
| **地图** | Leaflet.js + OpenStreetMap |
| **国际化** | 自研 i18n 系统（120+ 翻译键） |
| **部署** | Vercel / GitHub Pages |

> 💡 未来版本计划迁移至 **Next.js 14 + TypeScript + Tailwind CSS + Prisma + PostgreSQL**

---

## 📂 项目结构

```
hk-rental-site/
├── index.html          # 主页面（单页应用）
├── .gitignore          # Git 忽略配置
└── README.md           # 项目说明
```

---

## 🚀 本地运行

### 方法一：Python HTTP 服务器

```bash
# 克隆项目
git clone https://github.com/erikcywong/hk-rental-site.git
cd hk-rental-site

# 启动本地服务器
python -m http.server 8080

# 打开浏览器访问
# http://localhost:8080
```

### 方法二：VS Code Live Server

1. 用 VS Code 打开项目
2. 安装 **Live Server** 插件
3. 右键 `index.html` → **Open with Live Server**

---

## 🌏 香港地区数据

平台支持香港标准分区，涵盖 **5 大区域、60+ 具体地区**：

| 大区 | 地区数量 | 代表地区 |
|------|---------|---------|
| 🏝️ 香港島 | 17 | 中環、上環、灣仔、銅鑼灣、北角 |
| 🏙️ 九龍 | 22 | 尖沙咀、旺角、觀塘、何文田、鑽石山 |
| 🌆 新界東 | 8 | 沙田、大圍、馬鞍山、大埔、將軍澳 |
| 🏘️ 新界西 | 7 | 荃灣、葵涌、屯門、元朗、天水圍 |
| 🏝️ 離島 | 6 | 東涌、長洲、南丫島、愉景灣 |

---

## 📋 物业类型

- 🏢 **辦公室** — 甲級寫字樓、創意工作室
- 🏪 **零售店舖** — 臨街商舖、商場店舖
- 📦 **倉庫** — 物流倉儲、存儲單位
- 🏭 **工業大厦** — 工業單位、輕工業用途
- 🍽️ **餐廳** — 已領食肆牌的餐飲舖位
- 🤝 **共享辦公** — 靈活租期的共享辦公空間

---

## 🔧 待开发功能

- [ ] 用户注册/登录系统（JWT 认证）
- [ ] 后端 API（Next.js API Routes）
- [ ] 数据库（PostgreSQL + Prisma）
- [ ] 图片上传（Cloudinary）
- [ ] 即时聊天（盘源咨询）
- [ ] 收藏功能
- [ ] 租金走势图表
- [ ] 微信/WhatsApp 分享

---

## 👥 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

---

## 📄 开源协议

本项目采用 **MIT 协议** 开源 — 详见 [LICENSE](LICENSE) 文件

---

## 📞 联系方式

- 🌐 网站：https://github.com/erikcywong/hk-rental-site
- 📧 邮箱：erikcywong@example.com
- 💬 WhatsApp：+852 xxxx xxxx

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给一个 Star！⭐**

Made with ❤️ in Hong Kong 🇭🇰

</div>
