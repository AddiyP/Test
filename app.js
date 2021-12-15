const express = require('express');
const socketio = require('socket.io');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));



app.get('/', (req, res) => {
    //res.end('website 2');
    res.render('index');
});

const server = app.listen(process.env.PORT || 5000, () => {
    console.log('Server is running');
});

var generateUsername = function() {
    let first = ['spicy', 'chunky', 'chubby', 'pathetic', 'dumb', 'desperate', 'empty', 'sussy', 'mid', 'goated'];
    let second = ['meatloaf', 'pizza', 'fish', 'pig', 'redditor', 'clown', 'bakka', 'biden', 'monkey', 'chimp', 'op'];
    let index1 = Math.floor(Math.random() * first.length);
    let index2 = Math.floor(Math.random() * second.length);
    return first[index1] + "-" + second[index2];
}

const io = socketio(server, {
    cors: {
        origin: "http://localhost:8100",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});

io.on('connection', socket => {
    console.log('User connected');

    socket.username = generateUsername();
    socket.isAuthenticated = false;

    socket.on('change_username', data => {
        console.log("new username");
        socket.username = data.username;
        console.log(data);
    });

    socket.on('new_message', data => {
        console.log('new message');
        io.sockets.emit('receive_message', {message: data.message, username: socket.username});
    });
    
    io.sockets.emit('receive_message', {message: '' + username + ' joined', username: 'server'});
});

