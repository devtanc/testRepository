var socket = io();
var status = '';

/*
$('form').submit(function () {
    socket.emit('chat message', $('#message').val());
    $('#message').val('');
    $('#statusbar').text('Message sent!');
    status = 'sent';
    return false;
});

socket.on('chat message', function (msg) {
    $('#messages').append($('<li>').text(msg));
});

socket.on('status update', function (msg){
	$('#statusbar').text(msg);
})
*/

$('#message').keypress(function(){
	if (status != 'typing') {
		status = 'typing';
    	socket.emit('typing', 'Tanner');
    }
});