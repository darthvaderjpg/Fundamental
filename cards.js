document.addEventListener("DOMContentLoaded", function() {
    // DOM Elements
    const playerGreeting = document.getElementById("player-greeting");
    const chipCountingEl = document.getElementById("chip-count");
    const currentBetEl = document.getElementById("current-bet");
    const dealerCardsEl = document.getElementById("dealer-cards");
    const playerCardsEl = document.getElementById("player-cards");
    const dealerScoreEl = document.getElementById("dealer-score");
    const playerScoreEl = document.getElementById("player-score");
    const gameMessageEl = document.getElementById("game-message");
    const playerCapturedCountEl = document.getElementById("player-captured-count");
    const dealerCapturedCountEl = document.getElementById("dealer-captured-count");
    const combatLogEl = document.getElementById("combat-log");

    const dealBtn = document.getElementById("deal-btn");
    const hitBtn = document.getElementById("hit-btn");
    const standBtn = document.getElementById("stand-btn");
    const compareBtn = document.getElementById("compare-btn");
    const cancelCompareBtn = document.getElementById("cancel-compare-btn");

    const bettingControls = document.getElementById("betting-controls");
    const actionControls = document.getElementById("action-controls");
    const compareSelection = document.getElementById("compare-selection");

    
    const currentPlayer = localStorage.getItem("playerUsername") || "Player";
    if (playerGreeting) {
        playerGreeting.textContent = `Gambler: ${currentPlayer}`;
    }
    

    let chips = parseInt(localStorage.getItem("terminalChips")) || 500;
    let bet = 50;

    let deck = [];
    let playerHand = [];
    let dealerHand = [];
    let playerCaptured = []; 
    let dealerCaptured = []; 
    let gameOver = true;
    let comparingSelection = false;

    // Terminal Logging Helper
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
    
    function updateDisplay() {
        if (chipCountingEl) chipCountingEl.textContent = chips;
        if (currentBetEl) currentBetEl.textContent = bet;
        if (playerCapturedCountEl) playerCapturedCountEl.textContent = playerCaptured.length;
        if (dealerCapturedCountEl) dealerCapturedCountEl.textContent = dealerCaptured.length;
        localStorage.setItem("terminalChips", chips);
    }

    function getCardWeight(val) {
        if (val === 'A') return 14;
        if (val === 'K') return 13;
        if (val === 'Q') return 12;
        if (val === 'J') return 11;
        return parseInt(val);
    }

    function createDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        deck = [];
        for (let suit of suits) {
            for (let val of values) {
                deck.push({ suit, val, weight: getCardWeight(val) });
            }
        }
        
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }   

    function calculateHandValue(hand) {
        let sum = 0;
        let aces = 0;
        for (let card of hand) {
            if (card.val === 'A') {
                aces++;
                sum += 11;
            } else if (['K', 'Q', 'J', '10'].includes(card.val)) {
                sum += 10;
            } else {
                sum += parseInt(card.val);
            }
        }
        while (sum > 21 && aces > 0) {
            sum -= 10;
            aces--;
        }
        return sum;
    }
    
    function renderHands(hideDealerCards = true) {
        // Player cards rendering
        if (comparingSelection) {
            playerCardsEl.innerHTML = playerHand.map((c, index) => {
                const colorClass = ['♥','♦'].includes(c.suit) ? 'card-red' : 'card-black';
                return `<div class="card-box ${colorClass} clickable-card" onclick="window.selectCompareCard(${index})">${c.val} ${c.suit}</div>`;
            }).join('');            
        } else {
            playerCardsEl.innerHTML = playerHand.map(c => {
                const colorClass = ['♥','♦'].includes(c.suit) ? 'card-red' : 'card-black';
                return `<div class="card-box ${colorClass}">${c.val} ${c.suit}</div>`;
            }).join('');
        }
        playerScoreEl.textContent = calculateHandValue(playerHand);
        
        if (hideDealerCards) {
            dealerCardsEl.innerHTML = dealerHand.map(() => `
                <div class="card-box card-black">[ # ]</div>
            `).join('');
            dealerScoreEl.textContent = calculateHandValue(dealerHand); 
        } else {
            dealerCardsEl.innerHTML = dealerHand.map(c => {
                const colorClass = ['♥','♦'].includes(c.suit) ? 'card-red' : 'card-black';
                return `<div class="card-box ${colorClass}">${c.val} ${c.suit}</div>`;
            }).join('');
            dealerScoreEl.textContent = calculateHandValue(dealerHand);
        }
    }
    
    dealBtn.onclick = function() {
        if (chips < bet) {
            gameMessageEl.textContent = "Insufficient chips!";
            addLog("ERROR: Deal failed due to insufficient chips.");
            return;
        }
        chips -= bet;
        updateDisplay();

        createDeck();
        playerHand = [deck.pop(), deck.pop()];
        dealerHand = [deck.pop(), deck.pop()];
        playerCaptured = [];
        dealerCaptured = [];
        gameOver = false;
        comparingSelection = false;

        gameMessageEl.textContent = "Cards dealt. Make your move!";
        addLog(`New hand dealt. Bet placed: ${bet} chips.`);
        
        playerScoreEl.textContent = calculateHandValue(playerHand);
        dealerScoreEl.textContent = calculateHandValue(dealerHand);

        renderHands(true);

        bettingControls.style.display = "none";
        actionControls.style.display = "block";
        if (compareSelection) compareSelection.style.display = "none";
    };

    hitBtn.onclick = function() {
        if (gameOver || comparingSelection) return;
        const drawn = deck.pop();
        playerHand.push(drawn);
        renderHands(true);
        addLog(`Hit! Drew ${drawn.val}${drawn.suit}. Score: ${calculateHandValue(playerHand)}`);

        if (calculateHandValue(playerHand) > 21) {
            gameMessageEl.textContent = "BUSTED! Hand exceeded 21.";
            addLog("BUSTED! Operative exceeded 21.");
            gameOver = true;
            renderHands(false); 
            endGameCleanup();
        }
    };

    standBtn.onclick = function() {
        if (gameOver || comparingSelection) return;
        gameOver = true;
        gameMessageEl.textContent = "Dealer's turn... resolving hand step-by-step.";
        addLog("Stand Command used. Resolving dealer AI draw sequence.");

        let dealerTurnInterval = setInterval(() => {
            if (calculateHandValue(dealerHand) < 17) {
                const dDrawn = deck.pop();
                dealerHand.push(dDrawn);
                renderHands(false);
                gameMessageEl.textContent = "Dealer draws a card...";
                addLog(`Dealer drew ${dDrawn.val}${dDrawn.suit}. Score: ${calculateHandValue(dealerHand)}`);
            } else {
                clearInterval(dealerTurnInterval);
                renderHands(false);
                determineWinner();
                endGameCleanup();
            }
        }, 800);
    };

    compareBtn.onclick = function() {
        if (gameOver || playerHand.length === 0) return;
        comparingSelection = true;
        actionControls.style.display = "none";
        if (compareSelection) compareSelection.style.display = "block";
        gameMessageEl.textContent = "Select a card from your hand to compare with the Dealer!";
        addLog("Choose a card to pit against the dealer.");
        renderHands(true);
    };

    if (cancelCompareBtn) {
        cancelCompareBtn.onclick = function() {
            if (!comparingSelection) return;
            comparingSelection = false;
            if (compareSelection) compareSelection.style.display = "none";
            actionControls.style.display = "block";
            gameMessageEl.textContent = "Compare cancelled. Hit, Stand, or Compare again.";
            addLog("Compare mode cancelled by operative.");
            renderHands(true);
        };
    }

    window.selectCompareCard = function(index) {
        if (!comparingSelection) return;

        const playerCard = playerHand.splice(index, 1)[0];
        comparingSelection = false;
        if (compareSelection) compareSelection.style.display = "none";
        actionControls.style.display = "block";

        executeCompare(playerCard);
    };

    function executeCompare(playerCard) {
        const dealerIntent = Math.random() < 0.5; 

        dealerHand.sort((a, b) => a.weight - b.weight);

        let dealerCard;
        let dealerCardIndex;
        if (dealerIntent) {
            dealerCardIndex = dealerHand.length - 1; 
            dealerCard = dealerHand.splice(dealerCardIndex, 1)[0];
            gameMessageEl.textContent = `[COMPARE] Dealer plays OFFENSIVE (trying to beat ${playerCard.val}${playerCard.suit})!`;
            addLog(`[COMPARE] You played ${playerCard.val}${playerCard.suit} vs Dealer OFFENSIVE.`);
        } else {
            dealerCardIndex = 0; 
            dealerCard = dealerHand.splice(dealerCardIndex, 1)[0];
            gameMessageEl.textContent = `[COMPARE] Dealer plays SABOTAGE (trying to lose to ${playerCard.val}${playerCard.suit})!`;
            addLog(`[COMPARE] You played ${playerCard.val}${playerCard.suit} vs Dealer SABOTAGE.`);
        }

        setTimeout(() => {
            resolveCompare(playerCard, dealerCard);
        }, 1500);
    }
   
    function resolveCompare(pCard, dCard) {
        let resultMsg = `You played ${pCard.val}${pCard.suit} vs Dealer's ${dCard.val}${dCard.suit}. `;

        if (pCard.weight === dCard.weight) {
            gameMessageEl.textContent = resultMsg + "DRAW! Same value. Play another card!"; 
            addLog("DRAW! Values matched. Replay card.");
            comparingSelection = true;
            if (compareSelection) compareSelection.style.display = "block";
            renderHands(true);
            return;
        }
        
        let playerWon = pCard.weight > dCard.weight;

        if (playerWon) {
            playerCaptured.push(pCard, dCard);
            gameMessageEl.textContent = resultMsg + `You captured ${dCard.val}${dCard.suit} + your card back! (+50 chips)`;
            addLog(`Captured ${dCard.val}${dCard.suit} + bonus.`);
            chips += 50;
        } else {
            dealerCaptured.push(dCard, pCard);
            gameMessageEl.textContent = resultMsg + `The House seized your ${pCard.val}${pCard.suit} and kept their own.`;
            addLog(`House seized ${pCard.val}${pCard.suit}.`);
            chips = Math.max(0, chips - 25);
        }
        updateDisplay();
        renderHands(true);
    }

    function determineWinner() {
        const pScore = calculateHandValue(playerHand);
        const dScore = calculateHandValue(dealerHand);

        let captureBonus = (playerCaptured.length - dealerCaptured.length) * 15;

        if (pScore > 21) {
            gameMessageEl.textContent = "Busted! House wins. You should probably stop gambling now. Or not. Don't listen to me";
            addLog("Hand Result: Busted! House wins.");
        } else if (dScore > 21) {
            gameMessageEl.textContent = `The Dealer Busted! ${currentPlayer} wins!`;
            addLog(`Hand Result: Dealer Busted! ${currentPlayer} wins.`);
            chips += (bet * 2) + captureBonus;
        } else if (pScore > dScore) {
            gameMessageEl.textContent = `${currentPlayer} wins the hand!`;
            addLog(`Hand Result: ${currentPlayer} wins hand.`);
            chips += (bet * 2) + captureBonus;
        } else if (pScore < dScore) {
            gameMessageEl.textContent = "House Wins.";
            addLog("Hand Result: House wins hand.");
        } else {
            gameMessageEl.textContent = "PUSH. Bets returned.";
            addLog("Hand Result: PUSH.");
            chips += bet + captureBonus;
        }
        updateDisplay();
    }

    function endGameCleanup() {
        actionControls.style.display = "none";
        bettingControls.style.display = "block";
        comparingSelection = false;
        if (compareSelection) compareSelection.style.display = "none";
        
        if (chips <= 0) {
            chips = 500;
            gameMessageEl.textContent += " Here's 500 more chips to supply your critical Gambling Addiction";
            addLog(`[CRITICAL]+500 applied to support ${currentPlayer}'s gambling addiction`);
            updateDisplay();
        }
    }

    updateDisplay();
});