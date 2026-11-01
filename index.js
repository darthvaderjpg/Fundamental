console.log("Minigames is currently running");

window.alert("This is an alert");
window.alert("You are stinky");

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



let username;
document.getElementById("submit").onclick = function(){
    username = document.getElementById("myText").value;
   document.getElementById("H1").textContent = `Welcome to Fundamental Minigames, ${username}!`;
}



