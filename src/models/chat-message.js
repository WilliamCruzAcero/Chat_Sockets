class Message {
    constructor( uid, name, message ) {
        this.uid = uid;
        this.name = name;
        this.message = message;
    }
}

class ChatMessage {
    
    constructor() {
        this.message = [];
        this.users = {};
    }

    get last10() {
        this.message = this.message.splice(0,10);
        return this.message;
    }

    get usersArr() {
        return Object.values( this.users)
    }

    sendMessage( uid, name, message ) {
        this.message.unshift(
            new Message( uid, name, message )
        );
    }

    connectUser( user ) {
        this.users[user.id] = user
    }

    disconnectUser( id ) {
        delete this.users[id]
    }
}

module.exports = ChatMessage;