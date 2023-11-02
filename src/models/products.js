const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
    
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    
    price: {
        type: Number,
        default: 0
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },

    status: {
        type: Boolean,
        default: true,
        required: true
    },
    
    description: {
        type: String
    },

    available: {
        type: Boolean,
        defult: true
    },

    image: {
        type: String
    },
});

ProductSchema.methods.toJSON = function() {
    const { __v, status, ...data  } = this.toObject();
    return data;
}

module.exports = model( 'Product', ProductSchema );