import http from 'request';
import urls from './../../../../config/urls.json';

export class WhenApproveUserWasExecuted {
    constructor(data) {
        this._data = data;
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
    }

    buildEmail() {
        if (this._data.email && typeof this._data.email == "string" && this._data.email.includes("@")) {
            http.post({
                url: urls['mail'] + '/mail',
                headers: {
                    'secretkey': urls['x-access-key-ext']
                },
                body: {
                    to: this._data.email,
                    subject: "Pendaftaran Keanggotaan VIP CEKSTOK",
                    html: "<h1>PENDAFTARAN KEANGGOTAAN VIP CEKSTOK</h1><p>Hai "+ this._data.name +", akun anda dengan email ["+ this._data.email +"] telah kami konfirmasi.</p><br/>Selamat Bergabung dengan CEKSTOK.COM!.<br/><p>Terima kasih.</p>"
                },
                json: true
            }, function(error, response, body) {
                if (error) {
                    throw new Error('There\'s an error occured while sending an email to ' + this._data.email + 'caused by: ' + error);
                } else if (response.statusCode != 200) {
                    throw new Error('There\'s an error occured while sending an email to ' + this._data.email);
                } else {
                    console.log('Email sent to ' + this._data.email);
                    return body;
                    // console.log(body);
                }
            });
        } else {
            throw new Error("Wrong email!");
        }
    }
}