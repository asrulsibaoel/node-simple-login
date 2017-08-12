export class FailedToUpdateUserException extends Error{
    constructor(message) {
        super(message);
        this.message = message;
    }
}