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
    permisos: async function (data) {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM permisos_acciones WHERE id_permiso = ?", {
                    replacements: [data.Permisos_id]
                }).then(([permisosData]) => {
                    if(_.size(permisosData) <= 0){
                        chatbot.query(process.env.DATEBASE_ENCODING + "INSERT INTO permisos_acciones(id_permiso, nombre) VALUES (?, ?) RETURNING id", {
                            replacements: [data.Permisos_id, data.Permisos_nombre]
                        }).then(([insertPermiso]) => {
                            if(_.size(insertPermiso) == 1){
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        }); 
                    } else {
                        chatbot.query(process.env.DATEBASE_ENCODING + "UPDATE permisos_acciones SET id_permiso = ?, nombre = ? WHERE id_permiso = ? RETURNING id", {
                            replacements: [data.Permisos_id, data.Permisos_nombre, data.Permisos_id]
                        }).then(([insertPermiso]) => {
                            if(_.size(insertPermiso) == 1){
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

    permisosExtraer: async function () {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM permisos_acciones ORDER BY id", {
                    replacements: []
                }).then(([permisosData]) => {
                    if(_.size(permisosData) > 0){
                        resolve(permisosData)
                    } else {
                        resolve(false)
                    }
                });
            }
        );
    },

    permisosExtraerId: async function (data) {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM permisos_acciones WHERE id = ?", {
                    replacements: [data.id]
                }).then(([permisosData]) => {
                    if(_.size(permisosData) > 0){
                        resolve(permisosData)
                    } else {
                        resolve(false)
                    }
                });
            }
        );
    },
}