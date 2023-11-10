const { Socket } = require("socket.io");
const { checkJWT } = require("../helpers");
const { ChatMessage } = require("../src/models");

const chatMessage = new ChatMessage();
 
const socketController = async( socket = new Socket(), io ) => {

    const user = await checkJWT(socket.handshake.headers['x-token']);
    
    if ( !user ) {
        return socket.disconnect();
    }

    // Agregar usuario conectado
    chatMessage.connectUser( user );
    io.emit( 'active-users', chatMessage.usersArr );
    socket.emit( 'resive-message', chatMessage.last10 );

    // Conectarlo a una sala especial
    socket.join( user.id );

    // actualizar lista cuando alguien se desconecta
    socket.on('disconnect', () => {
        chatMessage.disconnectUser( user.id );
        io.emit('active-users', chatMessage.usersArr );
    })

    socket.on('send-message', ({ uid, message }) => {
        const nameComplete = user.name + ' ' +user.lastname;
        
        if ( uid ) {
            //mensaje chat privado
            socket.to(uid).emit('private-message', {nameComplete, message } )
        } else {
            // Mensaje chat comun
            chatMessage.sendMessage(user.id, nameComplete, message);
            io.emit('resive-message', chatMessage.last10);
        }
    })

} 

module.exports = {
    socketController
}