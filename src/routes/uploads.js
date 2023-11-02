const { Router } = require('express');
const { check } = require('express-validator');

const {
    showImage,
    fileUpload,
    updateImageCloudinary,
} = require('../controllers');

const {
    validateFields,
    validateFileUpload,
} = require('../../middlewares');

const { allowedCollection } = require('../../helpers');

const routerUploads = Router();

    routerUploads.get('/:collection/:id', [
        check('id', 'No es un ID de Mongo valido').isMongoId(),
        check('collection').custom( c => allowedCollection( c, ['users','products'] ) ),
        validateFields
    ], showImage  )
    routerUploads.post( '/', validateFileUpload, fileUpload );
    routerUploads.put('/:collection/:id', [
        validateFileUpload,
        check('id', 'No es un ID de Mongo valido').isMongoId(),
        check('collection').custom( c => allowedCollection( c, ['users','products'] ) ),
        validateFields
    ], updateImageCloudinary )
    
module.exports = routerUploads;