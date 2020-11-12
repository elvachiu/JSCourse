function rand(start, end){
    return Math.floor(Math.random()*(end-start+1))+start;
}
class Ball{
    constructor(){
        /*set the colors for balls randomly*/
        const COLORS = ["red", "orange", "yellow", "green", "blue", "purple", "gray", "pink", "skyblue", "olive"];
        this.color = COLORS[rand(0, 9)]; //choose from the color set above
        /*set the radius for balls randomly*/
        this.radius = rand(3,10);
        /*coordination of balls, set starting points randomly*/
        this.coor = {
            x: rand(this.radius, 750),
            y: rand(this.radius, 550)
        };
        /*use the change of (x, y) to make speed*/
        this.offset = {
            x: rand(-this.radius, 3),
            y: rand(-this.radius, 3),
            /*might be negative -> different directions*/
        };
        this.node = node;
        this.node.style.width = this.radius*2 + "px";
        this.node.style.height = this.radius*2 + "px";
        this.node.style.backgroundColor = COLORS[rand(0,9)];
        this.node.style.left = this.coor.x + "px";
        this.node.style.top = this.coor.y + "px";
        this.node.setAttribute("class", "ball"); /*set the style for balls*/
    }
    bounce(){ /*set boundaries, and balls bounce when hit any sides*/
        const hitTop = () => this.coor.y <= 0;
        const hitBottom = () => this.coor.y >= 600 - this.radius*2;
        const hitLeft = () => this.coor.x >= 800 - this.radius*2;
        const hitRight = () => this.coor.x <= 0;
        if(hitLeft() || hitRight()){
            this.offset.x *= -1; /*opposite direction*/
            this.offset.y = rand(-this.radius, 3); /*different angle*/
        }
        if(hitBottom() || hitTop()){
            this.offset.x = rand(-this.radius, 3);
            this.offset.y *= -1;
        }
    }
    move(){ 
        this.bounce(); /*first check whether hit the boundaries or not*/
        this.coor.x += this.offset.x;
        this.coor.y += this.offset.y;
        this.node.style.left = this.coor.x + "px";
        this.node.style.top = this.coor.y + "px";
    }
}

var container = document.createElement("div");
container.setAttribute("id", "container");
document.body.appendChild(container);

let balls = rand(3, 10); /*create 3~10 balls*/
let aBall = [balls], node; /*local variables*/
for(let i=0; i<balls; i++){
    node = document.createElement("div");
    aBall[i] = new Ball(node);
    container.appendChild(node);
}

var timer = setInterval(function run(){
    for(let i=0; i<balls; i++){
        aBall[i].move();
    }
}, 50);

setTimeout(clearInterval, 10000, timer); //run for 10 secs

var button = document.getElementById('start'); /*set up for the "keep bouncing" button*/
button.onclick = () => {
    var timer = setInterval(function run(){
        for(let i=0; i<balls; i++){
            aBall[i].move();
        }
    }, 50);
    setTimeout(clearInterval, 10000, timer);
}
