class Tetris {
    constructor() {
        this.canvas = document.getElementById('tetrisCanvas');
        this.context = this.canvas.getContext('2d');
        this.rows = 20;
        this.cols = 10;
        this.grid = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
        this.isRunning = true;
        this.blockSize = 40; // 고정 크기

        this.canvas.width = this.cols * this.blockSize;
        this.canvas.height = this.rows * this.blockSize;


        this.TETROMINOS = [
            [[1, 1, 1], [0, 1, 0]], // T 모양
            [[1, 1], [1, 1]], // O 모양
            [[1, 1, 0], [0, 1, 1]], // Z 모양
            [[0, 1, 1], [1, 1, 0]], // S 모양
            [[1, 1, 1, 1]], // I 모양
            [[1, 1, 1], [1, 0, 0]], // L 모양
            [[1, 1, 1], [0, 0, 1]]  // J 모양
        ];

        this.currentPiece = this.getRandomPiece(); // 랜덤 블록 생성
        this.start();
    }

    start() {
        document.addEventListener("keydown", (e) => this.handleKeyPress(e));
        requestAnimationFrame((t) => this.loop(t));
    }

    getRandomPiece() {
        const randomIndex = Math.floor(Math.random() * this.TETROMINOS.length);
        return { x: 4, y: 0, shape: this.TETROMINOS[randomIndex] };
    }


    handleKeyPress(event) {
        if (event.key === "ArrowLeft") this.move(-1);
        if (event.key === "ArrowRight") this.move(1);
        if (event.key === "ArrowDown") this.drop();
        if (event.key === "ArrowUp") this.rotate();
    }

    move(dir) {
        if (!this.collision(dir, 0)) {
            this.currentPiece.x += dir;
        }
    }

    drop() {
        if (!this.collision(0, 1)) {
            this.currentPiece.y += 1;
        } else {
            this.placeBlock();
            this.newPiece(); // 새로운 블록 생성
            if (this.collision(0, 0)) { // 새 블록이 겹치면 게임 오버
                alert("Game Over!");
                this.resetGame();
            }
        }
    }



    rotate() {
        let newShape = this.currentPiece.shape[0].map((_, i) =>
            this.currentPiece.shape.map(row => row[i]).reverse()
        );

        let oldShape = this.currentPiece.shape;
        this.currentPiece.shape = newShape;

        if (this.collision(0, 0)) {
            this.currentPiece.shape = oldShape; // 충돌 시 회전 취소
        }
    }
    resetGame() {
        this.grid = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
        this.currentPiece = this.getRandomPiece();
    }


    collision(offsetX, offsetY) {
        return this.currentPiece.shape.some((row, rIdx) => {
            return row.some((cell, cIdx) => {
                if (cell) {
                    let newX = this.currentPiece.x + cIdx + offsetX;
                    let newY = this.currentPiece.y + rIdx + offsetY;

                    return (
                        newY >= this.rows ||
                        newX < 0 || newX >= this.cols ||
                        (newY >= 0 && this.grid[newY][newX])
                    );
                }
                return false;
            });
        });
    }

    placeBlock() {
        this.currentPiece.shape.forEach((row, rIdx) => {
            row.forEach((cell, cIdx) => {
                if (cell) {
                    let y = this.currentPiece.y + rIdx;
                    let x = this.currentPiece.x + cIdx;
                    if (y >= 0 && y < this.rows && x >= 0 && x < this.cols) {
                        this.grid[y][x] = 1;
                    }
                }
            });
        });

        this.checkLines();
        this.newPiece();
    }

    newPiece() {
        this.currentPiece = this.getRandomPiece();
    }

    checkLines() {
        for (let y = this.rows - 1; y >= 0; y--) {
            if (this.grid[y].every(cell => cell !== 0)) {
                this.grid.splice(y, 1);
                this.grid.unshift(Array(this.cols).fill(0));
            }
        }
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.grid.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    this.context.fillStyle = "blue";
                    this.context.fillRect(
                        x * this.blockSize,
                        y * this.blockSize,
                        this.blockSize,
                        this.blockSize
                    );
                }
            });
        });

        this.currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    this.context.fillStyle = "red";
                    this.context.fillRect(
                        (this.currentPiece.x + x) * this.blockSize,
                        (this.currentPiece.y + y) * this.blockSize,
                        this.blockSize, this.blockSize
                    );

                }
            });
        });
    }

    loop(timestamp) {
        if (!this.isRunning) return;

        if (!this.lastTime) this.lastTime = timestamp;
        const delta = timestamp - this.lastTime;

        if (delta > this.dropInterval) {
            this.drop();
            this.lastTime = timestamp;
        }

        this.draw();
        requestAnimationFrame((t) => this.loop(t));
    }

    stop() {
        this.isRunning = false;
    }
}


window.startTetris = function () {
    console.log("Tetris game started!");
    window.tetrisGame = new Tetris();  // Tetris 객체 생성
};

window.stopTetris = function () {
    console.log("Tetris game stopped!");
    if (window.tetrisGame) {
        window.tetrisGame.stop();  // stop() 메서드를 추가해서 게임 루프 정지
    }
};


