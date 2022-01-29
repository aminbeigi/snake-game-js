const EMPTY = 0;
const SNAKE = 1;
const APPLE = 2;

export class Square {
    constructor(type, element) {
        this._type = type;
        this.element = element;
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

    get type() {
        return this._type;
    }

    set type(type) {
        if (!Square.#isValidType) {
            throw new Error(`Type must be either 1, 2 or 3. ${type} is not a valid type.`)
        }

        if (this._type === type) {
            throw new Error(`Can not set type to same type.`)
        }

        switch (type) {
            case Square.empty:
                this.element.className = "square-empty";
                break;
            case Square.snake:
                this.element.className = "square-snake";
                break;
            case Square.apple:
                this.element.className = "square-apple";
                break;
            default:
                throw Error(`${type} is not a valid type.`);
        }
        this._type = type;
    }

    static #isValidType(type) {
        return type === Square.empty || type === Square.snake || type === Square.apple;
    }
}