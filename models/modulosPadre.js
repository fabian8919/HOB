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
    modulosPadre: async function (data) {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM modulos_padre WHERE id_modulo_padre = ?", {
                    replacements: [data.ModulosPadre_id]
                }).then(([modulosDataPadre]) => {
                    if(_.size(modulosDataPadre) <= 0){
                        chatbot.query(process.env.DATEBASE_ENCODING + "INSERT INTO modulos_padre(id_modulo_padre, nombre) VALUES (?, ?) RETURNING id", {
                            replacements: [data.ModulosPadre_id, data.ModulosPadre_nombre]
                        }).then(([insertModuloPadre]) => {
                            if(_.size(insertModuloPadre) == 1){
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        }); 
                    } else {
                        chatbot.query(process.env.DATEBASE_ENCODING + "UPDATE modulos_padre SET id_modulo_padre = ?, nombre = ? WHERE id_modulo_padre = ? RETURNING id", {
                            replacements: [data.ModulosPadre_id, data.ModulosPadre_nombre, data.ModulosPadre_id]
                        }).then(([updateModuloPadre]) => {
                            if(_.size(updateModuloPadre) == 1){
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

    modulosPadreExtraer: async function () {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM modulos_padre ORDER BY id", {
                    replacements: []
                }).then(([modulosDataPadre]) => {
                    if(_.size(modulosDataPadre) > 0){
                        resolve(modulosDataPadre)
                    } else {
                        resolve(false)
                    }
                });
            }
        );
    },

    modulosPadreExtraerId: async function (data) {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM modulos_padre WHERE id = ?", {
                    replacements: [data.id]
                }).then(([modulosDataPadre]) => {
                    if(_.size(modulosDataPadre) > 0){
                        resolve(modulosDataPadre)
                    } else {
                        resolve(false)
                    }
                });
            }
        );
    },

    modulosPadreEliminarModulo: async function (data) {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "DELETE FROM modulos_padre WHERE id = ?", {
                    replacements: [data.id]
                }).then(([modulosDataPadre]) => {
                    if(_.size(modulosDataPadre) > 0){
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                });
            }
        );
    },
}