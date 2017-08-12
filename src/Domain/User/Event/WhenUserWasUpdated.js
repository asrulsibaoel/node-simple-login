import {User} from "../Model/User";
import http from "request";
import urls from './../../../../config/urls.json';

export class WhenUserWasUpdated {
    constructor(user) {
        if (!user instanceof User) {
            throw new Error("The parameter user must be instance of User class");
        } else {
            this._user = user;
        }
    }

    get user() {
        return this._user;
    }

    set user(value) {
        this._user = value;
    }

    buildAndSend() {
        if (this._user.email && typeof this._user.email == "string" && this._user.email.includes("@")) {
            http.post({
                url: urls['mail'] + '/mail',
                headers: {
                    'secretkey': urls['x-access-key-ext']
                },
                body: {
                    to: this._user.email,
                    subject: "Update Profile CEKSTOK",
                    html: "<h1>Profil Akun Anda Telah Diubah.</h1><p>Hai, " + this._user.name + ", Akun anda telah diubah pada tanggal " + new Date() + ".</p>Apabila anda tidak merasa mengubahnya, silahkan periksa kembali keamanan akun anda terutama pada kata sandi/ password anda.<br><p>Terima kasih.</p>"
                },
                json: true
            }, function (error, response, body) {
                if (error) {
                    throw new Error('There\'s an error occured while sending an email to ' + this._user.email + ' caused by: ' + error);
                } else if (response.statusCode != 200) {
                    throw new Error('There\'s an error occured while sending an email to ' + this._user.email);
                } else {
                    console.log('Email sent to ' + this._user.email);
                    return body;
                }
            });
        } else {
            throw new Error("Wrong email!");
        }
    }
}