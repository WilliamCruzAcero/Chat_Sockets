const { Schema, model} = require('mongoose');

const RoleSchema = Schema({

    name: {
        type: String,
        required: true
    },
    
    status: {
        type: Boolean,
        default: true,
        required: true
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

})

RoleSchema.methods.toJSON = function() {
    const { __v, ...data } = this.toObject();
    return data;
}

module.exports = model('Role', RoleSchema)
