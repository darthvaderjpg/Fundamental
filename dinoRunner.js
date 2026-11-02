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
        playerGreeting.textContent = `Runner: ${currentPlayername}`;
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
        if(gameLogEl.children.length>5); {
            gameLogEl.removeChild(gameLogEl.lastChild);
       }
    }

    let dino = {
        x:50, y:140, width:25, height: 35, vy:0, gravity: 0.6, jumpPower: -10, isJumping: false

    };

    let obstacles = []
    let obstacleTimer = 0;

    function updateScoreDisplay() {
        currentScoreEl.textContent = Math.floor(score);
        highScoreEl.textContent = highScore;
        localStorage.sitItem("dinoHighScore", highScore);
    }

    function spawnObstacle() {
        const height = Math.floor(Math.random() * 20) + 25;
        const width = 15;
        obstacles.push({
            x: canvas.width, y: canvas.height - height - 20, width: width, height: height

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
        gameMessageEl.textContent = "[SYSTEM] RUNNING"
        addLog("THE 'NO INTERNET GAME' ")
    }
    
    function gameLoop(){
        if(!isPlaying) return;

        ctx.clearRect(0,0,canvas.width, canvas.height);

        ctx.StrokeStyle = 
    }

});