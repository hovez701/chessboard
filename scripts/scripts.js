
// CHESS project setup
const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const secondheading = document.querySelector('#second-text');
const heading = document.querySelector('.title');
const button = document.querySelector('.lesson');
var c = canvas.getContext('2d');
var counter = 0;

// initialise board
var boardTop;
var boardBottom;
var boardLeft;
var boardRight;
var width;
var counter = 0;
var squareArray = []
var directions = []


// start page always at top
window.addEventListener('load', function(){
    window.scrollTo(0,0);

})

// chess board square class
class Square {
    constructor(x, y, dx, dy, width, color, originX, originY) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.width = width;
        this.color = color;
        this.originX = originX;
        this.originY = originY;

        this.draw = function () {
            c.beginPath();
            c.rect(this.x, this.y, this.width, this.width);
            c.fillStyle= this.color;
            c.stroke();
            c.fill();
        };

        this.cluster = function (){
            
            if(this.originX >this.x){
                this.x +=((this.originX -this.x)/200)
            } else if (this.originX < this.x){
                this.x -=((this.x-this.originX)/200)
            } 
            
            if(this.originY >this.y){
                this.y +=((this.originY -this.y)/200)
            } else if (this.originY < this.y){
                this.y -=((this.y-this.originY)/200)
            } 

            this.draw();
            counter++;

        }
        this.update = function () {

            // OPTIONAL removed to prevent board formation prior to second heading
            // if(this.x ==this.originX && this.y ==this.originY){
            //     this.x = this.originX;
            //     this.y = this.originY;
            //     this.dy = 0;
            //     this.dx = 0;
            // }
        
            if (this.x + this.width > innerWidth || this.x - this.width < 0) {
                this.dx = -this.dx;
            }

            if (this.y + this.width > innerHeight || this.y - this.width < 0) {
                this.dy = -this.dy;
            }

            if (this.x != this.originX && this.y != this.originY){
                this.x += this.dx;
                this.y += this.dy;
            } 
            this.draw();
            
        };

        this.assemble = function(){

            if(this.x >= this.originX -2 && this.x <= this.originX +2 && this.y >= this.originY-2 && this.y <= this.originY+2){
                this.lock();
            }
            var xdistance = this.originX - this.x;
            var ydistance = this.originY -this.y;
            this.x += xdistance/1300;
            this.y += ydistance/1300;

        }
        this.disassemble = function(){

            if(this.x ==this.originX && this.y ==this.originY){
                this.dx = directions[counter][0];
                this.dy = directions[counter][1];
                this.x += this.dx;
                this.y += this.dy;
                this.draw();
                counter+=1;
            }

        }

        this.lock = function(){
            this.x = this.originX;
            this.y=this.originY;
            this.dy = 0;
            this.dx = 0;
        }
    }
}



function animate(){
    requestAnimationFrame(animate);

    // clear the canvas
    c.clearRect(0,0,innerWidth,innerHeight);


    var pastTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;

    function scrollUpdate(){
         // only assemble if scrolling down
         var scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;
         if (scrollTop > pastTop){
             squareArray.forEach((x)=>x.assemble());
         } else{ //dissassemble if scrolling up
             squareArray.forEach((x)=>x.disassemble());
         }
         pastTop = scrollTop;
     
         
     }
    window.addEventListener('scroll', scrollUpdate, {passive: true});
    squareArray.forEach((x)=>x.update());
}




window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // adjust board size + piece size
    boardTop = (window.innerHeight/2) -240;
    boardBottom = boardTop +480;
    boardLeft = (window.innerWidth/2) -240;
    boardRight = boardLeft + 480;
    width = 60;

    // re initialise
    init()

})

function init(){
    //Clear array.
    squareArray = []
    color = undefined;

    //responsive board and chess square sizing
    if (innerWidth < 768){
        boardTop = (innerHeight/2) -120;
        boardBottom = boardTop +240;
        boardLeft = (innerWidth/2) -120;
        boardRight = boardLeft + 240;
        width =30;

    } else{
        boardTop = (innerHeight/2) -240;
        boardBottom = boardTop +480;
        boardLeft = (innerWidth/2) -240;
        boardRight = boardLeft + 480;
        width = 60;
    }
    originX = boardLeft;
    originY = boardTop;

    for(let i = 1; i<=64; i++){
        x = Math.random()*(innerWidth - width*2)+width;
        y = Math.random()*(innerHeight-width*2)+width;
        dx = (Math.random()-0.5)*8;
        dy = (Math.random()-0.5)*8;
        directions.push([dx,dy]);
        color === 'black'? color='white': color='black'
        squareArray.push(new Square(x,y,dx,dy,width, color, originX, originY));
        originX+=width;

        // change to next row of chessboard
        if (i%8 === 0){
            originY+=width;
            originX = boardLeft;
            color === 'black'? color='white': color='black'
        }
        

    }
}

//Assemble squares into board
const assembleBoard = function(entries){
    const [entry] = entries;
    if (entry.isIntersecting){
        squareArray.forEach((x)=>x.lock());

    //remove scroll event listener
    window.removeEventListener('scroll', scrollUpdate, {passive: true});


    }
    else{}

}

// intersection observer API
// assemble board once second heading is display
const obsOptions = {
    root: null, // target element intersecting the entire viewport
    threshold: 0,
    rootMargin: '0% 0% -10% 0%'
};

const observer = new IntersectionObserver(assembleBoard, obsOptions);
observer.observe(secondheading);

//start program
init();
animate();