import assert from 'assert';
import {RegisterUserCommand} from './../../../src/Domain/User/Command/RegisterUserCommand';
import crypt from './../../../src/Infrastructure/Library/crypt';
import {User} from "../../../src/Domain/User/Model/User";
import {AttemptUserLoginCommand} from "../../../src/Domain/User/Command/AttemptUserLoginCommand";
import {describe, it} from 'mocha';

describe('#Register User', () => {
    let name = "Administrator Ganteng";
    let username = "asrulsibaoel";
    let email = "Email@admin.com";
    let password = "admin123";
    let rolesId = "143881234asjdfhsdfa89dsf";
    let phone = "089648282519";
    let address = "Griya melati indah, Kepanjenkidul, blitar";
    let hashedPassword = crypt.generatePassword(password).toString('hex');
    let isActive = false;

    let user = new User(username, password, email, name, phone, rolesId, address, isActive);
    let command = new RegisterUserCommand(user);
    describe('#Validate command parameter', () => {
        it('Should return "true" if command parameter is instance of User object', () => {
            assert.ok(command.user instanceof User);
        });
    });

    describe('#Validate User Input', () => {
        it('Should have "@" character on email', () => {
            assert.ok(command.user.email.toString().includes("@"));
        });
    });

    describe('Password should be hashed', () => {
        it('Should return hashed password', () => {
            assert.equal(hashedPassword, command.user.password.toString());
        });
    });


});

describe("#Login User", () => {

    describe("username must be instance of string", () => {
        it("Should return true if username instance of string", () => {

            let username = "admin";
            let password = "admin123";
            let command = new AttemptUserLoginCommand(username, password);

            assert.ok(typeof command.username == "string");
        });

        it("Should passed if password hashed correctly!", () => {
            let username = "admin";
            let password = "admin123";

            let command = new AttemptUserLoginCommand(username, password);

            assert.equal(password, command.password.toString());
        });

        it("Should return throw if username or password is empty", () => {
            assert.throws(() => {
                let username = "";
                let password = "";

                return new AttemptUserLoginCommand(username, password);
            }, Error, "username or password cannot be empty");
        });

        describe('Parameters value', () => {
            it('Should passed if username is same as expected', () => {
                let username = "admin";
                let password = "admin123";

                let command = new AttemptUserLoginCommand(username, password);
                assert.equal(username, command.username);
            });
            it('Should passed if password is same as expected', () => {
                let username = "admin";
                let password = "admin123";

                let command = new AttemptUserLoginCommand(username, password);
                assert.equal(password, command.password);
            });
        });
    });
});

describe("#Update user profile.", () => {
    describe("User id must be valid.", () => {
        let userId = "0763becd-b8f5-40b0-998a-d09cb0d57ac3";

        let name = "Administrator Ganteng";
        let username = "asrulsibaoel";
        let email = "Email@admin.com";
        let password = "admin123";
        let rolesId = "143881234asjdfhsdfa89dsf";
        let phone = "089648282519";
        let address = "Griya melati indah, Kepanjenkidul, blitar";
        let isActive = true;

        let user = new User(username, password, email, name, phone, rolesId, address, isActive);
        it('Should return OK if userId is a String', () => {
            let command = new UpdateUserProfileCommand(userId, user);

            assert.ok(typeof command.userId == "string");
        });

        it('Should throw an error if userId is not exist / invalid', () => {
            let userId = "";
            assert.throws(() => {
                return new UpdateUserProfileCommand(userId, user);
            }, Error, "userId must be valid!");
        });
    });
});
