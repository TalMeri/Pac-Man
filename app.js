var context;
var star = new Object();
var shape = new Object();
var monster1 =new Object();
var monster2 =new Object();
var monster3 =new Object();
var monster4 =new Object();
var monsters=[];
var prevals=[];
var board;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var users = ["k"];
var passwords = ["k"];
var up=38;
var down=40;
var left=37;
var right=39;
var numberB=70;
var numberM=2;
var ball5p="#ff0000";
var ball15p="#c6d83b";
var ball25p="#38cc4a";
var face=4;
var score = 0;
var numLive=5;
var startPosition=new Object();
var gametime=60;
var foodLeft=70;

function startgame(){
	openDisplay("Game");
	$(document).ready(function() {
		context = canvas.getContext("2d");
		Start();
	});
}

function Start() {
	board = new Array();
	pac_color = "yellow";
	var cnt = 100;
	score=0;
	numLive=5;
	face=4;
	foodLeft=numberB;
	monsters=[];
	prevals=[];
	var allMonsters = [monster1, monster2, monster3, monster4]
	var food_remain = numberB;
	var monster_remain = numberM;
	var food5 =Math.round(food_remain*0.6);
	var food15 = Math.round(food_remain*0.3);
	var food25 =food_remain-food5-food15;
	var pacman_remain = 1;
	var monsterColor=100;
	for(var m=0; m<numberM; m++){
		monsters.push(allMonsters[m]);
		prevals.push(0);
	}
	for(var r=1; r<=5; r++)
		document.getElementById(r).style.display="";
	start_time = new Date();
	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 10; j++) {
			if (
				(i == 3 && j == 3) ||
				(i == 3 && j == 4) ||
				(i == 3 && j == 5) ||
				(i == 6 && j == 1) ||
				(i == 6 && j == 2)
			) {
				board[i][j] = 4;
			}
			else if(i==4 && j==4){
				board[i][j]=300;
				star.i=i;
				star.j=j;
				star.prev=0;
			}
			else if(((i==0 && j==0) || (i==0 && j==9) || (i==9 && j==0) ||(i==9 && j==9))&& monster_remain>0){
					board[i][j]=monsterColor;
					monsters[numberM-monster_remain].i=i;
					monsters[numberM-monster_remain].j=j;
					monster_remain--;
					monsterColor++;
				}
			else{
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) {
					food_remain--;
					RandNum=Math.floor(Math.random() * (3 - 0 + 1) + 0);
					if(RandNum==1 && food25>0){
						food25--;
						board[i][j] = 25;
					}
					else if (RandNum==2 && food15>0){
						food15--;
						board[i][j] = 15;
					}
					else if (food5>0){
						food5--;
						board[i][j] = 5;
					}
					else if (food25>0){
						food25--;
						board[i][j]=25;
					}
					else{
						food15--;
						board[i][j] = 15;
					}
					
				} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
					shape.i = i;
					shape.j = j;
					startPosition.i=i;
					startPosition.j=j;
					pacman_remain--;
					board[i][j] = 2;
				} else {
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}
	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		food_remain--;
		RandNum=Math.floor(Math.random() * (3 - 0 + 1) + 0);
		if(RandNum==1 && food25>0){
			food25--;
			board[emptyCell[0]][emptyCell[1]] = 25;
		}
		else if (RandNum==2 && food15>0){
			food15--;
			board[emptyCell[0]][emptyCell[1]] = 15;
		}
		else if (food5>0){
			food5--;
			board[emptyCell[0]][emptyCell[1]] = 5;
		}
		else if (food25>0){
			food25--;
			board[emptyCell[0]][emptyCell[1]] = 25;
		}
		else{
			food15--;
			board[emptyCell[0]][emptyCell[1]] = 15;
		}
	}
	if(pacman_remain>0){
		var emptyCell1=findRandomEmptyCell(board);
		board[emptyCell1[0]][emptyCell1[1]]=2;
		shape.i=emptyCell1[0];
		shape.j=emptyCell1[1];
		startPosition.i=emptyCell1[0];
		startPosition.j=emptyCell1[1];
		pacman_remain--;
	}
	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	interval = setInterval(UpdatePosition, 100);
	interval1 = setInterval(UpdatePositionS, 500);
	interval2 = setInterval(UpdatePositionM, 500);
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[up]) {
		return 1;
	}
	if (keysDown[down]) {
		return 2;
	}
	if (keysDown[left]) {
		return 3;
	}
	if (keysDown[right]) {
		return 4;
	}
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if(board[i][j]==100 || board[i][j]==101 || board[i][j]==102 || board[i][j]==103){
				context.beginPath();
				if(board[i][j]==100)
					context.fillStyle = "#99ff66";
				if(board[i][j]==101)
					context.fillStyle = "pink";
				if(board[i][j]==102)
					context.fillStyle = "#4ddbff";
				if(board[i][j]==103)
					context.fillStyle = "#ffcc66";
				context.arc(center.x , center.y, 20, 1*Math.PI, 2* Math.PI);
				context.lineTo(center.x+20, center.y+15);
				context.arc(center.x + 20 / 4 + 10, center.y + 15, 20 * 0.25, 0, Math.PI);
				context.arc(center.x + 20 / 4  , center.y + 15, 20 * 0.25, 0, Math.PI);
				context.arc(center.x + 20 / 4 -  10, center.y + 15, 20 * 0.25, 0, Math.PI);
				context.arc(center.x + 20 / 4 -20, center.y + 15, 20 * 0.25, 0, Math.PI);
				context.closePath();
				context.fill();
				context.strokeStyle = "black";
				context.stroke();

				context.beginPath();
				context.fillStyle = "white"; //color
				context.arc(center.x + 10, center.y -5, 5, 0, 2 * Math.PI);
				context.fill();
				context.beginPath();
				context.arc(center.x - 10, center.y -5, 5, 0, 2 * Math.PI);
				context.fill();

				context.beginPath();
				context.fillStyle = "black"; //color
				context.arc(center.x + 10, center.y -5, 3, 0, 2 * Math.PI);
				context.fill();
				context.beginPath();
				context.arc(center.x - 10, center.y -5, 3, 0, 2 * Math.PI);
				context.fill();
			}
			if(board[i][j]==300){
				context.beginPath();
				context.fillStyle="Gold";
    			context.translate(center.x, center.y);
    			context.lineTo(0,0-20);
    			for (var o = 0; o < 5; o++){
        			context.rotate(Math.PI / 5);
        			context.lineTo(0, 0 - (20*0.5));
       				context.rotate(Math.PI / 5);
        			context.lineTo(0, 0 - 20);
    			}
    			context.fill();
				context.restore();
				context.closePath();
				context.translate(-center.x,-center.y);
			}

			if (board[i][j] == 2) {
				context.beginPath();
				if(face==4){
					context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI);
				}
				else if (face==1){
					context.arc(center.x, center.y, 30, 1.65 * Math.PI, 1.35 * Math.PI);
				}
				else if(face==2){
					context.arc(center.x, center.y, 30, 0.65 * Math.PI, 0.30 * Math.PI);
				}
				else if(face==3){
					context.arc(center.x, center.y, 30, 1.20 * Math.PI, 0.90 * Math.PI);
				}
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				if(face==4 || face==3){
					context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI);
				}
				else if (face==1 || face==2){
					context.arc(center.x - 15, center.y-5 , 5, 0, 2 * Math.PI);
				}
				context.fillStyle = "black"; //color
				context.fill();

			} else if (board[i][j] == 25) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = ball25p; //color
				context.fill();
			}
			else if (board[i][j] == 15) {
				context.beginPath();
				context.arc(center.x, center.y, 10, 0, 2 * Math.PI); // circle
				context.fillStyle = ball15p; //color
				context.fill();
			}
			else if (board[i][j] == 5) {
				context.beginPath();
				context.arc(center.x, center.y, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = ball5p; //color
				context.fill();
			} else if (board[i][j] == 4) {
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}
		}
	}
}
function UpdatePositionM(){
	var monsterColor=100;
	var cantMoveTo=[4,100,101,102,103];
	for (var i=0;i<monsters.length;i++){
		board[monsters[i].i][monsters[i].j]=prevals[i];
		if(monsters[i].i>shape.i && monsters[i].i>0 && !(cantMoveTo.includes(board[monsters[i].i-1][monsters[i].j]))){
			monsters[i].i--;
		}
		else if(monsters[i].i<shape.i && monsters[i].i<9 && !(cantMoveTo.includes(board[monsters[i].i+1][monsters[i].j]))){
			monsters[i].i++;
		}
		else if (monsters[i].j>shape.j && monsters[i].j>0 && !(cantMoveTo.includes(board[monsters[i].i][monsters[i].j-1]))){
			monsters[i].j--;
		}
		else if(monsters[i].j<shape.j && monsters[i].j<9 && !(cantMoveTo.includes(board[monsters[i].i][monsters[i].j+1]))){
			monsters[i].j++;
		}
		if (board[monsters[i].i][monsters[i].j] ==2){
			meetMonster();
		}
		else{
			prevals[i]=board[monsters[i].i][monsters[i].j];
			board[monsters[i].i][monsters[i].j]=monsterColor
		}
		monsterColor++;
	}

}
function meetMonster(){
	score=score-10;
	var monster_remain=numberM;
	var monsterColor=100;
	if (numLive>1){
		document.getElementById(numLive).style.display="none";
		numLive--;
		for (var i=0 ; i<monsters.length ; i++){
			board[monsters[i].i][monsters[i].j]=prevals[i];
		}
		for (var j=0 ;j<=9;j=j+9){
			for(var m=0; m<=9;m=m+9){
				if(monster_remain>0){
					board[j][m]=monsterColor;
					monsters[numberM-monster_remain].i=j;
					monsters[numberM-monster_remain].j=m;
					monster_remain--;
					monsterColor++;
				}
			}
		}

		//pacman to start
		board[shape.i][shape.j]=0;
		board[startPosition.i][startPosition.j]=2;
		face=4;
		shape.i=startPosition.i;
		shape.j=startPosition.j;
	}
	else{
		window.clearInterval(interval);
		window.clearInterval(interval1);
		window.clearInterval(interval2);
		window.alert("Loser!");

	}
}
function UpdatePositionS(){
	var moveTo=Math.floor(Math.random() * (4 - 1 + 1) + 1);
	var cantMoveTo=[4,100,101,102,103];
	var didMove=false;
	var count=0;
	//while(!didMove && count<10){
		if (moveTo==1 && !(cantMoveTo.includes(board[star.i+1][star.j])) && star.i<9){
			board[star.i][star.j]=star.prev;
			star.i++;
			didMove=true;
			star.prev=board[star.i][star.j];
		}
		else if(moveTo==2 && !(cantMoveTo.includes(board[star.i][star.j+1])) && star.j<9){
			board[star.i][star.j]=star.prev;
			star.j++;
			didMove=true;
			star.prev=board[star.i][star.j];
		}
		else if(moveTo==3 && !(cantMoveTo.includes(board[star.i-1][star.j])) && star.i>0){
			board[star.i][star.j]=star.prev;
			star.i--;
			didMove=true;
			star.prev=board[star.i][star.j];
		}
		else if(moveTo==4 && !(cantMoveTo.includes(board[star.i][star.j--])) && star.j>0){
			board[star.i][star.j]=star.prev;
			star.j--;
			didMove=true;
			star.prev=board[star.i][star.j];
		}
		count++;
	//}
	board[star.i][star.j]=300;
}
function UpdatePosition() {
	if(foodLeft==0){
		window.clearInterval(interval);
		window.clearInterval(interval1);
		window.clearInterval(interval2);
		window.alert("Winner!!!1");
	}
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	if (x == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
			face=1;
		}
	}
	if (x == 2) {
		if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
			face=2;
		}
	}
	if (x == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
			face=3;
		}
	}
	if (x == 4) {
		if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
			face=4;
		}
	}
	if (board[shape.i][shape.j] == 25 || board[shape.i][shape.j] == 15 || board[shape.i][shape.j] == 5) {
		score=score+board[shape.i][shape.j];
		foodLeft--;
	}
	if (board[shape.i][shape.j] == 100 || board[shape.i][shape.j] == 101 || board[shape.i][shape.j] == 102 ||board[shape.i][shape.j] == 103){
		meetMonster();
	}
	else{
		board[shape.i][shape.j] = 2;
	}
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
//	if (score >= 20 && time_elapsed <= 10) {
//		pac_color = "green";
//	}
	//if (score == 50) {
