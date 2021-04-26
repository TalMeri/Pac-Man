var context;
var star = new Object();
var shape = new Object();
var monster1 =new Object();
var monster2 =new Object();
var monster3 =new Object();
var monster4 =new Object();
var monsters=[];
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
var pillLeft=2;
var clockleft=1;

function startgame(){
	openDisplay("Game");
	$(document).ready(function() {
		context = canvas.getContext("2d");
		Start();
	});
}

function Start() {
	canvas.width=canvas.width;
	board = new Array();
	pac_color = "yellow";
	var cnt = 100;
	score=0;
	numLive=5;
	face=4;
	foodLeft=numberB;
	pillLeft=2;
	clockleft=1;
	monsters=[];
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
				}else if ((randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) && !((i==0 && j==0) || (i==0 && j==9) || (i==9 && j==0) ||(i==9 && j==9))) {
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
			}if(((i==0 && j==0) || (i==0 && j==9) || (i==9 && j==0) ||(i==9 && j==9))&& monster_remain>0){
			monsters[numberM-monster_remain].prev=board[i][j];
			board[i][j]=monsterColor;
			monsters[numberM-monster_remain].i=i;
			monsters[numberM-monster_remain].j=j;
			monster_remain--;
			monsterColor++;
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
	interval2 = setInterval(UpdatePositionM, 500);
	interval1 = setInterval(UpdatePositionS, 500);
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
				context.strokeStyle="white";
				context.stroke();
			}
			else if (board[i][j] == 15) {
				context.beginPath();
				context.arc(center.x, center.y, 10, 0, 2 * Math.PI); // circle
				context.fillStyle = ball15p; //color
				context.fill();
				context.strokeStyle="white";
				context.stroke();
			}
			else if (board[i][j] == 5) {
				context.beginPath();
				context.arc(center.x, center.y, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = ball5p; //color
				context.fill();
				context.strokeStyle="white";
				context.stroke();

			} else if (board[i][j] == 4) {
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "black"; //color
				context.fill();
				context.lineWidth=2;
				context.strokeStyle="blue";
				context.stroke();
				context.lineWidth=1;
			}
			else if (board[i][j]==301){
				var radius = 15 * 0.90
				context.beginPath();
				context.arc(center.x, center.y, radius, 0, 2*Math.PI);
				context.fillStyle = 'white';
				context.fill();
				context.stroke();
				drawHand(context, radius*0.07, center.x-radius*0.5, center.y, center.x, center.y);
				drawHand(context, radius*0.07, center.x, center.y, center.x, center.y-radius*0.8);
			}
			else if (board[i][j]==302){
				context.beginPath();
				context.fillStyle="white";
				context.arc(center.x, center.y, 8, Math.PI*0.5, Math.PI*1.5);
				context.fill();
				context.closePath();

				context.beginPath();
				context.fillRect(center.x,center.y-8,8,16);
				context.closePath;

				context.beginPath();
				context.fillStyle="red";
				context.arc(center.x+15, center.y, 8, Math.PI*1.5, Math.PI*0.5);
				context.fill();
				context.closePath();

				context.beginPath();
				context.fillRect(center.x+8,center.y-8,8,16);
				context.closePath;
			}

		}
	}
}

function drawHand(context, width, x, y, endx, endy) {
	context.beginPath();
    context.lineWidth = width;
    context.lineCap = "round";
    context.moveTo(x,y);
	//context.rotate(pos);
	context.lineTo(endx,endy);
	context.strokeStyle="black";
    context.stroke();
    //context.rotate(-pos);
}

