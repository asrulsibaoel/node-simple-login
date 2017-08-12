import crypt from './../../../Infrastructure/Library/crypt';

export class UserPassword {

    constructor(password) {
        this.generatePasswordFromString(password);
    }

    generatePasswordFromString(password) {
        this._password = crypt.generatePassword(password);
    }

    /**
     *
     * @param password
     * @returns {boolean}
     */
    checkPassword(password) {
        return this._password == crypt.generatePassword(password);
    }

    toString() {
        return this._password.toString('hex');
    }
}