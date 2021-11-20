const dotenv = require('dotenv').config();
/* Clave secreta JWT */
module.exports = {
    key: process.env.KEY_JWT
}