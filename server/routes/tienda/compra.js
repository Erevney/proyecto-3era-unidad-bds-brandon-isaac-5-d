/*jshint esversion: 9*/
const TiendaModel = require('../../models/tienda.model');
const CompraModel = require('../../models/compra.model');
const UsuarioModel = require('../../models/usuario.model');
const express = require('express');
const app = express();


// http://localhost:3000/api/compra/?idTienda=603e51f51a35a066388f0f28
app.get('/', async(req, res) => {

    try {

        let idCompra = '';

        const idTienda = req.query.idTienda;

        if (req.query.idCompra)
            idCompra = req.query.idCompra;

        let queryFind = {};
        let queryOptions = {};

        if (idCompra) {
            queryFind = {
                '_id': idTienda,
                'ajsnCompra': {
                    $elemMatch: {
                        '_id': idCompra
                    }
                }
            };
            queryOptions = { 'ajsnCompra.$': 1 };
        } else {
            queryFind = {
                '_id': idTienda
            };
            queryOptions = {};
        }

        if (idTienda == undefined) {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }

        const compra = await TiendaModel.find(queryFind, queryOptions);
        let usuario = '';
        let infoFinal = {};
        for (const info of compra) {
            for (const compra of info.ajsnCompra) {
                usuario = await UsuarioModel.findById(compra.idusuario);
            }
        }

        if (compra.length <= 0) {
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontraron compras en la base de datos.',
                cont: {
                    compra
                }
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion obtenida correctamente.',
                cont: {
                    compra
                }
            });
        }

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al obtener las compras.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }


});

// http://localhost:3000/api/compra/?idTienda=603e51f51a35a066388f0f28
app.post('/', async(req, res) => {

    try {
        const idTienda = req.query.idTienda;

        if (idTienda == undefined) {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }

        const compra = new CompraModel(req.body);
        let err = compra.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al Insertar la compra.',
                cont: {
                    err
                }
            });
        }

        const productoDisponible = await TiendaModel.findOne({ _id: idTienda, arrProducto: compra.idProducto });

        if (productoDisponible == null) {
            return res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'Error: no se encontro el producto.',
                cont: 0
            });
        } else {
            const rmvProducto = await TiendaModel.findByIdAndUpdate(idTienda, { $pull: { arrInventario: compra.idAnimalito } }, { new: true });
            if (rmvProducto == null) {
                return res.status(400).send({
                    estatus: '400',
                    err: true,
                    msg: 'Error: no se pudo quitar el producto del array de inventario.',
                    cont: 0
                });
            }
            const nuevaCompra = await TiendaModel.findByIdAndUpdate(idTienda, { $push: { 'ajsnCompra': compra } }, { new: true });

            if (nuevaCompra.length <= 0) {
                res.status(400).send({
                    estatus: '400',
                    err: true,
                    msg: 'No se pudo registrar la compra en la base de datos.',
                    cont: 0
                });
            } else {
                res.status(200).send({
                    estatus: '200',
                    err: false,
                    msg: 'Informacion insertada correctamente.',
                    cont: {
                        compra
                    }
                });
            }
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al registrar la compra.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
});

// http://localhost:3000/api/compra/?idTienda=603e51f51a35a066388f0f28&idCompra=603e5d996dcc7c2108734283
app.put('/', async(req, res) => {

    try {

        const idTienda = req.query.idTienda;
        const idCompra = req.query.idCompra;

        if (idTienda == undefined || idCompra == undefined) {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }

        req.body._id = idCompra;

        const compra = new CompraModel(req.body);
        let err = compra.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error: Error al actualizar la compra.',
                cont: {
                    err
                }
            });
        }

        const nuevaCompra = await TiendaModel.findOneAndUpdate({ '_id': idTienda, 'ajsnCompra._id': idCompra }, { $set: { 'ajsnCompra.$[i]': compra } }, { arrayFilters: [{ 'i._id': idCompra }], new: true });

        if (nuevaCompra.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo actualizar la compra en la base de datos.',
                cont: 0
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion actualizada correctamente.',
                cont: {
                    compra
                }
            });
        }

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al actualizar la compra.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }

});

// http://localhost:3000/api/compra/?idTienda=603e51f51a35a066388f0f28&idCompra=603e5d996dcc7c2108734283
app.delete('/', async(req, res) => {

    try {

        const idTienda = req.query.idTienda;
        const idCompra = req.query.idCompra;
        const blnActivo = req.body.blnActivo;

        if (idTienda == undefined || idCompra == undefined) {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Error: No se envio un id valido.',
                cont: 0
            });
        }


        const nuevaCompra = await TiendaModel.findOneAndUpdate({ '_id': idTienda, 'ajsnCompra._id': idCompra }, { $set: { 'ajsnCompra.$.blnActivo': blnActivo } }, { new: true });

        if (nuevaCompra.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo eliminar la compra en la base de datos.',
                cont: 0
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion eliminada correctamente.',
                cont: {
                    nuevaCompra
                }
            });
        }

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al actualizar la compra.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }

});

module.exports = app;