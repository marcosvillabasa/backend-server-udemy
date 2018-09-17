// es muy importante porque es el punto de entrada a nuestra app

//requires, primer paso tenemos que crear los requires

const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');

//inicializar variables
const app =express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 






//importar rutas
var appRoutes =require('./routes/app.js');
var usuarioRoutes = require('./routes/usuario.js');
var loginRoutes = require('./routes/login.js');
var hospitalRoutes = require('./routes/hospital.js');
var medicoRoutes = require('./routes/medico.js');
var busquedaRoutes = require('./routes/busqueda.js');


//conexion a la bd
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', (err, res) => {
	if (err) throw err;

	console.log('Base de datos: \x1b[32m%s\x1b[0m' , 'online');
});


//rutas
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);



//escuchar peticiones
app.listen(3000, () => {
	console.log('Express server en el puerto: \x1b[32m%s\x1b[0m' , '3000');
});

// //rutas 
// app.get('/', (req, res, next) => {

// 	res.status(200).json({
// 		ok: true,
// 		mensaje: 'peticion realizada correctamente'
// 	});
// });
