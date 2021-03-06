'use strict'
const log = console.log;
const dotenv = require('dotenv').config();
const colors = require('colors');
const green = colors.green;
const red = colors.red;
const cyan = colors.cyan;
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const router = express.Router();
const session = require("express-session");
const Sequelize = require('sequelize');
const mailer = require('nodemailer');
const fileupload = require("express-fileupload");

global.log = console.log;
global.cyan = cyan;
global.red = red;
global.green = green;
global.r = router;
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
app.use(fileupload());

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
app.use('/', require('./controller/permisos'));
app.use('/', require('./controller/modulos'));
app.use('/', require('./controller/modulosPadre'));
app.use('/', require('./controller/login'));
app.use('/', require('./controller/sms'));
app.use('/', require('./controller/voz'));
app.use('/', require('./controller/stickers'));

/* Correo */
global.transpotmail = mailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'angelus1623@gmail.com',
      pass: 'Gelux*45/20'
    }
  });

/* Levantando el servidor */
app.listen(process.env.PORT, () => {
    log(green('Servidor ejecutandose en http://localhost:3000'));
});