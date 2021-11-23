const log = console.log;
const express = require('express');
const app = express();
const _ = require('lodash');
const colors = require('colors');
const red = colors.red;
const yellow = colors.yellow;
const cyan = colors.cyan;
const green = colors.green;
const Sequelize = require('sequelize');
const session = require("express-session");

/* Conectando el servidor a las sesiones */
app.use(session({
    secret: process.env.SESSION_KEY,
    saveUninitialized: true,
    resave: false,
}));

const db = new Sequelize(process.env.DATEBASE_NAME, process.env.DATEBASE_USER, process.env.DATEBASE_PASS, {
    host: process.env.DATEBASE_HOST,
    dialect: 'postgres',
    logging: false
});

/* Validando conexion con la base de datos */
db.authenticate()
    .then(() => {
        log(green('Conexión base de datos establecida'));
    })
    .catch(err => {
        log(red('Error al conectar a la base de datos: '), err);
        return false;
    });

var fns = module.exports = {
    clientes: async function (data) {
        log(yellow("Ingresa: clientes"));
        return new Promise(
            (resolve, reject) => {
                var activo = (data.Clientes_activo == "on") ? true : false;
                db.query(process.env.DATEBASE_ENCODING + "SELECT * FROM clientes WHERE nit = ?", {
                    replacements: [data.Clientes_nit]
                }).then(([clienteData]) => {
                    if(_.size(clienteData) <= 0){
                        db.query(process.env.DATEBASE_ENCODING + "INSERT INTO public.clientes(nit, razon_social, activo, telefono, direccion, correo) VALUES (?, ?, ?, ?, ?, ?) RETURNING id", {
                            replacements: [data.Clientes_nit, data.Clientes_razon_social, activo, data.Clientes_telefono, data.Clientes_direccion, data.Clientes_correo]
                        }).then(([insertCliente]) => {
                            if(_.size(insertCliente) == 1){
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        }); 
                    } else {

                    }
                });
                resolve(true);
            }
        );
    },

    clientesExtraer: async function () {
        log(yellow("Ingresa: clientesExtraer"));
        return new Promise(
            (resolve, reject) => {
                db.query(process.env.DATEBASE_ENCODING + "SELECT * FROM clientes", {
                    replacements: []
                }).then(([clienteData]) => {
                    if(_.size(clienteData) > 0){
                        resolve(clienteData)
                    } else {
                        resolve(false)
                    }
                });
            }
        );
    },
}