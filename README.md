# NameMount - 创意展示与互动体验平台

## 📋 项目概述

NameMount 是一个创意展示与互动体验平台，采用分类导航的方式组织各种精美的视觉展示、互动游戏和实用工具。项目基于纯前端技术栈，无需后端服务器，可直接部署到静态网站托管平台。

## 🏗️ 项目架构

### 📁 目录结构
```
free-name-mount/
├── index.html              # 主导航页面（首页）
├── astronaut.html          # 宇航员走进飞船展示页
├── fireworks.html          # 烟花绽放互动游戏页
├── README.md              # 项目文档
├── css/                   # 样式文件目录
│   ├── home.css          # 首页导航样式
│   ├── style.css         # 宇航员展示页样式
│   └── fireworks.css     # 烟花游戏样式
└── js/                    # JavaScript文件目录
    ├── scene.js          # SceneJS动画库
    ├── shape.js          # 图形绘制库
    ├── script.js         # 宇航员展示页逻辑
    └── fireworks.js      # 烟花游戏逻辑
```

### 🎯 核心架构设计

#### 1. 导航系统
- **入口页面**: `index.html` - 分类导航首页
- **路由方式**: 简单的页面跳转，无需复杂路由框架
- **分类结构**: 四大类别（展示类、互动类、艺术类、工具类）

#### 2. 页面组织
每个功能页面都是独立的HTML文件，包含：
- 独立的CSS样式文件
- 独立的JavaScript逻辑文件
- 返回首页的导航功能

#### 3. 技术栈
- **前端**: 纯HTML5 + CSS3 + JavaScript ES6+
- **动画**: CSS动画 + Canvas API + SceneJS库
- **响应式**: CSS媒体查询 + 弹性布局
- **部署**: 静态文件托管（支持Vercel、GitHub Pages等）

## 🎨 当前功能模块

### 🚀 展示类
#### 宇航员走进飞船 (`astronaut.html`)
- **技术实现**: SceneJS动画库 + CSS3动画
- **核心文件**: 
  - `css/style.css` - 3D场景样式
  - `js/scene.js` - SceneJS动画库
  - `js/shape.js` - 图形绘制工具
  - `js/script.js` - 动画控制逻辑
- **特色功能**: 
  - 3D宇宙飞船场景
  - 宇航员动画效果
  - 星空背景动画
  - 响应式适配

### 🎮 互动类
#### 烟花绽放游戏 (`fireworks.html`)
- **技术实现**: Canvas API + 粒子系统 + 物理引擎
- **核心文件**:
  - `css/fireworks.css` - 游戏界面样式
  - `js/fireworks.js` - 游戏逻辑和粒子系统
- **特色功能**:
  - 点击燃放烟花
  - 真实物理效果（重力、轨迹）
  - 多彩粒子系统
  - 计分系统
  - 自动模式
  - 键盘快捷键支持
  - 移动端触摸支持

### 🎨 艺术类
- **状态**: 待开发
- **规划**: 创意艺术作品和视觉效果展示

### 🔧 工具类
- **状态**: 待开发
- **规划**: 实用的在线工具和应用程序

## 🛠️ 开发指南

### 添加新模块的标准流程

#### 1. 创建页面文件
```bash
# 在根目录创建新的HTML文件
touch new-feature.html
```

#### 2. 创建样式文件
```bash
# 在css目录创建对应的CSS文件
touch css/new-feature.css
```

#### 3. 创建脚本文件（如需要）
```bash
# 在js目录创建对应的JavaScript文件
touch js/new-feature.js
```

#### 4. 页面结构模板
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>功能名称 - NameMount</title>
    <link rel="stylesheet" href="css/new-feature.css">
