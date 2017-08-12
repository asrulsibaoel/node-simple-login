import assert from 'assert';
import {InvalidRequiredAttributeException} from "../../../src/Domain/User/Exception/InvalidRequiredAttributeException";
import {FailedToCreateUserException} from "../../../src/Domain/User/Exception/FailedToCreateUserException";

describe("#InvalidRequiredAttributeException test", () => {
    describe("message test", () => {
        it("Should return 'message parameter must be string' exception if message is not string", () => {
            assert.throws(() => {
                return new InvalidRequiredAttributeException(123);
            }, Error, 'message parameter must be string');
        });
    });
});

describe("#FailedToCreateUserException test", () => {
    describe("message test", () => {
        it("Should return 'message parameter must be string' exception if message is not string", () => {
            assert.throws(() => {
                return new FailedToCreateUserException(123);
            }, Error, 'message parameter must be string');
        });
    });
});