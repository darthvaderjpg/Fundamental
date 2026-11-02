console.log("Minigames is currently running");

//Current Minigame ideas:
/*
* just means that these are the minigames I will be prioritizing
- means I'm done
1. *Translator -
2. *Cookie Clicker - 
3. *Cards - 
    for cards there will be two objectives:
    a. Either play a card higher than the computer's card
    b. get 21 cards without going over 21 so essentially drawing
4. *Tic-Tac-Toe - 
5. Bookshelf Sorting
6. *Dino Runner
7. Flappy Bird
8. Snake
9. Enldess Runner

*/

const submitBtn = document.getElementById("submit");
const usernameInput = document.getElementById("myText");
const loginDiv = document.getElementById("login");
const minigamesDiv = document.getElementById("minigames");
const heading = document.getElementById("H1");


const savedUsername = localStorage.getItem("playerUsername");

if (savedUsername) {
    
    heading.textContent = `Welcome back, ${savedUsername}!`;
    if (loginDiv) loginDiv.style.display = "none";
    if (minigamesDiv) minigamesDiv.style.display = "block";
}


if (submitBtn) {
    submitBtn.onclick = function() {
        let username = usernameInput.value.trim();

        
        if (username === "") {
            submitBtn.textContent = "Please enter a username";
            submitBtn.style.color = "#ff0000";
            return;
        }

        
        localStorage.setItem("playerUsername", username);

        
        heading.textContent = `Welcome to Fundamental Minigames, ${username}!`;

       
        loginDiv.style.display = "none";
        minigamesDiv.style.display = "block";
    };
}