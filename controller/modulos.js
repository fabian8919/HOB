'use strict'
const express = require('express');
const router = express.Router();
const app = express();
const session = require("express-session");
const fns = require("../models/modulos");

/* Conectando el servidor a las sesiones */
app.use(session({
    secret: process.env.SESSION_KEY,
    saveUninitialized: true,
    resave: false,
}));

router.post('/modulos/', (req, res) => {
    (async ()=>{
        let resp = await fns.modulos(req.body);
        res.send(JSON.stringify(resp));
    })();
});

router.post('/modulos/extraerData/', (req, res) => {
    (async ()=>{
        let resp = await fns.modulosExtraer();
        res.send(JSON.stringify(resp));
    })();
});

router.post('/modulos/extraerDataId/', (req, res) => {
    (async ()=>{
        let resp = await fns.modulosExtraerId(req.body);
        res.send(JSON.stringify(resp));
    })();
});

router.post('/modulos/eliminarModulo/', (req, res) => {
    (async ()=>{
        let resp = await fns.modulosEliminarModulo(req.body);
        res.send(JSON.stringify(resp));
    })();
});

router.post('/modulos/extraerDataModulosPadre/', (req, res) => {
    (async ()=>{
        let resp = await fns.modulosExtraerDataModulosPadre();
        res.send(JSON.stringify(resp));
    })();
});

module.exports = router;