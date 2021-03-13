/*jshint esversion: 8*/
const mongoose = require('mongoose');
const { Schema } = mongoose;

const compraSchema = new Schema({
    idusuario: {
        type: mongoose.Types.ObjectId,
        ref: 'usuario',
        required: [true, 'Favor de ingresar un identificador unico de usuario.']
    },
    idProducto: {
        type: mongoose.Types.ObjectId,
        ref: 'producto',
        required: [true, 'Favor de ingresar un identificador unico del producto.']
    },
    dteFecha: {
        type: Date,
        required: [true, 'Favor de insertar la fecha de la compra']
    },
    nmbCantidad: {
        type: Number,
        required: [true, 'Favor de ingresar la cantidad de productos.']
    },

    idObjeto: {
        type: Schema.Types.ObjectId,
        ref: 'Objeto'},

    nmbTotalPrecio: {
        type: Number,
        required: [true, 'Favor de ingresar la cantidad de la compra.']
    },
    strMetodoPago: {
        type: String,
        required: [true, 'Favor de insertar su metodo de pago.']
    },
    blnActivo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: "compra"
});

module.exports = mongoose.model('compra', compraSchema);