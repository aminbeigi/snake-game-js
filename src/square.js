import { Board } from "./board.js";

export class Square {
    constructor(type, element) {
        this._type = type;
        this.element = element;
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
            case Board.empty:
                this.element.className = "square-empty";
                break;
            case Board.snake:
                this.element.className = "square-snake";
                break;
            case Board.apple:
                this.element.className = "square-apple";
                break;
            default:
                throw Error(`${type} is not a valid type.`);
        }
        this._type = type;
    }

    static #isValidType(type) {
        return type === Board.empty || type === Board.snake || type === Board.apple;
    }
}