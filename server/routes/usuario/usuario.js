/*jshint esversion: 9*/
const UsuarioModel = require('../../models/usuario.model');
const Helper = require("../../libraries/helper");
const express = require('express');
const app = express();

const email = require('../../libraries/email');

// http://localhost:3000/api/usuario/
app.get('/', async(req, res) => {
    try {
        if (req.query.idusuario) req.queryMatch._id = req.query.idusuario;
        if (req.query.termino) req.queryMatch.$or = Helper(["strNombre", "strCorreo"], req.query.termino);

        const usuario = await UsuarioModel.find({...req.queryMatch }).populate({ path: 'idMascota', select: { 'strNombre': 1, '_id': 0 } });

        if (usuario.length <= 0) {
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontraron usuarios en la base de datos.',
                cont: {
                    usuario
                }
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion obtenida correctamente.',
                cont: {
                    usuario
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al obtener a los usuarios.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/usuario/
app.post('/', async(req, res) => {

    try {
        const user = new UsuarioModel(req.body);

        let err = user.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al Insertar el usuario.',
                cont: {
                    err
                }
            });
        }

        const usuarioEncontrado = await UsuarioModel.findOne({ strCorreo: { $regex: `^${user.strCorreo}$`, $options: 'i' } });
        if (usuarioEncontrado) return res.status(400).json({
            ok: false,
            resp: 400,
            msg: 'El correo del usuario que desea registrar ya se encuentra en uso.',
            cont: {
                Correo: usuarioEncontrado.strCorreo
            }
        });

        const usuario = await user.save();
        if (usuario.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo registrar el usuario en la base de datos.',
                cont: {
                    usuario
                }
            });
        } else {
            email.sendEmail(req.body.strCorreo);
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion insertada correctamente.',
                cont: {
                    usuario
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al registrar al usuario.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/usuario/?idusuario=603939becf1db633f87595b2
app.put('/', async(req, res) => {
    try {

        const idusuario = req.query.idusuario;

        if (idusuario == '') {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }

        req.body._id = idusuario;

        const usuarioEncontrada = await UsuarioModel.findById(idusuario);

        if (!usuarioEncontrada)
            return res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'Error: No se encontro el usuario en la base de datos.',
                cont: usuarioEncontrada
            });

        const newusuario = new UsuarioModel(req.body);

        let err = newusuario.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al Insertar el usuario.',
                cont: {
                    err
                }
            });
        }

        const usuarioActualizada = await UsuarioModel.findByIdAndUpdate(idusuario, { $set: newusuario }, { new: true });

        if (!usuarioActualizada) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Al intentar actualizar el usuario.',
                cont: 0
            });
        } else {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Success: Se actualizo el usuario correctamente.',
                cont: {
                    usuarioActualizada
                }
            });
        }

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error: Error al actualizar el usuario.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/usuario/?idusuario=603939becf1db633f87595b2
app.delete('/', async(req, res) => {

    try {

        if (req.query.idusuario == '') {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }

        idusuario = req.query.idusuario;
        blnActivo = req.body.blnActivo;

        const usuarioEncontrada = await UsuarioModel.findById(idusuario);

        if (!usuarioEncontrada)
            return res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'Error: No se encontro el usuario en la base de datos.',
                cont: usuarioEncontrada
            });

        const usuarioActualizada = await UsuarioModel.findByIdAndUpdate(idusuario, { $set: { blnActivo } }, { new: true });

        if (!usuarioActualizada) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Al intentar eliminar al usuario.',
                cont: 0
            });
        } else {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: `Success: Se a ${blnActivo === 'true'? 'activado': 'desactivado'} el usuario correctamente.`,
                cont: {
                    usuarioActualizado
                }
            });
        }


    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error: Error al eliminar al usuario.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }

});


module.exports = app;