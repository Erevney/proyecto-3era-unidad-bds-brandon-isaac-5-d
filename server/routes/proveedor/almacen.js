/*jshint esversion: 9*/
const proveedorModel = require('../../models/proveedor.model');
const almacenModel = require('../../models/almacen.model');
const express = require('express');
const app = express();


// http://localhost:3000/api/compra/?idTienda=603e51f51a35a066388f0f28
app.get('/', async(req, res) => {

    try {

        let idAlmacen = '';

        const idProveedor = req.query.idProveedor;

        if (req.query.idAlmacen)
            idAlmacen = req.query.idAlmacen;

        let queryFind = {};

        if (idAlmacen) {
            queryFind = {
                '_id': idProveedor,
                'ajsnAlmacen._id': idAlmacen
            };
        } else {
            queryFind = {
                '_id': idProveedor
            };
        }

        if (idProveedor == undefined) {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }

        const proveedor = await proveedorModel.find(queryFind);

        if (proveedor.length <= 0) {
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontraron almacenes en la base de datos.',
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
            msg: 'Error al obtener los almacenes.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }


});

// http://localhost:3000/api/compra/?idTienda=603e51f51a35a066388f0f28
app.post('/', async(req, res) => {

    try {
        const idProveedor = req.query.idProveedor;

        if (idProveedor == undefined) {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }

        const almacen = new almacenModel(req.body);
        let err = almacen.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al Insertar el almacen.',
                cont: {
                    err
                }
            });
        }

        const nuevoAlmacen = await proveedorModel.findByIdAndUpdate(idProveedor, { $push: { 'ajsnAlmacen': almacen } }, { new: true });

        if (nuevoAlmacen.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo registrar el almacen en la base de datos.',
                cont: 0
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion insertada correctamente.',
                cont: {
                    nuevoAlmacen
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al registrar el almacen.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

app.put('/', async(req, res) => {

    try {

        const idProveedor = req.query.idProveedor;
        const idAlmacen = req.query.idAlmacen;

        if (idProveedor == undefined || idAlmacen == undefined) {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }

        req.body._id = idAlmacen;

        const almacen = new almacenModel(req.body);
        let err = almacen.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al actualizar el almacen.',
                cont: {
                    err
                }
            });
        }


        const nuevoAlmacen = await proveedorModel.findOneAndUpdate({ '_id': idProveedor, 'ajsnAlmacen._id': idAlmacen }, { $set: { 'ajsAlmacen.$.idProducto': almacen.idProducto, 'ajsnAlmacen.$.nmbCantidad': almacen.nmbCantidad, 'ajsnAlmacen.$.strCategoria': almacen.strCategoria,'ajsnAlmacen.$.date': almacen.arrFechaIngreso.push(date)} }, { new: true });

        if (nuevoAlmacen.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo actualizar el almacen en la base de datos.',
                cont: 0
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion actualizada correctamente.',
                cont: {
                    almacen
                }
            });
        }

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al actualizar el almacen.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }

});


app.delete('/', async(req, res) => {

    try {

        const idProveedor = req.query.idProveedor;
        const idAlmacen = req.query.idAlmacen;
        const blnActivo = req.body.blnActivo;

        if (idProveedor == undefined || idAlmacen == undefined) {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }


        const nuevoAlmacen = await proveedorModel.findOneAndUpdate({ '_id': idProveedor, 'ajsnAlmacen._id': idAlmacen }, { $set: { 'ajsnAlmacen.$.blnActivo': blnActivo } }, { new: true });

        if (nuevoAlmacen.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo eliminar el almacen en la base de datos.',
                cont: 0
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion eliminada correctamente.',
                cont: {
                    nuevoAlmacen
                }
            });
        }

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al actualizar el almacen.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }

});

module.exports = app;