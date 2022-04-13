'use strict'
const fns = require("../models/api_mensajeria");

global.r.post('/apiMensajeria/GetRedes/', (req, res) => {
    (async ()=>{
        let resp = await fns.GetRedes(req.session.clienteSelec);
        res.send(JSON.stringify(resp));
    })();
});

global.r.post('/apiMensajeria/GetRedesAsociadas/', (req, res) => {
    (async ()=>{
        let resp = await fns.GetRedesAsociadas(req.session.clienteSelec);
        res.send(JSON.stringify(resp));
    })();
});

global.r.post('/apiMensajeria/createChannelId/', (req, res) => {
    (async ()=>{
        let resp = await fns.createChannelId(req.session.clienteSelec, req.body);
        res.send(JSON.stringify(resp));
    })();
});

global.r.post('/apiMensajeria/validarBirdKey/', (req, res) => {
    (async ()=>{
        let resp = await fns.validarBirdKey(req.session.clienteSelec);
        res.send(JSON.stringify(resp));
    })();
});

global.r.post('/apiMensajeria/redSocial/', (req, res) => {
    (async ()=>{
        let resp = await fns.redSocial(req.body);
        res.send(JSON.stringify(resp));
    })();
});

global.r.post('/apiMensajeria/createBirdKey/', (req, res) => {
    (async ()=>{
        let resp = await fns.createBirdKey(req.session.clienteSelec,req.body);
        res.send(JSON.stringify(resp));
    })();
});

global.r.post('/apiMensajeria/updateBirdKey/', (req, res) => {
    (async ()=>{
        let resp = await fns.updateBirdKey(req.body);
        res.send(JSON.stringify(resp));
    })();
});
    
module.exports = global.r;