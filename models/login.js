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
const md5 = require('md5');

/* Conectando el servidor a las sesiones */
app.use(session({
    secret: process.env.SESSION_KEY,
    saveUninitialized: true,
    resave: false,
}));

var fns = module.exports = {
    login: async function (data) {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM usuarios WHERE cedula = ?", {
                    replacements: [data.username]
                }).then(([clienteData]) => {
                    if (_.size(clienteData) === 1) {
                        if (clienteData[0].contrasena === md5(data.password)) {
                            fns.ultimoAcceso(data.username);
                            resolve(clienteData[0]);
                        } else {
                            (async () => {
                                let int = await fns.intentos(data.username);
                                if (int == 0) {
                                    resp = {
                                        "error": "El usuario se encuentra bloqueado."
                                    }
                                    resolve(resp);
                                } else if (int > 3) {
                                    resp = {
                                        "error": "El usuario se encuentra bloqueado."
                                    }
                                    resolve(resp);
                                } else {
                                    resp = {
                                        "error": "La contraseña es incorrecta."
                                    }
                                    resolve(resp);
                                }
                            })();
                        }
                    } else {
                        resp = {
                            "error": "El usuario ingresado no existe."
                        }
                        resolve(resp);
                    }
                });
            }
        );
    },
    intentos: async function (username) {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM usuarios WHERE cedula = ?", {
                    replacements: [username]
                }).then(([clienteData]) => {
                    var intentos = _.toInteger(clienteData[0].intentos) + 1;
                    if (intentos > 3) {
                        chatbot.query(process.env.DATEBASE_ENCODING + "UPDATE usuarios SET bloqueado = ? WHERE cedula = ?", {
                            replacements: ['true', username]
                        }).then(([update]) => {
                            resolve(0);
                        });
                    } else {
                        chatbot.query(process.env.DATEBASE_ENCODING + "UPDATE usuarios SET intentos = ? WHERE cedula = ?", {
                            replacements: [intentos, username]
                        }).then(([update]) => {
                            resolve(intentos);
                        });
                    }
                });
            }
        );
    },
    ultimoAcceso: async function (username) {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "UPDATE usuarios SET ultimo_acceso = ? WHERE cedula = ?", {
                    replacements: ['now()', username]
                }).then(([update]) => { });
            }
        );
    },
}