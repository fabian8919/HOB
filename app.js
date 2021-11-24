'use strict'
const log = console.log;
const dotenv = require('dotenv').config();
const colors = require('colors');
const green = colors.green;
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const session = require("express-session");
const Sequelize = require('sequelize');

global.chatbot = new Sequelize(process.env.DATEBASE_NAME, process.env.DATEBASE_USER, process.env.DATEBASE_PASS, {
    host: process.env.DATEBASE_HOST,
    dialect: 'postgres',
    logging: false
});

/* Validando conexion con la base de datos */
chatbot.authenticate()
    .then(() => {
        log(green('Conexión base de datos establecida'));
    })
    .catch(err => {
        log(red('Error al conectar a la base de datos: chatbot'), err);
        return false;
    });


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
app.use('/', require('./controller/clientes'));
app.use('/', require('./controller/usuarios'));

/* Levantando el servidor */
app.listen(process.env.PORT, () => {
    log(green('Servidor ejecutandose en http://localhost:3000'));
});