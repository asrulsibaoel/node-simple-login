export class InvalidRequiredAttributeException extends Error {
    constructor(message) {
        super(message);
        if(typeof message == "string") {
            this.message = message;
        } else {
            throw new Error("message parameter must be string");
        }
    }
}