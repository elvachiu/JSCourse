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
        //different types of stairs
        const types = ["normal", "flip", "scroll"];
        //three types having probability of 7:2:1
        const t = rand(1, 10);
        if(t == 8 || t == 9){
            this.type = types[1]; //type: flip
        }else if(t == 10){
            this.type = types[2]; //type: scroll
        }else{
            this.type = types[0]; //type: normal 
        }//this.type = types[Math.random()<0.75?0:1];
        //set the color for different types of stairs
        const colors = ["lightskyblue", "darkseagreen", "lightslategray"];
        if(this.type == "flip"){
            this.nodeS.style.backgroundColor = colors[1];
        }else if(this.type == "scroll"){
            this.nodeS.style.backgroundColor = colors[2];
        }//default in css is lightskyblue for normal stairs
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
            y: 3
        };
        this.status = 3 //3:falls down, 7:goes up, 5: hit by a bullet, 6: scroll
        this.nodeB.setAttribute("class", "ball"); //set the style for the ball
    }
    leftWall(){ //bounce back hitting the left wall
        const hitLeft = () => this.coor.x  >= 570;
        if(hitLeft()){
            console.log("hit the left wall");
            return 1;
        }
    }
    roll(direc){ //undone
        if(this.leftWall()){ //bounce back
            console.log("roll.leftWall");
            this.offset.x = 2;
            this.coor.x += this.offset.x;
            this.nodeB.style.left = this.coor.x + "px";
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
            x: 600, //fire from the right wall
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
//battery - red box (where the bullets store)
var battery = document.createElement("div");
battery.setAttribute("id", "battery");
document.body.appendChild(battery);
//score board - beige box
//var scoreBoard = document.createElement("div");
//scoreBoard.setAttribute("id", "scoreBoard");
//document.body.appendChild(scoreBoard);

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

//functions for the ball
var status, speed, timer;
function run(){ //let ball either falls or goes up
    if(ball.coor.y <= 430 && ball.status == 3){
        ball.coor.y += speed;
    }else if(ball.coor.y >= 0 && ball.status == 7){
        ball.coor.y -= speed;
    }else{ //drop to the ground
        gameOver();
    }
    ball.nodeB.style.top = ball.coor.y + "px";
};
status = setInterval(function ballStatus(){ //whether the ball is on stairs or in air
    for(let i=0; i<stairs; i++){
        if(ball.coor.y <= aStair[i].coor.y-10 && ball.coor.y >= aStair[i].coor.y-20 && ball.coor.x <= aStair[i].coor.x+50 && ball.coor.x >= aStair[i].coor.x){
            if(aStair[i].type == "flip"){
                ball.status = 3; //the dark green stairs would let the ball goes through
            }else if(aStair[i].type == "scroll"){
                ball.roll(2);
            }else{ //normal
                ball.status = 7;
            }
            speed = aStair[i].offset.y; //the speed of the stair the ball touched
            break;
        }
        else if(ball.coor.y >= aStair[i].coor.y-10 || ball.coor.y <= aStair[i].coor.y-20 || ball.coor.x >= aStair[i].coor.x+50 || ball.coor.x <= aStair[i].coor.x){
            ball.status = 3;
            speed = ball.offset.y;
        }
    }
    run();
}, 15); //or 15

//functions for the stairs
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

//functions for the bullets
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
var shot = setInterval(function gotShot(){
    for(let i=0; i<bullets; i++){
        if(document.getElementById("bullet"+i) !== null){
            if(ball.coor.y <= aBullet[i].coor.y+10 && ball.coor.y >= aBullet[i].coor.y-10 && ball.coor.x <= aBullet[i].coor.x+30 && ball.coor.x >= aBullet[i].coor.x){
                ball.status = 5; //hit by a bullet
                gameOver();
            }
        }
    }
}, 20);

//other functions
function keyC(){
    nodeS = document.createElement("div");
    nodeS.setAttribute("id", "stair"+stairs);
    aStair[stairs] = new Stair(nodeS);
    container.appendChild(nodeS);
    stairs += 1;
}

function gameOver(){
    setTimeout(clearInterval, 0, moving); 
    setTimeout(clearInterval, 0, addStair);
    setTimeout(clearInterval, 0, status);
    setTimeout(clearInterval, 0, fire);
    setTimeout(clearInterval, 0, bullets);
    setTimeout(clearInterval, 0, shot);
    console.log("game over");
}

//games run for 20 secs (just for testing)
setTimeout(clearInterval, 20000, moving); 
setTimeout(clearInterval, 20000, addStair);
setTimeout(clearInterval, 20000, status);
setTimeout(clearInterval, 20000, fire);
setTimeout(clearInterval, 20000, bullets);
setTimeout(clearInterval, 20000, shot);

var countC = 0; //can only use covers(key c) 5 times
function control(e){ //use keyboards to control the ball
    switch(e.code){ //goes left
        case "ArrowLeft":
            ball.roll(2);
            break;
        case "ArrowRight": //goes right
            ball.roll(-2);
            break;
        case "ArrowUp": //shield
            //undone
            console.log("up");
            break;
        case "KeyC": //cover: add one stair
            if(countC < 5){
                keyC();
                countC += 1;
            }
            break;
    }
}
window.addEventListener("keydown", control, false);
