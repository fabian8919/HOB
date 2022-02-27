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
    listarPlantillas: async function (clienteSelec) {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM plantillas WHERE codigo_cliente = ? AND tipo_proceso = 2 ORDER BY id", {
                    replacements: [clienteSelec]
                }).then(([plantillasData]) => {
                    if(_.size(plantillasData) > 0){
                        resolve(plantillasData)
                    } else {
                        resolve(false)
                    }
                });
            }
        );
    },

    existePlantilla: async function (data, clienteSelec) {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT nombre_plantilla FROM plantillas WHERE UPPER(nombre_plantilla) = ? AND codigo_cliente = ? AND tipo_proceso = 2", {
                    replacements: [data.nombre, clienteSelec]
                }).then(([plantillasData]) => {
                    if(_.size(plantillasData) > 0){
                        resolve('existe')
                    } else {
                        resolve('noexiste')
                    }
                });
            }
        );
    },

    CreatePlantilla: async function (data, clienteSelec) {
        return new Promise(
            (resolve, reject) => {
                var activo = (data.activePlantillaVoz == "on") ? true : false;
                chatbot.query(process.env.DATEBASE_ENCODING + "INSERT INTO plantillas(nombre_plantilla, contenido, codigo_cliente, activo, tipo_proceso) VALUES (?, ?, ?, ?, ?) RETURNING id", {
                    replacements: [data.nombres_plantilla, data.mensajeVozPlantilla, clienteSelec, activo, 2]
                }).then(([insertPlantilla]) => {
                    if(_.size(insertPlantilla) == 1){
                        resolve(true)
                    } else {
                        resolve(false);
                    }
                });
            }
        );
    },

    UpdatePlantilla: async function (data, clienteSelec) {
        return new Promise(
            (resolve, reject) => {
                var activo = (data.activePlantillaVoz == "on") ? true : false;
                chatbot.query(process.env.DATEBASE_ENCODING + "UPDATE plantillas SET nombre_plantilla = ?, contenido = ?, activo = ? WHERE id = ? AND codigo_cliente = ? AND tipo_proceso = ? RETURNING id", {
                    replacements: [data.nombres_plantilla, data.mensajeVozPlantilla, activo, data.idPlantillaVoz, clienteSelec, 2]
                }).then(([updatePlantilla]) => {
                    if(_.size(updatePlantilla) == 1){
                        resolve(true)
                    } else {
                        resolve(false);
                    }
                });
            }
        );
    },

}