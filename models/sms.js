const _ = require('lodash');
const fs = require('fs');
const papper = require('papaparse');

var fns = module.exports = {
    listarPlantillas: async function (clienteSelec) {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM plantillas WHERE codigo_cliente = ? AND tipo_proceso = 1 ORDER BY id", {
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
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT nombre_plantilla FROM plantillas WHERE UPPER(nombre_plantilla) = ? AND codigo_cliente = ? AND tipo_proceso = 1", {
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
                var activo = (data.activePlantillaSms == "on") ? true : false;
                chatbot.query(process.env.DATEBASE_ENCODING + "INSERT INTO plantillas(nombre_plantilla, contenido, codigo_cliente, activo, tipo_proceso) VALUES (?, ?, ?, ?, ?) RETURNING id", {
                    replacements: [data.nombres_plantilla, data.mensajeSmsPlantilla, clienteSelec, activo, 1]
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
                var activo = (data.activePlantillaSms == "on") ? true : false;
                chatbot.query(process.env.DATEBASE_ENCODING + "UPDATE plantillas SET nombre_plantilla = ?, contenido = ?, activo = ? WHERE id = ? AND codigo_cliente = ? AND tipo_proceso = ? RETURNING id", {
                    replacements: [data.nombres_plantilla, data.mensajeSmsPlantilla, activo, data.idPlantillaSms, clienteSelec, 1]
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
    procesarMasivo: async function (data, file) {
        return new Promise(
            (resolve, reject) => {
                console.log(data)
                console.log(file)
                file.mv(`tmp/${file.name}`,err => {
                    if(err){
                        console.log(err);
                        resolve(false);
                    } else {
                        let stream = fs.createReadStream(`tmp/${file.name}`)
                        .once('open', function () {
                        papper.parse(stream, {
                            delimiter: ';',
                            header: true,
                            worker: true,
                            complete: fns.procesarMasivoDataBase,
                            error: function (error) {
                                console.log(error);
                                resolve(false);
                            }
                        });
                        })
                        .on('error', function (err) {
                            console.log(err);
                            resolve(false);
                        });
                    }
                })
            }
        );
    },
    procesarMasivoDataBase: async function (data) {
        return new Promise(
            (resolve, reject) => {
               log(data)
            }
        );
    },
}