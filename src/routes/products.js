const { Router } = require('express');
const { check } = require('express-validator');

const SP_R = process.env.SP_R;
const AD_R = process.env.AD_R;
const US_R = process.env.US_R;

const {
    validateFields,
    validateJWT,
    validateRole,
} = require('../../middlewares');

const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers');

const {
    existsProductoById,
    existsCategoryById
} = require('../../helpers');

const routerProducts = Router();

    //obtener todos los productos
    routerProducts.get('/', getAllProducts );
    // Obtener producto por id - publico
    routerProducts.get('/:id',[
            check('id', 'No es un id de Mongo válido').isMongoId(),
            check('id').custom( existsProductoById ),
            validateFields,
        ], getProductById );
    // Crear producto - privado - cualquier persona con un token válido
    routerProducts.post('/', [ 
            validateJWT,
            check('name','El nombre es obligatorio').not().isEmpty(),
            check('category','No es un id de Mongo').isMongoId(),
            check('category').custom( existsCategoryById ),
            validateFields
        ], createProduct );
    // Actualizar producto - privado - solo usuarios autorizados
    routerProducts.put('/:id',[
            validateJWT,
            validateRole( SP_R, AD_R, US_R ),
            check('id', 'No es un ID de MOngo valido').isMongoId(),
            check('id').custom( existsProductoById ),
            validateFields
        ], updateProduct );
    // Borrar una categoria -  super/Admin
    routerProducts.delete('/:id', [
            validateJWT,
            validateRole( SP_R, AD_R ),
            check('id', 'No es un id de Mongo válido').isMongoId(),
            check('id').custom( existsProductoById ),
            validateFields,
        ], deleteProduct );

module.exports = routerProducts;