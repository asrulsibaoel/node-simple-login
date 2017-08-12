import {User} from "../Model/User";

export class RegisterUserCommand {
    constructor(user) {
        if(user instanceof User) {
            this.user = user;
        } else {
            throw new Error("parameter user must be instance of User");
        }
    }
}
