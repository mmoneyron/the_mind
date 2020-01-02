// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 800;
//document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
        bgReady = true;
};
bgImage.src = "./background.png";

// Background image
var cardReady = false;
var cardImage = new Image();
cardImage.onload = function () {
        cardReady = true;
};
cardImage.src = "./pictures/card_back.png";

netText="-";

var socket = io.connect('http://localhost:8000');
socket.on('message', function(message) {
	//alert('Le serveur a un message pour vous : ' + message);
	netText=message;
	render();
});

// Draw everything
var render = function () {
        if (bgReady) {
                //ctx.drawImage(bgImage, 0, 0);
        }
        if (cardReady) {
                //ctx.drawImage(cardImage, 20, 20);
        }

        // Score
	var para = document.createElement("p");
	var node = document.createTextNode("This is new.");
	para.appendChild(node);

	var paren = document.getElementById("div1");
	var child = document.getElementById("div1");
	element.appendChild(para);
        ctx.fillStyle = "rgb(250, 250, 250)";
        ctx.font = "24px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        //ctx.fillText(netText, 32, 32);
	var j = 0;
	var lines = netText.split('\n');
	/*while (j < lines.length) {
        	ctx.fillText(lines[j], 32, 32 + (j*32));
		j++;
	}*/
};

/*
function animate() {
        render();

        // Request a new animation frame using Paul Irish's shim
        window.requestAnimFrame(animate);
};
*/

function run() {
        render();
        time = Date.now();
        }

var time = Date.now();
setInterval(run, 10);

