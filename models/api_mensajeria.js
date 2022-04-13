const _ = require('lodash');

var fns = module.exports = {
    GetRedes: async function (cliente) {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM redes_sociales WHERE tipo NOT IN (SELECT tipo FROM channel_id_rela WHERE cliente = ?)", {
                    replacements: [cliente]
                }).then(([redes]) => {
                    if(_.size(redes) <= 0){
                        resolve(false)
                    } else {
                        resolve(redes); 
                    }
                });
            }
        );
    },

    GetRedesAsociadas: async function (cliente) {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT ch.id, ch.channel_id, rd.red, rd.icono FROM channel_id_rela AS ch INNER JOIN redes_sociales AS rd ON rd.tipo = ch.tipo WHERE ch.cliente = ?", {
                    replacements: [cliente]
                }).then(([dataChannel]) => {
                    if(_.size(dataChannel) <= 0){
                        resolve(false)
                    } else {
                        resolve(dataChannel); 
                    }
                });
            }
        );
    },

    createChannelId: async function (cliente, data) {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "INSERT INTO channel_id_rela(tipo, channel_id, cliente) values(?, ?, ?) RETURNING id", {
                    replacements: [data.tipo, data.bird, cliente]
                }).then(([channel]) => {
                    if(_.size(channel) <= 0){
                        resolve(false)
                    } else {
                        resolve(true); 
                    }
                });
            }
        );
    },

    validarBirdKey: async function (cliente) {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT bird_key,id FROM api_acceso WHERE cliente = ?", {
                    replacements: [cliente]
                }).then(([birdKey]) => {
                    if(_.size(birdKey) <= 0){
                        resolve(false)
                    } else {
                        resolve(birdKey); 
                    }
                });
            }
        );
    },

    redSocial: async function (data) {
        return new Promise(
            (resolve, reject) => {
                var name = data.redSocial_name.toUpperCase();
                chatbot.query(process.env.DATEBASE_ENCODING + "SELECT * FROM redes_sociales WHERE UPPER(red) = ?", {
                    replacements: [name]
                }).then(([redSocialData]) => {
                    if(_.size(redSocialData) <= 0){
                        chatbot.query(process.env.DATEBASE_ENCODING + "INSERT INTO redes_sociales(red, icono) VALUES (?, ?) RETURNING tipo", {
                            replacements: [name, data.redSocial_icono]
                        }).then(([insertRed]) => {
                            if(_.size(insertRed) == 1){
                                resolve(true)
                            } else {
                                resolve(false);
                            }
                        }); 
                    } else {
                        resolve('existe'); 
                    }
                });
            }
        );
    },

    createBirdKey: async function (cliente, data) {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "INSERT INTO api_acceso(bird_key, cliente) VALUES(?, ?) RETURNING id, bird_key", {
                    replacements: [data.bird,cliente]
                }).then(([birdKey]) => {
                    if(_.size(birdKey) <= 0){
                        resolve(false)
                    } else {
                        resolve(birdKey); 
                    }
                });
            }
        );
    },  

    updateBirdKey: async function (data) {
        return new Promise(
            (resolve, reject) => {
                chatbot.query(process.env.DATEBASE_ENCODING + "UPDATE api_acceso SET bird_key = ? WHERE id = ? RETURNING id", {
                    replacements: [data.birKey,data.id]
                }).then(([update]) => {
                    if(_.size(update) <= 0){
                        resolve(false)
                    } else {
                        resolve(true); 
                    }
                });
            }
        );
    },
}