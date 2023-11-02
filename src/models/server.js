const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../../database/config');

const {routerCategories} = require('../routes')
const {routerLogin} = require('../routes')
const {routerProducts} = require('../routes')
const {routerRoles} = require('../routes')
const {routerSearch} = require('../routes')
const {routerUploads} = require('../routes')
const { routerUsers } = require('../routes')

class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;

        this.paths = {
            categories: '/categories',
            login: '/login',
            products: '/products',
            roles: '/roles',
            search: '/search',
            uploads: '/uploads',
            users: '/users',
        }
        
        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Público
        this.app.use( express.static('public') );

        // Fileupload - Carga de archivos
        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        
        this.app.use( this.paths.categories, routerCategories );
        this.app.use( this.paths.login, routerLogin );
        this.app.use( this.paths.products, routerProducts );
        this.app.use( this.paths.roles, routerRoles );
        this.app.use( this.paths.search, routerSearch );
        this.app.use( this.paths.uploads, routerUploads );
        this.app.use( this.paths.users, routerUsers );
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}

module.exports = Server;