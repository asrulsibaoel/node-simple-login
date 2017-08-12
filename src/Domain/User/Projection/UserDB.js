const mongoose = require('./../../../../config/index');
let Schema = mongoose.Schema;
let uuid = require('uuid');
const findOrCreate = require('mongoose-find-or-create');
const nestedSet = require('mongoose-nested-set');

let userDB = new Schema({
    _id: {
        type : String,
        default: uuid.v4
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: true,
        required: true
    },
    parentId : {
        type: String,
        default: null
    },
    accessKey : {
        type: String,
        default: null
    },
    lft : {
        type: String,
        default: null
    },
    rgt : {
        type: String,
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});
userDB.plugin(findOrCreate);
userDB.plugin(nestedSet);

let UserDB = mongoose.model('UserDB', userDB);
module.exports = UserDB;