// Markdown编辑器 - 核心逻辑
class MarkdownEditor {
    constructor() {
        this.editor = document.getElementById('markdownInput');
        this.preview = document.getElementById('previewOutput');
        this.settings = this.loadSettings();
        
        this.currentFile = null;
        this.isFullscreen = false;
        this.isPreviewOnly = false;
        
        this.init();
    }
    
    init() {
        this.setupMarked();
        this.setupEventListeners();
        this.setupAutoSave();
        this.loadSampleContent();
        this.updateStats();
    }
    
    setupMarked() {
        marked.setOptions({
            highlight: function(code, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(code, { language: lang }).value;
                    } catch (err) {
                        console.error('代码高亮错误:', err);
                    }
                }
                return code;
            },
            breaks: true,
            gfm: true
        });
    }
    
    setupEventListeners() {
        // 编辑器输入事件
        this.editor.addEventListener('input', () => {
            this.updatePreview();
            this.updateStats();
            this.autoSave();
        });
        
        // 工具栏按钮事件
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleToolbarAction(e.target.dataset.action);
            });
        });
        
        // 面板控制按钮
        document.querySelectorAll('.panel-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handlePanelAction(e.target.dataset.action);
            });
        });
        
        // 模态框事件
        this.setupModalEvents();
        
        // 键盘快捷键
        this.setupKeyboardShortcuts();
        
        // 设置变化事件
        this.setupSettingsListeners();
    }
    
    setupModalEvents() {
        const modals = ['fileModal', 'settingsModal'];
        
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            const closeBtn = modal.querySelector('.modal-close');
            
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
        
        // 文件操作按钮
        document.querySelectorAll('.modal-btn[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFileAction(e.target.dataset.action);
            });
        });
        
        // 新建文件按钮
        document.getElementById('newFile').addEventListener('click', () => {
            this.newFile();
        });
        
        // 保存设置按钮
        document.getElementById('saveSettings').addEventListener('click', () => {
            this.saveSettings();
        });
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault();
                        this.saveFile();
                        break;
                    case 'o':
                        e.preventDefault();
                        this.openFile();
                        break;
                    case 'n':
                        e.preventDefault();
                        this.newFile();
                        break;
                    case 'p':
                        e.preventDefault();
                        this.togglePreview();
                        break;
                    case '/':
                        e.preventDefault();
                        this.toggleComment();
                        break;
                }
            }
            
            // Tab键处理
            if (e.key === 'Tab' && document.activeElement === this.editor) {
                e.preventDefault();
                this.insertText('    ');
            }
        });
    }
    
    setupSettingsListeners() {
        const settings = ['autoSave', 'lineNumbers', 'syntaxHighlight', 'livePreview'];
        
        settings.forEach(setting => {
            const element = document.getElementById(setting);
            if (element) {
                element.addEventListener('change', () => {
                    this.applySettings();
                });
            }
        });
        
        document.getElementById('themeSelect').addEventListener('change', () => {
            this.applyTheme();
        });
        
        document.getElementById('fontSize').addEventListener('input', (e) => {
            document.getElementById('fontSizeValue').textContent = `${e.target.value}px`;
            this.applyFontSize(e.target.value);
        });
    }
    
    handleToolbarAction(action) {
        const actions = {
            bold: () => this.wrapSelection('**', '**'),
            italic: () => this.wrapSelection('*', '*'),
            heading1: () => this.insertLine('# '),
            heading2: () => this.insertLine('## '),
            link: () => this.insertLink(),
            image: () => this.insertImage(),
            code: () => this.wrapSelection('```\n', '\n```'),
            quote: () => this.insertLine('> '),
            listUl: () => this.insertLine('- '),
            listOl: () => this.insertLine('1. '),
            table: () => this.insertTable(),
            hr: () => this.insertLine('\n---\n'),
            undo: () => this.undo(),
            redo: () => this.redo(),
            preview: () => this.togglePreview(),
            fullscreen: () => this.toggleFullscreen()
        };
        
        if (actions[action]) {
            actions[action]();
        }
    }
    
    handlePanelAction(action) {
        const actions = {
            clear: () => this.clearEditor(),
            format: () => this.formatDocument(),
            refresh: () => this.updatePreview(),
            theme: () => this.toggleTheme()
        };
        
        if (actions[action]) {
            actions[action]();
        }
    }
    
    handleFileAction(action) {
        const actions = {
            openFile: () => this.openFile(),
            saveFile: () => this.saveFile(),
            exportHtml: () => this.exportHtml(),
            exportPdf: () => this.exportPdf()
        };
        
        if (actions[action]) {
            actions[action]();
            document.getElementById('fileModal').style.display = 'none';
        }
    }
    
    wrapSelection(before, after) {
        const start = this.editor.selectionStart;
        const end = this.editor.selectionEnd;
        const selectedText = this.editor.value.substring(start, end);
        
        this.editor.value = this.editor.value.substring(0, start) + 
                           before + selectedText + after + 
                           this.editor.value.substring(end);
        
        this.editor.selectionStart = start + before.length;
        this.editor.selectionEnd = end + before.length;
        this.editor.focus();
        
        this.updatePreview();
    }
    
    insertLine(text) {
        const start = this.editor.selectionStart;
        const lines = this.editor.value.substring(0, start).split('\n');
        const currentLine = lines.length - 1;
        const lineStart = this.editor.value.lastIndexOf('\n', start - 1) + 1;
        
        this.editor.value = this.editor.value.substring(0, lineStart) + 
                           text + this.editor.value.substring(lineStart);
        
        this.editor.selectionStart = lineStart + text.length;
        this.editor.selectionEnd = this.editor.selectionStart;
        this.editor.focus();
        
        this.updatePreview();
    }
    
    insertLink() {
        const url = prompt('请输入链接URL:');
        const text = prompt('请输入链接文本:', url);
        
        if (url && text) {
            this.insertText(`[${text}](${url})`);
        }
    }
    
    insertImage() {
        const url = prompt('请输入图片URL:');
        const alt = prompt('请输入图片描述:');
        
        if (url) {
            this.insertText(`![${alt || ''}](${url})`);
        }
    }
    
    insertTable() {
        const table = `
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据 | 数据 | 数据 |
| 数据 | 数据 | 数据 |
        `.trim();
        
        this.insertText(table);
    }
    
    insertText(text) {
        const start = this.editor.selectionStart;
        const end = this.editor.selectionEnd;
        
        this.editor.value = this.editor.value.substring(0, start) + 
                           text + this.editor.value.substring(end);
        
        this.editor.selectionStart = start + text.length;
        this.editor.selectionEnd = this.editor.selectionStart;
        this.editor.focus();
        
        this.updatePreview();
    }
    
    undo() {
        document.execCommand('undo', false, null);
        this.updatePreview();
    }
    
    redo() {
        document.execCommand('redo', false, null);
        this.updatePreview();
    }
    
    togglePreview() {
        this.isPreviewOnly = !this.isPreviewOnly;
        
        if (this.isPreviewOnly) {
            this.editor.style.display = 'none';
            this.preview.parentElement.style.gridColumn = '1 / -1';
        } else {
            this.editor.style.display = 'block';
            this.preview.parentElement.style.gridColumn = '';
        }
    }
    
    toggleFullscreen() {
        this.isFullscreen = !this.isFullscreen;
        
        if (this.isFullscreen) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error('全屏模式错误:', err);
            });
        } else if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }
    
    toggleTheme() {
        const currentTheme = this.settings.theme || 'light';
        this.settings.theme = currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.saveSettings();
    }
    
    toggleComment() {
        const start = this.editor.selectionStart;
        const end = this.editor.selectionEnd;
        const selectedText = this.editor.value.substring(start, end);
        
        if (selectedText.includes('<!--') && selectedText.includes('-->')) {
            // 移除注释
            const uncommented = selectedText.replace(/<!--\s?/, '').replace(/\s?-->/, '');
            this.editor.value = this.editor.value.substring(0, start) + 
                               uncommented + this.editor.value.substring(end);
        } else {
            // 添加注释
            this.editor.value = this.editor.value.substring(0, start) + 
                               '<!-- ' + selectedText + ' -->' + 
                               this.editor.value.substring(end);
        }
        
        this.updatePreview();
    }
    
    updatePreview() {
        if (!this.settings.livePreview) return;
        
        const markdown = this.editor.value;
        this.preview.innerHTML = marked.parse(markdown);
        
        // 应用代码高亮
        this.preview.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    }
    
    updateStats() {
        const text = this.editor.value;
        const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
        const lineCount = text.split('\n').length;
        
        document.getElementById('wordCount').textContent = wordCount;
        document.getElementById('lineCount').textContent = lineCount;
    }
    
    autoSave() {
        if (!this.settings.autoSave) return;
        
        clearTimeout(this.autoSaveTimer);
        this.autoSaveTimer = setTimeout(() => {
            this.saveToLocalStorage();
        }, 1000);
    }
    
    setupAutoSave() {
        this.loadFromLocalStorage();
        
        window.addEventListener('beforeunload', (e) => {
            if (this.editor.value.trim() && this.settings.autoSave) {
                this.saveToLocalStorage();
            }
        });
    }
    
    saveToLocalStorage() {
        localStorage.setItem('markdownEditor_content', this.editor.value);
        localStorage.setItem('markdownEditor_stats', JSON.stringify({
            savedAt: new Date().toISOString(),
            wordCount: document.getElementById('wordCount').textContent,
            lineCount: document.getElementById('lineCount').textContent
        }));
    }
    
    loadFromLocalStorage() {
        const savedContent = localStorage.getItem('markdownEditor_content');
        if (savedContent) {
            if (confirm('检测到未保存的更改，是否恢复？')) {
                this.editor.value = savedContent;
                this.updatePreview();
                this.updateStats();
            } else {
                localStorage.removeItem('markdownEditor_content');
            }
        }
    }
    
    newFile() {
        if (this.editor.value.trim() && !confirm('当前内容尚未保存，确定要新建文件吗？')) {
            return;
        }
        
        this.editor.value = '';
        this.currentFile = null;
        this.updatePreview();
        this.updateStats();
        localStorage.removeItem('markdownEditor_content');
    }
    
    openFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.md,.txt,.markdown';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                this.editor.value = e.target.result;
                this.currentFile = file;
                this.updatePreview();
                this.updateStats();
                this.addToRecentFiles(file.name);
            };
            reader.readAsText(file);
        };
        
        input.click();
    }
    
    saveFile() {
        if (!this.editor.value.trim()) {
            alert('文档内容为空！');
            return;
        }
        
        const blob = new Blob([this.editor.value], { type: 'text/markdown' });
        const filename = this.currentFile ? this.currentFile.name : `document-${Date.now()}.md`;
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }
    
    exportHtml() {
        const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Exported Document</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
        pre { background: #2d3748; color: #e2e8f0; padding: 1em; border-radius: 8px; overflow-x: auto; }
        pre code { background: transparent; }
        blockquote { border-left: 4px solid #667eea; padding-left: 1em; margin: 1em 0; color: #718096; }
        table { width: 100%; border-collapse: collapse; margin: 1em 0; }
        th, td { border: 1px solid #e2e8f0; padding: 0.75em; text-align: left; }
        th { background: rgba(102, 126, 234, 0.1); }
    </style>
</head>
<body>
${marked.parse(this.editor.value)}
</body>
</html>`;
        
        const blob = new Blob([html], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `export-${Date.now()}.html`;
        link.click();
        URL.revokeObjectURL(link.href);
    }
    
    exportPdf() {
        alert('PDF导出功能需要服务器端支持。已生成HTML文件供打印使用。');
        this.exportHtml();
    }
    
    clearEditor() {
        if (confirm('确定要清空编辑器内容吗？')) {
            this.editor.value = '';
            this.updatePreview();
            this.updateStats();
        }
    }
    
    formatDocument() {
        // 简单的格式化逻辑
        let text = this.editor.value;
        
        // 规范化换行符
        text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        
        // 确保标题前后有空行
        text = text.replace(/(\n)(#+)([^\n]+)(\n)/g, '$1$2$3$4');
        
        this.editor.value = text;
        this.updatePreview();
    }
    
    addToRecentFiles(filename) {
        let recentFiles = JSON.parse(localStorage.getItem('recentFiles') || '[]');
        recentFiles = recentFiles.filter(file => file !== filename);
        recentFiles.unshift(filename);
        recentFiles = recentFiles.slice(0, 5); // 只保留最近5个文件
        
        localStorage.setItem('recentFiles', JSON.stringify(recentFiles));
        this.updateRecentFilesList();
    }
    
    updateRecentFilesList() {
        const recentFiles = JSON.parse(localStorage.getItem('recentFiles') || '[]');
        const fileList = document.querySelector('.file-list');
        
        fileList.innerHTML = recentFiles.length > 0 ? '' : '<p>暂无最近文件</p>';
        
        recentFiles.forEach(filename => {
            const item = document.createElement('div');
            item.className = 'file-item';
            item.textContent = filename;
            item.addEventListener('click', () => {
                // 这里可以实现文件加载逻辑
                alert(`加载文件: ${filename}`);
            });
            
            fileList.appendChild(item);
        });
    }
    
    loadSampleContent() {
        if (!this.editor.value.trim()) {
            this.editor.value = `# 欢迎使用 Markdown 编辑器

这是一个功能强大的在线Markdown编辑器，支持实时预览、语法高亮和多种导出格式。

## 功能特性

- ✨ **实时预览** - 边写边看效果
- 🎨 **语法高亮** - 代码块自动高亮
- 💾 **自动保存** - 防止内容丢失
- 📁 **文件操作** - 导入导出多种格式
- ⌨️ **键盘快捷键** - 提高编辑效率
- 📱 **响应式设计** - 支持移动端

## 快速开始

1. 在左侧编辑区编写Markdown内容
2. 实时在右侧查看渲染效果
3. 使用工具栏快速插入格式
4. 通过文件菜单保存或导出

## 代码示例

\`\`\`javascript
function greet(name) {
    return \`Hello, \${name}! Welcome to Markdown Editor.\`;
}

console.log(greet('World'));
\`\`\`

## 支持的语法

- **粗体** 和 *斜体*
- [链接](https://example.com)
- 图片: ![示例图片](https://via.placeholder.com/150)
- 列表:
  - 项目1
  - 项目2
- 表格:

| 功能 | 支持 | 说明 |
|------|------|------|
| 表格 | ✅ | 完整支持 |
| 数学公式 | ⚠️ | 部分支持 |

> 提示：使用快捷键 Ctrl+/ 可以快速注释/取消注释选中内容

享受写作的乐趣吧！ 🎉
`;
            this.updatePreview();
            this.updateStats();
        }
    }
    
    loadSettings() {
        const defaultSettings = {
            autoSave: true,
            lineNumbers: true,
            syntaxHighlight: true,
            livePreview: true,
            theme: 'light',
            fontSize: 16
        };
        
        const saved = localStorage.getItem('editorSettings');
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    }
    
    saveSettings() {
        this.settings.autoSave = document.getElementById('autoSave').checked;
        this.settings.lineNumbers = document.getElementById('lineNumbers').checked;
        this.settings.syntaxHighlight = document.getElementById('syntaxHighlight').checked;
        this.settings.livePreview = document.getElementById('livePreview').checked;
        this.settings.theme = document.getElementById('themeSelect').value;
        this.settings.fontSize = parseInt(document.getElementById('fontSize').value);
        
        localStorage.setItem('editorSettings', JSON.stringify(this.settings));
        this.applySettings();
        
        document.getElementById('settingsModal').style.display = 'none';
        alert('设置已保存！');
    }
    
    applySettings() {
        document.getElementById('autoSave').checked = this.settings.autoSave;
        document.getElementById('lineNumbers').checked = this.settings.lineNumbers;
        document.getElementById('syntaxHighlight').checked = this.settings.syntaxHighlight;
        document.getElementById('livePreview').checked = this.settings.livePreview;
        document.getElementById('themeSelect').value = this.settings.theme;
        document.getElementById('fontSize').value = this.settings.fontSize;
        document.getElementById('fontSizeValue').textContent = `${this.settings.fontSize}px`;
        
        this.applyTheme();
        this.applyFontSize(this.settings.fontSize);
        document.getElementById('autoSaveStatus').textContent = this.settings.autoSave ? '开启' : '关闭';
        
        if (!this.settings.livePreview) {
            this.updatePreview();
        }
    }
    
    applyTheme() {
        const theme = this.settings.theme;
        document.documentElement.setAttribute('data-theme', theme);
    }
    
    applyFontSize(size) {
        this.editor.style.fontSize = `${size}px`;
        this.preview.style.fontSize = `${size}px`;
    }
}

// 初始化Markdown编辑器
document.addEventListener('DOMContentLoaded', () => {
    const editor = new MarkdownEditor();
    
    // 全局暴露编辑器实例以便调试
    window.markdownEditor = editor;
    
    // 设置模态框初始值
    document.getElementById('fileModal').addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-btn')) {
            editor.updateRecentFilesList();
        }
    });
    
    // 设置面板初始显示
    document.querySelectorAll('.panel-btn[data-action="theme"]').forEach(btn => {
        btn.addEventListener('click', () => {
            editor.toggleTheme();
        });
    });
});