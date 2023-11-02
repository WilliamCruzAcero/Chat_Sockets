const { response } = require('express');
const { Role } = require('../src/models');

const validateRole = ( ...roles ) => {
   
    return async(req, res = response, next) => {

        if( !req.user ) {

            return res.status(401).json({
                msg: 'Se quiere verificar el role sin validar el token'
            });
        }

        if ( !roles.includes(req.user.role)) {

            return res.status(403).json({
                msg: `El servicio requiere uno de estos roles: ${roles}`
            })
        }
        
        const roleDB = await Role.findOne({name: req.user.role});
        
        if ( !roleDB?.status ) {

            return res.status(403).json({
                msg: `Role: ${roles}, inavilitado ó inexistente - hable con el administrador.`
            })
        }
        
        next();
    }
}

module.exports = {
    validateRole
}