'use strict'
const fns = require("../models/modulos");

global.r.post('/modulos/', (req, res) => {
    (async ()=>{
        let resp = await fns.modulos(req.body);
        res.send(JSON.stringify(resp));
    })();
});

global.r.post('/modulos/extraerData/', (req, res) => {
    (async ()=>{
        let resp = await fns.modulosExtraer();
        res.send(JSON.stringify(resp));
    })();
});

global.r.post('/modulos/extraerDataId/', (req, res) => {
    (async ()=>{
        let resp = await fns.modulosExtraerId(req.body);
        res.send(JSON.stringify(resp));
    })();
});

global.r.post('/modulos/eliminarModulo/', (req, res) => {
    (async ()=>{
        let resp = await fns.modulosEliminarModulo(req.body);
        res.send(JSON.stringify(resp));
    })();
});

global.r.post('/modulos/extraerDataModulosPadre/', (req, res) => {
    (async ()=>{
        let resp = await fns.modulosExtraerDataModulosPadre();
        res.send(JSON.stringify(resp));
    })();
});

module.exports = global.r;