let canvasWidth = 600;
let canvasHeight = 500;


let player = new Player();
let enimes = [];
enimes[0] = new Enemy(100, 100, "red", 90);
enimes[1] = new Enemy(canvasWidth / 2, 20, "green", 60);
enimes[2] = new Enemy(canvasWidth - 40, canvasHeight - 60, "blue", 30);

let goalSize = 30;
let goalOnePosition = new Position((canvasWidth / 3) - (goalSize / 2), (canvasHeight / 3) - (goalSize / 2));
let goalTwoPosition = new Position(((canvasWidth * 2) / 3) - (goalSize / 2), (canvasHeight / 3) - (goalSize / 2));
let goalThreePosition = new Position(((canvasWidth * 2) / 3) - (goalSize / 2), ((canvasHeight * 2) / 3) - (goalSize / 2));
let goalFourPosition = new Position((canvasWidth / 3) - (goalSize / 2), ((canvasHeight * 2) / 3) - (goalSize / 2));

let redGoal = new Goal(goalOnePosition, goalTwoPosition, 1, goalSize, "red");
let greenGoal = new Goal(goalTwoPosition, goalThreePosition, 2, goalSize, "green");
let blueGoal = new Goal(goalThreePosition, goalFourPosition, 3, goalSize, "blue");


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
    redGoal.update();
    greenGoal.update();
    blueGoal.update();


    //update graphics
    redGoal.render();
    blueGoal.render();
    greenGoal.render();
    player.render();
    for(i = 0; i < enimes.length; i++) {
        enimes[i].render();
    }


    console.log(redGoal.x);
    

}


/*
*@param x -- starting x position for enemy
*@param y -- starting y position for enemy
*@param color -- color of enemy
*@param adjustTime -- time in 1/60 of seconds for adjustments to be made
*/
function Enemy(x, y, color, adjustTime) {
    this.x = x;
    this.y = y;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.maxSpeed = 2;
    this.adjustRate = this.maxSpeed;
    this.radius = 5;
    this.color = color;
    this.counter = new Counter();
    this.adjustTimer = adjustTime;

    this.update = function() {
    
        //adjust for player after set ammount of time
        if(this.counter.isCountAt(this.adjustTimer)) {
            
            if(player.x > this.x) {
                this.xSpeed += this.adjustRate;
            }else if(player.x < this.x) {
                this.xSpeed -= this.adjustRate;
            }

            if(player.y > this.y) {
                this.ySpeed += this.adjustRate;
            }else if(player.y < this.y) {
                this.ySpeed -= this.adjustRate;
            }

            //limit speed
            if(this.ySpeed > this.maxSpeed) {
                this.ySpeed = this.maxSpeed;
            }else if(this.ySpeed < -this.maxSpeed) {
                this.ySpeed = -this.maxSpeed;
            }

            if(this.xSpeed > this.maxSpeed) {
                this.xSpeed = this.maxSpeed;
            }else if(this.xSpeed < -this.maxSpeed) {
                this.xSpeed = -this.maxSpeed;
            }

            this.counter.resetCount();
        }else {
            this.counter.update();
        }
        

        //add x and y speeds to position
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
    this.speed = 4;
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

/*
*@param position -- position of goal
*@param positionToGoTo -- positon for goal to head to
*@param goalStop -- current goal stop heading to (0 - 3)
*@param size -- size of goal
*@param color -- color for goal to look for in emeny to score point
*/
function Goal(position, positionToGoTo, goalStop, size, color) {
    this.x = position.x;
    this.y = position.y;
    this.nextPosition = positionToGoTo;
    this.goalStop = goalStop;
    this.size = size;
    this.color = color;


    this.update = function() {
        console.log("Current Pos: " + this.x + " " + this.y + ", Going to: " + this.nextPosition.x + " " + this.nextPosition.y);
        if(Math.floor(this.x) === Math.floor(this.nextPosition.x) && Math.floor(this.y) === Math.floor(this.nextPosition.y)) {
            //set new nextPosition
            if(this.goalStop === 0) {
                this.nextPosition = goalTwoPosition;
            }else if (this.goalStop === 1) {
                this.nextPosition = goalThreePosition;
            }else if (this.goalStop === 2) {
                this.nextPosition = goalFourPosition;
            }else if (this.goalStop === 3) {
                this.nextPosition = goalOnePosition;
            }

            //increment goal stop
            this.goalStop++;
            if(this.goalStop > 3) {
                this.goalStop -= 4;
            }

        }

        if(this.x < this.nextPosition.x) {
            this.x++;
        }else if(this.x > this.nextPosition.x) {
            this.x--;
        }

        if(this.y < this.nextPosition.y) {
            this.y++;
        }else if(this.y > this.nextPosition.y) {
            this.y--;
        }

    }


    /*
    *@param x -- x value of point to check
    *@parma y -- y value of point to check
    */
    this.isInsideGoal = function(x, y) {
        //check inside x values
        if(x >= this.x && x <= this.x + this.width) {
            //check inside y values
            if(y >= this.y && y <= this.y + this.height) {
                //is inside goal
                return true;
            }
        }

        //not inside goal
        return false;
    }

    //@param position -- new position to set goal to 
    this.setPosition = function(position) {
        this.x = position.x;
        this.y = position.y;
    }

    this.render = function() {
        fill(color);
        rect(this.x, this.y, this.size, this.size);
    }

}


//counter class to "keep time"
function Counter() {

    this.count = 0;

    this.update = function() {
        this.count++;
    }

    this.resetCount = function() {
        this.count = 0;
    }

    this.isCountAt = function(val) {
        return this.count === val;
    }
}

//position object which is almost a vector but I dont want to look up the Vector class for p5
function Position(x, y) {
    this.x = x;
    this.y = y;
}