function createPlayer (symbol) {
    this.symbol = symbol;
    let score = 0;
    const resetScore = () => score = 0;
    const addScore = () => score++;
    const getScore = () => score;
    return { symbol, getScore, addScore, resetScore };
}

const createCoords = (coordinates, occupied) => {
    return {
        coordinates: coordinates,
        occupied: occupied
    }
}

function createGameBoard () {
    let gameArray = [];

    const setUpGame = () => {
        for (let i = 0; i < 9; i++){
            gameArray.push(createCoords(i, null));
        }
    }
    const getGame = () => gameArray;
    const resetGame = () => gameArray = [];
    return { setUpGame, getGame, resetGame };
}

function checkWin(Array){
    const checkHorizontal = () => {
        const horiz1 = [0, 1, 2];
        const horiz2 = [3, 4, 5];
        const horiz3 = [6, 7, 8];
        const horizCombos = [horiz1, horiz2, horiz3]
        console.log(horizCombos[0][2])
        for (let i = 0; i < horizCombos.length(); i++){
            for (let y = 0; y < horizCombos[i].length(); y++){

            }
        }
    }
}

const horiz1 = [0, 1, 2];
const horiz2 = [3, 4, 5];
const horiz3 = [6, 7, 8];
const horizCombos = [horiz1, horiz2, horiz3]
console.log(horizCombos[0][2])
/*
const game1 = createGameBoard();
game1.setUpGame();
console.log(game1.displayGame().push(5));
*/