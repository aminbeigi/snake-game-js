/* ext features:
- resize the board (S/M/L).
- more fruits on board at a time
- game menu
    - highscores
    - current score
*/

import { Square } from "./square.js";

"use strict";

const MEDIUM = "medium"; // 9x9
const EMPTY = 0;
const SNAKE = 1;
const APPLE = 2;
export class Board {
    #board;
    #boardSize;

    constructor(boardSize) {
        this.#boardSize = boardSize;
        this.#board = this.#initBoard();
        this.#initSnake();

    }

    static get medium() {
        return MEDIUM;
    }

    static get empty() {
        return EMPTY;
    }

    static get snake() {
        return SNAKE;
    }

    static get empty() {
        return EMPTY;
        
    }

    #initBoard() {
        let containerElement = document.getElementById("container");
        let board = []
        for (let row = 0; row < 9; ++row) {
            board.push(Array(9).fill(null));
            let rowElement = document.createElement("div");
            containerElement.append(rowElement);
            for (let col = 0; col < 9; ++col) {
                let squareElement = document.createElement("div");
                squareElement.className = "square-empty";
                rowElement.append(squareElement);
                board[row][col] = new Square(3, squareElement);
            }
        }
        console.log(board);
        return board;
    }

    #initSnake() {
        this.#board[4][1].type = Board.snake;
        this.#board[4][2].type = Board.snake;
        this.#board[4][3].type = Board.snake;
    }
}
