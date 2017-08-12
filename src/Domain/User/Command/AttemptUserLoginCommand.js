export class AttemptUserLoginCommand {
    constructor(username, password) {
        if (username && password) {
            this.username = username;
            this.password = password;
        } else {
            throw new Error('Username or password cannot be empty');
        }
    }
}