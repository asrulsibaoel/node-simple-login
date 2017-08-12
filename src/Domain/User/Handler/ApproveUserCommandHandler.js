import {ApproveUserCommand} from "../Command/ApproveUserCommand";
import UserDB from './../Projection/UserDB';
import {FailedToUpdateUserException} from "../Exception/FailedToUpdateUserException";
import {UserNotFoundException} from "../Exception/UserNotFoundException";
import {WrongCommandException} from "../Exception/WrongCommandException";
import {WhenApproveUserWasExecuted} from "../Event/WhenApproveUserWasExecuted";

export class ApproveUserCommandHandler {
    execute(command, context) {
        let data;
        if(context.logger) {
            context.logger('EXECUTING..');
            this.command = command;
        }
        return new Promise((resolve, reject) => {
           setTimeout(() => {
               if (!command instanceof ApproveUserCommand) {
                   return reject(new WrongCommandException("command must be instance of ApproveUserCommand!"));
               }

               try {
                   data = this.saveData();
                   let event = new WhenApproveUserWasExecuted(data);
                   event.buildEmail();
                   return resolve(data);
               } catch (exception) {
                   return reject(exception);
               }
           },500);
        });
    }

    saveData() {
        return new Promise((resolve, reject) => {
            UserDB.findByIdAndUpdate(this.command.id,{
                $set : {isApproved : true}
            }, { new : true }, (err, data) => {
                if(err) return reject(new FailedToUpdateUserException("Cannot update the user caused by: " + err));
                if(data == null || !data || data == undefined) return reject(new UserNotFoundException("User is not found"));

                return resolve(data);
            });
        });
    }
}