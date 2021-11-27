'use strict'
const express = require('express');
const router = express.Router();
const app = express();
const session = require("express-session");
const fns = require("../models/modulosPadre");

/* Conectando el servidor a las sesiones */
app.use(session({
    secret: process.env.SESSION_KEY,
    saveUninitialized: true,
    resave: false,
}));

router.post('/modulosPadre/', (req, res) => {
    (async ()=>{
        let resp = await fns.modulosPadre(req.body);
        res.send(JSON.stringify(resp));
    })();
});

router.post('/modulosPadre/extraerData/', (req, res) => {
    (async ()=>{
        let resp = await fns.modulosPadreExtraer();
        res.send(JSON.stringify(resp));
    })();
});

router.post('/modulosPadre/extraerDataId/', (req, res) => {
    (async ()=>{
        let resp = await fns.modulosPadreExtraerId(req.body);
        res.send(JSON.stringify(resp));
    })();
});

router.post('/modulosPadre/eliminarModulo/', (req, res) => {
    (async ()=>{
        let resp = await fns.modulosPadreEliminarModulo(req.body);
        res.send(JSON.stringify(resp));
    })();
});

module.exports = router;