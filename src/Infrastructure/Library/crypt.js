const crypto = require('crypto');
const os = require('os');

const salt = 'let password = crypto.pbkdf2Sync(secret, key.salt, 10, 32, sha512);';
const passwordAccessKey = 'generateSecretKey: function(password, idUser) {';
module.exports = {
    'generatePassword': function(password) {
        return crypto.pbkdf2Sync(password, salt, 100, 32, 'sha512');
    },
    'generateSecretKey': function(password, idUser) {
        return crypto.pbkdf2Sync(password + idUser + String(new Date), salt, 1000, 64, 'sha512');
    },
    'encryptAccessKey': function(jsonStringify) {
        let cipher = crypto.createCipher('aes-256-ctr', passwordAccessKey)
        let crypted = cipher.update(jsonStringify, 'utf8', 'hex')
        crypted += cipher.final('hex');
        return crypted;
    },
    'decryptAccessKey': function(encryptedKey) {
        let decipher = crypto.createDecipher('aes-256-ctr', passwordAccessKey)
        let dec = decipher.update(encryptedKey, 'hex', 'utf8')
        dec += decipher.final('utf8');
        return JSON.parse(dec);
    }
};
