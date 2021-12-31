//Extract the userName and the group from the URL
var {username, room} = Qs.parse(location.search,{
    ignoreQueryPrefix : true
});

console.log(username,room);

const socket = io();
const chatMessage = document.querySelector('.chat-messages');
const usersList = document.getElementById('users');
const roomName = document.getElementById('room-name');

//Emit the message to the server to inform the userName and the group name
socket.emit('userContext',{username,room});

socket.on('roomUsers',({users,room})=>{
    updateRoomName(room);
    updateUserSection(users);
});

//Listen on the message sent from the server
socket.on('message',(obj)=>{
    console.log(`${obj.userName} ${obj.message}`);

    showMessageInChat(obj);

    //Scroll to the latest message
    chatMessage.scrollTop = chatMessage.scrollHeight;
})

//listen to the submit event of the form
const form = document.getElementById('chat-form');
form.addEventListener('submit',(e)=>{
    e.preventDefault();

    var message = e.target.elements.msg.value;

    socket.emit('chatMessage',message);

    //Clear the chat text box
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//Show the message in the chat Box
function showMessageInChat(obj){
    const div = document.createElement('div');

    div.classList.add('message');

    div.innerHTML = `<p class="meta">${obj.userName} <span>${obj.time}</span></p>
    <p class="text">
        ${obj.message}
    </p>
    `
    document.querySelector('.chat-messages').appendChild(div);
}

function updateUserSection(users){
    usersList.innerHTML = `
    ${users.map(user=>`<li>${user.username}</li>`).join('')}
    `;
}

function updateRoomName(room){
    roomName.innerHTML = `${room}`;
}