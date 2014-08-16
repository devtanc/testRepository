var app = angular.module('chatRoom', []);

app.factory('socket', function(){
	var socket = io.connect();
	return socket;
});

app.controller('chatRoomController', function($scope, socket){
	$scope.messages = [];
	$scope.loggedIn = false;
	$scope.username = '';
	$scope.status = {type:'', text:'Ready...'};

	$scope.$watch('MessageCenter.$dirty', function(change){
		if(change){
			socket.emit('update', {method:'broadcast', type:'typing', text:$scope.username + " typing...", user:$scope.username});
		}
	});

	$scope.login = function() {
		if ($scope.username != '') {
			console.log("Logging in [" + $scope.username + "]");
			$scope.loggedIn = true;
			socket.emit('update', {method:'broadcast', type:'new-user', text:$scope.username + " just joined!", user:$scope.username});
		} else {
			socket.emit('update', {method:'reply', type:'error', text:'No username supplied', user:$scope.username})
		}
	}

	$scope.sendMessage = function(msg) {
		if (msg && $scope.loggedIn) {
			console.log("Sending message from [" + $scope.username + "]");
			socket.emit('chat message', {user:$scope.username, message:msg, date:new Date()});
			$scope.message = '';
			$scope.MessageCenter.$setPristine();
		} else {
			console.log("Invalid login");
			socket.emit('update', {method:'reply', type:'error', text:'Please log in...', user:$scope.username})
		}
		
	};

	socket.on('chat message', function (msg) {
	    $scope.messages.push(msg);
	    $scope.$apply();
	});

	socket.on('status update', function (data){
		$scope.status.type = data.type;
		$scope.status.text = data.text;
		$scope.$apply();
	});
});