/* ext features:
- resize the board (S/M/L).
- more fruits on board at a time
- game menu
    - highscores
    - current score
*/

import { Square } from "./square.js";
import { Point } from "./point.js";

const GAME_SPEED_SLOW = 500;
const GAME_SPEED_MEDIUM = 500;
const GAME_SPEED_FAST = 1000;

const BOARD_SIZE_SMALL = 1;
const BOARD_SIZE_MEDIUM = 2;
const BOARD_SIZE_LARGE = 3;

const UP = 'w';
const LEFT = 'a';
const DOWN = 's';
const RIGHT = 'd';

const SNAKE_HEAD_POINT = -1;
const SNAKE_TAIL_POINT = 0;
export class Board {
    _snakePoints = [];

    constructor(boardSize, gameSpeed) {
        this._boardSize = boardSize;
        this._gameSpeed = gameSpeed;
        this._board = this._initBoard();
        this._initSnake();
        this._spawnApple();
    }

    start() {
        this.keyDownListener = (event) => this._handleKeyDownEvent(event);
        document.addEventListener('keydown',this.keyDownListener);
        this.moveIntervalId = setInterval(() => this._moveSnake(this._calcSnakeDirection(), true), this._gameSpeed)
    }

    stop(message) {
        document.removeEventListener('keydown', this.keyDownListener);
        clearInterval(this.moveIntervalId);
        console.log(message);
    }

    static get boardSizeMedium() {
        return BOARD_SIZE_MEDIUM;
    }

    static get gameSpeedMedium() {
        return GAME_SPEED_MEDIUM;
    }

    _handleKeyDownEvent(e) {
        this._moveSnake(e.key, false);
    }

    /**
     * This is the game loop I guess.
     */

    _moveSnake(inputDirection, interval) {
        if (!Board._isValidDirection(inputDirection)) return;
        if (this._isPlayerMoveInSnakeDirection(inputDirection, interval)) {
            return;
        }
        if (this._calcOppositeSnakeDirection() === inputDirection) {
            console.log("Cant go in opposite direction!");
            return;
        }

        let snakeHeadPoint = this._snakePoints.at(SNAKE_HEAD_POINT);
        let snakeTailPoint = this._snakePoints.at(SNAKE_TAIL_POINT);
        let newSnakeHeadPoint;
        switch (inputDirection) {
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
                throw Error(`${inputDirection} is not a valid direction.`)
        }

        // TODO: snake went on itself = loss

        if (!(newSnakeHeadPoint.x >= 0 && newSnakeHeadPoint.x < 9 &&
            newSnakeHeadPoint.y >= 0 && newSnakeHeadPoint.y < 9)) {
            this.stop("Ran into wall!!!");
            return;
        }

        const square = this._board[newSnakeHeadPoint.x][newSnakeHeadPoint.y];
        if (Square.isSnakeSquare(square)) {
            this.stop("Ran into yourself!");
            return;
        }

        if (Square.isAppleSquare(square)) {
            // EAT THE APPLE NOM NOM NOM
            this._spawnApple();
        } else {
            // delete snake tail
            this._snakePoints.shift();
            this._updateSquare(snakeTailPoint, Square.empty);
        }
        
        this._snakePoints.push(newSnakeHeadPoint)
        this._board[snakeHeadPoint.x][snakeHeadPoint.y].type = Square.snakeBody; // rename previous head
        this._updateSquare(newSnakeHeadPoint, Square.snakeHead);
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
        this._updateSquare(new Point(4, 1), Square.snakeBody);
        this._updateSquare(new Point(4, 2), Square.snakeBody);
        this._updateSquare(new Point(4, 3), Square.snakeHead);
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
            if (Square.isEmptySquare(square)) break;
            console.log('Calculating apple spot...');
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

    _calcOppositeSnakeDirection() {
        const currentSnakeDirection = this._calcSnakeDirection();
        switch (currentSnakeDirection) {
            case UP:
                return DOWN;
            case LEFT:
                return RIGHT;
            case DOWN:
                return UP;
            case RIGHT:
                return LEFT;
            default:
                throw Error(`Can not calculate opposite snake direction
                    from ${currentSnakeDirection}.`);
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
