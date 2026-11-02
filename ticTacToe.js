document.addEventListener("DOMContentLoaded", function() {
    const playerGreeting = document.getElementById("player-greeting");
    const playerScoreEl = document.getElementById("player-score");
    const cpuScoreEl = document.getElementById("cpu-score");
    const gameMessageEl = document.getElementById("game-message");
    const combatLogEl = document.getElementById("combat-log");
    const resetBtn = document.getElementById("reset-btn");
    const symbolSelect = document.getElementById("symbol-select");
    const cells = document.querySelectorAll(".ttt-cell");

    const currentPlayerName = localStorage.getItem("playerUsername") || "Player";
    if (playerGreeting) {
        playerGreeting.textContent = `Player: ${currentPlayerName}`;
    }

    let board = ["", "", "", "", "", "", "", "", ""];
    let isGameActive = true;
    let playerSymbol = "X";
    let cpuSymbol = "O";
    let currentPlayerTurn = "X"; 

    let playerScore = parseInt(localStorage.getItem("tttPlayerScore")) || 0;
    let cpuScore = parseInt(localStorage.getItem("tttCpuScore")) || 0;

    function updateScoreDisplay() {
        playerScoreEl.textContent = playerScore;
        cpuScoreEl.textContent = cpuScore;
        localStorage.setItem("tttPlayerScore", playerScore);
        localStorage.setItem("tttCpuScore", cpuScore);
    }

    function addLog(text) {
        if (!combatLogEl) return;
        const entry = document.createElement("div");
        entry.style.marginBottom = "4px";
        entry.textContent = `> ${text}`;
        combatLogEl.prepend(entry);
        if (combatLogEl.children.length > 6) {
            combatLogEl.removeChild(combatLogEl.lastChild);
        }
    }

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]            
    ];

    function checkWinner(currBoard) {
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            if (currBoard[a] && currBoard[a] === currBoard[b] && currBoard[a] === currBoard[c]) {
                return currBoard[a];
            }
        }
        if (!currBoard.includes("")) return "tie";
        return null;
    }

    function checkWinOrDraw() {
        let winner = checkWinner(board);
        if (!winner) return false;

        isGameActive = false;
        let winningCombo = winningConditions.find(cond => 
            board[cond[0]] && board[cond[0]] === board[cond[1]] && board[cond[0]] === board[cond[2]]
        );

        if (winner === playerSymbol) {
            playerScore++;
            gameMessageEl.textContent = `You [${playerSymbol}] beat Jimmothy! Makes sense, he's like 5 years old.`;
            addLog(`[SYSTEM]: ${currentPlayerName} [${playerSymbol}] defeated Jimmothy`);
        } else if (winner === cpuSymbol) {
            cpuScore++;
            gameMessageEl.textContent = `Uh Oh, CPU Jimmothy [${cpuSymbol}] beat you. You gonna take that?`;
            addLog(`[SYSTEM]: ${currentPlayerName} has a skill issue`);
        } else {
            gameMessageEl.textContent = `Stalemate.`;
            addLog(`[SYSTEM]: STALEMATE`);
        }

        updateScoreDisplay();
        if (winningCombo) highlightWinningCells(winningCombo);
        return true;
    }

    function highlightWinningCells(combo) {
        combo.forEach(index => {
            cells[index].style.borderColor = "#ffff33";
            cells[index].style.boxShadow = "0 0 15px rgba(255, 255, 51, 0.7)";
        });
    }

    function handleCellClick(e) {
        const index = e.target.getAttribute("data-index");

        if (!isGameActive || board[index] !== "" || currentPlayerTurn !== playerSymbol) {
            return;
        }

        makeMove(index, playerSymbol);

        if (!checkWinOrDraw()) {
            currentPlayerTurn = cpuSymbol;
            gameMessageEl.textContent = "[SYSTEM] CPU Jimmothy is using his singular braincell...";
            setTimeout(cpuMove, 600);
        }
    }

    function makeMove(index, symbol) {
        board[index] = symbol;
        cells[index].textContent = symbol;
       
        if (symbol === playerSymbol) {
            cells[index].classList.add("player-mark");
        } else {
            cells[index].classList.add("cpu-mark");
        }
        addLog(`Cell [${index}] claimed by [${symbol}]`);
    }

    function findBestMove() {
        let bestScore = -Infinity;
        let bestMove = null;

        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = cpuSymbol;
                let score = minimax(board, 0, false);
                board[i] = "";
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        return bestMove;
    }

    function minimax(currBoard, depth, isMaximizing) {
        let result = checkWinner(currBoard);
        if (result === cpuSymbol) return 10 - depth;
        if (result === playerSymbol) return depth - 10;
        if (result === "tie") return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < currBoard.length; i++) {
                if (currBoard[i] === "") {
                    currBoard[i] = cpuSymbol;
                    let score = minimax(currBoard, depth + 1, false);
                    currBoard[i] = "";
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < currBoard.length; i++) {
                if (currBoard[i] === "") {
                    currBoard[i] = playerSymbol;
                    let score = minimax(currBoard, depth + 1, true);
                    currBoard[i] = "";
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function cpuMove() {
        if (!isGameActive) return;

        let emptyCells = [];
        board.forEach((val, idx) => {
            if (val === "") emptyCells.push(idx);
        });

        if (emptyCells.length === 0) return;

        let chosenIndex;
       
        if (Math.random() < 0.5) {
            chosenIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            addLog("[SYSTEM]: Jimmothy got distracted and picked a random spot.");
        } else {
            chosenIndex = findBestMove();
            if (chosenIndex === null) {
                chosenIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            }
            addLog("[SYSTEM]: Jimmothy actually used his brain for a second.");
        }

        makeMove(chosenIndex, cpuSymbol);

        if (!checkWinOrDraw()) {
            currentPlayerTurn = playerSymbol;
            gameMessageEl.textContent = `Turn: Your move [${playerSymbol}]`;
        }
    }

    symbolSelect.onchange = function() {
        playerSymbol = symbolSelect.value;
        cpuSymbol = playerSymbol === "X" ? "O" : "X";
        resetBoard();
    };

    cells.forEach(cell => {
        cell.addEventListener("click", handleCellClick);
    });

    function resetBoard() {
        board = ["", "", "", "", "", "", "", "", ""];
        isGameActive = true;
        currentPlayerTurn = "X"; 
        gameMessageEl.textContent = `Turn: ${currentPlayerTurn === playerSymbol ? "Your move" : "Jimmothy's move"} [${currentPlayerTurn}]`;
        addLog("[SYSTEM]: Board Reset");

        cells.forEach(cell => {
            cell.textContent = "";
            cell.classList.remove("player-mark", "cpu-mark");
            cell.style.borderColor = "#ffffff";
            cell.style.boxShadow = "none";
        });
        
        if (currentPlayerTurn !== playerSymbol) {
            setTimeout(cpuMove, 500);
        }
    }

    resetBtn.onclick = resetBoard;

    updateScoreDisplay();
});