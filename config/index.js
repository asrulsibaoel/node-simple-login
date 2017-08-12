const mongoose = require('mongoose');
const promise= require('bluebird');
mongoose.Promise = promise;
mongoose.Promise = global.Promise;
// require('dotenv').config({path: '.env'});

let env = (process.env.NODE_ENV) ? process.env.NODE_ENV : 'local';
const config = mongoose.connect(dbServer[env]);

module.exports = config;
