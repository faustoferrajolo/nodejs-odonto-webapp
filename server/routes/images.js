const express = require('express');
const fs = require('fs');
const path = require('path');

const { verificaTokenImg, verificaToken } = require('../middlewares/autentication');

const app = express();


app.get('/imagen/:tipo/:img', [verificaTokenImg], (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathImg = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);
    let noImagePath = path.resolve(__dirname, '../assets/Not_found.png');

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        res.sendFile(noImagePath);
    }


});



module.exports = app;