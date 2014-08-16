var app = angular.module('chatRoom', []);

app.factory('socket', function(){
	var socket = io.connect();
	return socket;
});

app.controller('chatRoomController', function($scope, socket){
	$scope.messages = [];
	$scope.loggedIn = false;
	$scope.username = '';
	$scope.status = 'status';

	$scope.$watch('MessageCenter.$dirty', function(change){
		if(change){
			socket.emit('typing', $scope.username);
		}
	});

	$scope.sendMessage = function(msg) {
		socket.emit('chat message', {user:$scope.username, message:msg, date:new Date()});
		$scope.message = '';
		$scope.MessageCenter.$setPristine();
	};

	socket.on('chat message', function (msg) {
	    $scope.messages.push(msg);
	    $scope.$apply();
	});

	socket.on('status update', function (msg){
		$scope.status = msg;
		$scope.$apply();
	});
});