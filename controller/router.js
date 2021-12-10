'use strict'
const express = require('express');
const log = console.log
const router = express.Router();
const app = express();
const session = require("express-session");

/* Conectando el servidor a las sesiones */
app.use(session({
    secret: process.env.SESSION_KEY,
    saveUninitialized: true,
    resave: false,
}));

/* inicio */
router.get('/', (req, res) => {
    if (req.session.userid != null) {
        res.render('index', {
            modulos: req.session.modulos,
            padres: req.session.padres
        });
    } else {
        res.render('login');
    }
});

/* salir */
router.get('/salir', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;