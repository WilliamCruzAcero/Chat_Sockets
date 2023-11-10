const url = (window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/login'
            : 'https://curso-node-chat.onrender.com/login'

let user = null;
let socket = null;

// Referencias html
const txtUid = document.querySelector('#txtUid')
const txtMessage = document.querySelector('#txtMessage')
const ulUsers = document.querySelector('#ulUsers')
const ulMessage = document.querySelector('#ulMessage')
const ulPrivateChat = document.querySelector('#ulPrivateChat')
const btnExit = document.querySelector('#btnExit')

const validateJWT = async() => {
    
    const token = localStorage.getItem( 'token') || '';
    
    if ( token.length <= 10 ) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch( url, {
        headers: { 'x-token': token }
    });

    const { user: userDB, token: tokenDB } = await resp.json();
    localStorage.setItem( 'token', token );
    user = userDB;
    document.title = user.name + ' ' + user.lastname;

    await conectSoket();
}

const conectSoket = async() => {
    
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }   
    });
    
    socket.on('connect', () => {
        console.log('Sockets Online')
    });
    
    socket.on('disconnect', () => {
        console.log('Sockets Offline')
    });

    socket.on('resive-message', showMessage );
    socket.on('active-users',  showActiveUsers );
    socket.on('private-message', showPrivateMessage);
}

const showActiveUsers = ( users = []) => {

    let usersHtml = '';
    users.forEach( ({ name, lastname, uid }) => {

        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success"> ${ name } ${lastname} </h5>
                    <span class="fs-6 text-muted"> ${ uid } </span>
                </p>
            </li>
        `;
    })

    ulUsers.innerHTML = usersHtml;
}

const showMessage = ( message = []) => {
    
    let messageHtml = '';
    message.forEach( ({ name, message }) => {

        messageHtml += `
            <li>
                <p>
                    <span class="text-primary"> ${ name }: </span>
                    <span class="fs-6 text-muted"> ${ message } </span>
                </p>
            </li>
        `;
    })

    ulMessage.innerHTML = messageHtml;
}

const showPrivateMessage = ( privateMessage = []) => {
    
    let messagePrivateHtml = `
        <li>
        <p>
            <span class="text-primary"> ${ privateMessage.nameComplete }: </span>
            <span class="fs-6 text-muted"> ${ privateMessage.message } </span>
        </p>
        </li>
    `;
    // console.log(messagePrivateHtml)
    ulPrivateChat.innerHTML = messagePrivateHtml;
}


txtMessage.addEventListener('keyup', ( { keyCode } ) => {
    const message = txtMessage.value;
    const uid = txtUid.value;

    if ( keyCode !== 13 ) {return};
    if ( message.length === 0 ) {return};

    socket.emit('send-message', { message, uid });
    txtMessage.value = ''
})

btnExit.addEventListener('click', logout );

function logout() {
    
    alert(`Hasta luego`)
    localStorage.removeItem("token")
    window.location = '/'
    
}

const main = async() => {
    
    await validateJWT();
}

main();