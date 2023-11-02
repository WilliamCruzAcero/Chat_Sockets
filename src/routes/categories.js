const { Router } = require('express');
const { check } = require('express-validator');

const SP_R = process.env.SP_R;
const AD_R = process.env.AD_R;

const {
    validateJWT,
    validateFields,
    validateRole
} = require('../../middlewares');

const {
    getAllCategories,
    getCategoryBvId,
    createCategory,
    updateCategory,
    deleteCategory,
} = require('../controllers');

const { existsCategoryById } = require('../../helpers');

const routerCategories = Router();

    //  Obtener todas las categorias - publico
    routerCategories.get('/', getAllCategories );
    // Obtener una categoria por id - publico
    routerCategories.get('/:id',[
            check('id', 'No es un id de Mongo válido').isMongoId(),
            check('id').custom( existsCategoryById ),
            validateFields,
        ], getCategoryBvId );
    // Crear categoria - privado - cualquier persona con un token válido
    routerCategories.post('/', [ 
            validateJWT,
            check('name','El nombre es obligatorio').not().isEmpty(),
            validateFields
        ], createCategory );
    // Actualizar - privado - cualquiera con token válido
    routerCategories.put('/:id',[
            validateJWT,
            check('name','El nombre es obligatorio').not().isEmpty(),
            check('id').custom( existsCategoryById ),
            validateFields
        ], updateCategory );
    // Borrar una categoria - super/Admin
    routerCategories.delete('/:id',[
            validateJWT,
            validateRole( SP_R, AD_R ),
            check('id', 'No es un id de Mongo válido').isMongoId(),
            check('id').custom( existsCategoryById ),
            validateFields,
        ], deleteCategory );

module.exports = routerCategories;