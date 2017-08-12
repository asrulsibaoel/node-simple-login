import director from 'director.js';
import {RegisterUserCommand} from './../Domain/User/Command/RegisterUserCommand';
import {RegisterUserCommandHandler} from './../Domain/User/Handler/RegisterUserCommandHandler';
import {Decorator} from './../Domain/Decorator';
import {User} from './../Domain/User/Model/User';
import UserDB from './../Domain/User/Projection/UserDB';
import Crypt from './../Infrastructure/Library/crypt';

//exception handler
import {FailedToCreateUserException} from './../Domain/User/Exception/FailedToCreateUserException';
//reponses
import OkResponse from "./Response/OkResponse";
import InternalServerErrorResponse from "./Response/InternalServerErrorResponse";
import UnauthorizedResponse from "./Response/UnauthorizedResponse";
import InvalidResponse from "./Response/InvalidResponse";
import {AttemptUserLoginCommand} from "../Domain/User/Command/AttemptUserLoginCommand";
import {AttemptUserLoginCommandHandler} from "../Domain/User/Handler/AttemptUserLoginCommandHandler";
import {UserNotFoundException} from "../Domain/User/Exception/UserNotFoundException";

module.exports = (server, withMiddlewares) => {
    const promisesBus = director();

    function checkBodyParamFromRegister(req, res, next) {
        let email = req.body.email;
        let password = req.body.password;
        let name = req.body.name;
        let username = req.body.username;
        let address = req.body.address;
        let phone = req.body.phone;

        if (email && password && name && username && address && phone) {
            if (email.includes("@") && password != "" && name != "") {
                let splitedEmail = email.split("@");
                if (splitedEmail.length == 2) {
                    return next();
                } else {
                    InvalidResponse("Email or password must be valid!", res);
                }
            } else {
                console.log("Email or password must be valid!");
                InvalidResponse("Email or password must be valid!", res);
            }

        } else {
            console.log("Email, password, name, username, address and phone could not be empty!");
            InvalidResponse("Email, password, name, username, address and/ or phone cannot be empty!");
        }
    }

    function checkTokenLifeTime(req, res, next) {

        if (req.headers.accesskey && req.headers.accesskey != "") {
            let accessKey = Crypt.decryptAccessKey(req.headers.accesskey);

            if (accessKey) {
                if (accessKey.created_at != null) {
                    let dateNow = new Date();
                    let dateOnKey = new Date(accessKey.created_at);
                    let year = dateOnKey.getYear();
                    let month = dateOnKey.getMonth();
                    let date = dateOnKey.getDate();
                    if (dateNow.getYear() == year && dateNow.getMonth() == month && dateNow.getDate() == date) {
                        return next();
                    } else {
                        return UnauthorizedResponse("Your token is invalid or expired!", res);
                    }
                }
            }
        } else {

            return UnauthorizedResponse("Your token is invalid or expired!", res);
        }

        return UnauthorizedResponse("Your token is invalid or expired!", res);
    }


    withMiddlewares(server, checkBodyParamFromRegister, (custRoute) => {

        /**
         * @api {POST} /auth/register Register for user
         * @apiVersion 3.0.1
         * @apiName UserRegistration
         * @apiGroup User
         *
         * @apiParam {String} name *Users name.
         * @apiParam {String} email *Users email.
         * @apiParam {String} username *Users username.
         * @apiParam {String} password *Users password.
         * @apiParam {String} phone *Users phone.
         * @apiParam {String} address *Users address.
         * @apiParam {String} roleId (Optional) Users roleId.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
                    "success": true,
                    "status": 200,
                    "message": "Successfully logged in!",
                    "error_code": null,
                    "data": {
                        "secretKey": "b259eefa49c2d6af1502681c56ef56ee6654c9a9dc5032f4f32f03afa5dde23556bc3410c02721316b787c3b23e11c408711b352dcac0179e05dea600fca4ed80763becd-b8f5-40b0-998a-d09cb0d57ac3",
                        "accessKey": "e19c3b793385e7f5a6c66cd43e5ddd82b4c6c20d1e1862f61257cee82cbb083b13f8b64b4ca6a294ae95e4f21aa6654beacd811c08050e97309fe2c1a4e1a6c8519153b1b45f50b212a55ee0ecfc8131628fe07b15da4b75340f76bfcea018f2d9656a1545ec1d7bef9434bac81efc0e2e23c8"
                    }
            }
         *
         * @apiError InternalServerError 500 error.
         * @apiError InvalidException 400 Cannot create a user.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 505 Internal Server Error
         *     {
                "status": 500,
                "message": {
                    "error-code": 5,
                    "message": "Unhandled error caused by : Error: Wrong username or password!"
                },
                "data": {}
            }
         */
        custRoute.post('/auth/register', (req, res, next) => {
            let email = req.body.email;
            let password = req.body.password;
            let name = req.body.name;
            let username = req.body.username;
            let address = req.body.address;
            let phone = req.body.phone;
            let roleId = (req.body.roleId) ? req.body.roleId : null;

            RegisterUserCommand.prototype.ID = "RegisterUserCommand";
            promisesBus.registry.register(RegisterUserCommand.prototype.ID, new RegisterUserCommandHandler());

            let user = new User(username, password, email, name, phone, roleId, address, 0);
            const bus = new Decorator(promisesBus);
            bus.handle(new RegisterUserCommand(user))
                .then((data) => {
                    return OkResponse("Successfully registered a new user!", data, res);
                }).catch((exception) => {
                if (exception instanceof FailedToCreateUserException) {
                    return InternalServerErrorResponse("You are not authorized to access this page", res);
                } else {
                    return InternalServerErrorResponse("Unhandled error caused by : " + exception, res);
                }
            });
        });
    });

    withMiddlewares(server, checkTokenLifeTime, (customRoute) => {

        /**
         * @api {GET} /auth/get-user Check logged in session
         * @apiVersion 3.0.2
         * @apiName UserSession
         * @apiGroup User
         * @apiHeader {String} accesskey Users Unique accesskey
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
                    "success": true,
                    "status": 200,
                    "message": "Here the data",
                    "error_code": null,
                    "data": {
                        "_id": "0763becd-b8f5-40b0-998a-asdfasdfasd",
                        "name": "default user",
                        "username": "default",
                        "password": "hasdfuhasdfausdfjasdfa",
                        "phone": "default",
                        "email": "default",
                        "address": "default",
                        "status": 0,
                        "userType": "1",
                        "__v": 0,
                        "updated_at": "2017-07-28T07:40:43.183Z",
                        "created_at": "2017-07-28T07:40:43.183Z",
                        "warehouseId": null,
                        "accessKey": null,
                        "secretKey": null,
                        "parentId": null,
                        "rolesId": "3c4bf5fd-8049-427a-90f9-c9a77fdb0e0f",
                        "isApproved": true
                    }
                }
         *
         * @apiError InternalServerError 500 error.
         * @apiError InvalidException 400 error.
         * @apiError You are not logged in.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 401 Not Found
         *     {
                    "success": false,
                    "status": 401,
                    "message": "You are not logged in",
                    "error_code": 4,
                    "data": {}
                }
         */
        customRoute.get('/auth/get-user', (req, res, next) => {
            let decryptedKey = Crypt.decryptAccessKey(req.headers.accesskey);
            UserDB.findById(decryptedKey.idUser).then((data) => {
                return OkResponse("Here the data", data, res);
            }).catch((exception) => {
                return InvalidResponse(exception, res);
            });
        });

    });

    /**
     * @api {POST} /auth/login Login to the system
     * @apiVersion 3.0.1
     * @apiName UserLogin
     * @apiGroup User
     *
     * @apiParam {String} username Users username.
     * @apiParam {String} password Users passwords.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
                "success": true,
                "status": 200,
                "message": "Successfully logged in!",
                "error_code": null,
                "data": {
                    "secretKey": "b259eefa49c2d6af1502681c56ef56ee6654c9a9dc5032f4f32f03afa5dde23556bc3410c02721316b787c3b23e11c408711b352dcac0179e05dea600fca4ed80763becd-b8f5-40b0-998a-d09cb0d57ac3",
                    "accessKey": "e19c3b793385e7f5a6c66cd43e5ddd82b4c6c20d1e1862f61257cee82cbb083b13f8b64b4ca6a294ae95e4f21aa6654beacd811c08050e97309fe2c1a4e1a6c8519153b1b45f50b212a55ee0ecfc8131628fe07b15da4b75340f76bfcea018f2d9656a1545ec1d7bef9434bac81efc0e2e23c8"
                }
        }
     *
     * @apiError InternalServerError 500 error.
     * @apiError InvalidException 400 error.
     * @apiError User Not Found 404 error.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 500 Internal Server Error
     *     {
            "status": 500,
            "message": {
                "error-code": 5,
                "message": "Unhandled error caused by : Error: Wrong username or password!"
            },
            "data": {}
        }
     */
    server.post('/auth/login', (req, res, next) => {
        if (req.body.username && typeof req.body.username == "string" && req.body.username != "") {
            let username = req.body.username;
            let password = req.body.password;

            AttemptUserLoginCommand.prototype.ID = "AttemptUserLoginCommand";
            promisesBus.registry.register(AttemptUserLoginCommand.prototype.ID, new AttemptUserLoginCommandHandler());

            const bus = new Decorator(promisesBus);
            bus.handle(new AttemptUserLoginCommand(username, password))
                .then((data) => {
                    return OkResponse("Successfully logged in!", data, res);
                }).catch((exception) => {
                if (exception instanceof UserNotFoundException) {
                    return InvalidResponse(exception.message, res);
                } else {
                    return InternalServerErrorResponse("Unhandled error caused by : " + exception, res);
                }

            });
        } else {
            return InvalidResponse("Please input valid username or email address", res);
        }
    });

};
