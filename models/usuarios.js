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
const { response } = require('express');

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
                        if (data.contrasena == "") {
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
                resp = {}
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM usuarios WHERE id = ?", {
                    replacements: [data.idusuario]
                }).then(([clienteData]) => {
                    if (_.size(clienteData) >= 1) {
                        chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM clientes_usuarios WHERE cliente_nit = ? AND usuario_cedula = ?", {
                            replacements: [data.nitcliente, clienteData[0].cedula]
                        }).then(([dataIni]) => {
                            if (_.size(dataIni) >= 1) {
                                resp.error = "El cliente ya esta asignado al usuario";
                                resolve(resp);
                            } else {
                                chatbot.query(process.env.DATEBASE_ENCODING + "INSERT INTO clientes_usuarios (cliente_nit, usuario_cedula) VALUES (?,?) RETURNING id", {
                                    replacements: [data.nitcliente, clienteData[0].cedula]
                                }).then(([insertCU]) => {
                                    if (_.size(insertCU) >= 1) {
                                        resp.exito = "Proceso realizado con exito";
                                    } else {
                                        resp.error = "Hubo un error al guardar la información.";
                                    }
                                    resolve(resp);
                                });
                            }
                        });
                    } else {
                        resp.error = "El cliente no existe.";
                        resolve(resp);
                    }
                });
            }
        );
    },
    usuariosextraerUsuariosId: async function (data) {
        return new Promise(
            (resolve, reject) => {
                resp = {}
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM usuarios WHERE id = ?", {
                    replacements: [data.idusuario]
                }).then(([clienteData]) => {
                    if (_.size(clienteData) >= 1) {
                        chatbot.query(process.env.DATEBASE_ENCODING + "SELECT c.nit, c.razon_social FROM clientes c INNER JOIN clientes_usuarios cu ON cu.cliente_nit = c.nit WHERE usuario_cedula = ? ", {
                            replacements: [clienteData[0].cedula]
                        }).then(([RelaData]) => {
                            if (_.size(RelaData) >= 1) {
                                resolve(RelaData);
                            } else {
                                resolve(false);
                            }
                        });
                    } else {
                        resp.error = "El usuario no existe";
                        resolve(resp);
                    }
                });

            }
        );
    },
    removeUserClient: async function (data) {
        return new Promise(
            (resolve, reject) => {
                resp = {}
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM usuarios WHERE id = ?", {
                    replacements: [data.idusuario]
                }).then(([clienteData]) => {
                    if (_.size(clienteData) >= 1) {
                        chatbot.query(process.env.DATEBASE_ENCODING + "DELETE FROM clientes_usuarios WHERE  cliente_nit = ? AND usuario_cedula = ?", {
                            replacements: [data.nitcliente, clienteData[0].cedula]
                        }).then(([deleteCU]) => {
                            resp.exito = "Proceso realizado con exito";
                            resolve(resp);
                        });
                    } else {
                        resp.error = "El cliente no existe.";
                        resolve(resp);
                    }
                });

            }
        );
    },
}