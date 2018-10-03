let canvasWidth = 600;
let canvasHeight = 500;


let player = new Player();
let enimes = [];
enimes[0] = new Enemy(100, 100, "red");
enimes[1] = new Enemy(canvasWidth / 2, 20, "green");
enimes[2] = new Enemy(canvasWidth - 40, canvasHeight - 60, "blue");

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    frameRate(60);
    background(51);
}

function draw() {
    //clear screen
    fill(51);
    rect(0, 0, canvasWidth, canvasHeight);

    //update logic
    player.update();
    for(i = 0; i < enimes.length; i++) {
        enimes[i].update();
    }

    //update graphics
    player.render();
    for(i = 0; i < enimes.length; i++) {
        enimes[i].render();
    }

}

function Enemy(x, y, color) {
    this.x = x;
    this.y = y;
    this.xSpeed = 2;
    this.ySpeed = 2;
    this.adjustRate = 1;
    this.radius = 5;
    this.color = color;

    this.update = function() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;

        
        //check bounds
        if(this.x - this.radius < 0) {
            this.x = this.radius;
            this.xSpeed *= -1;
        }else if(this.x + this.radius > canvasWidth) {
            this.x = canvasWidth - this.radius;
            this.xSpeed *= -1;
        }

        if(this.y - this.radius < 0) {
            this.y = this.radius;
            this.ySpeed *= -1;
        }else if(this.y + this.radius > canvasHeight) {
            this.y = canvasHeight - this.radius;
            this.ySpeed *= -1;
        }
    }

    this.render = function() {
        ellipseMode(RADIUS);
        fill(color);
        ellipse(this.x, this.y, this.radius);
    }
}

function Player() {
    this.x = canvasWidth / 2;
    this.y = canvasHeight / 2;
    this.speed = 3;
    this.radius = 7;

    this.update = function() {

        //check for input
        if(keyIsDown(UP_ARROW)) {
            this.y -= this.speed;
        }

        if(keyIsDown(DOWN_ARROW)) {
            this.y += this.speed;
        }

        if(keyIsDown(RIGHT_ARROW)) {
            this.x += this.speed;
        }

        if(keyIsDown(LEFT_ARROW)) {
            this.x -= this.speed;
        }


        //check bounds
        if(this.x - this.radius < 0) {
            this.x = this.radius;
        }else if(this.x + this.radius > canvasWidth) {
            this.x = canvasWidth - this.radius;
        }

        if(this.y - this.radius < 0) {
            this.y = this.radius;
        }else if(this.y + this.radius > canvasHeight) {
            this.y = canvasHeight - this.radius;
        }
    }

    this.render = function() {
        ellipseMode(RADIUS);
        fill(255);
        ellipse(this.x, this.y, this.radius);
    }
}