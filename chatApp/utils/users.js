
var users = [];

function joinUser(id,username,room){
    var user = {id,username,room};

    users.push(user);

    return user;
}

function getUsersForRoom(room){
    const roomUsers = users.filter(user=>user.room === room);

    return roomUsers;
}

function getCurrentUser(id){
   return users.find(user=> user.id === id);
}

function userLeave(id){
    var index = users.findIndex(user=>user.id === id);

    if(index !== -1)
    {
        return users.splice(index,1)[0];
    }
}

module.exports = {joinUser,getCurrentUser,getUsersForRoom,userLeave};