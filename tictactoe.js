//const prompt = require('prompt-sync')();

function createPlayer (symbol) {
    this.symbol = symbol;
    let score = 0;
    const resetScore = () => score = 0;
    const addScore = () => score++;
    const getScore = () => score;
    return { symbol, getScore, addScore, resetScore };
}

const gameBoard = (function () {
    let gameArray = [];
    const boardSpots = document.querySelectorAll("[data-attribute='board']")

    const createCoords = (coordinates, occupied) => {
    return {
        coordinates: coordinates,
        occupied: occupied
        }
    }
    const setUpGame = () => {
        for (let i = 0; i < 9; i++){
            gameArray.push(createCoords(i, null));
        }
        console.log(boardSpots)
    }
    const getGame = () => gameArray;
    const resetGame = () => {
        for (let y = 0; y < 9; y++){
            gameArray[y].occupied = null;
        }
    }

    const checkWin = () => {
        const combos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], 
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]]
        for (let i = 0; i < combos.length; i++){
            const a = gameArray[combos[i][0]].occupied;
            const b = gameArray[combos[i][1]].occupied;
            const c = gameArray[combos[i][2]].occupied;
            if (a !== null && a === b && a === c){
                return { won: true, symbol: a, winningCombo: combos[i] };
            }
        }
        return { won: false, symbol: null, winningCombo: null };
    }

    const displayTerminal = () => {
    let display = "";
        for (let i = 0; i < 9; i += 3) {
            const row = gameArray.slice(i, i + 3)
                .map(cell => cell.occupied === null ? " " : cell.occupied)
                .join(" | ");
            display += row + "\n";
            if (i < 6) display += "---------\n";
        }
    console.log(display);
    };
    const getBoardSpots = () => boardSpots;

    return { setUpGame, getGame, resetGame, checkWin, getBoardSpots, displayTerminal };
})();

const startGame = (function () {
    let playerX;
    let playerO;
    /*
    const init = () =>{
        let playerChoice = prompt("Choose X or O", "X");
        if(playerChoice === "x" || playerChoice === "o"){
            playerChoice = playerChoice.toUpperCase(); 
        }
        if(playerChoice !== "X" && playerChoice !== "O"){
            playerChoice = "X";
            console.log("Invalid choice. Defaulting to X.");
        }
        player1 = createPlayer(playerChoice);
        console.log(`You chose to play as: ${playerChoice}`);
        if(player1.symbol === "X"){
            player2 = createPlayer("O");
        }
        else{
            player2 = createPlayer("X");
        }
    }
    */
    const init = () =>{
        playerX = createPlayer("X");
        playerO = createPlayer("O"); 
    }   
    const getPlayers = () => ({ playerX, playerO });

    return { init, getPlayers };
})();

function playRound() {
    const players = startGame.getPlayers()
    let currentPlayer = players.playerX;
    const nextGameBtn = document.getElementById("next-game-btn");
    const dialog = document.querySelector(".dialog-box");

    gameBoard.setUpGame();
    
    const switchPlayers = () =>{
        if(currentPlayer === players.playerX){
            currentPlayer = players.playerO;
            dialog.textContent = `Player ${players.playerO.symbol} turn`;
        }
        else{
            currentPlayer = players.playerX;
            dialog.textContent = `Player ${players.playerX.symbol} turn`;
        }
    }

    const isOccupied = (coordinate) =>{
        return gameBoard.getGame()[coordinate].occupied !== null;
    }

    const placeMove = (playerMove) =>{
        console.log("space clicked");
        gameBoard.displayTerminal();
        //let playerMove = prompt(`Choose where to place your move Player:${currentPlayer.symbol}`, "");
        if(isOccupied(playerMove) === true){
            return;
        }
        gameBoard.getGame()[playerMove].occupied = currentPlayer.symbol;
        gameBoard.getBoardSpots()[playerMove].classList.replace("board", "board-occupied");
        if(currentPlayer === players.playerX){
            const xSymbol = document.createElement("img");
            xSymbol.classList.add("marker");
            xSymbol.src = "images/X.svg";
            xSymbol.alt = "X icon";
            gameBoard.getBoardSpots()[playerMove].appendChild(xSymbol);
        }
        else{
            const oSymbol = document.createElement("img");
            oSymbol.classList.add("marker");
            oSymbol.src = "images/O.svg";
            oSymbol.alt = "O icon";
            gameBoard.getBoardSpots()[playerMove].appendChild(oSymbol);
        }
        
        if(gameBoard.checkWin().won === true){

            return;
        }
        switchPlayers();
    }

    for(let i = 0; i < gameBoard.getBoardSpots().length; i++){
        gameBoard.getBoardSpots()[i].addEventListener("click", () => placeMove(i));
    }

    const displayWinner = () => {
        gameBoard.displayTerminal();
        currentPlayer.addScore();
        for(let y = 0; y < 3; y++){
            gameBoard.getBoardSpots()[gameBoard.checkWin().winningCombo[y]].style.backgroundColor = "var(--light-green)";
        }
        nextGameBtn.classList.replace("board", "board-occupied");
        console.log(`${currentPlayer} won`)
    }

    const displayTie = () => {
        console.log(`It's a tie!`)
        console.log(`player ${players.playerX.symbol} score: ${players.playerX.getScore()} | player ${players.playerO.symbol} score: ${players.playerO.getScore()} `)
        gameBoard.resetGame();
    }

    /*
    let turns = 0;
    while(turns < 11){
        placeMove(currentPlayer);
        if(gameBoard.checkWin().won === true){
            displayWinner();
            return;
        }
        if(turns === 10){
            displayTie();
            return;
        }
        switchPlayers();
        turns++; 
    }
    */
};

const gameController = (function (){
    startGame.init();
    const players = startGame.getPlayers()
    console.log("Are players the same?", players.playerX === startGame.getPlayers().playerX);

    /*
    const continueGame = () =>{
        if(players.playerX.getScore() === 3 || players.playerO.getScore() === 3){
            return false;
        }
        else{
            return true;
        }
    }
    */

    const endGame = () => {

    }
    /*
    while (continueGame() === true){
        playRound();
    }
    */
    const restartWholeGame = () => gameController.restartWholeGame();

    const restartGameBtn = document.querySelector(".restart-button");
    //document.addEventListener("click")
})();

playRound();