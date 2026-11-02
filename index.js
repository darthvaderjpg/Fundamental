//Name: Siddarth Iyer
//Date: 11/1/26
//Rev:01
//Notes:None

console.log("Minigames is currently running");

//Current Minigame ideas:
/*
- just means that these are the minigames I will be prioritizing
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
7. *Flappy Bird
8. Snake
9. Enldess Runner

*/

const submitBtn = document.getElementById("submit");
const usernameInput = document.getElementById("myText");
const loginDiv = document.getElementById("login");
const minigamesDiv = document.getElementById("minigames");
const heading = document.getElementById("H1");
const subGreeting = document.getElementById("sub-greeting");
const sessionStatus = document.getElementById("session-status");
const logoutBtn = document.getElementById("logout-btn");
const newWindowBtn = document.getElementById("new-window-btn");

function loadUserSession(username) {
    heading.textContent = `Welcome back, ${username}!`;
    if (subGreeting) subGreeting.textContent = `> Select a minigame from the terminal suite below:`;
    if (sessionStatus) sessionStatus.textContent = `USER: ${username}`;
    if (loginDiv) loginDiv.style.display = "none";
    if (minigamesDiv) minigamesDiv.style.display = "block";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
}

function clearUserSession() {
    localStorage.removeItem("playerUsername");
    heading.textContent = "Welcome to Fundamental Minigames";
    if (subGreeting) subGreeting.textContent = "> Enter your username to get started and then choose a minigame!";
    if (sessionStatus) sessionStatus.textContent = "STATUS: UNAUTHENTICATED";
    if (loginDiv) loginDiv.style.display = "block";
    if (minigamesDiv) minigamesDiv.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (usernameInput) usernameInput.value = "";
}

// Initial session check
const savedUsername = localStorage.getItem("playerUsername");
if (savedUsername) {
    loadUserSession(savedUsername);
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
        loadUserSession(username);
    };
}

if (logoutBtn) {
    logoutBtn.onclick = function() {
        clearUserSession();
    };
}

if (newWindowBtn) {
    newWindowBtn.onclick = function() {
        window.open(window.location.href, "RetroTerminalSuite", "width=850,height=650,resizable=yes,scrollbars=yes");
    };
}