const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autentication');

const app = express();


app.get('/usuario', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ status: true }, 'nombre email status role google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se encontraron registros',
                    err
                });
            }

            Usuario.countDocuments({ status: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    conteo
                })

            })

        });

});


app.post('/usuario', [verificaToken, verificaAdmin_Role], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El dato no se pudo grabar',
                err
            });
        }

        return res.json({
            ok: true,
            usuario: usuarioDB
        })

    });

});


app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'status']);

    //body.password = bcrypt.hashSync(body.password, 10);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El dato no se pudo grabar',
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })



});
app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['status']);


    Usuario.findByIdAndUpdate(id, { status: false }, { new: true }, (err, usuarioDB) => {


        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario no existe en la base'
            });
        }

        //body.status = false;
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })


});



module.exports = app;