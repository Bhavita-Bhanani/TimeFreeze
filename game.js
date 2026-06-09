const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

const player = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    size: 25,
    speed: 5
};

const keys = {};
const enemies = [];

let gameStarted = false;
let gameOver = false;
let score = 0;
let startTime = 0;

window.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;

    if (!gameStarted && e.code === "Space") {
        gameStarted = true;
        startTime = Date.now();
    }

    if (gameOver && e.key.toLowerCase() === "r") {
        location.reload();
    }
});

window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});

function spawnEnemy() {
    const side = Math.floor(Math.random() * 4);

    let x, y;

    switch (side) {
        case 0:
            x = Math.random() * canvas.width;
            y = -30;
            break;

        case 1:
            x = canvas.width + 30;
            y = Math.random() * canvas.height;
            break;

        case 2:
            x = Math.random() * canvas.width;
            y = canvas.height + 30;
            break;

        default:
            x = -30;
            y = Math.random() * canvas.height;
    }

    enemies.push({
        x,
        y,
        size: 25,
        speed: 1.6
    });
}

setInterval(() => {
    if (gameStarted && !gameOver) {
        spawnEnemy();
    }
}, 1000);

function update() {

    if (!gameStarted || gameOver) return;

    let moving = false;

    if (keys["w"] || keys["arrowup"]) {
        player.y -= player.speed;
        moving = true;
    }

    if (keys["s"] || keys["arrowdown"]) {
        player.y += player.speed;
        moving = true;
    }

    if (keys["a"] || keys["arrowleft"]) {
        player.x -= player.speed;
        moving = true;
    }

    if (keys["d"] || keys["arrowright"]) {
        player.x += player.speed;
        moving = true;
    }

    player.x = Math.max(
        0,
        Math.min(canvas.width - player.size, player.x)
    );

    player.y = Math.max(
        0,
        Math.min(canvas.height - player.size, player.y)
    );

    const timeFactor = moving ? 1 : 0.15;

    enemies.forEach(enemy => {

        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;

        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
            enemy.x +=
                (dx / dist) *
                enemy.speed *
                timeFactor;

            enemy.y +=
                (dy / dist) *
                enemy.speed *
                timeFactor;
        }

        if (
            player.x < enemy.x + enemy.size &&
            player.x + player.size > enemy.x &&
            player.y < enemy.y + enemy.size &&
            player.y + player.size > enemy.y
        ) {
            gameOver = true;
        }
    });

    score = (
        (Date.now() - startTime) / 1000
    ).toFixed(1);
}

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    if (!gameStarted) {

        ctx.fillStyle = "white";

        ctx.textAlign = "center";

        ctx.font = "70px Arial";
        ctx.fillText(
            "TIME FREEZE",
            canvas.width / 2,
            canvas.height / 2 - 100
        );

        ctx.font = "30px Arial";
        ctx.fillText(
            "WASD / Arrow Keys to Move",
            canvas.width / 2,
            canvas.height / 2
        );

        ctx.fillText(
            "Avoid the Red Enemies",
            canvas.width / 2,
            canvas.height / 2 + 50
        );

        ctx.fillText(
            "Time Moves Faster When YOU Move",
            canvas.width / 2,
            canvas.height / 2 + 100
        );

        ctx.fillText(
            "Press SPACE to Start",
            canvas.width / 2,
            canvas.height / 2 + 180
        );

        return;
    }

    ctx.fillStyle = "#00AAFF";

    ctx.fillRect(
        player.x,
        player.y,
        player.size,
        player.size
    );

    ctx.fillStyle = "red";

    enemies.forEach(enemy => {
        ctx.fillRect(
            enemy.x,
            enemy.y,
            enemy.size,
            enemy.size
        );
    });

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "left";
    ctx.fillText(
        `Time: ${score}s`,
        20,
        40
    );

    if (gameOver) {

        ctx.textAlign = "center";

        ctx.font = "70px Arial";
        ctx.fillText(
            "GAME OVER",
            canvas.width / 2,
            canvas.height / 2
        );

        ctx.font = "35px Arial";
        ctx.fillText(
            `Survived ${score}s`,
            canvas.width / 2,
            canvas.height / 2 + 70
        );

        ctx.fillText(
            "Press R to Restart",
            canvas.width / 2,
            canvas.height / 2 + 130
        );
    }
}

function gameLoop() {

    update();
    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();