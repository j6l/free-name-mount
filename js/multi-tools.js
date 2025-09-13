/**
 * 多功能工具箱 - JavaScript核心功能
 * 包含JSON格式化、随机密码、Base64编码、URL编码等功能
 */

class MultiTools {
    constructor() {
        this.init();
    }

    init() {
        this.setupTabNavigation();
        this.setupEventListeners();
        this.setupRangeInputs();
    }

    // 设置选项卡导航
    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 移除所有激活状态
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));

                // 添加当前激活状态
                button.classList.add('active');
                const tabId = button.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    // 设置范围输入控件
    setupRangeInputs() {
        // 密码长度控制
        const passwordLength = document.getElementById('password-length');
        const passwordLengthValue = document.getElementById('password-length-value');
        
        passwordLength.addEventListener('input', () => {
            passwordLengthValue.textContent = passwordLength.value;
        });
    }

    // 设置事件监听器
    setupEventListeners() {
        // JSON工具
        document.getElementById('format-json').addEventListener('click', () => {
            this.formatJSON();
        });

        document.getElementById('minify-json').addEventListener('click', () => {
            this.minifyJSON();
        });

        document.getElementById('validate-json').addEventListener('click', () => {
            this.validateJSON();
        });

        // JSON结果复制
        document.getElementById('copy-json-result').addEventListener('click', () => {
            this.copyJSONResult();
        });

        // 密码生成
        document.getElementById('generate-password').addEventListener('click', () => {
            this.generatePassword();
        });

        document.getElementById('copy-all-passwords').addEventListener('click', () => {
            this.copyAllPasswords();
        });
    }

    // ==================== JSON工具功能 ====================
    formatJSON() {
        const input = document.getElementById('json-input').value.trim();
        const resultPre = document.getElementById('json-result');
        const copyBtn = document.getElementById('copy-json-result');

        if (!input) {
            this.showError(resultPre, '请输入JSON内容');
            copyBtn.style.display = 'none';
            return;
        }

        try {
            const parsed = JSON.parse(input);
            const formatted = JSON.stringify(parsed, null, 2);
            resultPre.textContent = formatted;
            resultPre.className = 'success';
            copyBtn.style.display = 'block';
        } catch (error) {
            this.showError(resultPre, 'JSON格式错误：' + error.message);
            copyBtn.style.display = 'none';
        }
    }

    minifyJSON() {
        const input = document.getElementById('json-input').value.trim();
        const resultPre = document.getElementById('json-result');
        const copyBtn = document.getElementById('copy-json-result');

        if (!input) {
            this.showError(resultPre, '请输入JSON内容');
            copyBtn.style.display = 'none';
            return;
        }

        try {
            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            resultPre.textContent = minified;
            resultPre.className = 'success';
            copyBtn.style.display = 'block';
        } catch (error) {
            this.showError(resultPre, 'JSON格式错误：' + error.message);
            copyBtn.style.display = 'none';
        }
    }

    validateJSON() {
        const input = document.getElementById('json-input').value.trim();
        const resultPre = document.getElementById('json-result');
        const copyBtn = document.getElementById('copy-json-result');

        if (!input) {
            this.showError(resultPre, '请输入JSON内容');
            copyBtn.style.display = 'none';
            return;
        }

        try {
            JSON.parse(input);
            resultPre.textContent = '✅ JSON格式正确！';
            resultPre.className = 'success';
            copyBtn.style.display = 'none'; // 验证结果不需要复制按钮
        } catch (error) {
            this.showError(resultPre, '❌ JSON格式错误：' + error.message);
            copyBtn.style.display = 'none';
        }
    }

    // 复制JSON结果
    copyJSONResult() {
        const resultPre = document.getElementById('json-result');
        const text = resultPre.textContent;

        if (!text || text.includes('请输入JSON内容') || text.includes('JSON格式错误') || text.includes('JSON格式正确')) {
            this.showMessage('没有可复制的内容');
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            this.showMessage('已复制JSON结果到剪贴板！');
        }).catch(err => {
            this.showMessage('复制失败：' + err.message);
        });
    }

    // ==================== 随机密码生成功能 ====================
    generatePassword() {
        const length = parseInt(document.getElementById('password-length').value);
        const count = parseInt(document.getElementById('password-count').value);
        const uppercase = document.getElementById('uppercase').checked;
        const lowercase = document.getElementById('lowercase').checked;
        const numbers = document.getElementById('numbers').checked;
        const symbols = document.getElementById('symbols').checked;
        const excludeChars = document.getElementById('exclude-chars').value;

        const resultsContainer = document.getElementById('password-results');
        const charSets = [];

        if (uppercase) charSets.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        if (lowercase) charSets.push('abcdefghijklmnopqrstuvwxyz');
        if (numbers) charSets.push('0123456789');
        if (symbols) charSets.push('!@#$%^&*()_+-=[]{}|;:,.<>?');

        if (charSets.length === 0) {
            this.showError(resultsContainer, '请至少选择一种字符类型');
            return;
        }

        // 生成多个密码
        const passwords = [];
        for (let i = 0; i < count; i++) {
            passwords.push(this.generateSinglePassword(length, charSets, excludeChars));
        }

        // 显示密码结果
        resultsContainer.innerHTML = passwords.map((password, index) => `
            <div class="password-item">
                <span class="password-text">${index + 1}. ${password}</span>
                <button class="btn secondary password-copy-btn" data-password="${password}" data-index="${index + 1}">
                    复制
                </button>
            </div>
        `).join('');

        // 为密码复制按钮添加事件监听器
        document.querySelectorAll('.password-copy-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const password = e.target.getAttribute('data-password');
                const index = e.target.getAttribute('data-index');
                navigator.clipboard.writeText(password).then(() => {
                    this.showMessage('已复制密码 ' + index);
                });
            });
        });

    }

    generateSinglePassword(length, charSets, excludeChars) {
        let password = '';
        const allChars = charSets.join('');
        
        // 过滤排除字符
        let availableChars = allChars;
        if (excludeChars) {
            const excludeSet = new Set(excludeChars.split(''));
            availableChars = allChars.split('').filter(char => !excludeSet.has(char)).join('');
        }

        if (availableChars.length === 0) {
            throw new Error('所有字符都被排除了，请调整排除字符设置');
        }

        // 确保至少包含每个选中的字符集中的一个字符
        for (const charSet of charSets) {
            let validChars = charSet;
            if (excludeChars) {
                const excludeSet = new Set(excludeChars.split(''));
                validChars = charSet.split('').filter(char => !excludeSet.has(char)).join('');
            }
            if (validChars.length > 0) {
                password += validChars[Math.floor(Math.random() * validChars.length)];
            }
        }

        // 填充剩余长度
        for (let i = password.length; i < length; i++) {
            password += availableChars[Math.floor(Math.random() * availableChars.length)];
        }

        // 打乱密码顺序
        return this.shuffleString(password);
    }

    shuffleString(str) {
        const array = str.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }

    // 复制所有密码功能
    copyAllPasswords() {
        const passwordElements = document.querySelectorAll('.password-text');
        if (passwordElements.length === 0) {
            this.showMessage('没有密码可复制');
            return;
        }

        const allPasswords = Array.from(passwordElements).map(el =>
            el.textContent.replace(/^\d+\.\s/, '')
        ).join('\n');
        
        navigator.clipboard.writeText(allPasswords).then(() => {
            this.showMessage('已复制所有密码到剪贴板！');
        }).catch(err => {
            this.showMessage('复制失败：' + err.message);
        });
    }

    // ==================== 通用工具函数 ====================
    copyToClipboard(elementId) {
        const element = document.getElementById(elementId);
        const text = element.value || element.textContent;

        if (!text) {
            this.showMessage('没有内容可复制');
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            this.showMessage('已复制到剪贴板！');
        }).catch(err => {
            this.showMessage('复制失败：' + err.message);
        });
    }

    showError(element, message) {
        if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
            element.value = message;
        } else {
            element.textContent = message;
        }
        element.className = 'error';
    }

    showSuccess(element, message) {
        if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
            element.value = message;
        } else {
            element.textContent = message;
        }
        element.className = 'success';
    }

    showMessage(message) {
        // 创建一个临时的消息提示
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 3000);
    }
}

// 初始化应用
let multiTools;
document.addEventListener('DOMContentLoaded', () => {
    multiTools = new MultiTools();
});