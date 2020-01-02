/**************************************************
** NODE.JS REQUIREMENTS
**************************************************/
var util = require("util"),
    express = require("express"),
        app = express(),
        http = require("http"),
        io = require("socket.io")(http);                              // Socket.IO

/**************************************************
** GAME VARIABLES
**************************************************/
var socket;             // Socket controller

var n;
var nb_players = 0;
var sclient;
var prot=0;
var cards = [];
var clients = [];
var playersDone = [0, 0, 0, 0];
var start = false;
var played = false

function runGame() {
  //console.log("------------------------");
	if (!start) {
		io.sockets.emit('message', 'N' + nb_players.toString());
		if (nb_players == 4) {
			start = true;
			io.sockets.emit('message', 'A' + cards[0] + '.' + cards[1] + '.' + cards[2] + '.' + cards[3]);
			console.log(cards);
			cards = cards.sort();
		}
	}
	if (played) {
		for (var i = 0; i < 4; i++) {
			if (playersDone[i]) {
				io.sockets.emit('message', 'P' + i);
			}
		}
		played = false;
	}
}

/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Create an empty array to store players
  server=http.createServer(app);
  // Set up Socket.IO to listen on port 8000
  socket = io.listen(server);
	server.listen(8000);
  app.use(express.static(__dirname+"/public"));

	// Start listening for events
  io.on("connection", onSocketConnection);
  console.log("the_mind.js started");
	
	// Build cards array
	n = Math.floor(Math.random() * 100) + 1;
	cards.push(n);
	n = Math.floor(Math.random() * 100) + 1;
	while (n == cards[0]) {
		n = Math.floor(Math.random() * 100) + 1;
	}
	cards.push(n);
	n = Math.floor(Math.random() * 100) + 1;
	while (n == cards[0] || n == cards[1]) {
		n = Math.floor(Math.random() * 100) + 1;
	}
	cards.push(n);
	n = Math.floor(Math.random() * 100) + 1;
	while (n == cards[0] || n == cards[1] || n == cards[2]) {
		n = Math.floor(Math.random() * 100) + 1;
	}
	cards.push(n);

	setInterval(runGame, 1000);
};

function getClientByID(id) {
	for (var i = 0; i < nb_players; i++) {
		if (id == clients[i])
			return i;
	}
};

// New socket connection
function onSocketConnection(client) {
        //console.log("New player has connected: "+client.constructor.name);
        console.log("New player has connected: "+client.id);

	if (nb_players < 4) {
		nb_players++;
		client.emit('message', 'N' + nb_players.toString());
		client.emit('message', "C" + cards[nb_players-1].toString());
		sclient=client;
		prot=1;
		clients.push(client.id);
		if (nb_players == 4) {
		}
	}
	client.on('game',  function(msg) {
		console.log('[' + getClientByID(client.id) + '] : ' + msg);
		playersDone[getClientByID(client.id)] = 1;
		played = true;
	});

};


init();
