const nodemailer = require('nodemailer');

export class Mailer {
    constructor(receiver, subject, text, html) {
        this._from = 'Admin Cekstok.com <admin@cekstok.com>';
        this._receiver = receiver;
        this._subject = subject;
        this._text = text;
        this._html = html;
        this._transporter = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "af1cb91e8d4f18",
                pass: "1ebe4747467ef0"
            }
        });
        this.buildMailOptions();
    }

    buildMailOptions () {
        this._mailOptions = {
            from : this._from,
            to : this._receiver,
            subject : this._subject,
            text : this._text,
            html : this._html
        };
    }

    send() {
        this._transporter.sendMail(this._mailOptions, (error, info) => {
            if(error) {
                console.log(error);
                return error;
            }

            return info;
        });
    }

    get receiver() {
        return this._receiver;
    }

    set receiver(value) {
        this._receiver = value;
    }

    get transporter() {
        return this._transporter;
    }

    set transporter(value) {
        this._transporter = value;
    }

    get subject() {
        return this._subject;
    }

    set subject(value) {
        this._subject = value;
    }

    get text() {
        return this._text;
    }

    set text(value) {
        this._text = value;
    }

    get html() {
        return this._html;
    }

    set html(value) {
        this._html = value;
    }

    get from() {
        return this._from;
    }

    set from(value) {
        this._from = value;
    }
}