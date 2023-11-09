const { response } = require('express');
const bcryptjs = require('bcryptjs')

const { User } = require('../models');

const {
    generateJWT,
    googleVerify,
} = require('../../helpers');

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        // Verificar si el email existe
        const user = await User.findOne({ email });
        if ( !user) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        // SI el usuario está activo
        if ( !user.status ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, user.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await generateJWT( user.id );

        res.json({
            user,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }   
}

const googleSignin = async(req, res = response) => {

    const { id_token } = req.body;

    try {
        const { email, name, lastname, image } = await googleVerify( id_token );
       
        let user = await User.findOne( { email } );

        if ( !user ) {
            const data = {
               name,
               lastname,
               email,
               password: ';p',
               image,
               google: true 
            };

            user = new User( data ); 
            await user.save();
        };

        if ( !user.status ) { 
            return res.status(401).json({
                msg: 'Usuario bloqueado, comuniquese con el administrardor.' 
            });
        }

        // Generar el JWT
        const token = await generateJWT( user.id );

        res.json({
            user,
            token
        });

    } catch (error) {
        res.status(400).json({
            msg: 'Token de Google no es válido'
        })
    }
}

const renewToken = async( req, res = response ) => {

    const { user } = req;

    // Generar el JWT
    const token = await generateJWT( user.id );
    
    res.json({
        user,
        token
    })
}

module.exports = {
    login,
    googleSignin,
    renewToken
}