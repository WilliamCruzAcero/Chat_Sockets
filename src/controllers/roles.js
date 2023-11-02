const { response } = require("express");
const { Role } = require("../models");

const getAllRoles = async( req, res = response ) => {

    const { limit , desde = 0 } = req.query;
    const query = {status: true};

    const [ totalRoles, roles ] = await Promise.all([
        Role.countDocuments(query),
        Role.find(query)
                .populate('user', 'name')
                .skip(desde)
                .limit(limit)
    ])

    res.json({
        totalRoles,
        roles
    })
}

//Obtener un role por ID 
const getRoleById = async( req, res = response ) => {

    const  {id}  = req.params;
    
    const role = await Role.findById( id )
                 .populate('user', 'name');
    
    if ( !role.status ) {
        return res.status(401).json({
            msg: 'Role bloqueado, hable con un administrador.'
        })
    }
    
    res.json({role})
}

// Crear role
const createRole = async( req, res = response) => {
    
    const name = req.body.name.toUpperCase();

    const roleDB = await Role.findOne( {name} );

    // verificar se la categoria existe
    if ( roleDB ) {
        return res.status(400).json({
            msg: `El role ${roleDB.name} ya existe`
        })   
    }

    //generar data a guardar
    const data = {
        name,
        user: req.user._id
    }

    const role = new Role(data);
    await role.save() 

    res.status(201).json({
        role
    })
}

// Actualizar Role
const updateRole = async(req = request, res = response) => {

    const { id } = req.params;
    const { _id, name,  ...resto } = req.body;

    const role = await Role.findByIdAndUpdate( id, resto, {new: true} )

    res.json(role);
}

// Borrar Role
const deleteRole = async(req = request, res = response) => {

    const { id } = req.params;
    
    const deleteRole = await Role.findByIdAndUpdate( id, {status: false}, {new: true} )

    res.json({
        msg: 'Role borrado con exito.',
        deleteRole
    });
}

module.exports = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
}