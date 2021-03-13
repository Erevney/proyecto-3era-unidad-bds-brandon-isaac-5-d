/*jshint esversion: 8*/
const express = require('express');
const app = express();

app.use('/usuario', require('./usuario/usuario'));
app.use('/mascota', require('./mascota/mascota'));
app.use('/tienda', require('./tienda/tienda'));
app.use('/compra', require('./tienda/compra'));
app.use('/proveedor', require('./proveedor/proveedor'));
app.use('/inventario', require('./tienda/inventario'));
app.use('/producto', require('./producto/producto'));
app.use('/almacen', require('./proveedor/almacen'));
module.exports = app;