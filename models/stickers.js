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
const webp = require('webp-converter');
const fs = require('fs');
const sharp = require('sharp');

/* Conectando el servidor a las sesiones */
app.use(session({
    secret: process.env.SESSION_KEY,
    saveUninitialized: true,
    resave: false,
}));

var fns = module.exports = {
    CrearPaquete: async function (data, clienteSelec) {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT paq.id FROM paquetes_stickers as paq inner join relacion_paquetes_stickers_clientes paqCli ON paqCli.nit_cliente = ? WHERE paq.nombre = ?", {
                    replacements: [clienteSelec, data.paquetes_stickers_nombre]
                }).then(([paqueteData]) => {
                    if(_.size(paqueteData) > 0){
                        resolve('existe');
                    } else {
                        var activo = (data.paquetes_stickers_activo == "on") ? true : false;
                        chatbot.query(process.env.DATEBASE_ENCODING + "INSERT INTO paquetes_stickers(nombre, activo) VALUES (?, ?) RETURNING id", {
                            replacements: [data.paquetes_stickers_nombre, activo]
                        }).then(([insertPaquete]) => {
                            if(_.size(insertPaquete) == 1){
                                chatbot.query(process.env.DATEBASE_ENCODING + "INSERT INTO relacion_paquetes_stickers_clientes(nit_cliente, id_paquete) VALUES (?, ?)", {
                                    replacements: [clienteSelec,insertPaquete[0].id]
                                })
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        }); 
                    }
                });
            }
        );
    },

    UpdatePaquete: async function (data) {
        return new Promise(
            (resolve, reject) => {
                var activo = (data.paquetes_stickers_activo == "on") ? true : false;
                chatbot.query(process.env.DATEBASE_ENCODING + "UPDATE paquetes_stickers SET nombre = ?, activo = ? WHERE id = ? RETURNING id", {
                    replacements: [data.paquetes_stickers_nombre, activo, data.idPaqueteStickers]
                }).then(([updatePaquete]) => {
                    if(_.size(updatePaquete) == 1){
                        resolve(true)
                    } else {
                        resolve(false);
                    }
                }); 
            }
        );
    },

    extraerData: async function (clienteSelec) {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT paq.* FROM relacion_paquetes_stickers_clientes as paqCli INNER JOIN paquetes_stickers as paq ON paq.id = paqCli.id_paquete WHERE paqCli.nit_cliente = ?", {
                    replacements: [clienteSelec]
                }).then(([paqueteData]) => {
                    if(_.size(paqueteData) > 0){
                        resolve(paqueteData);
                    } else {
                        resolve(false);
                    }
                }); 
            }
        );
    },

    extraerStickers: async function (data) {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT stick.* FROM relacion_paquetes_stickers as paqStick INNER JOIN stickers as stick ON stick.id = paqStick.id_sticker WHERE paqStick.id_paquete = ?", {
                    replacements: [data.idPaquete]
                }).then(([stickerData]) => {
                    if(_.size(stickerData) > 0){
                        resolve(stickerData);
                    } else {
                        resolve(false);
                    }
                }); 
            }
        );
    },

    eliminarPaquete: async function (data, clienteSelec) {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "DELETE FROM relacion_paquetes_stickers_clientes WHERE id_paquete = ? AND nit_cliente = ? RETURNING id", {
                    replacements: [data.id, clienteSelec]
                }).then(([paqueteData]) => {
                    if(_.size(paqueteData) > 0){
                        chatbot.query(process.env.DATEBASE_ENCODING + "DELETE FROM paquetes_stickers WHERE id = ?", {
                            replacements: [data.id]
                        }).then(([Delpa]) => {
                            resolve(true);
                        });
                    } else {
                        resolve(false);
                    }
                }); 
            }
        );
    },
    CargarStickers: async function (id, arrayfiles, clienteSelec) {
        return new Promise(
            (resolve, reject) => {
                const path = `public/alpha/${clienteSelec}/stickers/${id.idPaquete}`;
                fs.mkdirSync(path, { recursive: true });
                let files = arrayfiles.file;
                if(Array.isArray(files)){
                    for (let i = 0; i < files.length; i++) {
                        const name = files[i].name.split('.')[0];
                        fns.subirSticker(path, files[i].data, name, id.idPaquete)
                    }
                } else {
                    const name = files.name.split('.')[0];
                    fns.subirSticker(path, files.data, name, id.idPaquete)
                }
                resolve(true)
            }
        );
    },

    subirSticker: function (path, data, name, idPaquete) {
        sharp(data)
        .resize(512, 512)
        .webp()
        .toFile(`${path}/${name}.webp`, (error, resp) =>{
            if(!error){
                var newRuta = path.replace('public/', '');
                chatbot.query(process.env.DATEBASE_ENCODING + "INSERT INTO stickers(nombre, ruta) VALUES (?, ?) RETURNING id", {
                    replacements: [name, `${newRuta}/${name}.webp`]
                }).then(([insertSticker]) => {
                    if(_.size(insertSticker) == 1){
                        chatbot.query(process.env.DATEBASE_ENCODING + "INSERT INTO relacion_paquetes_stickers(id_sticker, id_paquete) VALUES (?, ?)", {
                            replacements: [insertSticker[0].id, idPaquete]
                        })
                    }
                }); 
            }
        });
    }
}