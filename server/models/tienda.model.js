/*jshint esversion: 8*/
const mongoose = require('mongoose');
const { Schema } = mongoose;

const compraModel = require('./compra.model');

const tiendaSchema = new Schema({
    strNombre: {
        type: String,
        required: [true, 'Favor de insertar el nombre de la tienda.']
    },
     idObjeto: {
        type: Schema.Types.ObjectId,
        ref: 'Objeto',
    },
    strDireccion: {
        type: String,
        required: [true, 'Favor de insertar la dirección de la tienda.']
    },
    strTelefono: String,
    strUrlWeb: String,
    arrSucursales: [{
        type: mongoose.Types.ObjectId,
        ref: 'sucursales'
    }], // Creación de un Array de  Id's
    ajsnVenta: [compraModel.schema], //Creación de un Array de Json
    blnActivo: {
        type: Boolean,
        default: true
    },
    ajsnInventario: [compraModel.schema], //Creación de un Array de Json
    blnActivo: {
        type: Boolean,
        default: true
    },
    arrProveedores: [{
        type: mongoose.Types.ObjectId,
        ref: 'sucursales'
    }]
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: "tienda"
});

module.exports = mongoose.model('Tienda', tiendaSchema);