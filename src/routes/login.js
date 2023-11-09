const { Router } = require('express');
const { check } = require('express-validator');

const {
    validateFields,
    validateJWT
} = require('../../middlewares');
 
const {
    login,
    googleSignin,
    renewToken,
} = require('../controllers');

const routerLogin = Router();

    routerLogin.get('/', validateJWT, renewToken )
    routerLogin.post('/',[
            check('email', 'El correo es obligatorio').isEmail(),
            check('password', 'La contraseña es obligatoria').not().isEmpty(),
            validateFields
        ], login );
    routerLogin.post('/google',[
            check('id_token', 'El id_token es necesario').not().isEmpty(),
            validateFields
        ], googleSignin );

module.exports = routerLogin; 