alert("Put Player names and Press Start Game")
const displayController = (()=> {
    const renderMessage = (message) => {
        document.querySelector('#message').innerHTML= message;
    }
    return{
        renderMessage
    }
})();



const Gameboard = (() => {
    let gameboard = ["", "", "", "", "", "", "", "", ""];

    const render = () => {
        let boardhtml = "";
        gameboard.forEach((square, index) => {
            boardhtml += `<div class="square" id="square-${index}">${square}</div>`;
        });
        document.querySelector('#gameboard').innerHTML = boardhtml;

        const squares = document.querySelectorAll(".square");
        squares.forEach((square) => {
            square.addEventListener("click", game.handleClick);
        });
    };

    const update = (index, value) => {
        gameboard[index] = value;
        render();
    };

    const getGameboard = () => gameboard;

    return { render, update, getGameboard };
})();

const createPlayer = (name, mark) => {
    return {
        name,
        mark,
    };
};

const game = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameOver;

    const start = () => {
        players = [
            createPlayer(document.querySelector('#player1').value, "X"),
            createPlayer(document.querySelector('#player2').value, "O")
        ];
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.render();
    };

    const handleClick = (event) => {
        if (gameOver) {
            return;            
        }
        let index = parseInt(event.target.id.split("-")[1]);
        if (Gameboard.getGameboard()[index] !== "")
            return;

        Gameboard.update(index, players[currentPlayerIndex].mark);

        if (checkForWin()) {
            gameOver = true;
            displayController.renderMessage(`${players[currentPlayerIndex].name} wins!`);
        } else if (checkForTie(Gameboard.getGameboard())) {
            gameOver = true;
            displayController.renderMessage("It's a tie .... Not a lie.");
        }

        currentPlayerIndex = (currentPlayerIndex + 1) % 2;
    };

    const restart = () => {
        for (let i = 0; i < 9; i++) {
            Gameboard.update(i, "");
        }
        Gameboard.render();
        gameOver=false;
        document.querySelector('#message').innerHTML="";
    };

    return { start, handleClick, restart };
})();

function checkForWin() {
    const board = Gameboard.getGameboard();
    const winningCombinations = [
        [0, 1, 2], // Top row
        [3, 4, 5], // Middle row
        [6, 7, 8], // Bottom row
        [0, 3, 6], // Left column
        [1, 4, 7], // Middle column
        [2, 5, 8], // Right column
        [0, 4, 8], // Diagonal from top-left to bottom-right
        [2, 4, 6]  // Diagonal from top-right to bottom-left
    ];

    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

function checkForTie() {
    const board = Gameboard.getGameboard();
    return board.every(cell => cell !== "");
}

const restartButton = document.querySelector('#restart-button');
restartButton.addEventListener("click", () => {
    game.restart();
});

const sbutton = document.querySelector('#start-button');
sbutton.addEventListener("click", () => {
    game.start();
});


