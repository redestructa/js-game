var
 canvas,context,brickList,
 brickWidth  = 50,
 brickHeight = 20,
 marginX = 2,
 marginY = 2,
 dingInc=0,
 dingPos=new Array(50,500,100,20),
 merkKey,
 ballPos=new Array(100,400),
 ballRadius = 10,
 ball_x = 4,
 ball_y = -4,
 bricks = new Array(),
 alwaysHit = false,
 punktzahl = 0,
 highscore = 0;
 
 //STRG+F alwaysHit, ist es true, dann zielt der Ball nach dem Aufprall auf das DING auf einen Brick
 //ding ist in dem Spiel immer der Balken unten.

 //nach MUSTER suchen


window.requestAnimFrame = function() {
        return window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame || 
        window.oRequestAnimationFrame || 
        window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
}();

function animate() {
        context.clearRect(0, 0, canvas.width, canvas.height);
		testCollision();
		paintBricks();
		paintDing();
		paintBall();
		window.requestAnimFrame(function() {
          animate();
        });
}



/**
 * @constructor
 */
function Brick (type, x, y){

switch (type){
case 0 : this.color = "#000"; this.punktzahl=100;break;
case 1 : this.color = "#f00"; this.punktzahl=200;break;
case 2 : this.color = "#0f0"; this.punktzahl=500;break;
case 3 : this.color = "#0ff"; this.punktzahl=1000;
}

this.x=x;
this.y=y;
}

function getAnyBrick(){
return brickList[Math.floor(Math.random()*brickList.length)];
}

function paintBall(){
	 
	var x = ballPos[0],
	    y = ballPos[1];

	if ((x+ballRadius)>=canvas.width) ball_x*=-1;
	else if ((x-ballRadius)<=0) ball_x*=-1;
	if (((y+ballRadius)>=dingPos[1] 
		&& (y+ballRadius)<=(dingPos[1]+5) 
		&& x>=dingPos[0] 
		&& x<=dingPos[0]+dingPos[2])){
		if (alwaysHit){
		

		var anyBrick = getAnyBrick(),
			richtung1 = (anyBrick.x+25) - ballPos[0],
		    richtung2 = (anyBrick.y+10) - ballPos[1];
				
		ball_y = -richtung2/richtung2*5;
		ball_x = -richtung1/richtung2*5;
		
		}
		else ball_y*=-1;
		}
	else if ((y-ballRadius)<=0) ball_y*=-1;
	else if ((y+ballRadius) >= canvas.height){
	ballPos[0]=50;
	ballPos[1]=400;
	ball_x*=-1;
	ball_y*=-1;
	}
	
	
	context.beginPath();
	context.fillStyle="#3a8";
	context.arc(x,y,ballRadius,0,Math.PI*2,true);
	context.closePath();
	context.fill();

	ballPos[0]+=ball_x;
	ballPos[1]+=ball_y;
		
}

function paintBrick(brick){
	
	context.beginPath();
	context.lineWidth=0;
	context.moveTo(brick.x,brick.y);
	context.lineTo(brick.x+50,brick.y);
	context.lineTo(brick.x+50,brick.y+20);
	context.lineTo(brick.x,brick.y+20);
	context.lineTo(brick.x,brick.y);
	context.fillStyle=brick.color;
	context.stroke();
	context.fill();
	
}

function paintDing(){
	dingPos[0]+=2*dingInc;
	var x=dingPos[0];
	var y=dingPos[1];
	var w=dingPos[2];
	var h=dingPos[3];
	context.beginPath();
	context.lineWidth=1;
	context.moveTo(x,y);
	context.lineTo(x+w,y);
	context.lineTo(x+w,y+h);
	context.lineTo(x,y+h);
	context.lineTo(x,y);
	context.fillStyle="#000";
	context.stroke();
	context.fill();
}

function r(){
var r = Math.floor(Math.random()*16);
switch (r){
case 10: r="a";break;
case 11: r="b";break;
case 12: r="c";break;
case 13: r="d";break;
case 14: r="e";break;
case 15: r="f";break;
}
return r;
}

function eachBrick(func){ //CALLBACK func
	for (var i = 0; i< brickList.length; i++){
		  func(brickList[i]);		  
	}
}

function paintBricks(){
	eachBrick(function(brick){
		paintBrick(brick);
	});
}

var bx,by,cx,cy;

