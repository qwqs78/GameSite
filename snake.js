class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('snakeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.blockSize = 20;
        this.rows = this.canvas.height / this.blockSize;
        this.cols = this.canvas.width / this.blockSize;

        this.snake = [{ x: 10, y: 10 }];
        this.direction = { x: 1, y: 0 };
        this.food = this.spawnFood();
        this.isRunning = true;

        document.addEventListener('keydown', e => this.handleKey(e));
        this.gameLoop = setInterval(() => this.update(), 150);
    }

    spawnFood() {
        return {
            x: Math.floor(Math.random() * this.cols),
            y: Math.floor(Math.random() * this.rows)
        };
    }

    handleKey(e) {
        const key = e.key;
        if (key === 'ArrowUp' && this.direction.y === 0) this.direction = { x: 0, y: -1 };
        else if (key === 'ArrowDown' && this.direction.y === 0) this.direction = { x: 0, y: 1 };
        else if (key === 'ArrowLeft' && this.direction.x === 0) this.direction = { x: -1, y: 0 };
        else if (key === 'ArrowRight' && this.direction.x === 0) this.direction = { x: 1, y: 0 };
    }

    update() {
        const head = {
            x: this.snake[0].x + this.direction.x,
            y: this.snake[0].y + this.direction.y
        };

        // 충돌 체크
        if (head.x < 0 || head.x >= this.cols || head.y < 0 || head.y >= this.rows ||
            this.snake.some(s => s.x === head.x && s.y === head.y)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        if (head.x === this.food.x && head.y === this.food.y) {
            this.food = this.spawnFood();
        } else {
            this.snake.pop();
        }

        this.draw();
    }

    gameOver() {
        clearInterval(this.gameLoop);

        const controls = document.createElement('div');
        controls.id = "game-controls";
        controls.style.marginTop = "10px";
        controls.style.textAlign = "center";

        controls.innerHTML = `
        <p style="font-weight: bold; color: red;">게임 오버!</p>
        <button onclick="restartSnakeGame()">다시 시작</button>
        <button onclick="exitSnakeGame()">게임 종료</button>
    `;

        this.canvas.parentNode.appendChild(controls);
    }
    

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 음식
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(this.food.x * this.blockSize, this.food.y * this.blockSize, this.blockSize, this.blockSize);

        // 뱀
        this.ctx.fillStyle = "green";
        this.snake.forEach(part => {
            this.ctx.fillRect(part.x * this.blockSize, part.y * this.blockSize, this.blockSize, this.blockSize);
        });
    }
}

window.startSnakeGame = function () {
    window.snakeGame = new SnakeGame();
};
window.restartSnakeGame = function () {
    document.getElementById('game-controls')?.remove();
    window.snakeGame = new SnakeGame();
};

window.exitSnakeGame = function () {
    document.getElementById('game-controls')?.remove();
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};
