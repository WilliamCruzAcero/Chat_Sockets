const { response } = require('express');

const {
    searchUsers,
    searchProducts,
    searchCategory,
    searchRoles,
} = require('../../helpers');

// coleciones permitidas
const collectionsAllowed = [
    'users',
    'products',
    'categories',
    'roles'
];

// buscar en DB
const search = ( req, res = response ) => {

    const { collection } = req.params;
    const { email, name, uid } = req.query;

    if ( !collectionsAllowed.includes( collection ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ collectionsAllowed}`
        })
    }
    switch ( collection ) {
        case 'users':
            searchUsers( name, email, uid, res )
            break;
        case 'products':
            searchProducts( name, uid, res )
            break;
        case 'categories':
            searchCategory( name, uid, res )
            break;
        case 'roles':
            searchRoles( name, uid, res )
            break;
    
        default:
            res.status(500).json({
                msg: 'Busqueda no implementada.'
            })
    }
}

module.exports = {
    search
}