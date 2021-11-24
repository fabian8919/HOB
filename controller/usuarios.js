'use strict'
const express = require('express');
const router = express.Router();
const app = express();
const session = require("express-session");
const fns = require("../models/usuarios");

/* Conectando el servidor a las sesiones */
app.use(session({
    secret: process.env.SESSION_KEY,
    saveUninitialized: true,
    resave: false,
}));

router.post('/usuarios/', (req, res) => {
    (async ()=>{
        let resp = await fns.usuarios(req.body);
        res.send(JSON.stringify(resp));
    })();
});

router.post('/usuarios/extraerData', (req, res) => {
    (async ()=>{
        let resp = await fns.usuariosExtraer();
        res.send(JSON.stringify(resp));
    })();
});

router.post('/usuarios/ExtraerId', (req, res) => {
    (async ()=>{
        let resp = await fns.usuariosExtraerId(req.body);
        res.send(JSON.stringify(resp));
    })();
});

module.exports = router;