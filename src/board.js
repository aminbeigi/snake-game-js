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

export class Board {
    #EMPTY = 1;

    constructor(boardSize) {
        this.boardSize = boardSize;
        this.board = this.initBoard();
    }

    static get medium() {
        return MEDIUM;
    }

    initBoard() {
        console.log("Initialising board.");



        let containerElement = document.getElementById("container");
        let board = [];
        for (let row = 0; row < 9; ++row) {
            let rowElement = document.createElement("div");
            containerElement.append(rowElement);
            for (let col = 0; col < 9; ++col) {
                let square = new Square(0, null);
                let squareElement = document.createElement("div");
                squareElement.className = "square";
                squareElement.innerText = 3;
                rowElement.append(squareElement);
            }
        }
        console.log(board);
        return board;
    }
}
