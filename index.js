var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(process.env.PORT || 5000);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.render('index.html');
});

io.sockets.on('connection', function (socket) {
    console.log('a user connected');

    io.sockets.emit('status update', 'New user connected!');

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('chat message', function (msg) {
        console.log('message: ' + msg.message + '\nfrom: ' + msg.user);
        io.sockets.emit('chat message', msg);
        socket.emit('status update', 'Message sent!');
        socket.broadcast.emit('status update', 'Message received from [' + msg.user + ']!')
    });

    socket.on('typing', function (user){
        io.sockets.emit('status update', user + ' currently typing...');
    })
});