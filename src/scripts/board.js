import { Square } from "./square.js";
import { Point } from "./point.js";

const GAME_START_SNAKE_TAIL_POINT = new Point(4, 0);
const GAME_START_SNAKE_BODY_POINT = new Point(4, 1);
const GAME_START_SNAKE_HEAD_POINT = new Point(4, 2);

const GAME_SPEED_SLOW = 500;
const GAME_SPEED_MEDIUM = 250;
const GAME_SPEED_FAST = 150;

const BOARD_SIZE_SMALL = 5;
const BOARD_SIZE_MEDIUM = 9;
const BOARD_SIZE_LARGE = 15;

const UP = 'ArrowUp';
const LEFT = 'ArrowLeft';
const DOWN = 'ArrowDown';
const RIGHT = 'ArrowRight';

const SNAKE_HEAD_POINT = -1;
const SNAKE_BODY_ONE_SQUARE_BEFORE_HEAD_POINT = -2;
const SNAKE_TAIL_POINT = 0;

/** Board class maintains state of board and conatins the game loop/logic.*/
export class Board {
    _snakePoints = [];

    constructor(boardSize, gameSpeed) {
        this._boardSize = boardSize;
        if (!Board._isValidBoardSize) throw Error(`${boardSize} is not a valid board size.`)
        this._gameSpeed = gameSpeed;
        if (!Board._isValidGameSpeed) throw Error(`${gameSpeed} is not a valid game speed.`)
        this._board = this._initBoard();
        this._initSnake();
        this._spawnApple();
    }

    start() {
        this.keyDownListener = (event) => this._handleKeyDownEvent(event);
        document.addEventListener('keydown',this.keyDownListener);
        this.moveIntervalId = setInterval(() => this._moveSnake(this._calcSnakeDirection(), true), this._gameSpeed);
    }

    stop(message) {
        document.removeEventListener('keydown', this.keyDownListener);
        clearInterval(this.moveIntervalId);
        console.log(message);
    }

    resetMoveInterval() {
        clearInterval(this.moveIntervalId);
        document.addEventListener('keydown',this.keyDownListener);
        this.moveIntervalId = setInterval(() => this._moveSnake(this._calcSnakeDirection(), true), this._gameSpeed)
    }

    static get boardSizeSmall() {
        return BOARD_SIZE_SMALL;
    }

    static get boardSizeMedium() {
        return BOARD_SIZE_MEDIUM;
    }

    static get boardSizeLarge() {
        return BOARD_SIZE_LARGE;
    }

    static get gameSpeedSlow() {
        return GAME_SPEED_SLOW;
    }

    static get gameSpeedMedium() {
        return GAME_SPEED_MEDIUM;
    }

    static get gameSpeedFast() {
        return GAME_SPEED_FAST;
    }

    _handleKeyDownEvent(e) {
        this._moveSnake(e.key, false);
    }

    /**
     * The game loop!
     * @param {String} inputDirection 
     * @param {boolean} interval 
     */
    _moveSnake(inputDirection, interval) {
        if (!Board._isValidDirection(inputDirection)) return;
        if (this._isMoveInSnakeDirection(inputDirection, interval)) return;
        if (this._calcOppositeSnakeDirection() === inputDirection) return;

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

        if (!this._isPointInBounds(newSnakeHeadPoint)) {
            this.stop("Moved into wall!!!");
            return;
        }

        const square = this._board[newSnakeHeadPoint.x][newSnakeHeadPoint.y];
        if (Square.isSnakeSquare(square)) {
            this.stop("Moved into snake body!");
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
        this.resetMoveInterval();
    }

    _updateSquare(point, squareType) {
        this._board[point.x][point.y].type = squareType;
    }

    /**
     * Initialises a 2D array (game board) containing Square objects
     * to all empty squares.
     * @returns {!Array<!Array<Square>>} 2D array.
     */
    _initBoard() {
        let containerElement = document.getElementById("game-screen");
        let board = []
        for (let row = 0; row < this._boardSize; ++row) {
            board.push(Array(this._boardSize).fill(null));
            let rowElement = document.createElement("div");
            containerElement.append(rowElement);
            for (let col = 0; col < this._boardSize; ++col) {
                let squareElement = document.createElement("div");
                squareElement.className = "square-empty";
                rowElement.append(squareElement);
                board[row][col] = new Square(Square.empty, squareElement);
            }
        }
        return board;
    }

    _initSnake() {
        this._updateSquare(GAME_START_SNAKE_TAIL_POINT, Square.snakeBody);
        this._updateSquare(GAME_START_SNAKE_BODY_POINT, Square.snakeBody);
        this._updateSquare(GAME_START_SNAKE_HEAD_POINT, Square.snakeHead);
        this._snakePoints.push(GAME_START_SNAKE_TAIL_POINT);
        this._snakePoints.push(GAME_START_SNAKE_BODY_POINT);
        this._snakePoints.push(GAME_START_SNAKE_HEAD_POINT);
    }

    _spawnApple() {
        let point; 
        while (true) {
            const x = Board._genRandomNumber(this._boardSize);
            const y = Board._genRandomNumber(this._boardSize);
            point = new Point(x, y);
            const square = this._board[point.x][point.y];
            if (Square.isEmptySquare(square)) break;
        }
        this._updateSquare(point, Square.apple);
    }

    _calcSnakeDirection() {
        const snakeHeadPoint = this._snakePoints.at(SNAKE_HEAD_POINT);
        const snakeBeforeHeadPoint = this._snakePoints.at(SNAKE_BODY_ONE_SQUARE_BEFORE_HEAD_POINT);
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

    _isMoveInSnakeDirection(direction, interval) {
        return (this._calcSnakeDirection() === direction) && !interval;
    }

    static _isValidDirection(direction) {
        return direction === UP || direction === LEFT ||
            direction === DOWN || direction == RIGHT;
    }

    _isPointInBounds(point) {
        return point.x >= 0 && point.x < this._boardSize &&
            point.y >= 0 && point.y < this._boardSize;
    }

    static _genRandomNumber(max) {
        return Math.floor(Math.random() * max);
    }

    static _isValidBoardSize(boardSize) {
        return boardSize === BOARD_SIZE_SMALL ||
            boardSize === BOARD_SIZE_MEDIUM ||
            boardSize === BOARD_SIZE_LARGE
    }

    static _isValidGameSpeed(gameSpeed) {
        return gameSpeed === GAME_SPEED_SLOW ||
            gameSpeed === GAME_SPEED_MEDIUM ||
            gameSpeed === GAME_SPEED_FAST;
    }
}
