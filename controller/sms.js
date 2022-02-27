'use strict'
const express = require('express');
const router = express.Router();
const app = express();
const session = require("express-session");
const fns = require("../models/sms");

/* Conectando el servidor a las sesiones */
app.use(session({
    secret: process.env.SESSION_KEY,
    saveUninitialized: true,
    resave: false,
}));

router.post('/sms/listarPlantillas/', (req, res) => {
    (async ()=>{
        let resp = await fns.listarPlantillas(req.session.clienteSelec);
        res.send(JSON.stringify(resp));
    })();
});

router.post('/sms/existePlantilla/', (req, res) => {
    (async ()=>{
        let resp = await fns.existePlantilla(req.body, req.session.clienteSelec);
        res.send(JSON.stringify(resp));
    })();
});

router.post('/sms/CreatePlantilla/', (req, res) => {
    (async ()=>{
        let resp = await fns.CreatePlantilla(req.body, req.session.clienteSelec);
        res.send(JSON.stringify(resp));
    })();
});

router.post('/sms/UpdatePlantilla/', (req, res) => {
    (async ()=>{
        let resp = await fns.UpdatePlantilla(req.body, req.session.clienteSelec);
        res.send(JSON.stringify(resp));
    })();
});

module.exports = router;