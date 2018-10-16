let canvasWidth = 600;
let canvasHeight = 500;
let gameOver = false;

let player = new Player();
let score = 0;

//create goals
let goalSize = 30;
let goalOnePosition = new Position((canvasWidth / 3) - (goalSize / 2), (canvasHeight / 3) - (goalSize / 2));
let goalTwoPosition = new Position(((canvasWidth * 2) / 3) - (goalSize / 2), (canvasHeight / 3) - (goalSize / 2));
let goalThreePosition = new Position(((canvasWidth * 2) / 3) - (goalSize / 2), ((canvasHeight * 2) / 3) - (goalSize / 2));
let goalFourPosition = new Position((canvasWidth / 3) - (goalSize / 2), ((canvasHeight * 2) / 3) - (goalSize / 2));

let redGoal = new Goal(goalOnePosition, goalTwoPosition, 1, goalSize, "red");
let greenGoal = new Goal(goalTwoPosition, goalThreePosition, 2, goalSize, "green");
let blueGoal = new Goal(goalThreePosition, goalFourPosition, 3, goalSize, "blue");

//create enimes
redEnemy = new Enemy(100, 100, "red", 90);
greenEnemy = new Enemy(goalThreePosition.x + 10, goalThreePosition.y + 10, "green", 60);
blueEnemy = new Enemy(canvasWidth - 40, canvasHeight - 60, "blue", 30);

//game over timer
let gameOverTimer = new Counter();
let gameOverBlinkRate = 30;
let isBlink = true;


function setup() {
    createCanvas(canvasWidth, canvasHeight);
    frameRate(60);
    background(51);
    textFont('Courier New');
}

function draw() {
    //clear screen
    fill(51);
    rect(0, 0, canvasWidth, canvasHeight);

    if(!gameOver){
        //update logic
        player.update();
        redEnemy.update();
        greenEnemy.update();
        blueEnemy.update();
        redGoal.update(redEnemy);
        greenGoal.update(greenEnemy);
        blueGoal.update(blueEnemy);
    }

        //update graphics
        //always going to update graphics
        stroke(255);
        strokeWeight(0);
        textSize(24);
        fill(255);
        text("Score: " + score, 20, 40);
        strokeWeight(1);
        redGoal.render();
        blueGoal.render();
        greenGoal.render();
        player.render();
        redEnemy.render();
        greenEnemy.render();
        blueEnemy.render();

        //draw game over text
        if(gameOver) {
            gameOverTimer.update();
            if(gameOverTimer.isCountAt(gameOverBlinkRate)) {
                gameOverTimer.resetCount();
                isBlink = !isBlink;
            }
            if(isBlink) {
                textSize(60);
                fill(255);
                stroke(0);
                strokeWeight(4);
                text("Game Over", canvasWidth / 2 - (60 * 2.5), canvasHeight / 2 + 20);
            } 

            if(keyIsDown(ENTER)) {
                gameOver = !gameOver;
                resetGame();
            }
        }
    

}

function resetGame() {
    score = 0;
    redEnemy.x = 100;
    redEnemy.y = 100;
    greenEnemy.x = goalThreePosition.x + 10;
    greenEnemy.y = goalThreePosition.y + 10;
    blueEnemy.x = canvasWidth - 40;
    blueEnemy.y = canvasHeight - 60;

}


/*
*@param x -- starting x position for enemy
*@param y -- starting y position for enemy
*@param color -- color of enemy
*@param adjustTime -- time in 1/60 of seconds for adjustments to be made
*/
function Enemy(x, y, color, adjustTime) {
    this.x = Math.floor(x);
    this.y = Math.floor(y);
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


        //check if collides with player
        if(player.collidesWith(new Position(this.x, this.y), this.radius)) {
            //game over
            gameOver = true;
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

    this.collidesWith = function(position, radius) {
        //console.log("Player: " + this.x + " " + this.y + "\nEnemy: " + position.x + " " + position.y);

        let leftSide = this.x - this.radius;
        let rightSide = this.x + this.radius;
        let top = this.y - this.radius;
        let bottom = this.y + this.radius;

        let objectLeftSide = position.x - radius;
        let objectRigthSide = position.x + radius;
        let objectTop = position.y - radius;
        let objectBottom = position.y + radius;

        //console.log("Player: left-%d, right-%d, top-%d, bottom-%d \nEnemy: left-%d, right-%d, top-%d, bottom-%d", leftSide, rightSide, top, bottom, objectLeftSide, objectRigthSide, objectTop, objectBottom);

        //check left side
        if(objectRigthSide > leftSide) {
            //check right side
            if(objectLeftSide < rightSide) {
                //check top
                if(objectBottom > top) {
                    //check bottom
                    if(objectTop < bottom) {
                        return true;
                    }
                }
            }
        }

        return false;
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
    this.enemyHasEntered = false;
    this.explosion = new Explosion(new Position(0, 0), this.size, this.color);
    this.explosion.canRender = false;


    this.update = function(enemy) {

        if(this.x === this.nextPosition.x && this.y === this.nextPosition.y) {
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
        
        //check for enemy inside goal
        if(this.isInsideGoal(enemy.x, enemy.y, enemy.radius)) {
            if(this.enemyHasEntered === false) {
                score++;
                this.enemyHasEntered = true;
                this.explosion = new Explosion(new Position(enemy.x, enemy.y), enemy.radius);
            }
        }else {
            this.enemyHasEntered = false;
        }

        //update explosion
        this.explosion.update();
        

    }



    /*
    *@param x -- x value of point to check
    *@parma y -- y value of point to check
    *@param radius -- radius of enemy to add buffer for
    */
    this.isInsideGoal = function(x, y, radius) {
        //check inside x values
        if(x > (this.x - radius) && x < (this.x + this.size + radius)) {
            //check inside y values
            if(y > this.y - radius && y < this.y + this.size + radius) {
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

        //render explosion if can
        if(this.explosion.canRender) {
            this.explosion.render();
        }
    }

}

function Explosion(position, radius) {
    this.position = position;
    this.expandRate = 2;
    this.alphaDecay = 8;
    this.radius = radius;
    this.expandTime = 40;
    this.timer = new Counter();
    this.canRender = true;
    this.alpha = 255;

    this.update = function() {
        this.radius += this.expandRate;
        this.alpha -= this.alphaDecay;
        this.timer.update();
        if(this.timer.isCountAt(this.expandTime)) {
            this.canRender = false;
        }
    }

    this.render = function() {
        noFill();
        ellipseMode(RADIUS);
        stroke(color(255,255,255, this.alpha));
        ellipse(this.position.x, this.position.y, this.radius);
        stroke(color(255,255,255, 255));
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
    this.x = Math.floor(x);
    this.y = Math.floor(y);
}