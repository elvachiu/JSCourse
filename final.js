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
        if(t == 7 || t == 8){
            this.type = types[1]; //type: flip
            var newP = document.createElement("p");
            var text = document.createTextNode("vVVVv");
            newP.appendChild(text);
            this.nodeS.insertBefore(newP, this.nodeS.childNodes[0]);
        }else if(t == 10){
            this.type = types[2]; //type: scroll
            var newP = document.createElement("p");
            var text = document.createTextNode("OOOO");
            newP.appendChild(text);
            this.nodeS.insertBefore(newP, this.nodeS.childNodes[0]);
        }else{
            this.type = types[0]; //type: normal 
        }
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
            x: 295,
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
        const hitLeft = () => this.coor.x  <= 0;
        if(hitLeft()){
            return 1;
        }
    }
    roll(direc){
        if(this.leftWall()){ //bounce back
            this.offset.x = 7;
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
            y: rand(50, 400)
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

class Coin{
    constructor(){
        const left = [20, 75, 130, 185, 240, 295, 350, 405, 460, 515, 570];
        this.coor = {
            x: left[rand(0, 10)],
            y: 440
        };
        this.offset = { //the coin goes up
            x: 0,
            y: 1.6
        };
        this.nodeCoin = nodeCoin;
        this.nodeCoin.style.left = this.coor.x + "px";
        this.nodeCoin.style.top = this.coor.y + "px";
        var newP = document.createElement("p");
        var text = document.createTextNode("10");
        newP.appendChild(text);
        this.nodeCoin.insertBefore(newP, this.nodeCoin.childNodes[0]);
        this.nodeCoin.setAttribute("class", "coin"); //set the style for the coin
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
        this.nodeCoin.style.top = this.coor.y + "px";
    }
}

class Sound{
    constructor(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.setAttribute("name", "sounds");
        this.sound.style.display = "none";
        this.sound.muted = true;
        document.body.appendChild(this.sound);
        this.play = function(){
            this.sound.play();
        };
        this.stop = function(){
            this.sound.pause();
        };
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
//lava - gold box (lava)
var lava = document.createElement("div");
lava.setAttribute("id", "lava");
document.body.appendChild(lava);
//start button
var startGame = document.createElement("button");
startGame.setAttribute("id", "startButton");
var pBtn = document.createElement("h3");
var textBtn = document.createTextNode("Game Starts");
pBtn.appendChild(textBtn);
this.startGame.insertBefore(pBtn, this.startGame.childNodes[0]);
document.body.appendChild(startGame);
//replay button
var replayGame = document.createElement("button");
replayGame.setAttribute("id", "replayButton");
var rpBtn = document.createElement("h3");
var rtextBtn = document.createTextNode("Replay Game");
rpBtn.appendChild(rtextBtn);
this.replayGame.insertBefore(rpBtn, this.replayGame.childNodes[0]);
document.body.appendChild(replayGame);
//score board
var scoreBoard = document.createElement("div");
scoreBoard.setAttribute("id", "scoreBoard");
document.body.appendChild(scoreBoard);
var score = 0; //to keep score
var showScore = document.createElement("h3");
var scoreText = document.createTextNode("Score: 0");
//ball created
nodeB = document.createElement("div");
nodeB.setAttribute("id", "ball");
ball = new Ball(nodeB);
container.appendChild(nodeB);

var stairs = 0 //record how many stairs have been created
var aStair = [50], nodeS; //the stairs
var ball, nodeB; //the ball
var bullets = 1; //record how many bullets have been generated
var aBullet = [50], nodeBullet; //the bullets
var coins = 0; //record how many coins have appeared
var aCoin = [50], nodeCoin; //the coins

//sound effects
var coinSound = new Sound("coin.mp3"); //get the coins
var laserGun = new Sound("lasergun.mp3"); //bullets
var fireBall = new Sound("fireball.mp3"); //the ball got shot
var swoosh = new Sound("swoosh.mp3"); //the flip stairs
var scrollSound = new Sound("mushroom.mp3"); //the scroll stairs
var gameOverSound = new Sound("gameover.mp3"); //game over

function initialize(){
    ball.coor.x = 295;
    ball.coor.y = 0;
    ball.nodeB.style.left = ball.coor.x + "px";
    ball.nodeB.style.top = ball.coor.y + "px";
    score = 0;
    document.getElementById("gameOver").style.display = "none";
    for(let i=0; i<stairs; i++){ 
        if(document.getElementById("stair"+i) !== null){ 
            let removeStairs = document.getElementById("stair"+i);
            removeStairs.remove(); //remove div
        }
    }
    for(let i=0; i<stairs; i++){ 
        if(document.getElementById("stair"+i) !== null){ 
            let removeStairs = document.getElementById("stair"+i);
            removeStairs.remove(); //remove div
        }
    }
    for(let i=0; i<bullets; i++){ 
        if(document.getElementById("bullet"+i) !== null){ 
            let removeBullets = document.getElementById("bullet"+i);
            removeBullets.remove(); //remove div
        }
    }
    for(let i=0; i<coins; i++){ 
        if(document.getElementById("coin"+i) !== null){ 
            let removeCoins = document.getElementById("coin"+i);
            removeCoins.remove(); //remove div
        }
    }
}

//start the game
function gameStart(){
    console.log("game starts");
    //stairs created at the start
    nodeS = document.createElement("div");
    nodeS.setAttribute("id", "stair"+stairs);
    aStair[stairs] = new Stair(nodeS);
    container.appendChild(nodeS);
    stairs = 1; //first stair created
    while(stairs < 7){ //create 7 stairs at different positions
        let flag = 0;
        nodeS = document.createElement("div");
        nodeS.setAttribute("id", "stair"+stairs);
        aStair[stairs] = new Stair(nodeS);
        for(let j=0; j<stairs; j++){
            if(aStair[j].coor.x == aStair[stairs].coor.x){
                flag = 1;
                break;
            }
        }
        if(flag){
            aStair.splice(stairs, 1);
        }else{
            container.appendChild(nodeS);
            stairs++;
        }
    }

    //sounds
    let sounds = document.getElementsByName("sounds");
    for(let i=0; i<6; i++){
        sounds[i].muted = false;
    }
    //score
    if(showScore.childNodes[0] == null){
        showScore.appendChild(scoreText);
    }else{
        showScore.replaceChild(scoreText, showScore.childNodes[0]);
    }
    var timer = setInterval(function scoring(){
        score += 8;
        scoreText = document.createTextNode("Score: " + score);
        showScore.replaceChild(scoreText, showScore.childNodes[0]);
        this.scoreBoard.insertBefore(showScore, this.scoreBoard.childNodes[0]);
    }, 40);
    
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
                    swoosh.play();
                    ball.status = 3; //the dark green stairs would let the ball goes through
                }else if(aStair[i].type == "scroll"){
                    scrollSound.play();
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
            }//not on stairs then the ball falls
        }
        run();
    }, 20);

    //functions for stairs
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

    //functions for bullets
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
    var generate = setInterval(function generateBullets(){
        nodeBullet = document.createElement("div");
        nodeBullet.setAttribute("id", "bullet"+bullets);
        aBullet[bullets] = new Bullet(nodeBullet);
        container.appendChild(nodeBullet);
        laserGun.play();
        bullets += 1;
    }, 1500);
    var shot = setInterval(function gotShot(){
        for(let i=0; i<bullets; i++){
            if(document.getElementById("bullet"+i) !== null){
                if(ball.coor.y <= aBullet[i].coor.y+10 && ball.coor.y >= aBullet[i].coor.y-10 && ball.coor.x <= aBullet[i].coor.x+30 && ball.coor.x >= aBullet[i].coor.x){
                    ball.status = 5; //hit by a bullet
                    fireBall.play();
                    setTimeout(function fireOver(){
                        gameOver();
                    }, 30);
                }
            }
        }
    }, 10);

    //functions for coins
    var appear = setInterval(function appearCoins(){
        nodeCoin = document.createElement("div");
        nodeCoin.setAttribute("id", "coin"+coins);
        aCoin[coins] = new Coin(nodeCoin);
        container.appendChild(nodeCoin);
        coins += 1;
    }, 5000);
    var disappear = setInterval(function disappearCoins(){
        for(let i=0; i<coins; i++){ 
            if(document.getElementById("coin"+i) !== null && aCoin[i].move() == 100){ 
                let hitCeiling = document.getElementById("coin"+i);
                hitCeiling.remove(); //remove div
            }
        }
    }, 50);
    var getCoin = setInterval(function getCoins(){
        for(let i=0; i<coins; i++){
            if(document.getElementById("coin"+i) !== null){
                if(ball.coor.y <= aCoin[i].coor.y+10 && ball.coor.y >= aCoin[i].coor.y-10 && ball.coor.x <= aCoin[i].coor.x+10 && ball.coor.x >= aCoin[i].coor.x-10){
                    coinSound.play();
                    score += 10;
                    setTimeout(function displayNone(){
                        document.getElementById("bonus").style.display = "none";
                    }, 500);
                    document.getElementById("bonus").style.display = "inline";
                    let getcoin = document.getElementById("coin"+i);
                    getcoin.remove(); //remove div
                }
            }
        }
    }, 15);

    //other functions
    function gameOver(){
        gameOverSound.play();
        document.getElementById("gameOver").style.display = "inline";
        setTimeout(clearInterval, 0, moving); 
        setTimeout(clearInterval, 0, addStair);
        setTimeout(clearInterval, 0, status);
        setTimeout(clearInterval, 0, fire);
        setTimeout(clearInterval, 0, generate);
        setTimeout(clearInterval, 0, shot);
        setTimeout(clearInterval, 0, timer);
        setTimeout(clearInterval, 0, appear);
        setTimeout(clearInterval, 0, disappear);
        setTimeout(clearInterval, 0, getCoin);
        console.log("game over");
        console.log("score: ", score);
        window.removeEventListener("keydown", control, false);
    }

    function keyC(){ //generate one stair near the ball
        let flag = 0; //whether near the ball or not
        while(flag == 0){
            nodeS = document.createElement("div");
            nodeS.setAttribute("id", "stair"+stairs);
            aStair[stairs] = new Stair(nodeS);
            if(ball.coor.x-75 <= aStair[stairs].coor.x && aStair[stairs].coor.x <= ball.coor.x+75){ 
                flag = 1;
                container.appendChild(nodeS);
                stairs += 1;
                break;
            }
        }
    }
    
    var countC = 0; //can only use covers(key c) 5 times
    function control(e){ //use keyboards to control the ball
        switch(e.code){ //goes left
            case "ArrowLeft":
                ball.roll(2);
                break;
            case "ArrowRight": //goes right
                ball.roll(-2);
                break;
            case "ArrowUp": //jump
                let lock = setInterval(function lockKey(){
                    window.removeEventListener("keydown", control, false);
                }, 10); //cannot jump more than once within one sec
                let jump = setInterval(function jump(){
                    if(ball.coor.y >= 0){
                        ball.coor.y -= 5;
                        ball.nodeB.style.top = ball.coor.y + "px";
                    }
                }, 15);
                setTimeout(function unjump(){
                    clearInterval(jump);
                }, 200);
                setTimeout(function unlock(){
                    clearInterval(lock);
                    window.addEventListener("keydown", control, false);
                }, 1000); //lock the keys for one sec
                break;
            case "KeyC": //cover: add one stair
                if(countC < 5){
                    keyC();
                    countC += 1;
                    score -= 100;
                }
                break;
        }
    }
    window.addEventListener("keydown", control, false);
}

//Get the button, and when the user clicks on it, execute gameStart()/replay()
document.getElementById("startButton").onclick = function startBtn(){
    gameStart();
    document.getElementById("startButton").disabled = "true"; //use once
}
document.getElementById("replayButton").onclick = function replayBtn(){
    initialize();
    gameStart();
}
