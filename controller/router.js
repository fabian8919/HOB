'use strict'
const express = require('express');
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
    res.render('index');
});

module.exports = router;