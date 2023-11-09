const { response } = require("express");
const { ObjectId } = require("mongoose").Types;

const { User, Product, Category, Role } = require("../src/models");

const searchUsers = async( name = '', email = '', uid = '', res = response) => {

    // buscar con Id de mongo
    const isMongoId = ObjectId.isValid( uid );

    if ( isMongoId ) {
        
        const user = await User.findById( uid );
                
        res.json({
            results: (user) ? [user] : []
        });
    }

    //expresion regular para que no diference mayusculas de minusculas
    const regexName = new RegExp( name, 'i' );
    const regexEmail = new RegExp( email, 'i' );

    // buscar con nombre 
    const users = await User.find({
        $or: [{ name: regexName }, { email: regexEmail }],
        $and: [{ status: true }]
    });
    
    const usersCount = await User.countDocuments({
        $or: [{ name: regexName }, { email: regexEmail, }],
        $and: [{ status: true }]
    });
        
    res.json({
        results: {usersCount}, users
    });
}

const searchProducts = async( name = '', uid = '', res = response) => {

    // buscar con Id de mongo
    const isMongoId = ObjectId.isValid( uid );

    if ( isMongoId ) {
        const product = await Product.findById( uid );
        res.json({
            results: (product) ? [product] : []
        });
    }

    //expresion regular para que no diference mayusculas de minusculas
    const regexName = new RegExp( name, 'i' );

    // buscar con nombre 
    const products = await Product.find({ name: regexName, status: true })
                            .populate('user', 'name')                        
                            .populate('category', 'name');
    
    // contador de Productos encontrados
    const productsCount = await Product.countDocuments({ name: regexName, status: true })
                            
    res.json({
        results: {productsCount}, products
    });
}

const searchCategory = async( name = '', uid = '', res = response) => {
   
    // buscar con Id de mongo
    const isMongoId = ObjectId.isValid( uid );

    if ( isMongoId ) {
        const category = await Category.findById( uid );
        
        res.json({
            results: (category) ? [ category ] : []
        });
    }

    //expresion regular para que no diference mayusculas de minusculas
    const regexName = new RegExp( name, 'i' );

    // buscar con nombre 
    const categories = await Category.find({ name: regexName, status: true })
                        .populate('user', 'name')
    const categoryCounter = await Category.countDocuments({ name: regexName, status: true });
    
    res.json({
        results: {categoryCounter}, categories
    });
}
    
const searchRoles = async( name = '', uid = '', res = response) => {

    // buscar con Id de mongo
    const isMongoId = ObjectId.isValid( uid );

    if ( isMongoId ) {
        const role = await Role.findById( uid );
        
        res.json({
            results: (role) ? [ role ] : []
        });
    }

    //expresion regular para que no diference mayusculas de minusculas
    const regexName = new RegExp( name, 'i' );

    // buscar con nombre 
    const roles = await Role.find({ name: regexName, status: true })
                        .populate('user', 'name');
    const roleCounter = await Role.countDocuments({ name: regexName, status: true })
                        
    res.json({
        results: {roleCounter}, roles
    });
}

module.exports = {
    searchUsers,
    searchProducts,
    searchCategory,
    searchRoles,
}