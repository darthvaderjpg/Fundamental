document.addEventListener("DOMContentLoaded", function() {
    const playerGreeting = document.getElementById("player-greeting");
    const highScoreEl = document.getElementById("high-score");
    const currentScoreEl = document.getElementById("current-score");
    const gameMessageEl = document.getElementById("game-message");
    const gameLogEl = document.getElementById("game-log");
    const startBtn = document.getElementById("start-btn");
    const canvas = document.getElementById("dinoCanvas");
    const ctx = canvas.getContext("2d");

    const currentPlayerName = localStorage.getItem("playerUsername") || "Player";
    if(playerGreeting) {
        playerGreeting.textContent = `Runner: ${currentPlayerName}`;
    }

    let highScore = parseInt(localStorage.getItem("dinoHighScore")) || 0;
    let score = 0;
    let isPlaying = false;
    let gameSpeed = 5;
    let animationFrameId;

    function addLog(text){
        if(!gameLogEl) return;
        const entry = document.createElement("div");
        entry.style.marginBottom = "4px";
        entry.textContent = `>${text}`;
        gameLogEl.prepend(entry);
        if(gameLogEl.children.length > 5) {
            gameLogEl.removeChild(gameLogEl.lastChild);
        }
    }

    let dino = {
        x: 50, y: 140, width: 25, height: 38, vy: 0, gravity: 0.6, jumpPower: -10, isJumping: false
    };

    let obstacles = [];
    let obstacleTimer = 0;

    function updateScoreDisplay() {
        currentScoreEl.textContent = Math.floor(score);
        highScoreEl.textContent = highScore;
        localStorage.setItem("dinoHighScore", highScore);
    }

    function spawnObstacle() {
        const height = Math.floor(Math.random() * 10) + 30;
        const width = 18;
        const type = Math.floor(Math.random() * 2); 
        obstacles.push({
            x: canvas.width, 
            y: canvas.height - height - 20, 
            width: width, 
            height: height,
            type: type
        });
    }

    function resetGame(){
        dino.y = 140;
        dino.vy = 0;
        dino.isJumping = false;
        obstacles = [];
        score = 0;
        gameSpeed = 5;
        obstacleTimer = 0;
        isPlaying = true;
        gameMessageEl.textContent = "[SYSTEM] RUNNING";
        addLog("THE 'NO INTERNET GAME' IS ACTIVE");
    }

    function jump() {
        if(!isPlaying){
            resetGame();
            gameLoop();
            return;
        }
        if(!dino.isJumping){
            dino.vy = dino.jumpPower;
            dino.isJumping = true;
        }
    }
    
    function gameLoop(){
        if(!isPlaying) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#00ff66";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - 20);
        ctx.lineTo(canvas.width, canvas.height - 20);
        ctx.stroke();

        dino.vy += dino.gravity;
        dino.y += dino.vy;

        if(dino.y > canvas.height - 20 - dino.height){
            dino.y = canvas.height - 20 - dino.height;
            dino.vy = 0;
            dino.isJumping = false;
        }

    
        ctx.fillStyle = "#00ff66";
        ctx.fillRect(dino.x + 8, dino.y + 12, 14, 18); 
        ctx.fillRect(dino.x + 16, dino.y + 2, 14, 12);  
        ctx.fillStyle = "#050505";
        ctx.fillRect(dino.x + 24, dino.y + 4, 3, 3);    
        ctx.fillStyle = "#00ff66";
        ctx.fillRect(dino.x, dino.y + 14, 8, 6);        
        

        let legTick = Math.floor(score * 0.5) % 2;
        if (legTick === 0) {
            ctx.fillRect(dino.x + 10, dino.y + 30, 3, 8);
            ctx.fillRect(dino.x + 18, dino.y + 30, 3, 5);
        } else {
            ctx.fillRect(dino.x + 10, dino.y + 30, 3, 5);
            ctx.fillRect(dino.x + 18, dino.y + 30, 3, 8);
        }

        obstacleTimer++;
        if(obstacleTimer > Math.max(40, 90 - Math.floor(score/50))) {
            spawnObstacle();
            obstacleTimer = 0;
        }

        for(let i = obstacles.length - 1; i >= 0; i--) {
            let obs = obstacles[i];
            obs.x -= gameSpeed;

   
            ctx.fillStyle = "#ffffff";
            if (obs.type === 0) {
       
                ctx.fillRect(obs.x + 5, obs.y, 6, obs.height);
                ctx.fillRect(obs.x, obs.y + 10, 4, 6);       
                ctx.fillRect(obs.x + 11, obs.y + 6, 4, 6);     
            } else {

                ctx.fillRect(obs.x + 2, obs.y + 5, 5, obs.height - 5);
                ctx.fillRect(obs.x + 10, obs.y, 5, obs.height);
                ctx.fillRect(obs.x + 7, obs.y + 12, 5, 5);   
            }

           
            if(
                dino.x < obs.x + obs.width &&
                dino.x + dino.width > obs.x &&
                dino.y < obs.y + obs.height &&
                dino.y + dino.height > obs.y
            ){
                isPlaying = false;
                gameMessageEl.textContent = "[CRASH] Connection lost!";
                addLog(`[CRASH]: ${currentPlayerName} got pricked by a cactus. Tee Hee. Final Score: ${Math.floor(score)}`);
                if (score > highScore) {
                    highScore = Math.floor(score);
                    addLog("[SYSTEM] NEW HIGH SCORE RECORDED.");
                }
                updateScoreDisplay();
                return;
            }

            if(obs.x + obs.width < 0){
                obstacles.splice(i, 1);
                score += 10;
            }
        }

        score += 0.1;
        gameSpeed = 5 + Math.floor(score / 100);

        updateScoreDisplay();
        animationFrameId = requestAnimationFrame(gameLoop);
    }

    window.addEventListener("keydown", function(e) {
        if(e.code === "Space" || e.code === "ArrowUp"){
            e.preventDefault();
            jump();
        }
    });

    canvas.addEventListener("click", function() {
        jump();
    });

    startBtn.onclick = function() {
        if(!isPlaying) {
            resetGame();
            gameLoop();
        }
    };

    updateScoreDisplay();
});