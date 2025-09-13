
# 古诗文鉴赏功能开发计划

## 项目概述
为NameMount平台添加古诗文鉴赏展示功能，包含《出师表》和历史上最有名的36首词。

## 功能需求
- 展示《出师表》全文
- 展示36首经典词作
- 支持诗文切换浏览
- 字体大小调整功能
- 响应式设计
- 返回首页功能

## 技术实现方案

### 文件结构
```
classical-literature.html          # 主页面
css/classical-literature.css       # 样式文件
js/classical-literature.js         # 交互逻辑
```

### 页面结构设计
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>古诗文鉴赏 - NameMount</title>
    <link rel="stylesheet" href="css/classical-literature.css">
</head>
<body>
    <div class="header">
        <h1>📜 古诗文鉴賞</h1>
        <button id="homeBtn" class="btn">🏠 返回首页</button>
    </div>

    <div class="content">
        <div class="sidebar">
            <ul id="poem-list">
                <!-- Poems will be dynamically inserted here -->
            </ul>
        </div>
        <div class="main-content">
            <div class="controls">
                <button id="prevBtn" class="control-btn">上一首</button>
                <button id="nextBtn" class="control-btn">下一首</button>
                <button id="biggerFontBtn" class="control-btn">A+</button>
                <button id="smallerFontBtn" class="control-btn">A-</button>
            </div>
            <div id="poem-display">
                <!-- Selected poem will be displayed here -->
            </div>
        </div>
    </div>

    <script src="js/classical-literature.js"></script>
    <script>
        document.getElementById('homeBtn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    </script>
</body>
</html>
```

### CSS样式设计 (`css/classical-literature.css`)
- 整体布局采用Flexbox，分为侧边栏和主内容区。
- 侧边栏显示诗文列表，可滚动。
- 主内容区显示诗文，提供控制按钮。
- 样式遵循项目已有的设计系统。

### JavaScript交互逻辑 (`js/classical-literature.js`)
- 动态加载诗文数据（《出师表》和36首词）。
- 在侧边栏生成诗文列表。
- 实现诗文切换功能。
- 实现字体大小调整功能。
- 默认显示《出师表》。

## 开发步骤
1.  **Code Mode**: 创建 `classical-literature.html` 文件。
2.  **Code Mode**: 创建 `css/classical-literature.css` 文件。
3.  **Code Mode**: 创建 `js/classical-literature.js` 文件，并添加诗文数据。
4.  **Code Mode**: 在 `index.html` 中添加入口。
5.  **Code Mode**: 测试功能。

## 诗词列表 (36首)
1.  苏轼 - 《念奴娇·赤壁怀古》
2.  李清照 - 《声声慢·寻寻觅觅》
3.  辛弃疾 - 《永遇乐·京口北固亭怀古》
4.  岳飞 - 《满江红·写怀》
5.  李煜 - 《虞美人·春花秋月何时了》
6.  柳永 - 《雨霖铃·寒蝉凄切》
7.  苏轼 - 《水调歌头·明月几时有》
8.  姜夔 - 《扬州慢·淮左名都》
9.  陆游 - 《钗头凤·红酥手》
10. 秦观 - 《鹊桥仙·纤云弄巧》
11. 晏殊 - 《浣溪沙·一曲新词酒一杯》
12. 欧阳修 - 《蝶恋花·庭院深深深几许》
13. 周邦彦 - 《兰陵王·柳》
14. 李清照 - 《一剪梅·红藕香残玉簟秋》
15. 辛弃疾 - 《青玉案·元夕》
16. 苏轼 - 《江城子·乙卯正月二十日夜记梦》
17. 范仲淹 - 《渔家傲·秋思》
18. 张孝祥 - 《六州歌头·长淮望断》
19. 柳永 - 《蝶恋花·伫倚危楼风细细》
20. 苏轼 - 《定风波·莫听穿林打叶声》
21. 李煜 - 《浪淘沙令·帘外雨潺潺》
22. 晏几道 - 《临江仙·梦后楼台高锁》
23. 贺铸 - 《青玉案·凌波不过横塘路》
24. 周邦彦 - 《苏幕遮·燎沉香》
25. 陆游 - 《诉衷情·当年万里觅封侯》
26. 吴文英 - 《莺啼序·春草池塘》
27. 辛弃疾 - 《破阵子·为陈同甫赋壮词以寄之》
28. 文天祥 - 《过零丁洋》
31. 曹操 - 《观沧海》
32. 陶渊明 - 《饮酒·其五》
33. 王维 - 《山居秋暝》
34. 李白 - 《将进酒》
35. 杜甫 - 《登高》
36. 白居易 - 《长恨歌》