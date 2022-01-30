// GAME class

import { Board } from "./board.js";

class Game {
    constructor() {
        this._showMenuScreen();
        this._initStartGameButton();
        this._initExitGameButton();
    }
    _showGameScreen() {
        document.getElementById("game-screen").style.display = "block";
        document.getElementById("game-menu").style.display = "none";
    }

    _showMenuScreen() {
        document.getElementById("game-screen").style.display = "none";
        document.getElementById("game-menu").style.display = "block";
    }

    _initStartGameButton() {
        document.getElementById("gameDataForm").addEventListener('click', () => this._startGameHandler());
    }

    _startGameHandler() {
        const boardSizeFormValue = document.getElementById("board-size").value;
        const gameSpeedFormValue = document.getElementById("game-speed").value;
        this.board = new Board(Game._formValueToBoardSize(boardSizeFormValue),
            Game._formValueToGameSpeed(gameSpeedFormValue));
        this._showGameScreen();
    }
    
    _initExitGameButton() {
        document.querySelector(".exit-game").addEventListener('click', () => this._exitGameHandler());
    }

    _exitGameHandler() {
        this._showMenuScreen();
        const parent = document.getElementById("game-screen");
        console.log(parent)
        while (parent.firstChild) {
            if (parent.lastChild.textContent === 'X') {
                break;
            }
            parent.removeChild(parent.lastChild)
        }

    }

    static _formValueToBoardSize(boardSizeFormValue) {
        switch (boardSizeFormValue) {
            case '0':
                return Board.boardSizeSmall;
            case '1':
                return Board.boardSizeMedium;
            case '2':
                return Board.boardSizeLarge;
            default:
                throw Error(`Do not recognise ${boardSize} value from form.`);
        }
    }

    static _formValueToGameSpeed(gameSpeedFormValue) {
        switch (gameSpeedFormValue) {
            case '0':
                return Board.gameSpeedSlow;
            case '1':
                return Board.gameSpeedMedium;
            case '2':
                return Board.gameSpeedFast;
            default:
                throw Error(`Do not recognise ${gameSpeedFormValue} value from form.`);
        }
    }
}

const game = new Game();