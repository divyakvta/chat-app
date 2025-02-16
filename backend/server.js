const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const cors = require('cors');
const { socket } = require('socket.io');
const path = require('path')

dotenv.config();
connectDB();
const app = express();

app.use(express.json())

app.use(cors());
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

//-------------Deployment----------------

const __dirname1 = path.resolve(); 


if (process.env.NODE_ENV === 'production') {
    
    app.use(express.static(path.join(__dirname1, 'frontend', 'build')));

    
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname1, 'frontend', 'build', 'index.html'));
    });
} else {
    
    app.get("/", (req, res) => {
        res.send("API is running successfully");
    });
}
//-------------Deployment----------------


app.use(notFound)
app.use(errorHandler)


const PORT = process.env.PORT || 7000

const server = app.listen(PORT, console.log(`Server is started on port ${PORT}`))
const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", (socket) => {
    console.log("connected to socket.io");

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        console.log(userData._id)
        socket.emit('connected')
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log('user joined room', room)
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));


    socket.on('new message', (newMessagerecieved) => {
        var chat = newMessagerecieved.chat;
        if(!chat.users) {
            return console.log("chat.users not defined");
        }

        chat.users.forEach(user => {
            if(user._id == newMessagerecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessagerecieved)
        });
    });

    socket.off("setup", () => {
        console.log("user disconnected");
        socket.leave(userData._id)
    });


})