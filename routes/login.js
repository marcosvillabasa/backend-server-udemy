const express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const app = express();
var Usuario = require('../models/usuario'); 

var SEED = require('../config/config.js').SEED;

app.post('/', (req,res) => {

	var body = req.body;

	Usuario.findOne({email: body.email}, (err, usuarioDB) => {

		if (err) {
			return res.status(500).json({
				ok: false,
				mensaje: 'Error al buscar usuario',
				errors: err
			}); 
		}

		if(!usuarioDB){
			if (err) {
			return res.status(400).json({
				ok: false,
				mensaje: 'Credenciales incorrectas usuario',
				errors: err
			}); 
			}
		}

		if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
			if (err) {
			return res.status(400).json({
				ok: false,
				mensaje: 'Credenciales incorrectas usuario',
				errors: err
			}); 
			}
		}

		//crear Token
		usuarioDB.password= ':)';
		var token = jwt.sign({ usuario: usuarioDB}, SEED ,{expiresIn: 14400}); 	

		res.status(200).json({
			ok:true,
			usuario: usuarioDB,
			token: token,
			id: usuarioDB._id,
		});	
	});

	


});



module.exports = app;