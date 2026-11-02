//Name: Siddarth Iyer
//Date: 11/1/26
//Rev:01
//Notes:None
document.addEventListener("DOMContentLoaded", function() {
    const playerGreeting = document.getElementById("player-greeting");
    const highScoreEl = document.getElementById("high-score");
    const currentScoreEl = document.getElementById("current-score");
    const gameMessageEl = document.getElementById("game-message");
    const gameLogEl = document.getElementById("game-log");
    const startBtn = document.getElementById("start-btn");
    const canvas = document.getElementById("flappyCanvas");
    const ctx = canvas.getContext("2d");

    const currentPlayerName = localStorage.getItem("playerUsername") || "Player";
    if (playerGreeting) {
        playerGreeting.textContent = `Pilot: ${currentPlayerName}`;
    }

    let highScore = parseInt(localStorage.getItem("flappyHighScore")) || 0;
    let score = 0;
    let isPlaying = false;
    let gameSpeed = 2.2;
    let animationFrameId;

    function addLog(text) {
        if (!gameLogEl) return;
        const entry = document.createElement("div");
        entry.style.marginBottom = "4px";
        entry.textContent = `>${text}`;
        gameLogEl.prepend(entry);
        if (gameLogEl.children.length > 5) {
            gameLogEl.removeChild(gameLogEl.lastChild);
        }
    }

    let bird = {
        x: 80,
        y: 250,
        width: 30,
        height: 24,
        gravity: 0.12,  
        lift: -3.8,     
        velocity: 0
    };

    let pipes = [];
    let pipeTimer = 0;
    const pipeWidth = 54;
    const pipeGap = 155; 
    const capHeight = 22;
    const capOverhang = 4;

    function updateScoreDisplay() {
        currentScoreEl.textContent = score;
        highScoreEl.textContent = highScore;
        localStorage.setItem("flappyHighScore", highScore);
    }

    function spawnPipe() {
        const minHeight = 40;
        const maxHeight = canvas.height - pipeGap - 70;
        const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

        pipes.push({
            x: canvas.width,
            top: topHeight,
            bottom: canvas.height - topHeight - pipeGap,
            passed: false
        });
    }

    function resetGame() {
        bird.y = 250;
        bird.velocity = 0;
        pipes = [];
        score = 0;
        gameSpeed = 2.2;
        pipeTimer = 0;
        isPlaying = true;
        gameMessageEl.textContent = "Gamma Ray'd flappy bird is flying!";
        addLog("[SYSTEM] FLIGHT IN PROGRESS");
    }

    function flap() {
        if (!isPlaying) {
            resetGame();
            gameLoop();
            return;
        }
        bird.velocity = bird.lift;
    }

    function drawBird() {
        ctx.save();
        ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
        let rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, bird.velocity * 0.08));
        ctx.rotate(rotation);

        // Bird Body (Classic Yellow)
        ctx.fillStyle = "#19f705";
        ctx.fillRect(-bird.width / 2, -bird.height / 2, bird.width, bird.height);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-bird.width / 2, -bird.height / 2, bird.width, bird.height);

        // Wing (Orange)
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(-bird.width / 4, -2, 10, 8);

        // Eye (White & Black)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(bird.width / 4 - 2, -bird.height / 3 - 2, 7, 7);
        ctx.fillStyle = "#000000";
        ctx.fillRect(bird.width / 4 + 2, -bird.height / 3, 3, 3);

        // Beak (Orange-Red)
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(bird.width / 2, -3, 8, 7);

        ctx.restore();
    }

    function drawStartScreen() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Ground Line
        ctx.strokeStyle = "#00ff66";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - 20);
        ctx.lineTo(canvas.width, canvas.height - 20);
        ctx.stroke();


        ctx.strokeStyle = "rgba(0, 255, 102, 0.4)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(0, bird.y + bird.height / 2);
        ctx.lineTo(canvas.width, bird.y + bird.height / 2);
        ctx.stroke();
        ctx.setLineDash([]);

   
        ctx.fillStyle = "#00ff66";
        ctx.font = "14px monospace";
        ctx.textAlign = "center";
        

        drawBird();
    }

    function gameLoop() {
        if (!isPlaying) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);


        bird.velocity += bird.gravity;
        bird.y += bird.velocity;


        drawBird();


        if (bird.y + bird.height >= canvas.height - 20 || bird.y <= 0) {
            endGame(`${currentPlayerName} has become fast-food. Yikes`);
            return;
        }

        ctx.strokeStyle = "#00ff66";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - 20);
        ctx.lineTo(canvas.width, canvas.height - 20);
        ctx.stroke();


        pipeTimer++;
        if (pipeTimer > 110) {
            spawnPipe();
            pipeTimer = 0;
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
            let p = pipes[i];
            p.x -= gameSpeed;


            ctx.fillStyle = "#00ff66";
            ctx.strokeStyle = "#005a00";
            ctx.lineWidth = 2;


            ctx.fillRect(p.x + capOverhang, 0, pipeWidth - (capOverhang * 2), p.top - capHeight);
            ctx.strokeRect(p.x + capOverhang, 0, pipeWidth - (capOverhang * 2), p.top - capHeight);
            ctx.fillRect(p.x, p.top - capHeight, pipeWidth, capHeight);
            ctx.strokeRect(p.x, p.top - capHeight, pipeWidth, capHeight);

            let bottomPipeY = canvas.height - p.bottom - 20;
            ctx.fillRect(p.x, bottomPipeY, pipeWidth, capHeight);
            ctx.strokeRect(p.x, bottomPipeY, pipeWidth, capHeight);
            ctx.fillRect(p.x + capOverhang, bottomPipeY + capHeight, pipeWidth - (capOverhang * 2), p.bottom);
            ctx.strokeRect(p.x + capOverhang, bottomPipeY + capHeight, pipeWidth - (capOverhang * 2), p.bottom);

     
            if (
                bird.x < p.x + pipeWidth &&
                bird.x + bird.width > p.x &&
                (bird.y < p.top || bird.y + bird.height > canvas.height - p.bottom - 20)
            ) {
                endGame(`${currentPlayerName} has been terminally diagnosed after reaching terminal velocity in the terminal`);
                return;
            }

            if (!p.passed && p.x + pipeWidth < bird.x) {
                score++;
                p.passed = true;
                gameSpeed = 2.2 + Math.floor(score / 5) * 0.15;
            }

            if (p.x + pipeWidth < 0) {
                pipes.splice(i, 1);
            }
        }

        updateScoreDisplay();
        animationFrameId = requestAnimationFrame(gameLoop);
    }

    function endGame(reason) {
        isPlaying = false;
        gameMessageEl.textContent = "[CRASH] Signal lost!";
        addLog(`[CRASH]: ${reason} Final Score: ${score}`);
        if (score > highScore) {
            highScore = score;
            addLog("[SYSTEM] NEW HIGH SCORE RECORDED.");
        }
        updateScoreDisplay();
        
        bird.y = 250;
        bird.velocity = 0;
        drawStartScreen();
    }

    window.addEventListener("keydown", function(e) {
        if (e.code === "Space" || e.code === "ArrowUp") {
            e.preventDefault();
            flap();
        }
    });

    canvas.addEventListener("click", function() {
        flap();
    });

    startBtn.onclick = function() {
        if (!isPlaying) {
            resetGame();
            gameLoop();
        }
    };

    updateScoreDisplay();
    drawStartScreen();
});