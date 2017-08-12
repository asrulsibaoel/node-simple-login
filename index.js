const restify = require('restify');
const withMiddlewares = require('restify-routing-middleware-applier');
const CookieParser = require('restify-cookies');
const UserDB = require('./src/Domain/User/Projection/UserDB');
const crypt = require('./src/Infrastructure/Library/crypt');
const config = require('./config');
const clc = require('cli-color');

const server = restify.createServer({
    name: 'Middleware-Service-V3',
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(CookieParser.parse);

restify.CORS.ALLOW_HEADERS.push('content-type');
restify.CORS.ALLOW_HEADERS.push('access-key');
server.pre(restify.CORS({'origins': ['*']}));

require('./src/Http/AuthRouter')(server, withMiddlewares);

server.get('/', function (req, res, next) {
    res.status(200);
    res.send("SERVER IS ALREADY UP");
    return next();
});

const port = (process.env.PORT) ? process.env.PORT : 8030;
server.listen(
    port,
    function () {
        console.log("---[============]---\n" + clc.bgYellowBright(server.name + ' Listening at port: ' + port) + "\n---[============]---");

        let password = crypt.generatePassword('password');

        //default user for highest hiearchy

                let defUser = {
                    name: 'default user',
                    username: 'default',
                    password: password.toString('hex'),
                    phone: "default",
                    email: 'default',
                    address: 'default',
                    isApproved: true,
                    created_at: new Date,
                    updated_at: new Date,
                    secretKey: null,
                    accessKey: null
                };
                UserDB.findOrCreate({
                    username: "default"
                },defUser,(error, data) => {
                    if(error) {
                        console.log(err);
                    } else {

                        console.log("Default User created or already exist : " + data);
                    }
                });

    });
