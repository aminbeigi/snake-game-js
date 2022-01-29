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
const RIGHT = 'd';

const SNAKE_HEAD_POINT = -1;
const SNAKE_TAIL_POINT = 0;
export class Board {
    _snakePoints = [];
    _board;
    _boardSize;

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
        let snakeHeadPoint = this._snakePoints.at(SNAKE_HEAD_POINT);
        let snakeTailPoint = this._snakePoints.at(SNAKE_TAIL_POINT);
        let newSnakeHeadPoint;
        switch (direction) {
            case UP:
                newSnakeHeadPoint = new Point(snakeHeadPoint.x - 1, snakeHeadPoint.y);
                break;
            case LEFT:
                newSnakeHeadPoint = new Point(snakeHeadPoint.x, snakeHeadPoint.y - 1);
                break;
            case DOWN:
                newSnakeHeadPoint = new Point(snakeHeadPoint.x + 1, snakeHeadPoint.y);
                break;
            case RIGHT:
                newSnakeHeadPoint = new Point(snakeHeadPoint.x, snakeHeadPoint.y + 1);
                break;
            default:
                throw Error("Not a valid direction.")
        }
        this._updateSquare(newSnakeHeadPoint, Square.snake);
        this._updateSquare(snakeTailPoint, Square.empty);
        this._snakePoints.shift();
        this._snakePoints.push(newSnakeHeadPoint)
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
        this._snakePoints.push(new Point(4, 1));
        this._snakePoints.push(new Point(4, 2));
        this._snakePoints.push(new Point(4, 3));
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
