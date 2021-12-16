const express = require('express');
const socketio = require('socket.io');
const app = express();

const mongoURI = process.env.MOGODB_URI;
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});

app.set('view engine', 'ejs');
app.use(express.static('public'))



app.get('/', (req, res) => {
    //res.end('website 2');
    res.render('index');
});

const server = app.listen(process.env.PORT || 5000, () => {
    console.log('Server is running');
});

var generateUsername = function() {
    let first = ['spicy', 'chunky', 'chubby', 'pathetic', 'dumb', 'desperate', 'empty', 'sussy', 'mid', 'goated'];
    let second = ['meatloaf', 'pizza', 'fish', 'pig', 'clown', 'bakka', 'biden', 'monkey', 'chimp', 'op'];
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
        let firstBroken = data.message.split('{'); /* Parses string to find all beanmotes */
        let finalBroken = []; 
        let brokenType = []; /* A type of 1 indicates a beanmote */
        let count = 0;
        for (let i = 0; i < firstBroken.length; i++)
        {
            let currBroken = firstBroken[i].split('}');
            for (let j = 0; j < currBroken.length; j++)
            {
                finalBroken[count] = currBroken[j];
                if (finalBroken[count].substr(0, 4) === "http" || finalBroken[count].substr(0, 5) === " http")
                {
                    brokenType[count] = 1;
                }
                else
                {
                    brokenType[count] = 0;
                }
                count++;
            }
        }
        
        let send = {}; /* Object to send */
        send.username = socket.username;
        send.stringChunks = finalBroken;
        send.chunkTypes = brokenType;

        io.sockets.emit('receive_message', send);
    });
});

