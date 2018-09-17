const express = require('express');


const app = express();

var Hospital = require('../models/hospital');


var mdAutenticacion = require('../middlewares/autenticacion');


//rutas 

//====================================
//=======OBTENER Hospital==============
//====================================
app.get('/', (req, res, next) => {

	var desde = req.query.desde || 0;
	desde = Number(desde);


	Hospital.find({})
		
		.skip(desde)
		.limit(5)
		.populate('usuario', 'nombre email')

		.exec( 
			(err, hospitales ) => {

		if (err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Error db cargando hospitales',
				errors: err
			}); 
		}

		Hospital.count({}, (err, conteo) => {
			res.status(200).json({
			ok:true,
			hospitales: hospitales,
			total: conteo
			});

		});

	 
	});

});



//====================================
//=======ACTUALIZAR Hospital===========
//====================================
app.put('/:id', mdAutenticacion.verificaToken ,(req, res) => {

	var id = req.params.id; 
	var body =  req.body;

	Hospital.findById(id, (err, hospital) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Error db al buscar hospital',
				errors: err
			}); 
		}

		if (!hospital) {
			
			return res.status(400).json({
				ok: false,
				mensaje: 'Error db id inexistente',
				errors: {message: 'no existe el hospital con ese id'}
			}); 
		
		}

		hospital.nombre = body.nombre;
		hospital.usuario = req.usuario._id;

		hospital.save( (err, hospitalGuardado) => {

			if (err) {
			return res.status(400).json({
				ok: false,
				mensaje: 'Error db al actualizar hospital',
				errors: err
				}); 
			}

			
			res.status(200).json({
				ok:true,
				hospital: hospitalGuardado 
			});
		});	
	});
});




//====================================
//=======CREAR Hospital================
//====================================
app.post('/', mdAutenticacion.verificaToken ,(req, res) => {


	var body = req.body;

	var hospital = new Hospital({
		nombre: body.nombre,
		usuario: req.usuario._id
	});

	hospital.save( (err, hospitalGuardado) => {

		if (err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Error al crear hospital',
				errors: err
			}); 
		}

		res.status(201).json({
			ok:true,
			hospital: hospitalGuardado
		});
	
	});


});


//====================================
//=======Borrar Hospital por id========
//====================================
app.delete('/:id', mdAutenticacion.verificaToken ,(req, res) => {
	var id =req.params.id;

	Hospital.findByIdAndRemove(id, (err,hospitalBorrado) => {

		if (err) {
			return res.status(500).json({
				ok: false, 
				mensaje: 'Error al borrar hospital',
				errors: err
				
			}); 
		}

		if ( !hospitalBorrado) {
			return res.status(400).json({
				ok: false,
				mensaje: 'No existe hospital con ese id',
				errors: {message: 'No existe hospital con ese id'}
			}); 
		}

		res.status(200).json({
			ok:true,
			hospital: hospitalBorrado
		});
	});
});


module.exports = app;