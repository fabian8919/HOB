'use strict'
const express = require('express');
const log = console.log
const router = express.Router();
const app = express();
const jwt = require("jwt-simple");
const config = require("../configs/config");
const moment = require("moment");
const session = require("express-session");
const { cyan } = require('colors');

/* Conectando el servidor a las sesiones */
app.use(session({
    secret: process.env.SESSION_KEY,
    saveUninitialized: true,
    resave: false,
}));

/* inicio */
router.get('/:tk', (req, res) => {

    if(req.params.tk != 'salir'){
        var payload = jwt.decode(req.params.tk, config.key);
        if (payload.exp <= moment().unix()) {
            res.redirect('/');
        } else {
            req.session.userid = payload.sub;
            res.render('login', {recovery : true});
        }
    }else if(req.params.tk == 'salir'){
        req.session.destroy();
        res.redirect('/');
    }else {
       
        if (req.session.userid != null) {
            res.render('index', {
                modulos: req.session.modulos,
                padres: req.session.padres
            });
        } else {
            res.render('login', {recovery: false});
        }
    }
});

router.get('/', (req, res) => {
    if (req.session.userid != null) {
        res.render('index', {
            modulos: req.session.modulos,
            padres: req.session.padres
        });
    } else {
        res.render('login', {recovery: false});
    }
});

/* salir */
// router.get('/salir', (req, res) => {
//     req.session.destroy();
//     res.redirect('/');
// });

module.exports = router;