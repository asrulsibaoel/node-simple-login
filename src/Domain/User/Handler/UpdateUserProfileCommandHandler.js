import {FailedToUpdateUserException} from "../Exception/FailedToUpdateUserException";
import {UpdateUserProfileCommand} from "../Command/UpdateUserProfileCommand";
import {WrongCommandException} from "../Exception/WrongCommandException";
import UserDB from './../Projection/UserDB';
import {WhenUserWasDeactivated} from "../Event/WhenUserWasDeactivated";
import {WhenUserWasUpdated} from "../Event/WhenUserWasUpdated";

export class UpdateUserProfileCommandHandler {

    execute(command, context) {
        if (context) {
            this.command = command;
        }

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!command instanceof UpdateUserProfileCommand) {
                    reject(new WrongCommandException("command parameter must be instance of UpdateUserProfileCommand"));
                }

                try {
                    let user = this.findUserAndUpdate();
                    if(user.isApproved == false) {
                        //when user was deactivated
                        let event = new WhenUserWasDeactivated(user);
                        event.buildAndSend();
                    } else {
                        //when user not deactivated
                        let event = new WhenUserWasUpdated(user);
                        event.buildAndSend();
                    }
                    resolve(user);
                } catch (exception) {
                    reject(new FailedToUpdateUserException(exception));
                }
            }, 500);
        });
    }

    findUserAndUpdate() {
        return new Promise((resolve, reject) => {
            UserDB.findByIdAndUpdate(this.command.userId, {
                $set: {
                    name: this.command.user.name,
                    username: this.command.user.username,
                    email: this.command.user.email.toString(),
                    password: this.command.user.password.toString(),
                    address: this.command.user.address,
                    phone: this.command.user.phone,
                    rolesId: this.command.user.rolesId,
                    isApproved: this.command.isApproved,
                    warehouseId: this.command.warehouseId,
                    parentId: this.command.parentId,
                    updated_at: new Date()
                }
            }, {new: true}).then((data) => {
                resolve(data);
            }).catch((exception) => {
                reject(exception);
            });
        });
    }
}