const log = console.log;
const express = require('express');
const app = express();
const _ = require('lodash');
const colors = require('colors');
const red = colors.red;
const cyan = colors.cyan;
const green = colors.green;
const session = require("express-session");
const fs = require('fs');
const jwt = require("jwt-simple");
const moment = require("moment");
const config = require("../configs/config");
const handlebars = require('handlebars');

/* Conectando el servidor a las sesiones */
app.use(session({
    secret: process.env.SESSION_KEY,
    saveUninitialized: true,
    resave: false,
}));

var fns = module.exports = {
    sendEmailRecovery: async function (data) {
        return new Promise(
            (resolve, reject) => {

                var token = createToken(data[0].id);

                readHTMLFile('public/assets/mails/recoveryPassword.html', function (err, html) {

                    var template = handlebars.compile(html);
                    var replacements = {
                        nombres: data[0].nombre,
                        url: "http://localhost:3000/"+token
                    };

                    var htmlToSend = template(replacements);

                    var mailOptions = {
                        from: 'House Of Bot',
                        to: data[0].correo,
                        subject: 'Recuperación de contraseña',
                        html: htmlToSend
                    };

                    transpotmail.sendMail(mailOptions, function (error, response) {
                        if (error) {
                            console.log(error);
                            callback(error);
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    });
                });
                resolve(true);
            }
        );
    }
}

var readHTMLFile = function (path, callback) {
    fs.readFile(path, {
        encoding: 'utf-8'
    }, function (err, html) {
        if (err) {
            callback(err);
            throw err;
        } else {
            callback(null, html);
        }
    });
};

var createToken = function (userid) {
    var payload = {
        sub: userid,
        iat: moment().unix(),
        exp: moment().add(3, "hours").unix(),
    };
    return jwt.encode(payload, config.key);
};