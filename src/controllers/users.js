const { response } = require('express');
const bcryptjs = require('bcryptjs');

const { User } = require('../models');

const getAllUsers = async(req, res = response) => {

    const { limit = 5, desde = 0 } = req.query;
    const query = { status: true };

    const [ totalUsers, users ] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip( Number( desde ) )
            .limit(Number( limit ))
    ]);

    res.json({
        totalUsers,
        users
    });
}

const getUserById = async(req, res = response ) => {

    const { id } = req.params;
    
    const userById = await User.findById(id)
    
    res.json({ userById })
}

const createUser = async(req, res = response) => {
    
    const { name, lastname, email, password, role } = req.body;
    const user = new User({ name, lastname, email, password, role });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );

    // Guardar en BD
    await user.save();

    res.json({
        user
    });
}

const updateUser = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, email, ...resto } = req.body;

    if ( password ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const user = await User.findByIdAndUpdate( id, resto );

    res.json(user);
}

const deleteUser = async(req, res = response) => {

    //borrar de forma fisica
    // const user = await User.findByIdAndDelete(id);
    const { id } = req.params;
    const user = await User.findByIdAndUpdate( id, { status: false } );

    res.json({
        user
    });
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
}