const { Router } = require('express');
const { check } = require('express-validator');

const SP_R = process.env.SP_R

const { 
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
} = require('../controllers');

const { 
    validateJWT,
    validateFields,
    validateRole,
} = require('../../middlewares');

const { existsRoleById } = require('../../helpers');

const routerRoles = Router();

    // obtener todos los roles
    routerRoles.get('/', getAllRoles);
    routerRoles.get('/:id', [
        check('id', 'No es un ID de MOngo valido').isMongoId(),
        check('id').custom( existsRoleById ),
        validateFields
    ], getRoleById);
    // Crear Role
    routerRoles.post('/', [
        validateJWT,
        validateRole(SP_R),
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        validateFields
    ], createRole);
    //Actualizar Role
    routerRoles.patch('/:id', [
        validateJWT,
        validateRole(SP_R),
        check('id', 'No es un ID de Mongo valido').isMongoId(),
        check('id').custom( existsRoleById ),
        validateFields
    ], updateRole );
    routerRoles.delete('/:id', [
        validateJWT,
        validateRole(SP_R),
        check('id', 'No es un ID de Mongo valido').isMongoId(),
        check('id').custom( existsRoleById ),
        validateFields
    ], deleteRole)

module.exports = routerRoles;