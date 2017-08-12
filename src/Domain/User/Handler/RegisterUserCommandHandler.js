import {RegisterUserCommand} from './../Command/RegisterUserCommand';
import {FailedToCreateUserException} from './../Exception/FailedToCreateUserException';
import UserDB from './../Projection/UserDB';
import {WhenUserWasRegistered} from "../Event/WhenUserWasRegistered";

export class RegisterUserCommandHandler {

    execute(command, context) {
        if (context.logger) {
            context.logger('EXECUTING..');
            this.command = command;
        }

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!command || !command instanceof RegisterUserCommand) {
                    return reject(new FailedToCreateUserException("Command should be instance of RegisterUserCommand"));
                } try {
                    this.createUser().then((result) => {
                        let event = new WhenUserWasRegistered(command.user);
                        event.buildEmail();
                        resolve(result);
                    }).catch((errResult) => {
                        reject(new FailedToCreateUserException(errResult));
                    })
                } catch (exception) {
                    return reject(new FailedToCreateUserException("Cannot create a user caused by : " + exception));
                }
            }, 1000);
        });
    }

    createUser() {
        return new Promise((resolve, reject) => {
            UserDB.findOne({
                $or: [
                    {email: this.command.user.email.toString()},
                    {phone: this.command.user.phone},
                    {username: this.command.user.username}
                ]
            }).then((user) => {
                if (user !== null) {
                    reject('User is already exist!');
                } else {
                    UserDB.create({
                        name: this.command.user.name,
                        username: this.command.user.username,
                        email: this.command.user.email.toString(),
                        password: this.command.user.password.toString(),
                        address: this.command.user.address,
                        rolesId: this.command.user.rolesId,
                        phone: this.command.user.phone,
                        isApproved: false,
                        created_at: new Date(),
                        updated_at: new Date(),
                        secretKey: null,
                        accessKey: null
                    }).then((created) => {
                        resolve(created);
                    }).catch((errCreated) => {
                        reject(errCreated);
                    });
                }
            }).catch((errUser) => {
                reject(errUser);
            });
        });
    }

}