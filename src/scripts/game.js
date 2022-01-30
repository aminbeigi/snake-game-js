// GAME class

import { Board } from "./board.js";

const showGameScreen = () => {
    document.getElementById("game-screen").style.display = "block";
    document.getElementById("game-menu").style.display = "none";
}

const showMenuScreen = () => {
    document.getElementById("game-screen").style.display = "none";
    document.getElementById("game-menu").style.display = "block";
}


showMenuScreen();
const gameDataFormElement = document.getElementById("gameDataForm")

gameDataFormElement.addEventListener('click', () => {
    const boardSizeFormValue = document.getElementById("board-size").value;
    const gameSpeedFormValue = document.getElementById("game-speed").value;
    let boardSize;
    let gameSpeed;

    switch (boardSizeFormValue) {
        case '0':
            boardSize = Board.boardSizeSmall;
            break;
        case '1':
            boardSize = Board.boardSizeMedium;
            break;
        case '2':
            boardSize = Board.boardSizeLarge;
            break;
        default:
            throw Error(`Do not recognise ${boardSize} value from form.`);
    }

    switch (gameSpeedFormValue) {
        case '0':
            gameSpeed = Board.gameSpeedSlow;
            break;
        case '1':
            gameSpeed = Board.gameSpeedMedium;
            break;
        case '2':
            gameSpeed = Board.gameSpeedFast;
            break;
        default:
            throw Error(`Do not recognise ${gameSpeedFormValue} value from form.`);
    }

    const board = new Board(boardSize, gameSpeed);
    showGameScreen();
})

