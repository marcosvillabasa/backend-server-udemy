const express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion'); 

const app = express();

var Usuario = require('../models/usuario');







//rutas 

//====================================
//=======OBTENER Usuario==============
//====================================
app.get('/', (req, res, next) => {

	var desde = req.query.desde || 0;
	desde = Number(desde);

	Usuario.find({}, 'nombre email img role')
		.skip(desde)
		.limit(5)

		.exec( 
			(err, usuarios ) => {

		if (err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Error db cargando usuarios',
				errors: err
			}); 
		}

		Usuario.count({}, (err, conteo) => {
			res.status(200).json({
			ok:true,
			usuarios: usuarios,
			total: conteo
			});

		});

		
	 
	});

});



//====================================
//=======ACTUALIZAR Usuario===========
//====================================
app.put('/:id', mdAutenticacion.verificaToken ,(req, res) => {

	var id = req.params.id; 
	var body =  req.body;

	Usuario.findById(id, (err, usuario) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Error db al buscar usuario',
				errors: err
			}); 
		}

		if (!usuario) {
			
			return res.status(400).json({
				ok: false,
				mensaje: 'Error db id inexistente',
				errors: {message: 'no existe el usuario con ese id'}
			}); 
		
		}

		usuario.nombre = body.nombre,
		usuario.email = body.email,
		usuario.role = body.role,

		usuario.save( (err, usuarioGuardado) => {

			if (err) {
			return res.status(400).json({
				ok: false,
				mensaje: 'Error db al actualizar usuario',
				errors: err
				}); 
			}

			usuarioGuardado.password = ':)';

			res.status(200).json({
				ok:true,
				usuario: usuarioGuardado 
			});
		});	
	});
});




//====================================
//=======CREAR Usuario================
//====================================
app.post('/', mdAutenticacion.verificaToken ,(req, res) => {


	var body = req.body;

	var usuario = new Usuario({
		nombre: body.nombre,
		email: body.email,
		password: bcrypt.hashSync(body.password, 10),
		img: body.img,
		role: body.role
	});

	usuario.save( (err, usuarioGuardado) => {

		if (err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Error al crear usuario',
				errors: err
			}); 
		}

		res.status(201).json({
			ok:true,
			usuario: usuarioGuardado,
			usuariotoken: req.usuario
		});
	
	});


});


//====================================
//=======Borrar Usuario por id========
//====================================
app.delete('/:id', mdAutenticacion.verificaToken ,(req, res) => {
	var id =req.params.id;

	Usuario.findByIdAndRemove(id, (err,usuarioBorrado) => {

		if (err) {
			return res.status(500).json({
				ok: false, 
				mensaje: 'Error al borrar usuario',
				errors: {message: 'No existe user con ese id'}
			}); 
		}

		if ( !usuarioBorrado) {
			return res.status(400).json({
				ok: false,
				mensaje: 'No existe user con ese id',
				errors: err
			}); 
		}

		res.status(200).json({
			ok:true,
			usuario: usuarioBorrado
		});
	});
});


module.exports = app;