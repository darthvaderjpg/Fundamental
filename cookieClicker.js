//Name: Siddarth Iyer
//Date: 11/1/26
//Rev:01
//Notes:None
document.addEventListener("DOMContentLoaded", function() {
    const playerGreeting = document.getElementById("player-greeting");
    const cookieCountElement = document.getElementById("cookie-count");
    const cpsCountElement = document.getElementById("cps-count");
    const clickBtn = document.getElementById("click-btn");

    
    const buyCursorBtn = document.getElementById("upgrade1");
    const cursorCostEl = document.getElementById("cursor-cost");
    const cursorCountEl = document.getElementById("cursor-count");

    const buyTemuBtn = document.getElementById("upgrade2");
    const temuCostEl = document.getElementById("temu-cost");
    const temuCountEl = document.getElementById("temu-count");

    const buyGrandmaBtn = document.getElementById("upgrade3");
    const grandmaCostEl = document.getElementById("grandma-cost");
    const grandmaCountEl = document.getElementById("grandma-count");

    const buyFactoryBtn = document.getElementById("upgrade4");
    const factoryCostEl = document.getElementById("factory-cost");
    const factoryCountEl = document.getElementById("factory-count");

    const saveBtn = document.getElementById("save-btn");
    const resetBtn = document.getElementById("reset-btn");

    const currentPlayer = localStorage.getItem("playerUsername") || "Player";
    if (playerGreeting) {
        playerGreeting.textContent = `${currentPlayer}`;
    }

    
    let cookies = 0;
    let cookiesPerSecond = 0;

    
    let cursorCount = 0;
    let cursorCost = 15;

    let temuCount = 0;
    let temuCost = 50;

    let grandmaCount = 0;
    let grandmaCost = 120;

    let factoryCount = 0;
    let factoryCost = 300;

    
    function calculateCPS() {
        cookiesPerSecond = (cursorCount * 1) + (temuCount * 4) + (grandmaCount * 12) + (factoryCount * 35);
    }

    
    function saveGame() {
        const gameSave = {
            cookies,
            cursorCount, cursorCost,
            temuCount, temuCost,
            grandmaCount, grandmaCost,
            factoryCount, factoryCost
        };
        localStorage.setItem("Save", JSON.stringify(gameSave));
    }

    
    function loadGame() {
        const savedData = localStorage.getItem("Save");
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            cookies = parsedData.cookies || 0;
            cursorCount = parsedData.cursorCount || 0;
            cursorCost = parsedData.cursorCost || 15;
            temuCount = parsedData.temuCount || 0;
            temuCost = parsedData.temuCost || 50;
            grandmaCount = parsedData.grandmaCount || 0;
            grandmaCost = parsedData.grandmaCost || 120;
            factoryCount = parsedData.factoryCount || 0;
            factoryCost = parsedData.factoryCost || 300;
            calculateCPS();
        }
    }

    // UPDATE DISPLAY
    function updateDisplay() {
        cookieCountElement.textContent = Math.floor(cookies);
        cpsCountElement.textContent = cookiesPerSecond;
        
        cursorCountEl.textContent = cursorCount;
        cursorCostEl.textContent = cursorCost;

        temuCountEl.textContent = temuCount;
        temuCostEl.textContent = temuCost;

        grandmaCountEl.textContent = grandmaCount;
        grandmaCostEl.textContent = grandmaCost;

        factoryCountEl.textContent = factoryCount;
        factoryCostEl.textContent = factoryCost;
    }

   
    loadGame();
    updateDisplay();

   
    clickBtn.onclick = function() {
        cookies += 1;
        updateDisplay();
    };

    
    buyCursorBtn.onclick = function() {
        if (cookies >= cursorCost) {
            cookies -= cursorCost;
            cursorCount++;
            cursorCost = Math.floor(cursorCost * 1.5);
            calculateCPS();
            updateDisplay();
            saveGame();
        } else {
            alert("Not enough cookies for an Auto Clicker!");
        }
    };

    buyTemuBtn.onclick = function() {
        if (cookies >= temuCost) {
            cookies -= temuCost;
            temuCount++;
            temuCost = Math.floor(temuCost * 1.5);
            calculateCPS();
            updateDisplay();
            saveGame();
        } else {
            alert("Not enough cookies for a Temu Clicker!");
        }
    };

    buyGrandmaBtn.onclick = function() {
        if (cookies >= grandmaCost) {
            cookies -= grandmaCost;
            grandmaCount++;
            grandmaCost = Math.floor(grandmaCost * 1.5);
            calculateCPS();
            updateDisplay();
            saveGame();
        } else {
            alert("Not enough cookies for Grandma's Clicker!");
        }
    };

    buyFactoryBtn.onclick = function() {
        if (cookies >= factoryCost) {
            cookies -= factoryCost;
            factoryCount++;
            factoryCost = Math.floor(factoryCost * 1.5);
            calculateCPS();
            updateDisplay();
            saveGame();
        } else {
            alert("Not enough cookies for a Factory Clicker!");
        }
    };

    
    saveBtn.onclick = function() {
        saveGame();
        alert("Progress saved!");
    };

    resetBtn.onclick = function() {
        if (confirm("Are you sure you want to reset your progress?")) {
            localStorage.removeItem("Save");
            cookies = 0;
            cookiesPerSecond = 0;
            cursorCount = 0; cursorCost = 15;
            temuCount = 0; temuCost = 50;
            grandmaCount = 0; grandmaCost = 120;
            factoryCount = 0; factoryCost = 300;
            calculateCPS();
            updateDisplay();
            alert("Data wiped.");
        }
    };

    
    let saveTimer = 0;
    setInterval(function() {
        if (cookiesPerSecond > 0) {
            cookies += cookiesPerSecond;
            updateDisplay();
        }

        saveTimer++;
        if (saveTimer >= 10) {
            saveGame();
            saveTimer = 0;
        }
    }, 1000);
});