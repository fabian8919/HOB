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

const db = new Sequelize(process.env.DATEBASE_NAME, process.env.DATEBASE_USER, process.env.DATEBASE_PASS, {
    host: process.env.DATEBASE_HOST,
    dialect: 'postgres',
    logging: false
});

/* Validando conexion con la base de datos */
db.authenticate()
    .then(() => {
        log(green('Conexión base de datos establecida'));
    })
    .catch(err => {
        log(red('Error al conectar a la base de datos: '), err);
        return false;
    });

var fns = module.exports = {
    permisos: async function (data) {
        return new Promise(
            (resolve, reject) => {
                db.query(process.env.DATEBASE_ENCODING + "SELECT * FROM permisos_acciones WHERE id_permiso = ?", {
                    replacements: [data.Permisos_id]
                }).then(([permisosData]) => {
                    if(_.size(permisosData) <= 0){
                        db.query(process.env.DATEBASE_ENCODING + "INSERT INTO permisos_acciones(id_permiso, nombre) VALUES (?, ?) RETURNING id", {
                            replacements: [data.Permisos_id, data.Permisos_nombre]
                        }).then(([insertPermiso]) => {
                            if(_.size(insertPermiso) == 1){
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        }); 
                    } else {
                        db.query(process.env.DATEBASE_ENCODING + "UPDATE permisos_acciones SET id_permiso = ?, nombre = ? WHERE id = ? RETURNING id", {
                            replacements: [data.Permisos_id, data.Permisos_nombre, data.Permisos_update]
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
                db.query(process.env.DATEBASE_ENCODING + "SELECT * FROM permisos_acciones ORDER BY id", {
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
                db.query(process.env.DATEBASE_ENCODING + "SELECT * FROM permisos_acciones WHERE id = ?", {
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