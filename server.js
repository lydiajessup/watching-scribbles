// Express, Web Portion, set up server
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//start server
server.listen(80);

//starting express
app.use(express.static('public'));

//send response if working
app.get('/', function (request, response) {
  res.send("Hello");
});

// WebSocket Portion
var watcher = null;

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
// open up a new connection
io.sockets.on('connection',
	// We are given a websocket object in our function
	function (socket) {

    //say ID
		console.log("We have a new client: " + socket.id);

		socket.on('watch', function(data) {
			// It's the watcher
			watcher = socket;
			console.log("have a watcher");
		});

		// client side: socket.emit('event', object representing the event);
		socket.on('event',
			// Run this function when a message is sent
			function (data) {
				console.log(data);

				// If there is a watcher, send to them
				if (watcher != null) {
					console.log("send to watcher");
					data.socket_id = socket.id;
					watcher.emit('event', data);
				}
			}
		);

		socket.on('disconnect', function() {
			console.log("Client has disconnected");
		});
	}
);
