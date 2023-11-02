const { Router } = require('express');

const { search } = require('../controllers');

const routerSearch = Router();

    routerSearch.get('/:collection',  search )

module.exports = routerSearch;