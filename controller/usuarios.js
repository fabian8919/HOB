'use strict'
const express = require('express');
const router = express.Router();
const app = express();
const session = require("express-session");
const fns = require("../models/usuarios");

/* Conectando el servidor a las sesiones */
app.use(session({
    secret: process.env.SESSION_KEY,
    saveUninitialized: true,
    resave: false,
}));

router.post('/usuarios/', (req, res) => {
    (async () => {
        let resp = await fns.usuarios(req.body);
        res.send(resp);
    })();
});

router.post('/usuarios/extraerData', (req, res) => {
    (async () => {
        let resp = await fns.usuariosExtraer();
        res.send(JSON.stringify(resp));
    })();
});

router.post('/usuarios/ExtraerId', (req, res) => {
    (async () => {
        let resp = await fns.usuariosExtraerId(req.body);
        res.send(JSON.stringify(resp));
    })();
});

router.post('/usuarios/DuplicadoCedula', (req, res) => {
    (async () => {
        let resp = await fns.usuariosDuplicadoCedula(req.body);
        res.send(resp);
    })();
});

router.post('/usuarios/ValidarContrasena', (req, res) => {
    (async () => {
        req.body.cedula = req.session.cedula;
        let resp = await fns.usuariosValidarContrasena(req.body);
        res.send(resp);
    })();
});

router.post('/usuario/UsuarioCliente', (req, res) => {
    (async () => {
        let resp = await fns.usuariosClienteUsuario(req.body);
        res.send(resp);
    })();
});

router.post('/clientes/extraerUsuariosId', (req, res) => {
    (async () => {
        let resp = await fns.usuariosextraerUsuariosId(req.body);
        res.send(resp);
    })();
});

router.post('/usuario/QuitarUsuarioCliente', (req, res) => {
    (async () => {
        let resp = await fns.removeUserClient(req.body);
        res.send(resp);
    })();
});

router.post('/usuario/UsuarioModulo', (req, res) => {
    (async () => {
        let resp = await fns.asociarModuloUser(req.body);
        res.send(resp);
    })();
});

router.post('/clientes/extraerModulosId', (req, res) => {
    (async () => {
        let resp = await fns.extraerModulosId(req.body);
        res.send(resp);
    })();
});

router.post('/usuario/QuitarUsuarioModulo', (req, res) => {
    (async () => {
        let resp = await fns.quitarModuloUsuario(req.body);
        res.send(resp);
    })();
});

router.post('/usuarios/extraerPermisosId/', (req, res) => {
    (async () => {
        let resp = await fns.extraerPermisosId(req.body);
        res.send(resp);
    })();
});

router.post('/usuario/UsuarioPermiso/', (req, res) => {
    (async () => {
        let resp = await fns.UsuarioPermiso(req.body);
        res.send(resp);
    })();
});

router.post('/usuario/QuitarUsuarioPermiso/', (req, res) => {
    (async () => {
        let resp = await fns.QuitarUsuarioPermiso(req.body);
        res.send(resp);
    })();
});

module.exports = router;