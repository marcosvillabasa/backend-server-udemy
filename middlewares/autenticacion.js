var jwt = require('jsonwebtoken');
var SEED = require('../config/config.js').SEED;


//====================================
//=======Verificar Token   ===========
//====================================

exports.verificaToken = function (req, res, next){ 

	app.use('/', (req,res, next) => {
	var token = req.query.token;

	token.verify( token, SEED, (err, decoded) => {

		if (err) {
			return res.status(401).json({
				ok: false,
				mensaje: 'Token incorrecto',
				errors: err
			}); 
		}

		// next();

		req.usuario = decoded.usuario;
	});

});
}