function testCollision(){
			
			if ( ball_x<0 )      {bx=ballPos[0]-ballRadius;   by=ballPos[1]; }
			else if ( ball_x>0 ) {bx=ballPos[0]+ballRadius-1; by=ballPos[1]; }
			if ( ball_y<0 )      {cx=ballPos[0]; cy=ballPos[1]-ballRadius+1; }
			else if ( ball_y>0 ) {cx=ballPos[0]; cy=ballPos[1]+ballRadius-1; }
			
	for (var key in brickList){
			if((brickList[key].x <= bx && bx <= brickList[key].x+50)
			 &&(brickList[key].y <= by && by <= brickList[key].y+20))
			{
			 ball_x*= -0.9-(Math.random()/5);
			
			}
			else if((brickList[key].x <= cx && cx <= brickList[key].x+50)
			 &&(brickList[key].y <= cy && cy <= brickList[key].y+20))
			{
			 ball_y*= -0.9-(Math.random()/5);
			}
			else continue;
			//bei continue überspringt er folgenden teil, also wenn keine kollision gefunden, ansonsten...:
			 
				punktzahl += brickList[key].punktzahl;
				document.getElementById('lblScore').innerHTML = punktzahl;
				
				if(punktzahl > highscore)
					setHighscore(punktzahl);
				
				
				//brickList updaten
				//das getroffene element wird mit dem letzten überschrieben
				brickList[key] = brickList[brickList.length-1];
				brickList.pop();
				//das letzte element kann nun gelöscht werden
				//so bleibt die liste konsistent und die länge wird aktualisiert
				
				
				
				break;
			
			}
}


function setHighscore(punkte) {
	highscore = punkte;
	window.localStorage.setItem('highscore', punkte);
	
	document.getElementById('lblHighscore').innerHTML = punkte;
}

function getHighscore() {
	return window.localStorage.getItem('highscore');
}

function punktEquals(punkt1,punkt2){
return (punkt1.x == punkt2.x && punkt1.y == punkt2.y);
}

function geradeHasPunkt(gerade, punkt){
	
}

function minAbstand(punkt, punktArray){
	
	var min = 999999,m;
	
	for (var key in punktArray){
	min = ( (m=abstand(punkt,punktArray[key])) > min ) ? min : m;
	}
	
	for (key in punktArray){
	if (abstand(punkt,punktArray[key]) == min)
	return punktArray[key];
	}
	
}

function abstand(punkt1,punkt2){
return Math.sqrt(  Math.pow((punkt1.x-punkt2.x),2) + Math.pow((punkt1.y-punkt2.y),2) );
}



function genBricks(){
	
brickList = new Array();

	for (var i = 0; i< 50; i++){
		
		 var type = Math.random()*100,
		 
		 //MUSTER 1
		 //x=Math.floor(i/5),
		 //y=i%5;
		 
		 //MUSTER 2
		 //x=Math.floor(i/5),
		 //y=2*(i%5) + (x%2);
		 
		 //MUSTER 3
		 //x=2*Math.floor(i/10)+0.5,
		 //y=i%10;
		 
		 //MUSTER 4
		 x=Math.floor(i/5),
		 y=2*(i%5)+0.5*(x%10);
		 
		 
		 if (type<5) type = 3;
		 else if (type<15) type = 2;
		 else if (type<35) type = 1;
		 else if (type<100) type = 0;
		 
		 brickList[i]=new Brick(type, x*52+5, y*22+5);
		 
	}
}

function init(){
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	genBricks();
	
	
	animate();
	
	highscore = getHighscore();
	document.getElementById('lblHighscore').innerHTML = highscore;
	
	window.addEventListener("keydown",function(event){keydown(event);},false);
	window.addEventListener("keyup",function(event){keyup(event);},false);


}

document.addEventListener("DOMContentLoaded", function(){
init();
},false);

function test(){
window.console.log("test");
}



function keydown(event){

dingInc = 0;

if ((event.keyCode==37 || event.keyCode==39)){
dingInc = (37==event.keyCode)?-5:5;
event.preventDefault();
event.stopPropagation();
//window.console.log("keydown");
}
merkKey = event.keyCode;


}


function keyup(event){
//window.console.log("key down: "+event.keyCode);
if (merkKey==event.keyCode && (event.keyCode==37 || event.keyCode==39))
dingInc = 0;
}




function logObject(obj){
	for (var key in obj){
		window.console.log(key+" : "+obj[key]);
	}
}



/**
 * @constructor
 */
function PowerUp(type){
	return Object({
		type: type
	});
}


/**
 * @constructor
 */
function Vector(x,y){return Object({x:x,y:y});}

/**
 * @constructor
 */
function Gerade(b,r){return Object({b:b,r:r});}

/**
 * @constructor
 */
function Schnittpunkt(gerade1,gerade2){
var x = gerade2.b.x - gerade1.b.x,
    y = gerade2.b.y - gerade1.b.y,
	a1 = gerade1.r.x,
	a2 = gerade1.r.y,
	b1 = -gerade2.r.x,
	b2 = -gerade2.r.y,s,t,ex,ey,faktor;
if ((a1!=0) && (a2!=0)){
	faktor = (a1/a2);
	    a1 = a1 - (a2*faktor);
	    b1 = b1 - (b2*faktor);
	     x =  x -  (y*faktor);
	t = x/b1;	 
	ex = gerade2.b.x+gerade2.r.x*t;
	ey = gerade2.b.y+gerade2.r.y*t;
} else if ((b1!=0) && (b2!=0)){
	faktor = (b1/b2);
	    a1 = a1 - (a2*faktor);
	    b1 = b1 - (b2*faktor);
	     x =  x -  (y*faktor);
	s= x/a1;
	ex = gerade1.b.x+gerade1.r.x*s;
	ey = gerade1.b.y+gerade1.r.y*s;
}
return new Vector(ex,ey);
}
