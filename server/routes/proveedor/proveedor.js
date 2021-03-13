/*jshint esversion: 9*/
const proveedorModel = require('../../models/proveedor.model');
const Helper = require("../../libraries/helper");
const express = require('express');
const app = express();

// http://localhost:3000/api/tienda/
app.get('/', async(req, res) => {
    try {
        if (req.query.idProveedor) req.queryMatch._id = req.query.idProveedor;
        if (req.query.termino) req.queryMatch.$or = Helper(["idusuario", "strEmpresa", "strDireccionEmpresa"], req.query.termino);

        const proveedor = await proveedorModel.find({...req.queryMatch });

        if (proveedor.length <= 0) {
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontraron provedores en la base de datos.',
                cont: {
                    proveedor
                }
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion obtenida correctamente.',
                cont: {
                    proveedor
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al obtener los proveedores.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/tienda/
app.post('/', async(req, res) => {

    try {
        const proveedor = new proveedorModel(req.body);

        let err = proveedor.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al Insertar el proveedor.',
                cont: {
                    err
                }
            });
        }

        const proveedorEncontrado = await proveedorModel.findOne({ strEmpresa: { $regex: `^${proveedor.strEmpresa}$`, $options: 'i' } });
        if (proveedorEncontrado) return res.status(400).json({
            ok: false,
            resp: 400,
            msg: `El proveedor que se desea insertar con el id ${proveedor.idusuario} ya se encuentra registrado en la base de datos.`,
            cont: 0
        });

        const nuevoProveedor = await proveedor.save();
        if (nuevoProveedor.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo registrar el proveedor en la base de datos.',
                cont: {
                    nuevoProveedor
                }
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion insertada correctamente.',
                cont: {
                    nuevoProveedor
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al registrar el proveedor.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/tienda/?idTienda=603e51f51a35a066388f0f28
app.put('/', async(req, res) => {
    try {

        const idProveedor = req.query.idProveedor;

        if (idProveedor == '') {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }

        req.body._id = idProveedor;

        const proveedorEncontrado = await proveedorModel.findById(idProveedor);

        if (!proveedorEncontrado)
            return res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'Error: No se encontro el proveedor en la base de datos.',
                cont: proveedorEncontrado
            });

        const newProveedor = new proveedorModel(req.body);

        let err = newProveedor.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al actualizar el proveedor.',
                cont: {
                    err
                }
            });
        }

        const proveedorActualizado = await proveedorModel.findByIdAndUpdate(idProveedor, { $set: newProveedor }, { new: true });

        if (!proveedorActualizado) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Al intentar actualizar el proveedor.',
                cont: 0
            });
        } else {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Success: Se actualizo el proveedor correctamente.',
                cont: {
                    proveedorActualizado
                }
            });
        }

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error: Error al actualizar el proveedor.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/tienda/?idTienda=603e51f51a35a066388f0f28
app.delete('/', async(req, res) => {

    try {

        if (req.query.idProveedor == '') {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }

        idProveedor = req.query.idProveedor;
        blnActivo = req.body.blnActivo;

        const proveedorEncontrado = await proveedorModel.findById(idProveedor);

        if (!proveedorEncontrado)
            return res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'Error: No se encontro el proveedor en la base de datos.',
                cont: proveedorEncontrado
            });

        const proveedorActualizado = await proveedorModel.findByIdAndUpdate(idProveedor, { $set: { blnActivo } }, { new: true });

        if (!proveedorActualizado) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Al intentar eliminar el proveedor.',
                cont: 0
            });
        } else {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: `Success: Se a ${blnActivo === 'true'? 'activado': 'desactivado'} el poveedor correctamente.`,
                cont: {
                    proveedorActualizado
                }
            });
        }


    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error: Error al eliminar el proveedor.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }

});


module.exports = app;