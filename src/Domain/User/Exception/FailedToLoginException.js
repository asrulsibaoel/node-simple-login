export class FailedToLoginException extends Error {
    constructor(message) {
        super(message);
        this.message = message;
    }
}