// 颜色选择器 - 核心逻辑
class ColorPicker {
    constructor() {
        this.hueCanvas = document.getElementById('hueCanvas');
        this.colorCanvas = document.getElementById('colorCanvas');
        this.hueCtx = this.hueCanvas.getContext('2d');
        this.colorCtx = this.colorCanvas.getContext('2d');
        
        this.currentColor = {
            hex: '#FF6B6B',
            rgb: { r: 255, g: 107, b: 107 },
            hsl: { h: 0, s: 100, l: 71 },
            cmyk: { c: 0, m: 58, y: 58, k: 0 }
        };
        
        this.config = {
            hue: 0,
            saturation: 100,
            lightness: 71,
            isDragging: false,
            dragType: null
        };
        
        this.palette = this.loadPalette();
        
        this.init();
    }
    
    init() {
        this.setupCanvases();
        this.setupEventListeners();
        this.setupInputListeners();
        this.renderPalette();
        this.updateColorDisplay();
    }
    
    setupCanvases() {
        this.drawHueCanvas();
        this.drawColorCanvas();
    }
    
    drawHueCanvas() {
        const gradient = this.hueCtx.createLinearGradient(0, 0, this.hueCanvas.width, 0);
        
        // 创建色相渐变
        const hues = [
            '#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF', '#FF0000'
        ];
        
        hues.forEach((color, index) => {
            gradient.addColorStop(index / (hues.length - 1), color);
        });
        
        this.hueCtx.fillStyle = gradient;
        this.hueCtx.fillRect(0, 0, this.hueCanvas.width, this.hueCanvas.height);
    }
    
