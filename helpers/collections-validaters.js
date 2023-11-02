const allowedCollection = ( collection = '', collections = []) => {

    const collectionInclude = collections.includes( collection );
    if ( !collectionInclude ) {
        throw new Error(`La colección ${ collection } no es permitida, ${ collections }`);
    }
    return true;
}

module.exports = {
    allowedCollection
}