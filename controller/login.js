'use strict'
const express = require('express');
const router = express.Router();
const app = express();
const log = console.log;
const session = require("express-session");
const fns = require("../models/login");

/* Conectando el servidor a las sesiones */
app.use(session({
    secret: process.env.SESSION_KEY,
    saveUninitialized: true,
    resave: false,
}));

router.post('/login', (req, res) => {
    (async () => {
        let resp = await fns.login(req.body);
        if(!resp.error){
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

module.exports = router;