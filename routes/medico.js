const express = require('express');


const app = express();

var Medico = require('../models/medico');


var mdAutenticacion = require('../middlewares/autenticacion');


//rutas 

//====================================
//=======OBTENER Medico==============
//====================================
app.get('/', (req, res, next) => {

	var desde = req.query.desde || 0;
	desde = Number(desde);
	

	Medico.find({})

		.skip(desde)
		.limit(5)

		.populate('usuario', 'nombre email')
		.populate('hospital')
		.exec( 
			(err, medicos ) => {

		if (err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Error db cargando medicos',
				errors: err
			}); 
		}

		Medico.count({}, (err, conteo) => {
			res.status(200).json({
			ok:true,
			medicos: medicos,
			total: conteo
			});

		});

	 
	});

});



//====================================
//=======ACTUALIZAR Medico===========
//====================================
app.put('/:id', mdAutenticacion.verificaToken ,(req, res) => {

	var id = req.params.id; 
	var body =  req.body;

	Medico.findById(id, (err, medico) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Error db al buscar medico',
				errors: err
			}); 
		}

		if (!medico) {
			
			return res.status(400).json({
				ok: false,
				mensaje: 'Error db id inexistente',
				errors: {message: 'no existe el medico con ese id'}
			}); 
		
		}

		medico.nombre = body.nombre;
		medico.usuario = req.usuario._id;
		medico.hospital = body.hospital;

		medico.save( (err, medicoGuardado) => {

			if (err) {
			return res.status(400).json({
				ok: false,
				mensaje: 'Error db al actualizar medico',
				errors: err
				}); 
			}

			
			res.status(200).json({
				ok:true,
				medico: medicoGuardado 
			});
		});	
	});
});




//====================================
//=======CREAR Medico================
//====================================
app.post('/', mdAutenticacion.verificaToken ,(req, res) => {


	var body = req.body;

	var medico = new Medico({
		nombre: body.nombre,
		usuario: req.usuario._id,
		hospital: body.hospital
	});

	medico.save( (err, medicoGuardado) => {

		if (err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Error al crear medico',
				errors: err
			}); 
		}

		res.status(201).json({
			ok:true,
			medico: medicoGuardado
		});
	
	});


});


//====================================
//=======Borrar Medico por id========
//====================================
app.delete('/:id', mdAutenticacion.verificaToken ,(req, res) => {
	var id =req.params.id;

	Medico.findByIdAndRemove(id, (err,medicoBorrado) => {

		if (err) {
			return res.status(500).json({
				ok: false, 
				mensaje: 'Error al borrar medico',
				errors: err
				
			}); 
		}

		if ( !medicoBorrado) {
			return res.status(400).json({
				ok: false,
				mensaje: 'No existe medico con ese id',
				errors: {message: 'No existe medico con ese id'}
			}); 
		}

		res.status(200).json({
			ok:true,
			medico: medicoBorrado
		});
	});
});


module.exports = app;