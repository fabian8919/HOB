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
const in_array = require('in_array');
const mailer = require('nodemailer');

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
                resp = {}
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
                                    resp.error = "El usuario se encuentra bloqueado.";
                                } else if (int > 3) {
                                    resp.error = "El usuario se encuentra bloqueado.";
                                } else {
                                    resp.error = "La contraseña es incorrecta.";
                                }
                                resolve(resp);
                            })();
                        }
                    } else {
                        resp.error = "El usuario ingresado no existe.";
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
                }).then(([update]) => {});
            }
        );
    },
    dataUserLogin: async function (iduser) {
        return new Promise(
            (resolve, reject) => {
                data = {};
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM usuarios WHERE id = ?", {
                    replacements: [iduser]
                }).then(([userData]) => {
                    if (_.size(userData) > 0) {
                        chatbot.query(process.env.DATEBASE_ENCODING + "SELECT c.id_modulo, c.nombre_modulo, p.nombre AS padre, c.icono FROM permisos_modulos c INNER JOIN modulos_padre p ON p.id_modulo_padre = c.modulo_padre INNER JOIN usuarios_permisos_modulos cu ON cu.modulo_id = c.id_modulo WHERE cedula_usuario = ?", {
                            replacements: [userData[0].cedula]
                        }).then(([userModulos]) => {
                            if (_.size(userModulos) > 0) {
                                var modulos = [];
                                var padres = [];
                                var padresArray = [];
                                for (let i = 0; i < userModulos.length; i++) {
                                    modulos.push({
                                        idmol: userModulos[i].id_modulo,
                                        namemol: userModulos[i].nombre_modulo,
                                        padre: userModulos[i].padre,
                                        icono: userModulos[i].icono
                                    });
                                    if (!in_array(userModulos[i].padre, padresArray)) {
                                        padresArray.push(userModulos[i].padre);
                                        padres.push({
                                            padre: userModulos[i].padre
                                        });
                                    }
                                }
                            }
                            data.modulos = modulos;
                            data.padres = padres;
                            resolve(data);
                        });
                    } else {
                        data.error = "El usuario no existe.";
                        resolve(data);
                    }
                });
            }
        );
    }
}