function UpdatePositionM(){
	var monsterColor=100;
	var cantMoveTo=[4,100,101,102,103,300];
	for (var i=0;i<monsters.length;i++){
		board[monsters[i].i][monsters[i].j]=monsters[i].prev;
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
			for (var k=0 ; k<monsters.length ; k++){
				board[monsters[k].i][monsters[k].j]=monsters[k].prev;
				monsters[k].prev=0;
			}
			board[shape.i][shape.j]=0;
			meetMonster();
		}
		else{
			monsters[i].prev=board[monsters[i].i][monsters[i].j];
			board[monsters[i].i][monsters[i].j]=monsterColor
		}
		monsterColor++;
	}

}
function meetMonster(){
	score=score-10;
	var monster_remain=numberM;
	var monsterColor=100;
	if (pillLeft>0){
		var emptyCell3 = findRandomEmptyCell(board);
		board[emptyCell3[0]][emptyCell3[1]]=302;
		pillLeft--;
	}
	//pacman to start
	board[startPosition.i][startPosition.j]=2;
	face=4;
	shape.i=startPosition.i;
	shape.j=startPosition.j;
	if (numLive>1){
		document.getElementById(numLive).style.display="none";
		numLive--;
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
	}
	else{
		window.clearInterval(interval);
		window.clearInterval(interval1);
		window.clearInterval(interval2);
		openDialog('loser');

	}
}
function UpdatePositionS(){
	var moveTo=Math.floor(Math.random() * (4 - 1 + 1) + 1);
	var cantMoveTo=[4,100,101,102,103, 301];
	board[star.i][star.j]=star.prev;
	if(moveTo==1){
		if (star.i<9 &&!(cantMoveTo.includes(board[star.i+1][star.j]))){
			star.i++;
		}
	}
	if(moveTo==2){
		if(star.j<9 && !(cantMoveTo.includes(board[star.i][star.j+1]))){
			star.j++;
		}
	}
	if(moveTo==3){
		if(star.i>0 && !(cantMoveTo.includes(board[star.i-1][star.j]))){
			star.i--;
		}
	}
	if(moveTo==4){
		if(star.j>0 && !(cantMoveTo.includes(board[star.i][star.j-1]))){
			star.j--;
		}
	}
	if (board[star.i][star.j] ==2){
		meetStar();
	}
	else{
		star.prev=board[star.i][star.j];
		board[star.i][star.j]=300
	}
}
function meetStar(){
	score=score+50;
	window.clearInterval(interval1);
	
}
function UpdatePosition() {
	if(foodLeft==0){
		window.clearInterval(interval);
		window.clearInterval(interval1);
		window.clearInterval(interval2);
		openDialog('winner');
	}
	if (foodLeft==numberB-10 && clockleft>0){
		var emptyCell2=findRandomEmptyCell(board);
		board[emptyCell2[0]][emptyCell2[1]]=301;
		clockleft--;
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
		for (var k=0 ; k<monsters.length ; k++){
			board[monsters[k].i][monsters[k].j]=monsters[k].prev;
			monsters[k].prev=0;
		}
		meetMonster();
	}
	else{
		if (board[shape.i][shape.j]==300){
			meetStar();
			if (star.prev==25 || star.prev==15|| star.prev==5){
				score=score+star.prev;
				foodLeft--;
			}
		}
		else if (board[shape.i][shape.j]==301){
			gametime=gametime+10;
		}
		else if (board[shape.i][shape.j]==302){
			numLive++;
			document.getElementById(numLive).style.display="";
		}
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
		if(score<100){
			document.getElementById('text').innerHTML="You are better than "+ score +" points!";
			openDialog('better');
		}
		else
			openDialog('winner');
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
$(function(){
	$.validator.addMethod('strongPassword', function(value, element){
		return this.optional(element) || value.length >=6 && /\d/.test(value) && /[a-z]/i.test(value);
	}, 'Your password must be at least 6 characters long and contain at least one number and one char\'.');

	$.validator.addMethod( "lettersonly", function( value, element ) {
		return this.optional( element ) || /^[a-z\s]+$/i.test( value );
	}, "Letters only please" );

	$.validator.addMethod( "userexist", function( value, element ) {
		return this.optional( element ) || !(users.includes(value));
	}, "User allready exist" );

	$.validator.addMethod( "notEqualTo", function( value, element, param ) {
		return this.optional( element ) || !$.validator.methods.equalTo.call( this, value, element, param );
	}, "Please enter a different value, values must not be the same." );


	$("#register-form").validate({
		rules: {
			uname:{
				required: true,
				userexist: true

			},
			pswd:{
				required: true,
				strongPassword: true

			},
			fname:{
				required: true,
				lettersonly: true

			},
			email:{
				required: true,
				email: true

			},
			day:{
				required: true
			},
			month:{
				required: true
			},
			year:{
				required: true
			}
		},
		messages:{
			day:{
				required:" required"
			},
			month:{
				required:" required"
			},
			year:{
				required:" required"
			}
		},
		submitHandler: function(form){
			users.push(document.getElementById('username').value);
			passwords.push(document.getElementById("passwd").value);
			var form = $("#register-form");
			form[0].reset();
			openDisplay('Login');
		}
	});
	$("#setting-form").validate({
		rules: {
			keydown:{
				notEqualTo: "#Up",
	//			notEqualTo: "#Left",
	//			notEqualTo: "#Right"
			},
			keyright:{
				notEqualTo: "#Down",
	//			notEqualTo: "#Left",
				notEqualTo: "#Up"
			},
			keyleft:{
				notEqualTo: "#Down",
				notEqualTo: "#Up",
				notEqualTo: "#Right"
			}
		},
		submitHandler: function(form){
			startgame();
		}
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
	var form = $("#login-form");
	form[0].reset();
	if (valid){
		var output = document.getElementById('LoginOut');
		output.innerHTML = username;
		openDisplay("Setting");
	}
	else{
		openDialog('mydialog');
	}
}
function openDialog(ID){
	document.getElementById(ID).showModal();
}
function closeDialog(ID){
	document.getElementById(ID).close();
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

	var val5 = (0x1000000+Math.random()*0xffffff).toString(16).substr(1,6)
  	document.getElementById("5p").value = "#" + val5;
	ball5p="#"+val5;

	var val15 = (0x1000000+Math.random()*0xffffff).toString(16).substr(1,6);
  	document.getElementById("15p").value = "#" + val15;
	ball15p="#"+val15;

	var val25 = (0x1000000+Math.random()*0xffffff).toString(16).substr(1,6);
  	document.getElementById("25p").value = "#" + val25;
	ball25p="#"+val25;

	numberM=Math.floor(Math.random() * (4 - 1 + 1) + 1);
	document.getElementById("numM").value = numberM;

	gametime=Math.floor(Math.random() * (600 - 60 + 1) + 60);
	document.getElementById("Time").value = gametime;

}

function TimeUpdate(){
	var val=document.getElementById("Time").value;
	gametime=val;
}

$("[type='number']").keypress(function (evt) {
    evt.preventDefault();
});

