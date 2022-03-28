'use strict'
const fns = require("../models/voz");

global.r.post('/voz/listarPlantillas/', (req, res) => {
    (async ()=>{
        let resp = await fns.listarPlantillas(req.session.clienteSelec);
        res.send(JSON.stringify(resp));
    })();
});

global.r.post('/voz/existePlantilla/', (req, res) => {
    (async ()=>{
        let resp = await fns.existePlantilla(req.body, req.session.clienteSelec);
        res.send(JSON.stringify(resp));
    })();
});

global.r.post('/voz/CreatePlantilla/', (req, res) => {
    (async ()=>{
        let resp = await fns.CreatePlantilla(req.body, req.session.clienteSelec);
        res.send(JSON.stringify(resp));
    })();
});

global.r.post('/voz/UpdatePlantilla/', (req, res) => {
    (async ()=>{
        let resp = await fns.UpdatePlantilla(req.body, req.session.clienteSelec);
        res.send(JSON.stringify(resp));
    })();
});

global.r.post('/voz/procesarMasivo/', (req, res) => {
    (async ()=>{
        let resp = await fns.procesarMasivo(req.body, req.files.file);
        res.send(JSON.stringify(resp));
    })();
});

module.exports = global.r;