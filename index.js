const io = require("socket.io")(8900, {
    cors: {
        origin: "http://localhost:3000",
    },
})


let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};

const removeUser = (userId) => {
    console.log({userId});
    users = users.filter((user) => user.userId !== userId);
    console.log('disconnect : ', {users});
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
    //when ceonnect
    console.log({users});
    //take userId and socketId from user
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
        //console.log('connect : ',{users});
    });
    //send and get message
    socket.on("sendMessage", ({ chat_id, deleted, img, profilePic, sentTime, userSend_id, receiverId, text }) => {
        const user = getUser(receiverId);
        //console.log({user});
        io.to(user.socketId).emit("getMessage", {
            chat_id, 
            deleted, 
            img, 
            profilePic, 
            sentTime, 
            userSend_id, 
            text
        });
    });

    //when disconnect
    socket.on("disconnect-user", (userId) => {
        removeUser(userId);
        io.emit("getUsers", users);
    });
});
