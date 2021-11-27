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

var fns = module.exports = {
    clientes: async function (data) {
        return new Promise(
            (resolve, reject) => {
                log(green(data.Clientes_activo))
                var activo = (data.Clientes_activo == "on") ? true : false;
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM clientes WHERE nit = ?", {
                    replacements: [data.Clientes_nit]
                }).then(([clienteData]) => {
                    if(_.size(clienteData) <= 0){
                        chatbot.query(process.env.DATEBASE_ENCODING + "INSERT INTO clientes(nit, razon_social, activo, telefono, direccion, correo) VALUES (?, ?, ?, ?, ?, ?) RETURNING id", {
                            replacements: [data.Clientes_nit, data.Clientes_razon_social, activo, data.Clientes_telefono, data.Clientes_direccion, data.Clientes_correo]
                        }).then(([insertCliente]) => {
                            if(_.size(insertCliente) == 1){
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        }); 
                    } else {
                        log(cyan(activo))
                        chatbot.query(process.env.DATEBASE_ENCODING + "UPDATE clientes SET razon_social = ?, activo = ? , telefono = ?, direccion = ?, correo = ? WHERE nit = ? RETURNING id", {
                            replacements: [data.Clientes_razon_social, activo, data.Clientes_telefono, data.Clientes_direccion, data.Clientes_correo, data.Clientes_nit]
                        }).then(([insertCliente]) => {
                            if(_.size(insertCliente) == 1){
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        }); 
                    }
                });
                resolve(true);
            }
        );
    },

    clientesExtraer: async function () {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM clientes", {
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

    clientesExtraerId: async function (data) {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM clientes WHERE id = ?", {
                    replacements: [data.id]
                }).then(([clientesData]) => {
                    if(_.size(clientesData) > 0){
                        resolve(clientesData)
                    } else {
                        resolve(false)
                    }
                });
            }
        );
    },

    clientesEliminarCliente: async function (data) {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "DELETE FROM clientes WHERE id = ?", {
                    replacements: [data.id]
                }).then(([clientesData]) => {
                    if(_.size(clientesData) > 0){
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                });
            }
        );
    },
}