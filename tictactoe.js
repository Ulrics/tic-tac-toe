const prompt = require('prompt-sync')();

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

    return { setUpGame, getGame, resetGame, checkWin, displayTerminal };
})();

const startGame = (function () {
    let player1;
    let player2;

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
    const getPlayers = () => ({ player1, player2 });

    return { init, getPlayers };
})();

function playRound() {
    const players = startGame.getPlayers()
    let currentPlayer = players.player1;

    gameBoard.setUpGame();

    const switchPlayers = () =>{
        if(currentPlayer === players.player1){
            currentPlayer = players.player2;
        }
        else{
            currentPlayer = players.player1;
        }
    }

    const isOccupied = (coordinate) =>{
        return gameBoard.getGame()[coordinate].occupied !== null;
    }

    const placeMove = () =>{
        gameBoard.displayTerminal();
        let playerMove = prompt(`Choose where to place your move Player:${currentPlayer.symbol}`, "");
        if(playerMove > 9){
            return placeMove();
        }
        if(isOccupied(playerMove) === true){
            return placeMove();
        }
        gameBoard.getGame()[playerMove].occupied = currentPlayer.symbol;
    }

    const displayWinner = () => {
        gameBoard.displayTerminal();
        currentPlayer.addScore();
        console.log(`${currentPlayer.symbol}'s won!`)
        console.log(`player ${players.player1.symbol} score: ${players.player1.getScore()} | player ${players.player2.symbol} score: ${players.player2.getScore()} `)
        gameBoard.resetGame();
    }

    const displayTie = () => {
        console.log(`It's a tie!`)
        console.log(`player ${players.player1.symbol} score: ${players.player1.getScore()} | player ${players.player2.symbol} score: ${players.player2.getScore()} `)
        gameBoard.resetGame();
    }

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
};

const gameController = (function (){
    startGame.init();
    const players = startGame.getPlayers()
    console.log("Are players the same?", players.player1 === startGame.getPlayers().player1);


    const continueGame = () =>{
        if(players.player1.getScore() === 3 || players.player2.getScore() === 3){
            return false;
        }
        else{
            return true;
        }
    }

    const endGame = () => {

    }

    while (continueGame() === true){
        playRound();
    }
    const restartWholeGame = () => gameController.restartWholeGame();
})();

gameController();
/*
const game1 = createGameBoard();
game1.setUpGame();
console.log(game1.displayGame().push(5));
*/