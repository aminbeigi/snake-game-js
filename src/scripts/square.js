const EMPTY = 0;
const SNAKE_BODY = 1;
const SNAKE_HEAD = 2;
const APPLE = 3;

export class Square {
    constructor(type, element) {
        this._type = type;
        this.element = element;
    }

    static get empty() {
        return EMPTY;
    }

    static get snakeBody() {
        return SNAKE_BODY;
    }

    static get snakeHead() {
        return SNAKE_HEAD;
    }

    static get apple() {
        return APPLE;
    }

    get type() {
        return this._type;
    }

    set type(type) {
        if (!Square._isValidType) {
            throw new Error(`Square type must be either 1, 2 or 3.`)
        }

        if (this._type === type) {
            throw new Error(`Square type arg ${type} is same as current type.`)
        }

        switch (type) {
            case EMPTY:
                this.element.className = "square-empty";
                break;
            case SNAKE_BODY:
                this.element.className = "square-snake-body";
                break;
            case SNAKE_HEAD:
                this.element.className = "square-snake-head";
                break;
            case APPLE:
                this.element.className = "square-apple";
                break;
            default:
                throw Error(`${type} is not a valid type.`);
        }
        this._type = type;
    }

    static _isValidType(type) {
        return type === EMPTY || type === SNAKE_BODY ||
            type === SNAKE_HEAD || type === APPLE;
    }

    static isEmptySquare(square) {
        if (!(square instanceof Square)) throw Error(`${square} is not an instance of Square.`);
        return square.type === EMPTY;
    }

    static isSnakeSquare(square) {
        if (!(square instanceof Square)) throw Error(`${square} is not an instance of Square.`);
        return square.type === SNAKE_BODY || square.type === SNAKE_HEAD;
    }

    static isAppleSquare(square) {
        if (!(square instanceof Square)) throw Error(`${square} is not an instance of Square.`);
        return square.type === APPLE;
    }
}