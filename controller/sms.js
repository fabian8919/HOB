'use strict'
const fns = require("../models/sms");

global.r.post('/sms/listarPlantillas/', (req, res) => {
    (async ()=>{
        let resp = await fns.listarPlantillas(req.session.clienteSelec);
        res.send(JSON.stringify(resp));
    })();
});

global.r.post('/sms/existePlantilla/', (req, res) => {
    (async ()=>{
        let resp = await fns.existePlantilla(req.body, req.session.clienteSelec);
        res.send(JSON.stringify(resp));
    })();
});

global.r.post('/sms/CreatePlantilla/', (req, res) => {
    (async ()=>{
        let resp = await fns.CreatePlantilla(req.body, req.session.clienteSelec);
        res.send(JSON.stringify(resp));
    })();
});

global.r.post('/sms/UpdatePlantilla/', (req, res) => {
    (async ()=>{
        let resp = await fns.UpdatePlantilla(req.body, req.session.clienteSelec);
        res.send(JSON.stringify(resp));
    })();
});

global.r.post('/sms/procesarMasivo/', (req, res) => {
    (async ()=>{
        let resp = await fns.procesarMasivo(req.body, req.files.file);
        res.send(JSON.stringify(resp));
    })();
});

module.exports = global.r;