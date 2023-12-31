const allowedCollection = require('./collections-validaters');
const dbValidaters = require('./db-validaters');
const fileUpload = require('./file-upload');
const generateJWT = require('./generate-jwt');
const googleVerify = require('./google-verify');
const search = require('./search');
const checkJWT = require('./checkJWT')

module.exports = {
    ...allowedCollection,
    ...dbValidaters,
    ...fileUpload,
    ...generateJWT,
    ...googleVerify,
    ...search,
    ...checkJWT
}