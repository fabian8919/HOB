'use strict'
const express = require('express');
const router = express.Router();
const app = express();
const session = require("express-session");
const fns = require("../models/stickers");

/* Conectando el servidor a las sesiones */
app.use(session({
    secret: process.env.SESSION_KEY,
    saveUninitialized: true,
    resave: false,
}));

router.post('/stickers/CrearPaquete/', (req, res) => {
    (async ()=>{
        let resp = await fns.CrearPaquete(req.body, req.session.clienteSelec);
        res.send(JSON.stringify(resp));
    })();
});

router.post('/stickers/UpdatePaquete/', (req, res) => {
    (async ()=>{
        let resp = await fns.UpdatePaquete(req.body);
        res.send(JSON.stringify(resp));
    })();
});

router.post('/stickers/extraerData/', (req, res) => {
    (async ()=>{
        let resp = await fns.extraerData(req.session.clienteSelec);
        res.send(JSON.stringify(resp));
    })();
});

router.post('/stickers/extraerStickers/', (req, res) => {
    (async ()=>{
        let resp = await fns.extraerStickers(req.body);
        res.send(JSON.stringify(resp));
    })();
});

router.post('/stickers/eliminarPaquete/', (req, res) => {
    (async ()=>{
        let resp = await fns.eliminarPaquete(req.body, req.session.clienteSelec);
        res.send(JSON.stringify(resp));
    })();
});


router.post('/stickers/CargarStickers/', (req, res) => {
    (async ()=>{
        let resp = await fns.CargarStickers(req.body, req.files, req.session.clienteSelec);
        res.send(JSON.stringify(resp));
    })();
});

module.exports = router;