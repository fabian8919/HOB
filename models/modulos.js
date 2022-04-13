const _ = require('lodash');

var fns = module.exports = {
    modulos: async function (data) {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM permisos_modulos WHERE id_modulo = ?", {
                    replacements: [data.Modulos_id]
                }).then(([modulosData]) => {
                    if(_.size(modulosData) <= 0){
                        chatbot.query(process.env.DATEBASE_ENCODING + "INSERT INTO permisos_modulos(id_modulo, nombre_modulo, modulo_padre, icono) VALUES (?, ?, ?, ?) RETURNING id", {
                            replacements: [data.Modulos_id, data.Modulos_nombre, data.Modulos_relPadre, data.Modulos_icono]
                        }).then(([insertModulo]) => {
                            if(_.size(insertModulo) == 1){
                                resolve(true)
                            } else {
                                resolve(false);
                            }
                        }); 
                    } else {
                        chatbot.query(process.env.DATEBASE_ENCODING + "UPDATE permisos_modulos SET id_modulo = ?, nombre_modulo = ?, modulo_padre = ?, icono = ? WHERE id_modulo = ? RETURNING id", {
                            replacements: [data.Modulos_id, data.Modulos_nombre, data.Modulos_relPadre, data.Modulos_icono, data.Modulos_id]
                        }).then(([updateModulo]) => {
                            if(_.size(updateModulo) == 1){
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

    modulosExtraer: async function () {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT pm.id AS idreg, pm.id_modulo, pm.icono, pm.nombre_modulo, mp.nombre AS nom_padre  FROM permisos_modulos pm INNER JOIN modulos_padre mp ON mp.id_modulo_padre = pm.modulo_padre ORDER BY pm.id", {
                    replacements: []
                }).then(([modulosData]) => {
                    if(_.size(modulosData) > 0){
                        resolve(modulosData)
                    } else {
                        resolve(false)
                    }
                });
            }
        );
    },

    modulosExtraerId: async function (data) {
        console.log(data.id)
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM permisos_modulos WHERE id = ?", {
                    replacements: [data.id]
                }).then(([modulosData]) => {
                    if(_.size(modulosData) > 0){
                        resolve(modulosData)
                    } else {
                        resolve(false)
                    }
                });
            }
        );
    },

    modulosEliminarModulo: async function (data) {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "DELETE FROM permisos_modulos WHERE id = ?", {
                    replacements: [data.id]
                }).then(([modulosData]) => {
                    if(_.size(modulosData) > 0){
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                });
            }
        );
    },

    modulosExtraerDataModulosPadre: async function () {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM modulos_padre ORDER BY id", {
                    replacements: []
                }).then(([modulosData]) => {
                    if(_.size(modulosData) > 0){
                        resolve(modulosData)
                    } else {
                        resolve(false)
                    }
                });
            }
        );
    },
}