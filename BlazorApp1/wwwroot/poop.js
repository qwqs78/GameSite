let poopGameState = {
    isRunning: true,
    animationId: null
};
let score = 0;

window.startPoopDodgeGame = function () {
    const canvas = document.getElementById("poopCanvas");
    const ctx = canvas.getContext("2d");

    const player = {
        x: 180,
        y: 550,
        width: 40,
        height: 40,
        speed: 5
    };

    let poop = {
        x: Math.random() * 360,
        y: 0,
        width: 30,
        height: 30,
        speed: 3
    };

    document.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft" && player.x > 0) player.x -= player.speed;
        if (e.key === "ArrowRight" && player.x < canvas.width - player.width) player.x += player.speed;
    });

    function drawPlayer() {
        ctx.fillStyle = "green";
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    function drawPoop() {
        ctx.fillStyle = "brown";
        ctx.fillRect(poop.x, poop.y, poop.width, poop.height);
    }

    function drawScore() {
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("점수: " + score, 10, 25);
    }

    function detectCollision() {
        return (
            player.x < poop.x + poop.width &&
            player.x + player.width > poop.x &&
            player.y < poop.y + poop.height &&
            player.y + player.height > poop.y
        );
    }

    function resetPoop() {
        poop.x = Math.random() * (canvas.width - poop.width);
        poop.y = 0;
        poop.speed += 0.2; // 난이도 증가
        score++;
    }
    function showGameOverButtons() {
        const btns = document.getElementById("gameOverButtons");
        if (btns) btns.style.display = "block";
    }


    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawPlayer();
        drawPoop();
        drawScore();

        poop.y += poop.speed;

        if (detectCollision()) {
            poopGameState.isRunning = false;
            showGameOverButtons();
            alert("💥 게임 오버 당신의 최종 점수: " + score);
            return;
        }


        if (poop.y > canvas.height) {
            resetPoop();
        }

        poopGameState.animationId = requestAnimationFrame(update);
    }

    update();
};
window.restartPoopDodgeGame = function () {
    cancelAnimationFrame(poopGameState.animationId);
    poopGameState.isRunning = false;

    score = 0;

    const btns = document.getElementById("gameOverButtons");
    if (btns) btns.style.display = "none";

    startPoopDodgeGame(); // 재시작
};
window.endPoopDodgeGame = function () {
    poopGameState.isRunning = false;
    cancelAnimationFrame(poopGameState.animationId);

    const ctx = document.getElementById("poopCanvas").getContext("2d");
    ctx.clearRect(0, 0, 400, 600);
    ctx.font = "30px Arial";
    ctx.fillText("게임 종료됨", 100, 300);

    const btns = document.getElementById("gameOverButtons");
    if (btns) btns.style.display = "none";
};


