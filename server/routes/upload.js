const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');

const fs = require('fs');
const path = require('path');

app.use(fileUpload({ useTempFiles: true }));


app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;


    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    mensaje: 'No se ha seleccionado ningún archivo'
                }


            });

    }

    //valida tipos
    let tiposValidos = ['usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                mensaje: 'Los tipos permitidos son ' + tiposValidos.join(', ')
            }
        })
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];


    //Restringir extensiones
    let extensionesValidas = ['jpg', 'jpeg', 'gif', 'png'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                mensaje: 'Las extensiones permitidas son ' + extensionesValidas.join('/'),
                ext: extension
            }
        })
    }


    //Cambiar nombre al archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        //La imagen ya se encuentra grabada

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        }

        /*         
        res.json({
                    ok: true,
                    mensaje: 'Imagen subida correctamente'
                }) 
                
                */


    });




});


function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }
        if (!usuarioDB) {

            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        mensaje: 'El usuario no se encuentra en la base'
                    }
                });
        }

        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioDB) => {
            res.json({
                ok: true,
                usuario: usuarioDB,
                img: nombreArchivo,
                mensaje: 'Imagen subida correctamente'

            })
        });

    });

}

function borraArchivo(img, tipo) {
    let pathImage = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`);

    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
    }

}


module.exports = app;