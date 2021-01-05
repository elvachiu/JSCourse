"use strict";

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
            y: 0.8
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
        this.coor = { //initial position
            x: 250,
            y: 0
        };
        this.nodeB = nodeB;
        this.nodeB.style.left = this.coor.x + "px";
        this.nodeB.style.top = this.coor.y + "px";
        this.offset = { //initially fall
            x: 0,
            y: 5
        };
        this.status = 3 //3:falls down, 7:goes up
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
    roll(direc){
        if(this.bounce()){ //first check whether hit the boundaries or not
            direc *= -1; //the opposite direction
        }
        if(direc == 2){ //arrow left
            this.offset.x = -5;
            this.coor.x += this.offset.x;
            this.nodeB.style.left = this.coor.x + "px";
        }else if(direc == -2){ //arrow right
            this.offset.x = 5;
            this.coor.x += this.offset.x;
            this.nodeB.style.left = this.coor.x + "px";
        }
    }
}

class Bullet{
    constructor(){
        this.coor = {
            x: 575, //fire from the right wall
            y: rand(0, 445)
        }
        this.offset = {
            x: 20
        }
        this.nodeBullet = nodeBullet;
        this.nodeBullet.style.left = this.coor.x + "px";
        this.nodeBullet.style.top = this.coor.y + "px";
        this.nodeBullet.setAttribute("class", "bullet"); //set the style for the bullet
    }
    walls(){ //whether bullets hit walls or not
        const hitRight = () => this.coor.x <= 0;
        if(hitRight()){
            return 1;
        }
    }
    shoot(){ 
        if(this.walls()){ //first check whether hit walls or not
            return 200;
        }
        //if not, bullets fly left
        this.coor.x -= this.offset.x;
        this.nodeBullet.style.left = this.coor.x + "px";
    }
}

//container - black box
var container = document.createElement("div");
container.setAttribute("id", "container");
document.body.appendChild(container);

var stairs = 7 //record how many stairs have been created (initially 7)
let aStair = [50], nodeS; //the stairs
let ball, nodeB; //the ball
var bullets = 1; //record how many bullets have been generated
let aBullet = [50], nodeBullet; //the bullets

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

//bullets created
nodeBullet = document.createElement("div");
nodeBullet.setAttribute("id", "bullet"+bullets);
aBullet[bullets] = new Bullet(nodeBullet);
container.appendChild(nodeBullet);

var status, speed;
function run(){ //let ball either falls or goes up
    if(ball.coor.y <= 430 && ball.status == 3){
        ball.coor.y += speed;
    }else if(ball.coor.y >= 0 && ball.status ==7){
        ball.coor.y -= speed;
    }
    ball.nodeB.style.top = ball.coor.y + "px";
};
status = setInterval(function status(){ //whether the ball is on stairs or in air
    for(let i=0; i<stairs; i++){
        if(ball.coor.y <= aStair[i].coor.y-10 && ball.coor.y >= aStair[i].coor.y-20 && ball.coor.x <= aStair[i].coor.x+50 && ball.coor.x >= aStair[i].coor.x){
            speed = aStair[i].offset.y; //the speed of the stair the ball touched
            ball.status = 7;
            break;
        }
        else if(ball.coor.y >= aStair[i].coor.y-10 || ball.coor.y <= aStair[i].coor.y-20 || ball.coor.x >= aStair[i].coor.x+50 || ball.coor.x <= aStair[i].coor.x){
            speed = ball.offset.y;
            ball.status = 3;
        }
    }
    run();
}, 20);

var moving = setInterval(function stairMoves(){
    for(let i=0; i<stairs; i++){ 
        if(document.getElementById("stair"+i) !== null && aStair[i].move() == 100){ 
            let hitCeiling = document.getElementById("stair"+i);
            hitCeiling.remove(); //remove div
        }else{ // if(document.getElementById("stair"+i) !== null)
            aStair[i].move();
        }
    }
}, 50);
var addStair = setInterval(function addStair(){
    nodeS = document.createElement("div");
    nodeS.setAttribute("id", "stair"+stairs);
    aStair[stairs] = new Stair(nodeS);
    container.appendChild(nodeS);
    stairs += 1;
}, 1000);

var fire = setInterval(function fireBullets(){
    for(let i=1; i<=bullets; i++){
        if(document.getElementById("bullet"+i) !== null && aBullet[i].shoot() == 200){ 
            let hitWall = document.getElementById("bullet"+i);
            hitWall.remove(); //remove div
        }else if(document.getElementById("bullet"+i) !== null && aBullet[i].shoot() !== 200){
            aBullet[i].shoot();
        }
    }
}, 100);
var bullets = setInterval(function generate(){
    nodeBullet = document.createElement("div");
    nodeBullet.setAttribute("id", "bullet"+bullets);
    aBullet[bullets] = new Bullet(nodeBullet);
    container.appendChild(nodeBullet);
    bullets += 1;
}, 1000);

//games run for 20 secs (just for testing)
setTimeout(clearInterval, 20000, moving); 
setTimeout(clearInterval, 20000, addStair);
setTimeout(clearInterval, 20000, status);
setTimeout(clearInterval, 20000, fire);
setTimeout(clearInterval, 20000, bullets);

function control(e){ //use keyboards to control the ball
    switch(e.code){ //goes left
        case "ArrowLeft":
            ball.roll(2);
            break;
        case "ArrowRight": //goes right
            ball.roll(-2);
            break;
    }
}
window.addEventListener("keydown", control, false);
