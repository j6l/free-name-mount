class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.exploded = false;
        this.rocket = {
            x: x,
            y: window.innerHeight,
            vx: (Math.random() - 0.5) * 2,
            vy: -Math.random() * 8 - 12,
            trail: []
        };
        this.colors = [
            '#ff6b6b', '#ffd93d', '#6bcf7f', '#4ecdc4', 
            '#45b7d1', '#96ceb4', '#ff8a80', '#ffb74d',
            '#81c784', '#64b5f6', '#ba68c8', '#f06292'
        ];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    }

    update() {
        if (!this.exploded) {
            // 火箭上升阶段
            this.rocket.x += this.rocket.vx;
            this.rocket.y += this.rocket.vy;
            this.rocket.vy += 0.3; // 重力

            // 添加尾迹
            this.rocket.trail.push({ x: this.rocket.x, y: this.rocket.y });
            if (this.rocket.trail.length > 10) {
                this.rocket.trail.shift();
            }

            // 检查是否到达爆炸点
            if (this.rocket.vy >= 0 || this.rocket.y <= this.y) {
                this.explode();
            }
        } else {
            // 粒子爆炸阶段
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const particle = this.particles[i];
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.1; // 重力
                particle.life -= 0.02;
                particle.size *= 0.98;

                if (particle.life <= 0 || particle.size <= 0.1) {
                    this.particles.splice(i, 1);
                }
            }
        }
    }

    explode() {
        this.exploded = true;
        const particleCount = Math.random() * 50 + 50;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = Math.random() * 8 + 2;
            
            this.particles.push({
                x: this.rocket.x,
                y: this.rocket.y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                life: 1,
                size: Math.random() * 4 + 2,
                color: this.color,
                brightness: Math.random() * 0.5 + 0.5
            });
        }

        // 添加二次爆炸效果
        if (Math.random() < 0.3) {
            setTimeout(() => {
                this.addSecondaryExplosion();
            }, 500);
        }
    }

    addSecondaryExplosion() {
        const secondaryCount = 20;
        for (let i = 0; i < secondaryCount; i++) {
            const angle = (Math.PI * 2 * i) / secondaryCount;
            const velocity = Math.random() * 4 + 1;
            
            this.particles.push({
                x: this.rocket.x + (Math.random() - 0.5) * 50,
                y: this.rocket.y + (Math.random() - 0.5) * 50,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                life: 0.8,
                size: Math.random() * 2 + 1,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                brightness: Math.random() * 0.3 + 0.3
            });
        }
    }

    draw(ctx) {
        if (!this.exploded) {
            // 绘制火箭尾迹
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            for (let i = 0; i < this.rocket.trail.length; i++) {
                const point = this.rocket.trail[i];
                const alpha = i / this.rocket.trail.length;
                ctx.globalAlpha = alpha;
                if (i === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            }
            ctx.stroke();
            ctx.globalAlpha = 1;

            // 绘制火箭
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.rocket.x, this.rocket.y, 3, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // 绘制爆炸粒子
            this.particles.forEach(particle => {
                ctx.save();
                ctx.globalAlpha = particle.life * particle.brightness;
                ctx.fillStyle = particle.color;
                ctx.shadowBlur = 15;
                ctx.shadowColor = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });
        }
    }

    isDead() {
        return this.exploded && this.particles.length === 0;
    }
}

class FireworksGame {
    constructor() {
        this.canvas = document.getElementById('fireworksCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.fireworks = [];
        this.score = 0;
        this.autoMode = false;
        this.autoInterval = null;
        
        this.setupCanvas();
        this.setupEventListeners();
        this.gameLoop();
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }

    setupEventListeners() {
        // 点击创建烟花
        this.canvas.addEventListener('click', (e) => {
            if (!this.autoMode) {
                this.createFirework(e.clientX, e.clientY);
                this.updateScore(10);
            }
        });

        // 触摸支持
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (!this.autoMode) {
                const touch = e.touches[0];
                this.createFirework(touch.clientX, touch.clientY);
                this.updateScore(10);
            }
        });

        // 按钮事件
        document.getElementById('homeBtn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        document.getElementById('clearBtn').addEventListener('click', () => {
            this.fireworks = [];
            this.score = 0;
            this.updateScore(0);
        });

        document.getElementById('autoBtn').addEventListener('click', () => {
            this.toggleAutoMode();
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    if (!this.autoMode) {
                        this.createRandomFirework();
                        this.updateScore(5);
                    }
                    break;
                case 'a':
                case 'A':
                    this.toggleAutoMode();
                    break;
                case 'c':
                case 'C':
                    this.fireworks = [];
                    break;
            }
        });
    }

    createFirework(x, y) {
        this.fireworks.push(new Firework(x, y));
    }

    createRandomFirework() {
        const x = Math.random() * this.canvas.width;
        const y = Math.random() * this.canvas.height * 0.5 + 50;
        this.createFirework(x, y);
    }

    toggleAutoMode() {
        this.autoMode = !this.autoMode;
        const autoBtn = document.getElementById('autoBtn');
        
        if (this.autoMode) {
            autoBtn.textContent = '⏸️ 停止自动';
            autoBtn.style.background = 'rgba(255, 107, 107, 0.3)';
            this.startAutoMode();
        } else {
            autoBtn.textContent = '✨ 自动模式';
            autoBtn.style.background = 'rgba(255, 255, 255, 0.1)';
            this.stopAutoMode();
        }
    }

    startAutoMode() {
        this.autoInterval = setInterval(() => {
            if (Math.random() < 0.7) {
                this.createRandomFirework();
                this.updateScore(2);
            }
        }, 800);
    }

    stopAutoMode() {
        if (this.autoInterval) {
            clearInterval(this.autoInterval);
            this.autoInterval = null;
        }
    }

    updateScore(points) {
        this.score += points;
        document.getElementById('score').textContent = this.score;
    }

    gameLoop() {
        // 清空画布
        this.ctx.fillStyle = 'rgba(12, 12, 12, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 更新和绘制烟花
        for (let i = this.fireworks.length - 1; i >= 0; i--) {
            const firework = this.fireworks[i];
            firework.update();
            firework.draw(this.ctx);

            if (firework.isDead()) {
                this.fireworks.splice(i, 1);
            }
        }

        requestAnimationFrame(() => this.gameLoop());
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new FireworksGame();
    
    // 添加欢迎提示
    setTimeout(() => {
        if (document.getElementById('score').textContent === '0') {
            const instruction = document.querySelector('.instruction');
            instruction.style.animation = 'pulse 1s ease-in-out 3';
        }
    }, 2000);
});