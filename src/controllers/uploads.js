const path = require('path');
const fs   = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );

const { response } = require('express');
const { uploadFile } = require('../../helpers');

const { User, Product } = require('../models');

const fileUpload = async(req, res = response) => {

    try {
        // const nombre = await subirArchivo( req.files, ['txt','md'], 'textos' );
        const name = await uploadFile( req.files, undefined, 'image' );
        res.json({ name });

    } catch (msg) {
        res.status(400).json({ msg });
    }
}

const updateImageCloudinary = async( req, res = response ) => {

    const { id, collection } = req.params;

    let model;

    switch ( collection ) {
        case 'users':
            model = await User.findById( id );
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe el usuario con el id: ${ id}`
                });
            }
            break;
        case 'products':
            model = await Product.findById( id );
            if ( !model ) {
                return res.status(400).json({
                    msg: `No eiste producto con el id: ${ id }`
                });
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Validación no implementada.'
            })
    }

    // limpiar imagenes previas
    if( model.image ) {
        
        const nameArr = model.image.split('/');
        const name = nameArr[ nameArr.length - 1 ];
        const [ public_id ] = name.split('.');
        cloudinary.uploader.destroy(public_id) 
    }

    const { tempFilePath } = req.files.file
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    
    model.image = secure_url;

    await model.save();
    
    res.json( model );
}

const updateImgage = async( req, res = response ) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById( id );
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${ id }`
                });
            }
            break;
        case 'products':
            model = await Product.findById( id );
                if ( !model ) {
                    return res.status(400).json({
                        msg: `No existe un producto con el id: ${ id }`
                    });
                }    
            break;
        default:
            return res.status(500).json({
                msg: 'Validación no implementada.'
            })
    }

    // limpiar imagenes previas
    if( model.image ) {
        //hay que borrar la imagen del servidor
        const pathImage = path.join( __dirname, '../../uploads', collection, model.image);
        if( fs.existsSync( pathImage) ) {
           fs.unlinkSync( pathImage ); 
        }
    }
    
    const name = await uploadFile( req.files, undefined, collection );
    model.image = name;

    await model.save();
    
    res.json({ model });
}

const showImage = async( req, res = response ) => {
    
    const { id, collection } = req.params;
    let model;

    switch (collection) {
        case 'users':
            model = await User.findById( id );
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${ id }`
                });
            }
            break;
        case 'products':
            model = await Product.findById( id );
                if ( !model ) {
                    return res.status(400).json({
                        msg: `No existe un producto con el id: ${ id }`
                    });
                }    
            break;
        default:
            return res.status(500).json({
                msg: 'Validación no implementada.'
            })
    }

    // ver si hay imagen establecida
    if( model.image ) {
        
        const pathImage = path.join( __dirname, '../../uploads', collection, model.image);
        if( fs.existsSync( pathImage) ) {
           return res.sendFile( pathImage ) 
        }
    }

    const pathPlaceHolder = path.join( __dirname, '../../assets/no-image.jpg' )
    
    res.sendFile( pathPlaceHolder );
}

module.exports = {
    fileUpload,
    updateImageCloudinary,
    updateImgage,
    showImage,
}