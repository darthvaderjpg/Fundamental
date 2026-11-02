//Name: Siddarth Iyer
//Date: 11/1/26
//Rev:01
//Notes:None
document.addEventListener("DOMContentLoaded", function() {
    const greetingEL = document.getElementById("player-greeting");
    const puzzleEl = document.getElementById("binary");
    const answerInput = document.getElementById("translation"); 
    const guessBtn = document.getElementById("guess");            
    const feedbackEl = document.getElementById("result");         
    const scoreEl = document.getElementById("score");             

    // Load player username
    const currentPlayer = localStorage.getItem("playerUsername") || "Player";
    if (greetingEL) {
        greetingEL.textContent = `Welcome to the Translator Minigame, ${currentPlayer}!`;
    }

    let currentWord = "";
    let score = 0;

    function textToBinary(text) {
        let binaryresult = "";
        for (let i = 0; i < text.length; i++) {
            let binaryChar = text.charCodeAt(i).toString(2);
            binaryChar = binaryChar.padStart(8, '0');
            binaryresult += binaryChar + " ";
        }
        return binaryresult.trim();
    }

    function generateRandomWord() {
        const characters = "abcdefghijklmnopqrstuvwxyz";
        const wordLength = Math.floor(Math.random() * 5) + 3; // Random length between 3 and 7
        let randomWord = "";
        for (let i = 0; i < wordLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomWord += characters[randomIndex];
        }
        return randomWord;
    }

    function nextRound() {
        if (answerInput) answerInput.value = "";
        if (feedbackEl) feedbackEl.textContent = "";
        currentWord = generateRandomWord();

        const binaryVersion = textToBinary(currentWord);
        if (puzzleEl) puzzleEl.textContent = binaryVersion;

        console.log(`Current word: ${currentWord}, Binary: ${binaryVersion}`);
    }

    if (guessBtn) {
        guessBtn.onclick = function() {
            const playerGuess = answerInput.value.trim().toLowerCase();

            if (playerGuess === "") {
                feedbackEl.textContent = "Please enter an answer";
                feedbackEl.style.color = "#d9b00a";
                return;
            }

            if (playerGuess === currentWord) {
                feedbackEl.textContent = "Correct! Nice Job";
                feedbackEl.style.color = "#00ff00";
                score++;
                if (scoreEl) scoreEl.textContent = score; 
                setTimeout(nextRound, 2000); 
            } else {
                feedbackEl.textContent = "Incorrect. Try again.";
                feedbackEl.style.color = "#ff0000";
            }
        };
    }

    // Start the game loop
    nextRound();
});