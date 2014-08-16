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
    socket.broadcast.emit('status update', {method:'broadcast', type:'new-user', text:'New user connected!', user:'unknown'} );

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('chat message', function (msg) {
        console.log('message: ' + msg.message + '\nfrom: ' + msg.user);
        io.sockets.emit('chat message', msg);
        socket.emit('status update', {method:'reply', type:'message', text:'Message sent!', user:msg.user});
        socket.broadcast.emit('status update', {method:'broadcast', type:'message', text:'Message received from [' + msg.user + ']', user:msg.user})
    });

    socket.on('update', function (data){
        console.log("Received update from [" + data.user + "]");
        if(data.method == 'broadcast') {
            console.log("Broadcasting data");
            socket.broadcast.emit('status update', data);
        } else
        if(data.method == 'reply') {
            console.log("Sending data back to user [" + data.user + "]");
            io.sockets.emit('status update', data);
        }
    })
});