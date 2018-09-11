// es muy importante porque es el punto de entrada a nuestra app

//requires, primer paso tenemos que crear los requires

const express = require('express');
const mongoose = require('mongoose');


//inicializar variables
const app =express();

//conexion a la bd
mongoose.connection.openUri('mongodb://localhost:27017/primeraDB', (err, res) => {
	if (err) throw err;

	console.log('Base de datos: \x1b[32m%s\x1b[0m' , 'online');
});


//escuchar peticiones
app.listen(3000, () => {
	console.log('Express server en el puerto 3000');
});

//rutas 
app.get('/', (req, res, next) => {

	res.status(200).json({
		ok: true,
		mensaje: 'peticion realizada correctamente'
	});
});
