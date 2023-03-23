
var ship;
var asteroids = [];
var lasers = [];

var laserblast = new Audio('laserblast.wav');
var boom = new Audio('boom.wav');

var points = 0;


function setup() { 
  createCanvas(windowWidth, windowHeight - 30);
  ship = new Ship();
  for (var i = 0; i < 5; i++) {
  	asteroids.push(new Asteroid());
  }
} 

function rp() {
  Math.max(1, points / 30);
}

function respawn() {
    asteroids.push(new Asteroid(rp));
}

setInterval(respawn, 15000);


function updateDisplay() {
document.getElementById("points").innerHTML = "Points: " + points;
}


function addPoints(n) {
points += n;
updateDisplay();
}



function draw() { 
  background(0);
  
  for (var i = 0; i < asteroids.length; i++) {
    if (ship.hits(asteroids[i])) {
        location.reload()
    }
    asteroids[i].render();
  	asteroids[i].update();
    asteroids[i].edges();
  }


  for (var i = lasers.length-1; i >= 0; i--) {
    lasers[i].render();
  	lasers[i].update();
    if (lasers[i].offscreen()) {
      lasers.splice(i, 1);
    } else {
    	for (var j = asteroids.length-1; j >= 0; j--) {
    		if (lasers[i].hits(asteroids[j])) {
          addPoints(1)
    	    if (asteroids[j].r > 10) {
    	  		var newAsteroids = asteroids[j].breakup();
    	    	asteroids = asteroids.concat(newAsteroids);
    	    }
    	    asteroids.splice(j, 1);
    	    lasers.splice(i, 1);
            boom.play();
    	    break;
    		}
    	}
    }
  }
  
  console.log(lasers.length);
  
  ship.render();
  ship.turn();
  ship.update();
  ship.edges();
}

function keyReleased() {
  ship.setRotation(0);
  ship.boosting(false);
}

function keyPressed() {
  if (key == ' ') {
  	lasers.push(new Laser(ship.pos, ship.heading));
    laserblast.play();
	} else if (keyCode == RIGHT_ARROW) {
    ship.setRotation(0.1);
  } else if (keyCode == LEFT_ARROW) {
    ship.setRotation(-0.1);
  } else if (keyCode == UP_ARROW) {
    ship.boosting(true);
  }
}