const messagebird = require('messagebird')(process.env.KEY_BIRD_SMS);
const log = console.log;
const express = require('express');
const app = express();
const _ = require('lodash');
const colors = require('colors');
const red = colors.red;
const yellow = colors.yellow;
const cyan = colors.cyan;
const green = colors.green;

var sms = module.exports = {
    sendMenssage: async function () {
        return new Promise(
            (resolve, reject) => {
              
            }
        );
    },
}