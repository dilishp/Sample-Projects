const express = require('express');
const path = require('path');
const io = require('socket.io');
const http = require('http');
const formatMessage = require('./utils/format');
const {joinUser,getCurrentUser,getUsersForRoom,userLeave}  = require('./utils/users');

const app = express();
const server = http.createServer(app);
const socio = io(server);

var chatBot = "ChatBot";

//set static html page to the express
app.use(express.static(path.join(__dirname,'../_html_css')));

socio.on('connection',(soc)=>{
     //Listen to the UserContext Recieve message
     soc.on('userContext',({username,room})=>{
        const user = joinUser(soc.id,username,room);

        soc.join(user.room);

        //Welcome the current user
        soc.emit('message',formatMessage(chatBot,"Welcome you have joined the chat"));

        //Notify all the other clients that a new user has joined the chat
        soc.broadcast.to(user.room).emit('message',formatMessage(chatBot,`${user.username} has joined the chat`));
        
        socio.to(user.room).emit('roomUsers',{
            users: getUsersForRoom(user.room),
            room:user.room
        });
    });

  

     //Listen to the chat message
     soc.on('chatMessage',(msg)=>{
        const user = getCurrentUser(soc.id);
        socio.to(user.room).emit('message',formatMessage(user.userName,msg));
    });


    //notify when  the use is disconnected
    soc.on('disconnect',()=>{
        const user = userLeave(soc.id);
        if(user)
        {
            soc.broadcast.to(user.room).emit('message',formatMessage(chatBot,`${user.username} has left the chat`));

            socio.to(user.room)
            .emit('roomUsers',{users : getUsersForRoom(user.room),room:user.room});
        }
    });
});

const port = 4000 || process.env.PORT;

server.listen(port,()=> console.log(`server running on port : ${port}`));