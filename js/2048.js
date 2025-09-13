// 2048游戏类
class Game2048 {
    constructor() {
        this.grid = [];
        this.score = 0;
        this.bestScore = 0;
        this.size = 4;
        this.tileContainer = document.querySelector('.tile-container');
        this.gameMessage = document.querySelector('.game-message');
        
        this.init();
    }
    
    // 初始化游戏
    init() {
        this.setupEventListeners();
        this.loadBestScore();
        this.restart();
    }
    
    // 设置事件监听器
    setupEventListeners() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    e.preventDefault();
                    this.move('up');
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    e.preventDefault();
                    this.move('down');
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault();
                    this.move('left');
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault();
                    this.move('right');
                    break;
            }
        });
        
        // 重新开始按钮
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restart();
        });
        
        // 重试按钮
        document.getElementById('retry-button').addEventListener('click', () => {
            this.restart();
        });
        
        // 返回首页按钮
        document.getElementById('homeBtn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
        
        // 触摸事件支持
        let touchStartX, touchStartY;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            if (!touchStartX || !touchStartY) return;
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const dx = touchEndX - touchStartX;
            const dy = touchEndY - touchStartY;
            
            // 判断滑动方向
            if (Math.abs(dx) > Math.abs(dy)) {
                // 水平滑动
                if (dx > 50) {
                    this.move('right');
                } else if (dx < -50) {
                    this.move('left');
                }
            } else {
                // 垂直滑动
                if (dy > 50) {
                    this.move('down');
                } else if (dy < -50) {
                    this.move('up');
                }
            }
            
            touchStartX = null;
            touchStartY = null;
        });
    }
    
    // 重新开始游戏
    restart() {
        this.grid = [];
        this.score = 0;
        this.updateScore();
        
        // 初始化网格
        for (let i = 0; i < this.size; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.size; j++) {
                this.grid[i][j] = 0;
            }
        }
        
        // 添加初始方块
        this.addRandomTile();
        this.addRandomTile();
        
        // 隐藏游戏结束/胜利消息
        this.gameMessage.className = 'game-message';
        this.gameMessage.querySelector('p').textContent = '';
        
        // 渲染游戏
        this.render();
    }
    
    // 添加随机方块
    addRandomTile() {
        const emptyCells = [];
        
        // 找到所有空单元格
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({x: i, y: j});
                }
            }
        }
        
        if (emptyCells.length > 0) {
            // 随机选择一个空单元格
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            
            // 根据当前游戏状态设置新方块的值
            const value = this.getNewTileValue();
            
            // 在选中的位置添加方块
            this.grid[randomCell.x][randomCell.y] = value;
            return true;
        }
        
        return false;
    }
    
    // 获取新方块的值 - 根据当前游戏已有最小值到最大值之间
    getNewTileValue() {
        // 获取当前游戏中的所有非零值
        const existingValues = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] > 0) {
                    existingValues.push(this.grid[i][j]);
                }
            }
        }
        
        // 如果没有现有值，则添加初始值2或4
        if (existingValues.length === 0) {
            return Math.random() < 0.9 ? 2 : 4;
        }
        
        // 获取最小值和最大值
        const minValue = Math.min(...existingValues);
        const maxValue = Math.max(...existingValues);
        
        // 在最小值和最大值之间生成新值（必须是2的幂）
        const possibleValues = [];
        for (let value = minValue; value <= maxValue; value *= 2) {
            possibleValues.push(value);
        }
        
        // 如果只有一种可能的值，则返回该值
        if (possibleValues.length === 1) {
            return possibleValues[0];
        }
        
        // 否则在可能的值中随机选择
        return possibleValues[Math.floor(Math.random() * possibleValues.length)];
    }
    
    // 移动方块
    move(direction) {
        let moved = false;
        let gridBefore = JSON.stringify(this.grid);
        
        switch(direction) {
            case 'up':
                moved = this.moveUp();
                break;
            case 'down':
                moved = this.moveDown();
                break;
            case 'left':
                moved = this.moveLeft();
                break;
            case 'right':
                moved = this.moveRight();
                break;
        }
        
        // 如果网格发生了变化
        if (moved) {
            // 添加新方块
            this.addRandomTile();
            
            // 渲染游戏
            this.render();
            
            // 检查游戏状态
            this.checkGameStatus();
        }
    }
    
    // 向上移动
    moveUp() {
        let moved = false;
        
        for (let j = 0; j < this.size; j++) {
            // 获取列
            const column = [];
            for (let i = 0; i < this.size; i++) {
                column.push(this.grid[i][j]);
            }
            
            // 移动并合并
            const result = this.moveAndMerge(column);
            
            // 更新网格
            for (let i = 0; i < this.size; i++) {
                if (this.grid[i][j] !== result[i]) {
                    this.grid[i][j] = result[i];
                    moved = true;
                }
            }
        }
        
        return moved;
    }
    
    // 向下移动
    moveDown() {
        let moved = false;
        
        for (let j = 0; j < this.size; j++) {
            // 获取列
            const column = [];
            for (let i = this.size - 1; i >= 0; i--) {
                column.push(this.grid[i][j]);
            }
            
            // 移动并合并
            const result = this.moveAndMerge(column);
            
            // 更新网格
            for (let i = 0; i < this.size; i++) {
                if (this.grid[this.size - 1 - i][j] !== result[i]) {
                    this.grid[this.size - 1 - i][j] = result[i];
                    moved = true;
                }
            }
        }
        
        return moved;
    }
    
    // 向左移动
    moveLeft() {
        let moved = false;
        
        for (let i = 0; i < this.size; i++) {
            // 获取行
            const row = this.grid[i].slice();
            
            // 移动并合并
            const result = this.moveAndMerge(row);
            
            // 更新网格
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] !== result[j]) {
                    this.grid[i][j] = result[j];
                    moved = true;
                }
            }
        }
        
        return moved;
    }
    
    // 向右移动
    moveRight() {
        let moved = false;
        
        for (let i = 0; i < this.size; i++) {
            // 获取行
            const row = this.grid[i].slice().reverse();
            
            // 移动并合并
            const result = this.moveAndMerge(row);
            
            // 更新网格
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][this.size - 1 - j] !== result[j]) {
                    this.grid[i][this.size - 1 - j] = result[j];
                    moved = true;
                }
            }
        }
        
        return moved;
    }
    
    // 移动并合并数组
    moveAndMerge(arr) {
        // 移除所有0
        const filtered = arr.filter(val => val !== 0);
        
        // 合并相同值
        for (let i = 0; i < filtered.length - 1; i++) {
            if (filtered[i] === filtered[i + 1]) {
                filtered[i] *= 2;
                this.score += filtered[i];
                filtered.splice(i + 1, 1);
            }
        }
        
        // 添加0填充到原始长度
        while (filtered.length < this.size) {
            filtered.push(0);
        }
        
        return filtered;
    }
    
    // 渲染游戏
    render() {
        // 清空容器
        this.tileContainer.innerHTML = '';
        
        // 更新分数
        this.updateScore();
        
        // 创建方块元素
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const value = this.grid[i][j];
                if (value !== 0) {
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${value}`;
                    tile.textContent = value;
                    
                    // 添加超大数值的特殊样式
                    if (value > 2048) {
                        tile.classList.add('tile-super');
                    }
                    
                    // 设置位置
                    tile.style.left = `${j * (100 / this.size)}%`;
                    tile.style.top = `${i * (100 / this.size)}%`;
                    
                    this.tileContainer.appendChild(tile);
                }
            }
        }
    }
    
    // 更新分数
    updateScore() {
        document.getElementById('score').textContent = this.score;
        
        // 更新最高分
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            document.getElementById('best-score').textContent = this.bestScore;
            this.saveBestScore();
        }
    }
    
    // 保存最高分到localStorage
    saveBestScore() {
        try {
            localStorage.setItem('2048-best-score', this.bestScore.toString());
        } catch (e) {
            // 忽略存储错误
        }
    }
    
    // 从localStorage加载最高分
    loadBestScore() {
        try {
            const saved = localStorage.getItem('2048-best-score');
            if (saved) {
                this.bestScore = parseInt(saved, 10);
                document.getElementById('best-score').textContent = this.bestScore;
            }
        } catch (e) {
            // 忽略读取错误
        }
    }
    
    // 检查游戏状态
    checkGameStatus() {
        // 检查是否胜利 (达到2048)
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 2048) {
                    this.showGameMessage('🎉 恭喜！你赢了！', 'game-won');
                    return;
                }
            }
        }
        
        // 检查是否游戏结束
        if (this.isGameOver()) {
            this.showGameMessage('💀 游戏结束！', 'game-over');
        }
    }
    
    // 检查游戏是否结束
    isGameOver() {
        // 检查是否有空单元格
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 0) {
                    return false;
                }
            }
        }
        
        // 检查是否可以合并
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const value = this.grid[i][j];
                
                // 检查右边
                if (j < this.size - 1 && this.grid[i][j + 1] === value) {
                    return false;
                }
                
                // 检查下面
                if (i < this.size - 1 && this.grid[i + 1][j] === value) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    // 显示游戏消息
    showGameMessage(message, type) {
        this.gameMessage.querySelector('p').textContent = message;
        this.gameMessage.className = `game-message ${type}`;
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new Game2048();
});