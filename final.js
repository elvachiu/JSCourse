"use strict"

function rand(start, end){
    return Math.floor(Math.random()*(end-start+1))+start;
}

class Stair{
    constructor(){
        //set the x-axis for stairs
        const left = [0, 55, 110, 165, 220, 275, 330, 385, 440, 495, 550];
        this.coor = {
            x: left[rand(0, 10)],
            y: 440 //start from the bottom
        };
        this.nodeS = nodeS;
        this.nodeS.style.left = this.coor.x + "px";
        this.nodeS.style.top = this.coor.y + "px";
        this.offset = { //the stair goes up
            x: 0,
            y: rand(5, 10)/10
        };
        this.nodeS.setAttribute("class", "stair"); //set the style for stairs
    }
    ceiling(){ //set the ceiling
        const hitTop = () => this.coor.y <= 0;
        if(hitTop()){
            return 1;
        }
    }
    move(){ 
        if(this.ceiling()){ //first check whether hit the ceiling or not
            return 100;
        }
        this.coor.y -= this.offset.y; //goes up
        this.nodeS.style.top = this.coor.y + "px";
    }
}

class Ball{
    constructor(){
        this.coor = {
            x: 250,
            y: 0
        };
        this.nodeB = nodeB;
        this.nodeB.style.left = this.coor.x + "px";
        this.nodeB.style.top = this.coor.y + "px";
        this.offset = { //the ball goes left or right
            x: 0,
            y: 5
        }; //initially stay still
        this.nodeB.setAttribute("class", "ball"); //set the style for the ball
    }
    bounce(){ //set boundaries, and the ball bounces hitting them
        const hitTop = () => this.coor.y <= this.radius*2;
        const hitBottom = () => this.coor.y >= 600 - this.radius*2;
        const hitLeft = () => this.coor.x >= 600 - this.radius*2;
        const hitRight = () => this.coor.x <= 0;
        if(hitLeft() || hitRight() || hitBottom() || hitTop()){
            return 1;
        }else{
            return 0;
        }
    }//bounce() & roll() undone
    roll(direc, speed){
        if(this.bounce()){ //first check whether hit the boundaries or not
            direc *= -1; //the opposite direction
        }
        if(direc == 2){ //arrow left
            this.offset.x = -3;
            this.coor.x += this.offset.x;
            this.nodeB.style.left = this.coor.x + "px";
        }else if(direc == -2){ //arrow right
            this.offset.x = 3;
            this.coor.x += this.offset.x;
            this.nodeB.style.left = this.coor.x + "px";
        }else if(direc == 5){ //let the ball goes up by the speed of the stair it is on
            if(ball.coor.y >= 0){
                ball.coor.y -= speed*2;
                ball.nodeB.style.top = ball.coor.y + "px";
            }
        }
    }
}

//container-black box
var container = document.createElement("div");
container.setAttribute("id", "container");
document.body.appendChild(container);

var stairs = rand(5, 10) //record how many stairs have been created (initially 5~10 stairs)
let aStair = [50], nodeS; //the stairs
let ball, nodeB; //the ball

//stairs created at the start
for(let i=0; i<stairs; i++){
    nodeS = document.createElement("div");
    nodeS.setAttribute("id", "stair"+i);
    aStair[i] = new Stair(nodeS);
    container.appendChild(nodeS);
}

//ball created
nodeB = document.createElement("div");
nodeB.setAttribute("id", "ball");
ball = new Ball(nodeB);
container.appendChild(nodeB);

var roll; //later setInterval()
function touch(){ //check if the ball touch any stairs
    for(let i=0; i<stairs; i++){
        if(ball.coor.y <= aStair[i].coor.y-20 && ball.coor.y >= aStair[i].coor.y-30 && ball.coor.x <= aStair[i].coor.x+50 && ball.coor.x >= aStair[i].coor.x){
            let s = aStair[i].offset.y; //the speed of the stair the ball touched
            setTimeout(clearInterval, 0, start); //stop the ball when it touch the stair
            roll = setInterval(function rolling(){
                ball.roll(5, s); //let the ball goes up by the speed of the stair it is on
            }, 50);
            break;
        }
    }
}

//game starts, the ball falls until it touches any stairs or hits the ground
var start = setInterval(function start(){
    if(ball.coor.y <= 430){ //before it hits the ground
        touch(); //check if it touches any stairs
        ball.coor.y += ball.offset.y;
        ball.nodeB.style.top = ball.coor.y + "px";
    }
}, 50)

var timer = setInterval(function stairMoves(){
    for(let i=0; i<stairs; i++){ 
        if(document.getElementById("stair"+i) !== null && aStair[i].move() == 100){ 
            let hitCeiling = document.getElementById("stair"+i);
            hitCeiling.remove(); //remove div
        }else{ // if(document.getElementById("stair"+i) !== null)
            aStair[i].move();
        }
    }
}, 50);

var timer2 = setInterval(function addStair(){
    nodeS = document.createElement("div");
    nodeS.setAttribute("id", "stair"+stairs);
    aStair[stairs] = new Stair(nodeS);
    container.appendChild(nodeS);
    stairs += 1;
}, 1000);

//games run for 20 secs (just for testing)
setTimeout(clearInterval, 20000, start); 
setTimeout(clearInterval, 20000, timer); 
setTimeout(clearInterval, 20000, timer2); 
setTimeout(clearInterval, 10000, roll); //seems to not be working...

function control(e){ //use keyboards to control the ball
    switch(e.code){ //goes left
        case "ArrowLeft":
            ball.roll(2, 0);
            break;
        case "ArrowRight": //goes right
            ball.roll(-2, 0);
            break;
    }
}
window.addEventListener("keydown", control, false);
