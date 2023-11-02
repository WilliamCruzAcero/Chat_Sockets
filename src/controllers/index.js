const categories = require('./categories');
const login = require('./login');
const product = require('./products');
const roles = require('./roles')
const search = require('./search');
const uploads = require('./uploads');
const users = require('./users');

module.exports = {
    ...categories,
    ...login,
    ...product,
    ...roles,
    ...search,
    ...uploads,
    ...users
}