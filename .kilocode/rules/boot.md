[[calls]]
match = "when the user requests code examples, setup or configuration steps, or library/API documentation"
tool  = "context7"

[[calls]]
match = "when working on NameMount platform development"
tool  = "follow_namemount_standards"

# NameMount 开发规范标准

## 📋 项目概述
NameMount 是一个创意展示与互动体验平台，采用纯前端技术栈，包含四大类别：展示类、互动类、艺术类、工具类。
这是一个winodws11 开发机器，使用命令行交互使用windows 命令

## 🏗️ 项目架构标准

### 📁 目录结构规范
```
free-name-mount/
├── index.html              # 主导航页面（首页）
├── [category].html        # 分类功能页面
├── css/                   # 样式文件目录
│   ├── home.css          # 首页导航样式
│   ├── [feature].css     # 功能页面样式
│   └── style.css         # 通用样式
└── js/                    # JavaScript文件目录
    ├── [feature].js       # 功能页面逻辑
    └── lib/              # 第三方库目录（可选）
```

### 🎯 核心架构设计
- **入口页面**: `index.html` - 分类导航首页
- **路由方式**: 简单的页面跳转
- **分类结构**: 四大类别（展示类、互动类、艺术类、工具类）

## 🎨 设计系统标准

### 色彩规范
- **主色调**: `#667eea` (蓝紫色)
- **辅助色**: `#764ba2` (深紫色)
- **强调色**: `#ffd93d` (金黄色)
- **文字色**: `#333` (深灰) / `white` (白色)

### 样式规范
- **圆角**: `15px` (卡片) / `25px` (按钮)
- **阴影**: `0 8px 32px rgba(0, 0, 0, 0.1)`
- **毛玻璃效果**: `backdrop-filter: blur(10px)`

## 📱 响应式设计标准

### 断点设置
```css
/* 桌面端 */
@media (min-width: 1200px) { /* 大屏幕优化 */ }

/* 平板端 */
@media (max-width: 768px) { /* 平板适配 */ }

/* 手机端 */
@media (max-width: 480px) { /* 手机适配 */ }
```

## 💻 开发规范

### HTML模板标准
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>功能名称 - NameMount</title>
    <link rel="stylesheet" href="css/[feature].css">
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
    <script src="js/[feature].js"></script>
</body>
</html>
```

### JavaScript模块化标准
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

## 🛠️ 新功能开发流程

### 1. 创建页面文件
```bash
# 在根目录创建新的HTML文件
touch new-feature.html
```

### 2. 创建样式文件
```bash
# 在css目录创建对应的CSS文件
touch css/new-feature.css
```

### 3. 创建脚本文件（如需要）
```bash
# 在js目录创建对应的JavaScript文件
touch js/new-feature.js
```

### 4. 更新导航页面
在 `index.html` 中对应分类的 `items-list` 中添加新项目：
```html
<li class="item" onclick="navigateTo('new-feature.html')">
    <div class="item-title">功能名称</div>
    <div class="item-description">功能描述</div>
</li>
```

## 🎮 交互功能要求

### 必需功能
1. **返回首页**: 每个页面都需要返回首页按钮
2. **响应式交互**: 支持桌面和移动端操作
3. **键盘支持**: 重要功能提供键盘快捷键
4. **错误处理**: 优雅的错误提示和处理

### 技术实现要求
- 使用现代ES6+语法
- 支持移动端触摸事件
- 考虑性能优化（懒加载、硬件加速）
- 使用本地存储保存用户偏好

## 📊 质量保证标准

### 测试要求
- 跨浏览器兼容性测试（Chrome, Firefox, Safari, Edge）
- 移动端设备测试
- 性能测试（加载时间、内存使用）
- 用户体验测试

### 代码质量
- 清晰的代码注释
- 模块化的代码结构
- 错误边界处理
- 内存泄漏预防

## 🚀 部署标准

### 本地开发
```bash
# 使用本地服务器
python -m http.server 8000
# 或
npx serve .
```

### 生产部署
- 支持静态文件托管（Vercel、GitHub Pages、Netlify）
- 启用GZIP压缩
- 配置适当的缓存策略

## 🔄 版本控制规范

### 分支策略
- `main`: 生产环境代码
- `develop`: 开发分支
- `feature/*`: 功能开发分支
- `bugfix/*`: 问题修复分支

### 提交信息规范
- feat: 新功能
- fix: 修复问题
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关

## 📈 扩展规划标准

### 技术选型原则
- 优先使用原生Web API
- 谨慎引入第三方库
- 保持包体积最小化
- 考虑长期维护成本

### 性能优化指南
- 图片懒加载和压缩
- 代码分割和懒加载
- 缓存策略优化
- 减少重绘和重排

---
**遵循此规范确保NameMount平台的一致性和可维护性**