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
    modulos: async function (data) {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM permisos_modulos WHERE id_modulo = ?", {
                    replacements: [data.Modulos_id]
                }).then(([modulosData]) => {
                    if(_.size(modulosData) <= 0){
                        chatbot.query(process.env.DATEBASE_ENCODING + "INSERT INTO permisos_modulos(id_modulo, nombre_modulo) VALUES (?, ?) RETURNING id", {
                            replacements: [data.Modulos_id, data.Modulos_nombre]
                        }).then(([insertModulo]) => {
                            if(_.size(insertModulo) == 1){
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        }); 
                    } else {
                        chatbot.query(process.env.DATEBASE_ENCODING + "UPDATE permisos_modulos SET id_modulo = ?, nombre_modulo = ? WHERE id_modulo = ? RETURNING id", {
                            replacements: [data.Modulos_id, data.Modulos_nombre, data.Modulos_id]
                        }).then(([updateModulo]) => {
                            if(_.size(updateModulo) == 1){
                                resolve('actualizado');
                            } else {
                                resolve('noactualiza');
                            }
                        }); 
                    }
                });
                resolve(true);
            }
        );
    },

    modulosExtraer: async function () {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM permisos_modulos ORDER BY id", {
                    replacements: []
                }).then(([modulosData]) => {
                    if(_.size(modulosData) > 0){
                        resolve(modulosData)
                    } else {
                        resolve(false)
                    }
                });
            }
        );
    },

    modulosExtraerId: async function (data) {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM permisos_modulos WHERE id = ?", {
                    replacements: [data.id]
                }).then(([modulosData]) => {
                    if(_.size(modulosData) > 0){
                        resolve(modulosData)
                    } else {
                        resolve(false)
                    }
                });
            }
        );
    },
}