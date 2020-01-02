// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1004;
canvas.height = 752;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
        bgReady = true;
};
bgImage.src = "./pictures/Images/background.png";

// Card Back
var cardBackReady = false;
var cardBack = new Image();
cardBack.onload = function () {
        cardBackReady = true;
};
cardBack.src = "./pictures/Images/back_card.png";

// Card
var cardReady = false;
var card = new Image();
card.onload = function () {
        //cardReady = true;
};
canvas.onclick = function () {
	if (!playerDone) {
		if (event.offsetX >= 80 && event.offsetX <=250 && event.offsetY >= 200 && event.offsetY <= 490) {
			console.log("PLAY");
			socket.emit('game', "PLAY");
			playerDone= 1;
		}
	}
}
card.src = "./pictures/Images/card20.png";

// played card 1
var cardP1Ready = false;
var cardP1 = new Image();
var cards = [];
cards.push(new Image());
cards[0].onload = function () {
        //cardP1Ready = true;
};
cards[0].src = "./pictures/Images/card12.png";

// played card 2
var cardP2Ready = false;
cards.push(new Image());
cards[1].onload = function () {
        //cardP2Ready = true;
};
cards[1].src = "./pictures/Images/card33.png";

// played card 3
var cardP3Ready = false;
cards.push(new Image());
cards[2].onload = function () {
        //cardP3Ready = true;
};
cards[2].src = "./pictures/Images/card46.png";

// played card 4
var cardP4Ready = false;
cards.push(new Image());
cards[3].onload = function () {
        //cardP4Ready = true;
};
cards[3].src = "./pictures/Images/card94.png";

var nb_players = -1;
var PlayerID = -1;
var playersDone = [0, 0, 0, 0];
var playerDone = 0;
var j = 0;
var k = 0;
var X = [0, 0, 0, 0];
var Y = [0, 0, 0, 0];
var playerOrder = [];

var socket = io.connect('http://localhost:8000');
socket.on('message', function(message) {
	netText=message;
	console.log(message);
	if (message[0] == 'C') { // Card
		cards[PlayerID].src = "./pictures/Images/card" + message.split('C')[1] + ".png";
		cardReady = true;
	} else if (message[0] == 'N') { // Number of players connected
		if (nb_players == -1) {
			PlayerID = parseInt(message.split('N')[1]) - 1;
			console.log("Player ID : " + PlayerID);
		}
		nb_players = parseInt(message.split('N')[1]);
	} else if (message[0] == 'P') {
		var n = parseInt(message.split('P')[1]);
		if (!playersDone[n]) {
			playersDone[n] = 1;
			X[k] = stackX;
			Y[k] = stackY;
			k++;
			stackX+=50;
			stackY+=60;
			playerOrder.push(n);
		}
	} else if (message[0] == 'A') { // All cards
		m = message.split('A')[1];
		cards[0].src = "./pictures/Images/card"+m.split('.')[0]+".png";
		cards[1].src = "./pictures/Images/card"+m.split('.')[1]+".png";
		cards[2].src = "./pictures/Images/card"+m.split('.')[2]+".png";
		cards[3].src = "./pictures/Images/card"+m.split('.')[3]+".png";
		console.log(m);
	}
	render();
});

// Draw everything
var stackX = 450;
var stackY = 180;
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0, 1004, 752);
  }
  if (cardBackReady) {
		var j = 0;
		for (var i = 0; i < nb_players; i++) {
			if (!playersDone[i]) {
				if (i == PlayerID) {
  	  		ctx.drawImage(cards[i], 50, 180, 200, 310);
				} else {
					ctx.drawImage(cardBack, 850, 150+200*j, 120, 180);
					j++;
				}
			}/* else {
				ctx.drawImage(cards[i], X[i], Y[i], 120, 180);
			}*/
		}
		for (var i = 0; i < playerOrder.length; i++) {
			ctx.drawImage(cards[playerOrder[i]], X[i], Y[i], 120, 180);
		}
  }
};

function run() {
	render();
  time = Date.now();
}

var time = Date.now();
setInterval(run, 10);

