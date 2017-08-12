import {InvalidRequiredAttributeException} from "../Exception/InvalidRequiredAttributeException";

export class UserEmail {

    constructor(email) {
        this.generateEmailFromString(email);
    }

    generateEmailFromString(email) {
        if (email && email != "" && email.includes("@")) {
            let splitedMail = email.split("@");
            if (splitedMail.length == 2) {
                this._email = email;
            } else {
                throw new InvalidRequiredAttributeException("Invalid email address.");
            }
        } else {
            throw new InvalidRequiredAttributeException("Invalid email address.");
        }
    }

    parsedEmail() {
        return this._email.split("@");
    }

    /**
     *
     * @returns {*}
     */
    get domainName() {
        return this.parsedEmail()[1];
    }

    /**
     *
     * @returns {*}
     */
    get userEmailName() {
        return this.parsedEmail()[0];
    }

    /**
     *
     * @returns {String}
     */
    toString() {
        return this._email;
    }
}