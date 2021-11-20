'use strict'
const log = console.log;
const dotenv = require('dotenv').config();
const colors = require('colors');
const green = colors.green;
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const config = require('./configs/config');
const session = require("express-session");

/* Use Json */
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/* Conectando el servidor a las sesiones */
app.use(session({
    secret: process.env.SESSION_KEY,
    saveUninitialized: true,
    resave: false,
}));

/* Definiendo del motor de plantillas */
app.set('view engine', 'ejs');

/* Ruta estatica de los insumos */
app.use(express.static(__dirname + '/public'));

/* Requiriendo archivos para usar */
app.use('/', require('./controller/router'));

/* Levantando el servidor */
app.listen(process.env.PORT, () => {
    log(green('Servidor ejecutandose en http://localhost:3000'));
});