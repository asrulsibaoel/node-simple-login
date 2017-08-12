export class WrongCommandException extends Error {
    constructor(message) {
        super(message);
        this.message = message;
    }
}