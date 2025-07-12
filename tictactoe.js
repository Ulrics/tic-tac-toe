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

    const getBoardSpots = () => boardSpots;
    const resetBoard = () =>{
        boardSpots.forEach(spot => {
            spot.classList.remove(...spot.classList);
            spot.classList.add("board");
            spot.innerHTML = "";
        });
    }
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

    const checkTie = () => {
        for (let z = 0; z < gameArray.length; z++){
            if(gameArray[z].occupied === null){
                return false;
            }
        }
        return true;
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

    return { setUpGame, getGame, resetGame, checkWin, checkTie, getBoardSpots, resetBoard, displayTerminal };
})();

const startGame = (function () {
    let playerX;
    let playerO;

    const init = () =>{
        playerX = createPlayer("X");
        playerO = createPlayer("O"); 
    }   
    const getPlayers = () => ({ playerX, playerO });

    return { init, getPlayers };
})();

const gameController = (function (){
    startGame.init();
    gameBoard.setUpGame();
    
    const players = startGame.getPlayers()
    const playerXScore = document.getElementById("x-score");
    const playerOScore = document.getElementById("o-score");
    const dialog = document.querySelector(".dialog-box");
    const nextGameBtn = document.getElementById("next-game-btn");
    const restartGameBtn = document.querySelector(".restart-button");

    function playRound() {
    let currentPlayer = players.playerX;


        function placeMoveListener(e) {
            const index = Number(e.currentTarget.getAttribute("data-coordinate"));
            placeMove(index);
        }

        const addBoardListener = () => {
            gameBoard.getBoardSpots().forEach(spot => {
                spot.addEventListener("click", placeMoveListener);
            });
        };

        const removeBoardListener = () => {
            gameBoard.getBoardSpots().forEach(spot => {
                spot.removeEventListener("click", placeMoveListener);
            });
        };

        addBoardListener();

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
                displayWinner();
                removeBoardListener();
                return;
            }
            if(gameBoard.checkTie()){
                displayTie();
                removeBoardListener();
                return;
            }
            switchPlayers();
        }

        const displayWinner = () => {
            gameBoard.displayTerminal();
            currentPlayer.addScore();
            for(let y = 0; y < 3; y++){
                gameBoard.getBoardSpots()[gameBoard.checkWin().winningCombo[y]].classList.replace("board-occupied", "board-winner");
            }
            nextGameBtn.classList.replace("disabled-button", "next-button");
            nextGameBtn.addEventListener("click", nextGame);
            playerXScore.textContent = players.playerX.getScore();
            playerOScore.textContent = players.playerO.getScore();
            dialog.textContent = `Player ${currentPlayer.symbol} won!`
        }

        const displayTie = () => {
            nextGameBtn.classList.replace("disabled-button", "next-button");
            nextGameBtn.addEventListener("click", nextGame);
            dialog.textContent = `Game is tied!`;
        }
    };

    playRound();

    const restartGame = () =>{
        players.playerX.resetScore();
        players.playerO.resetScore();
        playerXScore.textContent = players.playerX.getScore();
        playerOScore.textContent = players.playerO.getScore();
        nextGameBtn.classList.replace("next-button", "disabled-button");
        
        gameBoard.resetBoard();
        gameBoard.resetGame(); 
        playRound();     
    }

    const nextGame = () =>{
        gameBoard.resetBoard();
        gameBoard.resetGame();
        playRound();
        nextGameBtn.classList.replace("next-button", "disabled-button");
        nextGameBtn.removeEventListener("click", nextGame);
    }

    restartGameBtn.addEventListener("click", restartGame);
})();
