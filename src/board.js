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
const MEDIUM = 2;
const LARGE = 3;

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
        this._spawnApple();
    }

    start() {
        this.keyDownListener = (event) => this._handleKeyDownEvent(event);
        document.addEventListener('keydown',this.keyDownListener);
        this.moveIntervalId = setInterval(() => this._moveSnake(this._calcSnakeDirection(), true), 1000)
    }

    stop(message) {
        document.removeEventListener('keydown', this.keyDownListener);
        clearInterval(this.moveIntervalId);
        console.log("Game LOST!");
    }

    static get medium() {
        return MEDIUM;
    }

    _handleKeyDownEvent(e) {
        if (!Board._isValidDirection) return;
        this._moveSnake(e.key, false);
    }

    /**
     * This is the game loop I guess.
     */

    _moveSnake(direction, interval) {
        if (this._isPlayerMoveInSnakeDirection(direction, interval)) {
            return;
        }

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
                throw Error(`${direction} is not a valid direction.`)
        }

        // TODO: snake went on itself = loss

        if (!(newSnakeHeadPoint.x >= 0 && newSnakeHeadPoint.x < 9 &&
            newSnakeHeadPoint.y >= 0 && newSnakeHeadPoint.y < 9)) {
            this.stop("Ran into wall!!!");
            return;
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
        // TODO clean up
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
                board[row][col] = new Square(Square.empty, squareElement);
            }
        }
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

    _spawnApple() {
        let point; 
        while (true) {
            const x = Board._genRandomNumber(9);
            const y = Board._genRandomNumber(9);
            point = new Point(x, y);
            const square = this._board[point.x][point.y];
            if (Square._isEmptySquare(square)) break;
            console.log(Square._isEmptySquare(square));
            console.log(Square.empty);
            console.log(square.type);
            throw Error('what');
        }
        this._updateSquare(point, Square.apple);
    }

    _calcSnakeDirection() {
        const snakeHeadPoint = this._snakePoints.at(SNAKE_HEAD_POINT);
        const snakeBeforeHeadPoint = this._snakePoints.at(-2);
        const xDiff = snakeHeadPoint.x - snakeBeforeHeadPoint.x;
        const yDiff = snakeHeadPoint.y - snakeBeforeHeadPoint.y;
        if (xDiff === -1) {
            return UP;
        } else if (xDiff === 1) {
            return DOWN;
        } else if (yDiff === -1) {
            return LEFT;
        } else if (yDiff === 1) {
            return RIGHT; 
        } else {
            throw Error("Can not calculate snake direction.");
        }
    }

    /**
     * The player can not manually move in snake direction.
     * @param {*} direction 
     * @param {*} interval 
     * @returns 
     */
    _isPlayerMoveInSnakeDirection(direction, interval) {
        return (this._calcSnakeDirection() === direction) && !interval;
    }

    static _isValidDirection(direction) {
        return direction === UP || direction === LEFT ||
            direction === DOWN || direction == RIGHT;
    }

    static _isValidPoint(point) {
        if (!(point instanceof Point)) {
            throw Error('Arg is not instance of Point.')
        }
        if (!(point.x >= 0 && point.x < 9 &&
            point.y >= 0 && point.y < 9)) {
            throw Error(`The point ${point} values are not correct.`)
        }

        return true;
    }

    static _genRandomNumber(max) {
        return Math.floor(Math.random() * max);
    }
}
