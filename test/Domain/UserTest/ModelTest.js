import assert from 'assert';
import {UserEmail} from "../../../src/Domain/User/Model/UserEmail";
import crypt from './../../../src/Infrastructure/Library/crypt';
import {User} from "../../../src/Domain/User/Model/User";

describe('#UserEmail test', () => {
    let email = "asrulsibaoel@gmail.com";
    let userEmail = new UserEmail(email);
    it('Should passed if return value is "asrulsibaoel".', () => {
        let splittedMail = email.split('@');

        assert.equal(splittedMail[0], userEmail.parsedEmail()[0]);
    });

    it('Should passed if return value is "gmail".', () => {
        let splittedMail = email.split('@');

        assert.equal(splittedMail[1], userEmail.domainName);
    });

    it('Should passed if return value is "gmail".', () => {
        let splittedMail = email.split('@');

        assert.equal(splittedMail[0], userEmail.userEmailName);
    });


});

describe('#User test', () => {
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

    it('Should throw an exception if email not set correctly.', () => {
        let email2 = "";
        let user2 = new User(username, password, email2, name, phone, rolesId, address, isActive);
        assert.throws(() => {
            return user2;
        }, Error, 'Invalid email address.');
    });
});

