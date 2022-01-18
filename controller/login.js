'use strict'
const express = require('express');
const router = express.Router();
const app = express();
const log = console.log;
const md5 = require('md5');
const _ = require('lodash');
const session = require("express-session");
const fns = require("../models/login");
const mailer = require("../models/mailer");

/* Conectando el servidor a las sesiones */
app.use(session({
    secret: process.env.SESSION_KEY,
    saveUninitialized: true,
    resave: false,
}));

router.post('/login', (req, res) => {
    (async () => {
        let resp = await fns.login(req.body);
        if (!resp.error) {
            req.session.userid = resp.id;
            req.session.cedula = resp.cedula;
            req.session.nombre = resp.nombre;
            req.session.correo = resp.correo;
            let respUser = await fns.dataUserLogin(req.session.userid);
            req.session.modulos = respUser.modulos;
            req.session.padres = respUser.padres;
            req.session.error = (!req.error) ? "" : req.error;
            res.send(req.session);
        } else {
            res.send(JSON.stringify(resp));
        }
    })();
});

router.post('/recovery', (req, res) => {
    var resp = {};
    chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM usuarios WHERE correo = ?", {
        replacements: [req.body.email]
    }).then(([userData]) => {
        if (_.size(userData) > 0) {
            (async () => {
                let correo = await mailer.sendEmailRecovery(userData);
                if(correo){
                    resp.exito = "Hemos enviado un correo electronico a: " + userData[0].correo;
                } else {
                    resp.error = "Error al enviar correo electronico.";
                }
                res.send(JSON.stringify(resp));
            })();
        } else {
            resp.error = "El correo electrónico no se encuentra registrado en nuestro sistema.";
            res.send(JSON.stringify(resp));
        }
    });
});

router.post('/password', (req, res) => {
    var resp = {};
    chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM usuarios WHERE id = ?", {
        replacements: [req.session.userid]
    }).then(([userData]) => {
        if (_.size(userData) > 0) {
            if(userData[0].contrasena == md5(req.body.pass)){
                resp.error = "Error, la contraseña no puede ser igual a la actual.";
                res.send(JSON.stringify(resp));
            } else {
                chatbot.query(process.env.DATEBASE_ENCODING + "UPDATE usuarios SET contrasena = ? WHERE id = ?", {
                    replacements: [md5(req.body.pass), req.session.userid]
                }).then(([update]) => {
                    req.session.destroy();
                    resp.exito = "Contraseña actualizada correctamente.";
                    res.send(JSON.stringify(resp));
                });
            }
        } else {
            resp.error = "Error, contacte al administrador del sistema.";
            res.send(JSON.stringify(resp));
        }
    });
});

module.exports = router;