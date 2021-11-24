'use strict'
const express = require('express');
const router = express.Router();
const app = express();
const session = require("express-session");
const fns = require("../models/permisos");

/* Conectando el servidor a las sesiones */
app.use(session({
    secret: process.env.SESSION_KEY,
    saveUninitialized: true,
    resave: false,
}));

router.post('/permisos/', (req, res) => {
    (async ()=>{
        let resp = await fns.permisos(req.body);
        res.send(JSON.stringify(resp));
    })();
});

router.post('/permisos/extraerData/', (req, res) => {
    (async ()=>{
        let resp = await fns.permisosExtraer();
        res.send(JSON.stringify(resp));
    })();
});

router.post('/permisos/extraerDataId/', (req, res) => {
    (async ()=>{
        let resp = await fns.permisosExtraerId(req.body);
        res.send(JSON.stringify(resp));
    })();
});

module.exports = router;