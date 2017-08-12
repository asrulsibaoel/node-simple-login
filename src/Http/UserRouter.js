import director from 'director.js';
import UserDB from './../Domain/User/Projection/UserDB';
import Crypt from './../Infrastructure/Library/crypt';
import OkResponse from './Response/OkResponse';
import {Decorator} from './../Domain/Decorator';
import UnauthorizedResponse from './Response/UnauthorizedResponse';
import NotFoundResponse from './Response/NotFoundResponse';
import InvalidResponse from './Response/InvalidResponse';
import InternalServerErrorResponse from './Response/InternalServerErrorResponse';
import Urls from './../../config/urls.json';
import {UpdateUserProfileCommand} from "../Domain/User/Command/UpdateUserProfileCommand";
import {RegisterUserCommandHandler} from "../Domain/User/Handler/RegisterUserCommandHandler";
import {User} from "../Domain/User/Model/User";
import {FailedToUpdateUserException} from "../Domain/User/Exception/FailedToUpdateUserException";

module.exports = (server, withMiddlewares) => {
    const promisesBus = director();

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

    function checkIsRightUser(req, res, next) {
        let secretKey = Crypt.decryptAccessKey((req.headers.accesskey));
        if (secretKey.level <= 1 || secretKey.idUser == req.params.id) {

            return next();
        }

        return UnauthorizedResponse("You are not authorized to perform this action!", res);
    }

    withMiddlewares(server, checkTokenLifeTime, (route) => {
        /**
         * @api {POST} /user/profile/update/ Approve registered user.
         * @apiVersion 3.0.1
         * @apiName ApproveUser
         * @apiGroup User
         * @apiHeader {String} accesskey Users Unique accesskey
         *
         * @apiParam {Number} id Users unique ID.
         *
         * @apiSuccessExample Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "firstname": "John",
         *       "lastname": "Doe"
         *     }
         *
         * @apiError UserNotFound The id of the User was not found.
         *
         * @apiErrorExample Error-Response:
         *     HTTP/1.1 404 Not Found
         *     {
         *       "error": "UserNotFound"
         *     }
         */
        route.post('/user/edit/:id', (req, res, next) => {
            let accessKey = Crypt.decryptAccessKey(req.headers.accesskey);
            let userId = req.params.id;
            let idUser = accessKey.idUser;

            let isAllowed = () => {
                //is user him/ her self
                if (userId == idUser) {
                    return true;
                } else {
                    UserDB.findById(idUser, (error, user) => {
                        UserDB.rebuildTree(user, 1, () => {
                            // if () {
                            //
                            // }

                        });
                    });
                }
            };

            if (isAllowed) {
                saveProfile(req, res);
            } else {
                UnauthorizedResponse("You are not authorized to perform this action", res);
            }
        });
    });
};

function saveProfile(req, res) {
    const promisesBus = director();

    let email = req.body.email;
    let password = req.body.password;
    let name = req.body.name;
    let username = req.body.username;
    let address = req.body.address;
    let phone = req.body.phone;
    let roleId = (req.body.roleId) ? req.body.roleId : null;
    let isApproved = (req.body.isApproved) ? req.body.isApproved : false;
    let warehouseId = (req.body.warehouseId) ? req.body.warehouseId : null;
    let parentId = (req.body.isApproved) ? req.body.parentId : false;


    UpdateUserProfileCommand.prototypeID = "UpdateUserProfileCommand";
    promisesBus.registry.register(UpdateUserProfileCommand.prototype.ID, new RegisterUserCommandHandler());

    let user = new User(username, password, email, name, phone, roleId, address, isApproved, warehouseId, parentId);
    const bus = new Decorator(promisesBus);
    bus.handle(new UpdateUserProfileCommand(user))
        .then((data) => {
            return OkResponse("Successfully registered a new user!", data, res);
        }).catch((exception) => {
        if (exception instanceof FailedToUpdateUserException) {
            return InternalServerErrorResponse("You are not authorized to access this page", res);
        } else {
            return InternalServerErrorResponse("Unhandled error caused by : " + exception, res);
        }
    });
}