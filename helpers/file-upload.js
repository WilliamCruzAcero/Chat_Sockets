const path = require('path');
const {v4: uuidv4} = require('uuid');

const uploadFile = ( files, allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'], folder = ''  ) => {

    return new Promise( (resolve, reject) => {
    
        const { archivo } = files;
        const cutName = archivo.name.split('.');
        const extension = cutName[ cutName.length - 1]

        // validar extensiones 
        if ( !allowedExtensions.includes(extension)) {
            return reject(`La extensión "${extension}", no es permitida - ${allowedExtensions}`);
        }

        const nameTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', folder, nameTemp);

        archivo.mv(uploadPath, (err) => {

            if (err) {
                reject(err);
            }

            resolve(nameTemp);
        });
    });
};

module.exports = {
    uploadFile
}