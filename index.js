console.log("Minigames is currently running");




//Current Minigame ideas:
/*
* just means that these are the minigames I will be prioritizing
1. *Translator
2. *Cookie Clicker
3. *Cards
    for cards there will be two objectives:
    a. Either play a card higher than the computer's card
    b. get 21 cards without going over 21 so essentially drawing
4. *Tic-Tac-Toe
5. Bookshelf Sorting
6. *Dino Runner
7. Flappy Bird
8. Snake
9. Enldess Runner

*/

console.log("Minigames is currently running");

const submitBtn = document.getElementById("submit");
const usernameInput = document.getElementById("myText");
const loginDiv = document.getElementById("login");
const minigamesDiv = document.getElementById("minigames");
const heading = document.getElementById("H1");

submitBtn.onclick = function() {
    let username = usernameInput.value.trim();

    // Make sure they typed something
    if (username === "") {
        window.alert("Please enter a username first!");
        return;
    }

    // Update the welcome text
    heading.textContent = `Welcome to Fundamental Minigames, ${username}!`;

    // Save the username to browser storage
    localStorage.setItem("playerUsername", username);

    // Hide the login box and show the minigames list
    loginDiv.style.display = "none";
    minigamesDiv.style.display = "block";
};

