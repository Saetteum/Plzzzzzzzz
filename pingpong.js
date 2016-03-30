(function($){
	$(function()
	{
		init();
	});
})(jQuery);

function renderPaddles() {
	$("#paddleB").css("top", pingpong.paddleB.y);
	$("#paddleA").css("top", pingpong.paddleA.y);
}

var pingpong = {
	paddleA: {
		x: 50,
		y: 100,
		width: 20,
		height: 70,
		speed : 0
	},
	paddleB: {
		x: 320,
		y: 100,
		width: 20,
		height: 70,
		speed : 0
	},
	playground: {
		offsetTop: $("#playground").offset().top,
		height: parseInt($("#playground").height()),
		width: parseInt($("#playground").width())
	},
	ball: {
		speed: 5,
		x: 150,
		y: 100,
		directionX: 1,
		directionY: 1
	},
	scoreA : 0,
	scoreB : 0
};
		
function gameloop() {
	if(pingpong.isPaused == false)
	{
		moveBall();
		autoMovePaddleA();
		autoMovePaddleB();
	}
}

function ballHitsTopBottom() {
	var y = pingpong.ball.y + pingpong.ball.speed * pingpong.ball.directionY;
	return y < 0 || y > pingpong.playground.height-parseInt($("#ball").height());
}

function ballHitsRightWall() {
	return pingpong.ball.x + pingpong.ball.speed * pingpong.ball.directionX > pingpong.playground.width;
}

function ballHitsLeftWall() {
	return pingpong.ball.x + pingpong.ball.speed * pingpong.ball.directionX < 0;
}

function handleMouseInputs(x) {
	// run the game when mouse moves in the playground.
	$('#playground').mouseenter(function(){
		pingpong.isPaused = false;
	});
	// pause the game when mouse moves out the playground.
	$('#playground').mouseleave(function(){
		pingpong.isPaused = true;
	});
	// calculate the paddle position by using the mouse position.
	if(x == 0)
		$('#playground').mousemove(function(e){
			pingpong.paddleB.y = e.pageY - pingpong.playground.offsetTop;
		});
}

function playerAWin() {
	// reset the ball;
	pingpong.ball.x = 250;
	pingpong.ball.y = 100;
	// update the ball location variables;
	pingpong.ball.directionX = -1;
	
	pingpong.scoreA++;
	$("#score-a").text(pingpong.scoreA);
}
function playerBWin() {
	// reset the ball;
	pingpong.ball.x = 150;
	pingpong.ball.y = 100;
	// update the ball location variables;
	pingpong.ball.directionX = 1;
	
	pingpong.scoreB++;
	$("#score-b").text(pingpong.scoreA);
}

function moveBall() {
	// reference useful varaibles
	var ball = pingpong.ball;
	// check playground top/bottom boundary
	if (ballHitsTopBottom()) {
		// reverse direction
		ball.directionY *= -1;
	}
	// check right
	if (ballHitsRightWall()) {
		playerAWin();
	}
	// check left
	if (ballHitsLeftWall()) {
		playerBWin();
	}
	// Variables for checking paddles
	var ballX = ball.x + ball.speed * ball.directionX;
	var ballY = ball.y + ball.speed * ball.directionY;
	// check moving paddle here, later.
	// check left paddle
	if (ballX >= pingpong.paddleA.x && ballX < pingpong.paddleA.x + pingpong.paddleA.width) {
		if (ballY <= pingpong.paddleA.y + pingpong.paddleA.height && ballY >= pingpong.paddleA.y) {
			ball.directionX = 1;
		}
	}
	// check right paddle
	if (ballX  >= (pingpong.paddleB.x) && ballX < (pingpong.paddleB.x + pingpong.paddleB.width ) ) {
		if (ballY <= pingpong.paddleB.y + pingpong.paddleB.height && ballY >= pingpong.paddleB.y) {
			ball.directionX = -1;
		}
	}	
		
	// update the ball position data
	ball.x += ball.speed * ball.directionX;
	ball.y += ball.speed * ball.directionY;
	
	//console.log("ball direction = " + ball.directionX);
	console.log("paddleB = " + pingpong.paddleB.x + " y = " + pingpong.paddleB.y + " ball.y = " + ballY);
}
function renderBall() {
	var ball = pingpong.ball;
	$("#ball").css({
		"left" : ball.x + ball.speed * ball.directionX,
		"top" : ball.y + ball.speed * ball.directionY
	});
}

function autoMovePaddleA() {
	var speed = 4;
	var direction = 1;
	var paddleY = pingpong.paddleA.y + pingpong.paddleA.height/2;
	if (paddleY > pingpong.ball.y) {
		direction = -1;
	}
	pingpong.paddleA.y += speed * direction;
}

function autoMovePaddleB() {


	//change speed is available   +2 or -2
	
	pingpong.paddleB.y += pingpong.paddleB.speed; 
}

function render() {
	renderBall();
	renderPaddles();
	window.requestAnimationFrame(render);
}

function init() {
	// set interval to call gameloop logic in 30 FPS
	pingpong.timer = setInterval(gameloop, 1000/30);
	
	// view rendering
	window.requestAnimationFrame(render);
	// inputs
	handleMouseInputs(0);
}