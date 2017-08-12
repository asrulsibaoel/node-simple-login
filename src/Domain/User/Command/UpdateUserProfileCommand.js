import {User} from "../Model/User";

export class UpdateUserProfileCommand {

    constructor(userId, user) {
        if(userId == null || !userId || !user instanceof User) {
            throw new Error("userId and/or user parameter(s) must be valid!");
        } else {
            this.userId = userId;
            this.user = user;
        }
    }
}