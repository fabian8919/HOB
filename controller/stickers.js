'use strict'
const fns = require("../models/stickers");

global.r.post('/stickers/CrearPaquete/', (req, res) => {
    (async ()=>{
        let resp = await fns.CrearPaquete(req.body, req.session.clienteSelec);
        res.send(JSON.stringify(resp));
    })();
});

global.r.post('/stickers/UpdatePaquete/', (req, res) => {
    (async ()=>{
        let resp = await fns.UpdatePaquete(req.body);
        res.send(JSON.stringify(resp));
    })();
});

global.r.post('/stickers/extraerData/', (req, res) => {
    (async ()=>{
        let resp = await fns.extraerData(req.session.clienteSelec);
        res.send(JSON.stringify(resp));
    })();
});

global.r.post('/stickers/extraerStickers/', (req, res) => {
    (async ()=>{
        let resp = await fns.extraerStickers(req.body);
        res.send(JSON.stringify(resp));
    })();
});

global.r.post('/stickers/eliminarPaquete/', (req, res) => {
    (async ()=>{
        let resp = await fns.eliminarPaquete(req.body, req.session.clienteSelec);
        res.send(JSON.stringify(resp));
    })();
});

global.r.post('/stickers/eliminarSticker/', (req, res) => {
    (async ()=>{
        let resp = await fns.eliminarSticker(req.body);
        res.send(JSON.stringify(resp));
    })();
});

global.r.post('/stickers/CargarStickers/', (req, res) => {
    (async ()=>{
        let resp = await fns.CargarStickers(req.body, req.files, req.session.clienteSelec);
        res.send(JSON.stringify(resp));
    })();
});

module.exports = global.r;