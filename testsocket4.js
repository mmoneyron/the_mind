/**************************************************
** NODE.JS REQUIREMENTS
**************************************************/
var util = require("util"),
    express = require("express"),
        app = express(),
        http = require("http"),
	sq = require('sqlite3'),
        io = require("socket.io")(http);                              // Socket.IO

/**************************************************
** GAME VARIABLES
**************************************************/
var socket;             // Socket controller

var mess="";
var sclient;
var prot=0;

function retrieveGameState() {
        console.log("------------------------");
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
        //socket.sockets.on("connection", onSocketConnection);
        console.log("testsocket4.js started");

	setInterval(retrieveGameState, 1000);
};

// New socket connection
function onSocketConnection(client) {

        console.log("New player has connected: "+client.constructor.name);
        console.log("New player has connected: "+client.id);

	//client.emit('message', mess);
	sclient=client;
	prot=1;
};


init();
