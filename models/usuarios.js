const log = console.log;
const express = require('express');
const app = express();
const _ = require('lodash');
const colors = require('colors');
const md5 = require('md5');
const red = colors.red;
const yellow = colors.yellow;
const cyan = colors.cyan;
const green = colors.green;
const session = require("express-session");

/* Conectando el servidor a las sesiones */
app.use(session({
    secret: process.env.SESSION_KEY,
    saveUninitialized: true,
    resave: false,
}));

var fns = module.exports = {
    usuarios: async function (data) {
        return new Promise(
            (resolve, reject) => {
                
                var activo = (data.activo == "on") ? true : false;
                var bloqueado = (!data.bloqueado) ? false : (data.bloqueado == "on") ? true : false;

                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM usuarios WHERE cedula = ?", {
                    replacements: [data.cedula]
                }).then(([clienteData]) => {
                    if (_.size(clienteData) <= 0) {
                        chatbot.query(process.env.DATEBASE_ENCODING + "INSERT INTO usuarios(cedula, nombre, correo, contrasena, fecha, activo, bloqueado) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id", {
                            replacements: [data.cedula, data.nombre, data.correo, md5(data.contrasena), 'now()', activo, bloqueado]
                        }).then(([insertUser]) => {
                            if (_.size(insertUser) == 1) {
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        });
                    } else {
                        if(data.contrasena == ""){
                            chatbot.query(process.env.DATEBASE_ENCODING + "UPDATE usuarios SET cedula = ?, nombre = ?, correo = ?, activo = ?, bloqueado = ? WHERE cedula = ? RETURNING id", {
                                replacements: [data.cedula, data.nombre, data.correo, activo, bloqueado, data.cedula]
                            }).then(([insertUser]) => {
                                if (_.size(insertUser) == 1) {
                                    resolve(true);
                                } else {
                                    resolve(false);
                                }
                            });
                        } else {
                            chatbot.query(process.env.DATEBASE_ENCODING + "UPDATE usuarios SET cedula = ?, nombre = ?, correo = ?, contrasena = ?, activo = ?, bloqueado = ? WHERE cedula = ? RETURNING id", {
                                replacements: [data.cedula, data.nombre, data.correo, md5(data.contrasena), activo, bloqueado, data.cedula]
                            }).then(([insertUser]) => {
                                if (_.size(insertUser) == 1) {
                                    resolve(true);
                                } else {
                                    resolve(false);
                                }
                            });
                        }
                    }
                });
            }
        );
    },
    usuariosExtraer: async function () {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM usuarios", {
                    replacements: []
                }).then(([clienteData]) => {
                    if (_.size(clienteData) > 0) {
                        resolve(clienteData)
                    } else {
                        resolve(false)
                    }
                });
            }
        );
    },
    usuariosExtraerId: async function (data) {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM usuarios WHERE id = ?", {
                    replacements: [data.id]
                }).then(([clienteData]) => {
                    if (_.size(clienteData) > 0) {
                        resolve(clienteData);
                    } else {
                        resolve(false);
                    }
                });
            }
        );
    },
    usuariosDuplicadoCedula: async function (data) {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM usuarios WHERE cedula = ?", {
                    replacements: [data.cedula]
                }).then(([clienteData]) => {
                    if (_.size(clienteData) >= 1) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                });
            }
        );
    },
    usuariosValidarContrasena: async function (data) {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM usuarios WHERE cedula = ?", {
                    replacements: [data.cedula]
                }).then(([clienteData]) => {
                    if (_.size(clienteData) >= 1) {
                        if (clienteData[0].contrasena == md5(data.contrasena)) {
                            chatbot.query(process.env.DATEBASE_ENCODING + "DELETE FROM usuarios WHERE id = ?", {
                                replacements: [data.id]
                            }).then(([DelClient]) => {
                                resolve(true);
                            });
                        } else {
                            resolve(false);
                        }
                    } else {
                        resolve(false);
                    }
                });
            }
        );
    },
    usuariosClienteUsuario: async function (data) {
        return new Promise(
            (resolve, reject) => {
              log(data)
            }
        );
    },
    usuariosextraerUsuariosId: async function (data) {
        return new Promise(
            (resolve, reject) => {
              log(data)
              chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM ", {
                replacements: [data.idusuario]
            }).then(([DelClient]) => {

            });
            }
        );
    },
}