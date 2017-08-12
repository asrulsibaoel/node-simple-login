import UserDB from './../Projection/UserDB';
import Crypt from './../../../Infrastructure/Library/crypt';
import {AttemptUserLoginCommand} from "../Command/AttemptUserLoginCommand";
import {WrongCommandException} from "../Exception/WrongCommandException";
import {InvalidRequiredAttributeException} from "../Exception/InvalidRequiredAttributeException";
import {UserNotFoundException} from "../Exception/UserNotFoundException";
import {FailedToLoginException} from "../Exception/FailedToLoginException";

export class AttemptUserLoginCommandHandler {
    execute(command, context) {
        if (context.logger) {
            // context.logger("EXECUTING COMMAND");
            this.command = command;
        }

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!command instanceof AttemptUserLoginCommand) return reject(new WrongCommandException("command must be instance of AttemptUserLoginCommand!"));
                if (typeof command.username != "string" && typeof command.password != "string") {
                    return reject(new InvalidRequiredAttributeException("Username or password must be string!"));
                }

                if (!(command.username && command.password)) {
                    return reject(new InvalidRequiredAttributeException("Username or password cannot be empty!"));
                }

                UserDB.findOne({
                    $or: [
                        {
                            username: command.username,
                            password: Crypt.generatePassword(command.password).toString('hex'),
                            isApproved: true
                        },
                        {
                            email: command.username,
                            password: Crypt.generatePassword(command.password).toString('hex'),
                            isApproved: true
                        }
                    ]
                }).populate({
                    model: "RoleDB",
                    path: "rolesId",
                    select: "name + accessList + level"
                }).then(function (user) {
                    if (user == null) {
                        //wrong attempt
                        return reject(new UserNotFoundException('Wrong username or password!'));
                    } else {
                        if (Crypt.generatePassword(command.password).toString('hex') == user.password) {
                            let secretKey = Crypt.generateSecretKey(user.password, user._id).toString('hex') + user._id;
                            let accessKey = Crypt.encryptAccessKey(JSON.stringify({
                                idUser: user._id,
                                level: user.rolesId.level,
                                accessList: user.rolesId.accessList,
                                created_at: new Date
                            }));

                            // UserDB.findByIdAndUpdate(user._id, {$set : {
                            //     secretKey: secretKey,
                            //     accessKey: accessKey,
                            //     updated_at: new Date()
                            // }}, {new: true}).then(function (updated) {

                                return resolve({
                                    secretKey: secretKey,
                                    accessKey: accessKey
                                });
                            // }).catch(function (errUpdated) {
                            //     return reject(new FailedToLoginException(errUpdated));
                            // });
                        } else {
                            return reject(new FailedToLoginException("You are not authorized to perform this action"));
                        }
                    }
                }).catch(function (err) {
                    return reject(new FailedToLoginException(err));
                });
            }, 500);

        });
    }
}