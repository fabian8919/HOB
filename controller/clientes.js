'use strict'
const express = require('express');
const router = express.Router();
const app = express();
const session = require("express-session");
const fns = require("../models/clientes");

/* Conectando el servidor a las sesiones */
app.use(session({
    secret: process.env.SESSION_KEY,
    saveUninitialized: true,
    resave: false,
}));

router.post('/clientes/', (req, res) => {
    (async ()=>{
        let resp = await fns.clientes(req.body);
        res.send(JSON.stringify(resp));
    })();
});

router.post('/clientes/extraerData', (req, res) => {
    (async ()=>{
        let resp = await fns.clientesExtraer();
        res.send(JSON.stringify(resp));
    })();
});

router.post('/clientes/extraerDataId/', (req, res) => {
    (async ()=>{
        let resp = await fns.clientesExtraerId(req.body);
        res.send(JSON.stringify(resp));
    })();
});

router.post('/clientes/eliminarCliente/', (req, res) => {
    (async ()=>{
        let resp = await fns.clientesEliminarCliente(req.body);
        res.send(JSON.stringify(resp));
    })();
});

module.exports = router;