    drawColorCanvas() {
        const width = this.colorCanvas.width;
        const height = this.colorCanvas.height;
        
        // 清除画布
        this.colorCtx.clearRect(0, 0, width, height);
        
        // 创建饱和度/亮度渐变
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const saturation = (x / width) * 100;
                const lightness = 100 - (y / height) * 100;
                
                const color = this.hslToRgb(this.config.hue, saturation, lightness);
                this.colorCtx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
                this.colorCtx.fillRect(x, y, 1, 1);
            }
        }
        
        // 绘制选择器标记
        const markerX = (this.config.saturation / 100) * width;
        const markerY = (1 - this.config.lightness / 100) * height;
        
        this.colorCtx.strokeStyle = '#ffffff';
        this.colorCtx.lineWidth = 2;
        this.colorCtx.beginPath();
        this.colorCtx.arc(markerX, markerY, 8, 0, Math.PI * 2);
        this.colorCtx.stroke();
        
        this.colorCtx.strokeStyle = '#000000';
        this.colorCtx.lineWidth = 1;
        this.colorCtx.beginPath();
        this.colorCtx.arc(markerX, markerY, 8, 0, Math.PI * 2);
        this.colorCtx.stroke();
    }
    
    setupEventListeners() {
        // 色相画布事件
        this.hueCanvas.addEventListener('mousedown', (e) => this.startDrag(e, 'hue'));
        this.hueCanvas.addEventListener('touchstart', (e) => this.startDrag(e, 'hue'));
        
        // 颜色画布事件
        this.colorCanvas.addEventListener('mousedown', (e) => this.startDrag(e, 'color'));
        this.colorCanvas.addEventListener('touchstart', (e) => this.startDrag(e, 'color'));
        
        // 全局事件
        document.addEventListener('mousemove', this.handleDrag.bind(this));
        document.addEventListener('touchmove', this.handleDrag.bind(this));
        document.addEventListener('mouseup', this.stopDrag.bind(this));
        document.addEventListener('touchend', this.stopDrag.bind(this));
        
        // 控制按钮事件
        document.getElementById('saveColor').addEventListener('click', () => this.saveToPalette());
        document.getElementById('clearPalette').addEventListener('click', () => this.clearPalette());
        document.getElementById('contrastCheck').addEventListener('click', () => this.checkContrast());
        document.getElementById('colorBlind').addEventListener('click', () => this.simulateColorBlind());
        document.getElementById('gradientGen').addEventListener('click', () => this.generateGradient());
        document.getElementById('exportPalette').addEventListener('click', () => this.exportPalette());
        
        // 预设方案事件
        document.querySelectorAll('.scheme').forEach(scheme => {
            scheme.addEventListener('click', (e) => {
                this.loadPresetScheme(e.currentTarget.dataset.scheme);
            });
        });
    }
    
    setupInputListeners() {
        const inputs = {
            hexInput: this.handleHexInput.bind(this),
            rgbInput: this.handleRgbInput.bind(this),
            hslInput: this.handleHslInput.bind(this),
            cmykInput: this.handleCmykInput.bind(this)
        };
        
        Object.entries(inputs).forEach(([id, handler]) => {
            document.getElementById(id).addEventListener('input', handler);
            document.getElementById(id).addEventListener('change', handler);
        });
    }
    
    startDrag(e, type) {
        e.preventDefault();
        this.config.isDragging = true;
        this.config.dragType = type;
        this.handleDrag(e);
    }
    
    handleDrag(e) {
        if (!this.config.isDragging) return;
        
        const rect = this.config.dragType === 'hue' ? 
            this.hueCanvas.getBoundingClientRect() : 
            this.colorCanvas.getBoundingClientRect();
        
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        if (!clientX || !clientY) return;
        
        const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
        const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
        
        if (this.config.dragType === 'hue') {
            this.config.hue = (x / rect.width) * 360;
            this.drawColorCanvas();
        } else {
            this.config.saturation = (x / rect.width) * 100;
            this.config.lightness = 100 - (y / rect.height) * 100;
        }
        
        this.updateCurrentColor();
    }
    
    stopDrag() {
        this.config.isDragging = false;
        this.config.dragType = null;
    }
    
    updateCurrentColor() {
        const rgb = this.hslToRgb(this.config.hue, this.config.saturation, this.config.lightness);
        const hsl = { h: this.config.hue, s: this.config.saturation, l: this.config.lightness };
        const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
        const cmyk = this.rgbToCmyk(rgb.r, rgb.g, rgb.b);
        
        this.currentColor = { hex, rgb, hsl, cmyk };
        this.updateColorDisplay();
    }
    
    updateColorDisplay() {
        // 更新颜色显示
        document.getElementById('currentColor').style.backgroundColor = this.currentColor.hex;
        document.getElementById('colorHex').textContent = this.currentColor.hex;
        document.getElementById('colorRgb').textContent = `rgb(${this.currentColor.rgb.r}, ${this.currentColor.rgb.g}, ${this.currentColor.rgb.b})`;
        document.getElementById('colorHsl').textContent = `hsl(${Math.round(this.currentColor.hsl.h)}, ${Math.round(this.currentColor.hsl.s)}%, ${Math.round(this.currentColor.hsl.l)}%)`;
        document.getElementById('cmykInput').value = `cmyk(${Math.round(this.currentColor.cmyk.c)}%, ${Math.round(this.currentColor.cmyk.m)}%, ${Math.round(this.currentColor.cmyk.y)}%, ${Math.round(this.currentColor.cmyk.k)}%)`;
        
        // 更新输入框（不触发事件）
        document.getElementById('hexInput').value = this.currentColor.hex;
        document.getElementById('rgbInput').value = `rgb(${this.currentColor.rgb.r}, ${this.currentColor.rgb.g}, ${this.currentColor.rgb.b})`;
        document.getElementById('hslInput').value = `hsl(${Math.round(this.currentColor.hsl.h)}, ${Math.round(this.currentColor.hsl.s)}%, ${Math.round(this.currentColor.hsl.l)}%)`;
    }
    
    handleHexInput(e) {
        const hex = e.target.value;
        if (this.isValidHex(hex)) {
            const rgb = this.hexToRgb(hex);
            this.updateFromRgb(rgb.r, rgb.g, rgb.b);
        }
    }
    
    handleRgbInput(e) {
        const match = e.target.value.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (match) {
            const r = parseInt(match[1]);
            const g = parseInt(match[2]);
            const b = parseInt(match[3]);
            this.updateFromRgb(r, g, b);
        }
    }
    
    handleHslInput(e) {
        const match = e.target.value.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        if (match) {
            const h = parseInt(match[1]);
            const s = parseInt(match[2]);
            const l = parseInt(match[3]);
            this.updateFromHsl(h, s, l);
        }
    }
    
    handleCmykInput(e) {
        const match = e.target.value.match(/cmyk\((\d+)%,\s*(\d+)%,\s*(\d+)%,\s*(\d+)%\)/);
        if (match) {
            const c = parseInt(match[1]);
            const m = parseInt(match[2]);
            const y = parseInt(match[3]);
            const k = parseInt(match[4]);
            const rgb = this.cmykToRgb(c, m, y, k);
            this.updateFromRgb(rgb.r, rgb.g, rgb.b);
        }
    }
    
    updateFromRgb(r, g, b) {
        const hsl = this.rgbToHsl(r, g, b);
        this.config.hue = hsl.h;
        this.config.saturation = hsl.s;
        this.config.lightness = hsl.l;
        this.drawColorCanvas();
        this.updateCurrentColor();
    }
    
    updateFromHsl(h, s, l) {
        this.config.hue = h;
        this.config.saturation = s;
        this.config.lightness = l;
        this.drawColorCanvas();
        this.updateCurrentColor();
    }
    
    // 颜色转换函数
    hslToRgb(h, s, l) {
        s /= 100;
        l /= 100;
        
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        
        let r, g, b;
        
        if (h >= 0 && h < 60) {
            [r, g, b] = [c, x, 0];
        } else if (h >= 60 && h < 120) {
            [r, g, b] = [x, c, 0];
        } else if (h >= 120 && h < 180) {
            [r, g, b] = [0, c, x];
        } else if (h >= 180 && h < 240) {
            [r, g, b] = [0, x, c];
        } else if (h >= 240 && h < 300) {
            [r, g, b] = [x, 0, c];
        } else {
            [r, g, b] = [c, 0, x];
        }
        
        return {
            r: Math.round((r + m) * 255),
            g: Math.round((g + m) * 255),
            b: Math.round((b + m) * 255)
        };
    }
    
    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            
            h /= 6;
        }
        
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }
    
    rgbToHex(r, g, b) {
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }
    
    rgbToCmyk(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const k = 1 - Math.max(r, g, b);
        const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
        const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
        const y = k === 1 ? 0 : (1 - b - k) / (1 - k);
        
        return {
            c: Math.round(c * 100),
            m: Math.round(m * 100),
            y: Math.round(y * 100),
            k: Math.round(k * 100)
        };
    }
    
    cmykToRgb(c, m, y, k) {
        c /= 100;
        m /= 100;
        y /= 100;
        k /= 100;
        
        return {
            r: Math.round(255 * (1 - c) * (1 - k)),
            g: Math.round(255 * (1 - m) * (1 - k)),
            b: Math.round(255 * (1 - y) * (1 - k))
        };
    }
    
    isValidHex(hex) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    }
    
    // 调色板功能
    saveToPalette() {
        if (this.palette.length >= 20) {
            alert('调色板已满（最多20个颜色）');
            return;
        }
        
        this.palette.push(this.currentColor.hex);
        this.savePalette();
        this.renderPalette();
    }
    
    clearPalette() {
        if (confirm('确定要清空调色板吗？')) {
            this.palette = [];
            this.savePalette();
            this.renderPalette();
        }
    }
    
    loadPalette() {
        const saved = localStorage.getItem('colorPalette');
        return saved ? JSON.parse(saved) : [];
    }
    
    savePalette() {
        localStorage.setItem('colorPalette', JSON.stringify(this.palette));
    }
    
    renderPalette() {
        const paletteEl = document.getElementById('colorPalette');
        paletteEl.innerHTML = '';
        
        this.palette.forEach((color, index) => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = color;
            swatch.title = color;
            swatch.addEventListener('click', () => {
                this.loadColorFromPalette(color);
            });
            
            paletteEl.appendChild(swatch);
        });
    }
    
    loadColorFromPalette(hex) {
        const rgb = this.hexToRgb(hex);
        this.updateFromRgb(rgb.r, rgb.g, rgb.b);
    }
    
    // 工具功能
    checkContrast() {
        const resultEl = document.getElementById('contrastResult');
        const sampleEl = document.getElementById('textSample');
        const valueEl = document.getElementById('contrastValue');
        const ratingEl = document.getElementById('contrastRating');
        
        // 显示对比度检查面板
        document.getElementById('colorblindResult').style.display = 'none';
        resultEl.style.display = 'block';
        
        // 设置样本颜色
        sampleEl.style.backgroundColor = this.currentColor.hex;
        sampleEl.style.color = this.getContrastColor(this.currentColor.hex);
        
        // 计算对比度
        const contrast = this.calculateContrast(this.currentColor.hex);
        valueEl.textContent = `${contrast.toFixed(2)}:1`;
        
        // 评估对比度
        if (contrast >= 4.5) {
            ratingEl.textContent = '✅ 符合 WCAG AA 标准';
            ratingEl.className = 'contrast-rating good';
        } else if (contrast >= 3.0) {
            ratingEl.textContent = '⚠️ 符合 WCAG AA 大文本标准';
            ratingEl.className = 'contrast-rating good';
        } else {
            ratingEl.textContent = '❌ 不符合 WCAG 标准';
            ratingEl.className = 'contrast-rating poor';
        }
    }
    
    calculateContrast(hex) {
        const rgb = this.hexToRgb(hex);
        const luminance = this.calculateLuminance(rgb.r, rgb.g, rgb.b);
        const bgLuminance = 1; // 白色背景
        
        return (Math.max(luminance, bgLuminance) + 0.05) /
               (Math.min(luminance, bgLuminance) + 0.05);
    }
    
    calculateLuminance(r, g, b) {
        const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }
    
    getContrastColor(hex) {
        const rgb = this.hexToRgb(hex);
        const luminance = this.calculateLuminance(rgb.r, rgb.g, rgb.b);
        return luminance > 0.5 ? '#000000' : '#ffffff';
    }
    
    simulateColorBlind() {
        const resultEl = document.getElementById('colorblindResult');
        const normalEl = document.getElementById('normalSample');
        const protanEl = document.getElementById('protanSample');
        const deutanEl = document.getElementById('deutanSample');
        
        // 显示色盲模拟面板
        document.getElementById('contrastResult').style.display = 'none';
        resultEl.style.display = 'block';
        
        // 设置样本颜色
        normalEl.style.backgroundColor = this.currentColor.hex;
        protanEl.style.backgroundColor = this.simulateProtanopia(this.currentColor.hex);
        deutanEl.style.backgroundColor = this.simulateDeuteranopia(this.currentColor.hex);
    }
    
    simulateProtanopia(hex) {
        // 红色盲模拟
        const rgb = this.hexToRgb(hex);
        return this.rgbToHex(
            Math.round(rgb.r * 0.567 + rgb.g * 0.433),
            Math.round(rgb.r * 0.558 + rgb.g * 0.442),
            rgb.b
        );
    }
    
    simulateDeuteranopia(hex) {
        // 绿色盲模拟
        const rgb = this.hexToRgb(hex);
        return this.rgbToHex(
            Math.round(rgb.r * 0.625 + rgb.g * 0.375),
            Math.round(rgb.r * 0.7 + rgb.g * 0.3),
            rgb.b
        );
    }
    
    generateGradient() {
        const baseHsl = this.currentColor.hsl;
        const gradients = [];
        
        // 生成5种渐变颜色
        for (let i = 0; i < 5; i++) {
            const h = (baseHsl.h + i * 72) % 360;
            const s = Math.max(20, Math.min(100, baseHsl.s + (i - 2) * 10));
            const l = Math.max(20, Math.min(80, baseHsl.l + (i - 2) * 5));
            
            const rgb = this.hslToRgb(h, s, l);
            gradients.push(this.rgbToHex(rgb.r, rgb.g, rgb.b));
        }
        
        // 添加到调色板
        gradients.forEach(color => {
            if (this.palette.length < 20 && !this.palette.includes(color)) {
                this.palette.push(color);
            }
        });
        
        this.savePalette();
        this.renderPalette();
        alert('已生成渐变颜色并添加到调色板！');
    }
    
    exportPalette() {
        const paletteText = this.palette.join('\n');
        const blob = new Blob([paletteText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'color-palette.txt';
        a.click();
        
        URL.revokeObjectURL(url);
    }
    
    loadPresetScheme(schemeName) {
        const schemes = {
            material: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#F9CA24'],
            pastel: ['#FFD3B6', '#FFAAA5', '#FF8B94', '#DCEDC1'],
            mono: ['#2D3436', '#636E72', '#B2BEC3', '#DFE6E9']
        };
        
        const scheme = schemes[schemeName];
        if (scheme) {
            this.palette = [...scheme];
            this.savePalette();
            this.renderPalette();
            
            // 加载第一个颜色
            this.loadColorFromPalette(scheme[0]);
        }
    }
}

// 初始化颜色选择器
document.addEventListener('DOMContentLoaded', () => {
    new ColorPicker();
});
