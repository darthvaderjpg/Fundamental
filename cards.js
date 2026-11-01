document.addEventListener("DOMContentLoaded"), function() {
    const playerGreeting = document.getElementById("player-greeting");
    const chipCountingEl = document.getElmementById("chip-count");
    const currentBetEl = document.getElementById("current-bet");
    const dealerCardsEl = document.getElementById("dealer-cards");
    const playerCardsEl = document.getElementById("player-cards");
    const dealerScoreEl = document.getElementById("dealer-score");
    const playerScoreEl = document.getElementById("player-score");
    const gameMessageEl = document.getElementById("game-message");

    const dealBtn = document.getElementById("deal-btn");
    const hitBtn = document.getElementById("hit-btn");
    const standBtn = document.getElementById("stand-btn");
    const compareBtn = document.getElementById("compare-btn");

    const bettingControls = document.getElementById("betting-controls");
    const actionControls = document.getElementById("action-controls");
    const compareSelection = document.getElementById("compare-selection")

    const currentPlayer = localStorage.getItem("playerUsername") || "Player";
    if(playerGreeting) {
        playerGreeting.textContent = 'Gambler: ${currentPlayer}';
    }
    
    let chips = parseInt(localStorage.getItem("chips")) || 500;
    let bet = 50;

    let deck = [];
    let playerHand = []
    let dealerHand = []
    let gameOver = true;
    let comparingSelection = false;

    function updateDisplay() {
        chipCountingEl.textContent = chips;
        currentBetEl.textContent = bet;
        localStorage.setItem("chips", chips);
    }

    function createDeck(){
        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        deck = [];
        for(let suit of suits){
            for(let val of values){
                deck.push({suit, val, weight: getCardWeight(val)});
            }
        }
    }
    for(let i = deck.length - 1; i>0; i--){
        const j = Math.floor(Math.random() * (i +1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function getCardWeight(val){
    if(val === 'A') return 14;
    if(val === 'K') return 13;
    if(val === 'Q') return 12;
    if(val === 'J') return 11;
    return parseInt(val);
}   

function calculateHandValue(Head){
        let sum = 0;
        let aces =0;
        for(let card of hand){
            if(card.val === 'A'){
                aces++;
                sum+=11;
            } else if(['K','Q', 'J', '10'].includes(cards.val)) {
                sum+= 10;
            } else {
                sum+= parseInt(card.val);
            }
        }
        while(sum > 21 && aces > 0){
            sum -= 10;
            aces--;
        }
        return sum
}

function renderHands(hideDealerSEcondCard = true){
    if(comparingSelection) {
        playerCardsEl.innerHTML = playerHand.map((c, index) =>`
                <div class="card-box clickable-card" onclick="window.selectClashCard(${index})" style="color: ${['♥','♦'].includes(c.suit)?'#ff3333':'#ffffff'}"> ${c.val}${c.suit} </div>`).join('');            
    } else {
       playerCardsEl.innerHTML = playerHand.map(c => `
                <div class="card-box" style="color: ${['♥','♦'].includes(c.suit)?'#ff3333':'#ffffff'}"> ${c.val}${c.suit} </div> `).join('');
    }
}
    playerScoreEl.textContent = calculateHandValue(playerHand);

    if(hideDealerSecondCard && dealerHand.length > 1){
        dealerCardsEl.innerHTML = `
                <div class="card-box" style="color: ${['♥','♦'].includes(dealerHand[0].suit)?'#ff3333':'#ffffff'}">${dealerHand[0].val}${dealerHand[0].suit}</div> <div class="card-box">[?]</div>`
} else {
    dealerCardsEl.innerHTML = dealerHand.map(c => `
                <div class="card-box" style="color: ${['♥','♦'].includes(c.suit)?'#ff3333':'#ffffff'}">${c.val}${c.suit}</div>`).join('');
            dealerScoreEl.textContent = calculateHandValue(dealerHand);
        
}

dealBtn.onclick = function(){
    if(chips <bet){
        gameMessageEl.textContent = "Insufficient chips";
        return;
    }
    chips -= bet;
    updateDisplay;

    createDeck();
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    gameOver = false;
    comparingSelection = false;

    gameMessageEl.textContent = "Cards dealt. Hit, Stand, or Compare";
    renderHands(true);

    bettingControls.style.display = "none";
    actionControls.style.display = "block";
    comparingSelection.style.display = "none";
};

hitBtn.onclick = function(){
    if(gameOver || comparingSelection) return;
    playerHand.push(deck.pop());
    renderHands(true);

    if(calculateHandValue(playerHand) > 21){
        gameMessageEl.textContent = "BUSTED! Hand exceeded 21. Sucks to suck.";
        gameOver = true;
        endGameCleanup();
    }
};

    standBtn.onclick = function() {
        if(gameOver || selectingForClash) return;
        gamemover = true;

        while(calculatedHandValue(dealerHand) < 17){
            dealerHand.push(deck.pop());
        }

        renderHands(false);
        determineWinner();
        endGameCleanup();
    };

    compareBtn.onclick = function() {
        if(gameOver || playerHand.length ===0) return;
        comparingSelection = true;
        actionControls.style.display = "none";
        
    }
