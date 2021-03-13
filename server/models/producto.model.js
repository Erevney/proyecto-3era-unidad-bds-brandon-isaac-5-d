/*jshint esversion: 8*/
const mongoose = require('mongoose');
const { Schema } = mongoose;
let schemaopcion = {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: "producto"
}
const productoSchema = new Schema({
    strNombre: {
        type: String,
        required: [true, 'Favor de insertar el nombre del producto']
    },
    strDescripcion: {
        type: String,
        required: [true, 'Favor de insertar descripcion de producto.']
    },
    blnActivo: {
        type: Boolean,
        default: true
    }
}, {
    
},schemaopcion);

module.exports = mongoose.model('producto', productoSchema);