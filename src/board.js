/* ext features:
- resize the board (S/M/L).
- more fruits on board at a time
- game menu
    - highscores
    - current score
*/

import { Square } from "./square.js";
import { Point } from "./point.js";

"use strict";

const SMALL = 1;
const MEDIUM = 2; // 9x9
const LARGE = 3; // 9x9

const UP = 'w';
const LEFT = 'a';
const DOWN = 's';
const RIGHT = 'r';
export class Board {
    _board;
    _boardSize;
    _snakeHeadPoint;
    _snakeTailPoint;

    constructor(boardSize) {
        this._boardSize = boardSize;
        this._board = this._initBoard();
        this._initSnake();

        document.addEventListener('keydown', event => this._handleKeyDownEvent(event));
    }

    static get medium() {
        return MEDIUM;
    }

    _handleKeyDownEvent(e) {
        if (!Board._isValidDirection) return;
        this._moveSnake(e.key);
    }

    _moveSnake(direction) {
        switch (direction) {
            case UP:
                console.log("head")
                const newSnakeHeadPoint = new Point(this._snakeHeadPoint.x - 1, this._snakeHeadPoint.y);
                this._updateSquare(newSnakeHeadPoint, Square.snake);
                this._updateSquare(this._snakeTailPoint, Square.empty);
                break;
            default:
                throw Error("Not a valid direction.")
        }
    }

    _updateSquare(point, squareType) {
        if (!(Board._isValidPoint(point))) return;
        this._board[point.x][point.y].type = squareType;
    }

    _initBoard() {
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

    _initSnake() {
        this._updateSquare(new Point(4, 1), Square.snake);
        this._updateSquare(new Point(4, 2), Square.snake);
        this._updateSquare(new Point(4, 3), Square.snake);
        this._snakeHeadPoint = new Point(4, 3);
        this._snakeTailPoint = new Point(4, 1);
    }

    static _isValidDirection(direction) {
        return direction === UP || direction === LEFT ||
            direction === DOWN || direction == RIGHT;
    }

    static _isValidPoint(point) {
        if (!(point instanceof Point)) {
            throw Error("Argument is not instance of Point.")
        }
        if (!(point.x >= 0 && point.x < 9 &&
            point.y >= 0 && point.y < 9)) {
            throw Error("Point values are not inside board.")
        }

        return true;
    }
}
