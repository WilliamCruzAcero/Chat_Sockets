const { Router } = require('express');
const { check } = require('express-validator');

const SP_R = process.env.SP_R;
const AD_R = process.env.AD_R;

const {
    validateFields,
    validateJWT,
    validateRole,
} = require('../../middlewares');

const {
    validRole,
    existsUserById,
    existsEmail,
} = require('../../helpers');

const {
    getAllUsers,
    getUserById,
    createUser,
    deleteUser,
    updateUser,
} = require('../controllers');

const routerUsers = Router();
    
    routerUsers.get('/', getAllUsers );
    routerUsers.get('/:id',[
            check('id', 'No es un ID de MOngo valido').isMongoId(),
            check('id').custom( existsUserById ),
            validateFields
        ], getUserById );
    routerUsers.post('/',[
            check('name', 'El nombre es obligatorio').not().isEmpty(),
            check('lastname', 'El apellido es obligatorio').not().isEmpty(),
            check('email', 'El correo no es válido').isEmail(),
            check('email').custom( existsEmail ),
            check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
            check('role').custom( validRole ), 
            validateFields
        ], createUser );
    routerUsers.put('/:id',[
            check('id', 'No es un ID válido').isMongoId(),
            check('id').custom( existsUserById ),
            check('role').custom( validRole ), 
            validateFields
        ], updateUser );
    routerUsers.delete('/:id',[
            validateJWT,
            validateRole( SP_R, AD_R ),
            check('id', 'No es un ID válido').isMongoId(),
            check('id').custom( existsUserById ),
            validateFields
        ], deleteUser );

module.exports = routerUsers;