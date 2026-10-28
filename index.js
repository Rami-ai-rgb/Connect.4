let board = Array(42).fill(""); 
let isRed = true;
let position = 3;
let collumPosition = 0;
let coincount = 0;
let gameOver = false;

const hovercells = document.querySelectorAll('.hoverCell');
const cells = document.querySelectorAll(".Cell");

function moveDirection(position) {
    if (hovercells[position]) {
        let coinPrefix = isRed ? "Redcoin" : "yellowCoin";
        let currentCoin = document.getElementById(`${coinPrefix}${coincount - 1}`);
        if (currentCoin) {
            hovercells[position].appendChild(currentCoin);
        }
    } else {
        console.error(`Element at index ${position} does not exist.`);
    }
}

function dropCoin() {
    const columnSize = 6;
    const startIndex = position * columnSize;
    const endIndex = startIndex + columnSize - 1;

    let foundEmptySpace = false;

    for (let i = endIndex; i >= startIndex; i--) {
        if (board[i] === "") {
            collumPosition = i;
            foundEmptySpace = true;
            break; 
        }
    }
    
    if (!foundEmptySpace) {
        console.log("This column is full!");
        return false; 
    }
    
    if (cells[collumPosition]) {
        let coinPrefix = isRed ? "Redcoin" : "yellowCoin";
        let currentCoin = document.getElementById(`${coinPrefix}${coincount - 1}`);
        if (currentCoin) {
            cells[collumPosition].appendChild(currentCoin);
        }
    } else {
        console.error(`Element at index ${collumPosition} does not exist.`);
    }
    
    board[collumPosition] = isRed ? "red" : "yellow";
    return true;
}

function createRedCoin(){
    let redCoin = document.createElement(`div`);
    redCoin.id = `Redcoin${coincount}`;
    redCoin.className = "redCoins";
    hovercells[position].appendChild(redCoin);
    coincount++;
}

function createYellowCoin(){
    let yellowCoin = document.createElement(`div`);
    yellowCoin.id = `yellowCoin${coincount}`;
    yellowCoin.className = "yellowCoins";
    hovercells[position].appendChild(yellowCoin);
    coincount++;
}

function checkWin(lastIndex, player) {
    const BOARD_ROWS = 6;
    const BOARD_COLS = 7;

    const col = Math.floor(lastIndex / BOARD_ROWS);
    const row = lastIndex % BOARD_ROWS;

    const directions = [
        { dCol: 1,  dRow: 0,  indexDelta: 6 },   
        { dCol: 0,  dRow: 1,  indexDelta: 1 },   
        { dCol: 1,  dRow: -1, indexDelta: 5 },   
        { dCol: 1,  dRow: 1,  indexDelta: 7 }    
    ];

    for (let dir of directions) {
        let count = 1; 
        let currCol = col + dir.dCol;
        let currRow = row + dir.dRow;
        let currIndex = lastIndex + dir.indexDelta;

        while (
            currCol >= 0 && currCol < BOARD_COLS &&
            currRow >= 0 && currRow < BOARD_ROWS &&
            board[currIndex] === player
        ) {
            count++;
            currCol += dir.dCol;
            currRow += dir.dRow;
            currIndex += dir.indexDelta;
        }

        currCol = col - dir.dCol;
        currRow = row - dir.dRow;
        currIndex = lastIndex - dir.indexDelta;

        while (
            currCol >= 0 && currCol < BOARD_COLS &&
            currRow >= 0 && currRow < BOARD_ROWS &&
            board[currIndex] === player
        ) {
            count++;
            currCol -= dir.dCol;
            currRow -= dir.dRow;
            currIndex -= dir.indexDelta;
        }

        if (count >= 4) {
            return true; 
        }
    }

    return false;
}

createRedCoin();

document.addEventListener("keydown", event => {
    if(event.key.startsWith("Arrow") || event.key === " " || event.code === "Space"){
        
        if (gameOver) return;

        switch (event.key) {
            case "ArrowRight":
                if (position < 6) { 
                    position++;
                }
                moveDirection(position);
                break; 
                
            case "ArrowLeft":
                if (position > 0) {
                    position--;
                }
                moveDirection(position);
                break; 
                
            case " ":
            case "Space":
                let success = dropCoin();
                if (success) {
                    let currentPlayer = isRed ? "red" : "yellow"; 
                    let winningIndex = collumPosition; 

                    isRed = !isRed; 
                    if (isRed) {
                        createRedCoin();
                    } else {
                        createYellowCoin();
                    }

                    setTimeout(() => {
                        if (checkWin(winningIndex, currentPlayer)) {
                            console.log(`${currentPlayer.toUpperCase()} WINS!`);
                            alert(`${currentPlayer.toUpperCase()} WINS!`);
                            gameOver = true; 
                        }
                    }, 10);
                }
                console.log(board);
                break;
        }
    }
});