//		window.clearInterval(interval);
	if((currentTime-start_time)/1000<=gametime)
	//} else {
		Draw();
	else {
		window.clearInterval(interval);
		window.clearInterval(interval1);
		window.clearInterval(interval2);
		if(score<100)
			window.alert("You are better than "+ score +" points!");
		else
			window.alert("Winner!!!");
	}
	//}
}
function openDisplay(clicked_id){
	var screens=document.getElementsByClassName("screen");
	var i;
	for (i=0; i<screens.length; i++){
		screens[i].style.display='none';
	}
	document.getElementById(clicked_id).style.display="block";
}

  $(document).ready(function () {
	$.dobPicker({
		daySelector: "#dob-day",
		monthSelector: "#dob-month",
		yearSelector: "#dob-year",
		dayDefault: "Day",
		monthDefault: "Month",
		yearDefault: "Year",
		minimumAge: 18,
		maximumAge: 100
	});
});

function loginValidate() {
	var username = document.getElementById('uname').value;
	var password = document.getElementById('pswd').value;
	var valid =false;
    for (var i=0; i <users.length; i++) {
        if ((username == users[i]) && (password == passwords[i])) {
            valid = true; 
        }
    }
	if (valid){
		var output = document.getElementById('LoginOut');
		output.innerHTML = username;
		openDisplay("Setting");
	}
	else{
		openDialog();
	}
}
function openDialog(){
	document.getElementById("mydialog").showModal();
}
function closeDialog(){
	document.getElementById("mydialog").close();
}
function changeKey(keyToChange,event){
	var val = event.key;
	if (val==" ")
		val="Space"
	if(keyToChange=="Up")
		up=event.keyCode;
	if(keyToChange=="Down")
		down=event.keyCode;
	if(keyToChange=="Left")
		left=event.keyCode;
	if(keyToChange=="Right")
		right=event.keyCode;
	document.getElementById(keyToChange).value= val;
}
function numBalls(RangeVal,Out){
	var output = document.getElementById(Out);
	output.innerHTML = document.getElementById(RangeVal).value;
	numberB=document.getElementById(RangeVal).value;
	
}
function newGame(){
	window.clearInterval(interval);
	window.clearInterval(interval1);
	window.clearInterval(interval2);
	openDisplay("Setting");
}
function numMonster(){
	var val=parseInt(document.getElementById("numM").value);
	numberM=val;
}
function pickColor(ColorChange){
	if(ColorChange=="5p")
		ball5p=document.getElementById(ColorChange).value;
	if(ColorChange=="15p")
		ball15p=document.getElementById(ColorChange).value;
	if(ColorChange=="25p")
		ball25p=document.getElementById(ColorChange).value;
}

function randomPick(){
	up=38;
	down=40;
	left=37;
	right=39;
	document.getElementById("Up").value="ArrowUp";
	document.getElementById("Down").value="ArrowDown";
	document.getElementById("Left").value="ArrowLeft";
	document.getElementById("Right").value="ArrowRight";

	numberB=Math.floor(Math.random() * (90 - 50 + 1) + 50);
	document.getElementById("outB").innerHTML = numberB;
	document.getElementById("BallRange").value=numberB;

	var val5 = Math.floor(Math.random()*16777215).toString(16);
  	document.getElementById("5p").value = "#" + val5;
	ball5p="#"+val5;

	var val15 = Math.floor(Math.random()*16777215).toString(16);
  	document.getElementById("15p").value = "#" + val15;
	ball15p="#"+val15;

	var val25 = Math.floor(Math.random()*16777215).toString(16);
  	document.getElementById("25p").value = "#" + val25;
	ball25p="#"+val25;

	numberM=Math.floor(Math.random() * (4 - 1 + 1) + 1);
	document.getElementById("numM").value = numberM;

}

function TimeUpdate(){
	var val=document.getElementById("Time").value;
	gametime=val;
}

$("[type='number']").keypress(function (evt) {
    evt.preventDefault();
});

