window.startPoopDodgeGame = function () {
    const canvas = document.getElementById('poopCanvas');
    const ctx = canvas.getContext('2d');

    const player = { x: 180, y: 550, width: 40, height: 40, speed: 5 };
    const poops = [];
    let gameInterval;

    function spawnPoop() {
        const x = Math.random() * (canvas.width - 20);
        poops.push({ x: x, y: 0, width: 20, height: 20, speed: 3 });
    }

    function drawPlayer() {
        ctx.fillStyle = "green";
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    function drawPoops() {
        ctx.fillStyle = "brown";
        for (const poop of poops) {
            ctx.fillRect(poop.x, poop.y, poop.width, poop.height);
        }
    }

    function updatePoops() {
        for (const poop of poops) {
            poop.y += poop.speed;
        }
    }

    function detectCollision() {
        for (const poop of poops) {
            if (
                poop.x < player.x + player.width &&
                poop.x + poop.width > player.x &&
                poop.y < player.y + player.height &&
                poop.y + poop.height > player.y
            ) {
                alert("💥 피하지 못했습니다! 게임 오버!");
                clearInterval(gameInterval);
            }
        }
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function gameLoop() {
        clearCanvas();
        drawPlayer();
        drawPoops();
        updatePoops();
        detectCollision();
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft" && player.x > 0) {
            player.x -= player.speed;
        } else if (e.key === "ArrowRight" && player.x + player.width < canvas.width) {
            player.x += player.speed;
        }
    });

    gameInterval = setInterval(gameLoop, 30);
    setInterval(spawnPoop, 1000);
}