</head>
<body>
    <div class="header">
        <h1>功能名称</h1>
        <button id="homeBtn" class="btn">🏠 返回首页</button>
    </div>
    
    <!-- 功能内容区域 -->
    <div class="content">
        <!-- 具体功能实现 -->
    </div>
    
    <script>
        // 返回首页功能
        document.getElementById('homeBtn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    </script>
    <script src="js/new-feature.js"></script>
</body>
</html>
```

#### 5. 更新导航页面
在 `index.html` 中对应分类的 `items-list` 中添加新项目：
```html
<li class="item" onclick="navigateTo('new-feature.html')">
    <div class="item-title">功能名称</div>
    <div class="item-description">功能描述</div>
</li>
```

### 🎨 样式规范

#### CSS文件组织
```css
/* 1. 重置样式 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* 2. 基础样式 */
body {
    font-family: 'Arial', sans-serif;
    /* 统一的背景渐变 */
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 3. 布局样式 */
.header { /* 页面头部 */ }
.content { /* 主要内容区 */ }
.footer { /* 页面底部 */ }

/* 4. 组件样式 */
.btn { /* 按钮组件 */ }

/* 5. 响应式样式 */
@media (max-width: 768px) {
    /* 移动端适配 */
}
```

#### 设计系统
- **主色调**: `#667eea` (蓝紫色)
- **辅助色**: `#764ba2` (深紫色)
- **强调色**: `#ffd93d` (金黄色)
- **文字色**: `#333` (深灰) / `white` (白色)
- **圆角**: `15px` (卡片) / `25px` (按钮)
- **阴影**: `0 8px 32px rgba(0, 0, 0, 0.1)`
- **毛玻璃**: `backdrop-filter: blur(10px)`

### 📱 响应式设计标准

```css
/* 桌面端 */
@media (min-width: 1200px) { /* 大屏幕优化 */ }

/* 平板端 */
@media (max-width: 768px) { /* 平板适配 */ }

/* 手机端 */
@media (max-width: 480px) { /* 手机适配 */ }
```

### 🎮 交互功能规范

#### JavaScript模块化
```javascript
// 功能类封装
class FeatureName {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupCanvas(); // 如果需要Canvas
    }
    
    setupEventListeners() {
        // 事件监听器设置
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new FeatureName();
});
```

#### 必需的交互功能
1. **返回首页**: 每个页面都需要返回首页按钮
2. **响应式交互**: 支持桌面和移动端操作
3. **键盘支持**: 重要功能提供键盘快捷键
4. **错误处理**: 优雅的错误提示和处理

## 🚀 部署指南

### 本地开发
```bash
# 直接用浏览器打开index.html
# 或使用本地服务器
python -m http.server 8000
# 或
npx serve .
```

### 生产部署
项目为纯静态网站，支持以下平台：
- **Vercel**: 推荐，零配置部署
- **GitHub Pages**: 免费静态托管
- **Netlify**: 功能丰富的静态托管
- **任何静态文件服务器**

## 📈 扩展规划

### 短期目标
- [ ] 艺术类：添加粒子动画展示
- [ ] 工具类：添加实用小工具（颜色选择器、代码格式化等）
- [ ] 优化移动端体验
- [ ] 添加暗色主题切换

### 中期目标
- [ ] 添加用户偏好设置
- [ ] 实现页面间的数据共享
- [ ] 添加更多交互游戏
- [ ] 性能优化和懒加载

### 长期目标
- [ ] 考虑引入轻量级框架
- [ ] 添加PWA支持
- [ ] 多语言支持
- [ ] 用户生成内容功能

## 🤝 贡献指南

1. **Fork** 项目
2. 创建功能分支: `git checkout -b feature/new-feature`
3. 按照开发规范添加新功能
4. 测试功能在各设备上的表现
5. 提交更改: `git commit -m 'Add new feature'`
6. 推送分支: `git push origin feature/new-feature`
7. 创建 **Pull Request**

## 📄 许可证

MIT License - 详见 LICENSE 文件

## 🎯 项目愿景

NameMount 致力于成为一个展示创意、分享技术、提供实用工具的综合平台。我们相信好的创意应该被更多人看到，实用的工具应该触手可及，美好的体验应该人人享有。

---

**探索无限创意可能 - NameMount 2024**