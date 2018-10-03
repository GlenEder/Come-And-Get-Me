let canvasWidth = 600;
let canvasHeight = 500;


let player = new Player();

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

    //update graphics
    player.render();

}

function Player() {
    this.x = canvasWidth / 2;
    this.y = canvasHeight / 2;
    this.speed = 3;
    this.radius = 5;

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