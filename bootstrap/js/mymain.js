var usr=document.getElementById("user_name").textContent;
var nameroom="";
var owner=0;
var flag=0;
var ownername="";
var id=0;
var rival="";
var flagwait=0;		
enter_submit("input_name_room","submit_button_create");
var xmlhttp = new XMLHttpRequest();
var wsUri = "ws://htn.ddns.net:9000/myserver.php";
websocket = new WebSocket(wsUri); 
var list_remote = $('#list_remote');
var temp="";
var number_remote=0;	
var browser=0;
var MapOponentFlag=0;
	websocket.onopen = function(ev) { // connection is open 
		send_message("username","null",0,"null",usr);		
	}
	websocket.onmessage = function(ev) {
		var response 		= JSON.parse(ev.data); //PHP sends Json data		
		var res_type 		= response.type; //message type
		var res_message 	= response.message; //message text
 		var id_browser      = response.id_browser;
		var id_remote 		= response.id_remote; //user name
		switch(res_type){
			case'OK':{
				lock=0;
                               //                                myGameArea.interval=setInterval(myTimer,1000);
				break;
			}
			case'play_game':{
				if(res_message=="endgame"){
					if(id_remote==1) alert("You win");
					else alert("You loss");
					OutGame();
				}else{
				    show_page_game();
					flag=0;
					document.getElementById("btn_ready").innerHTML="Ready";
		            document.getElementById("btn_ready").style.border = "1px solid #00ff00";
		            document.getElementById("btn_ready").style.backgroundColor = "#00ff00";
				    startGame();
				}
				break;
			}
			case 'ready_play':{
				if(res_message=="OK"){
					document.getElementById("btn_ready").disabled = false;
					document.getElementById("btn_ready").style.cursor = "pointer";
					document.getElementById("btn_ready").style.border = "1px solid #00ff00";
					document.getElementById("btn_ready").style.backgroundColor = "#00ff00";
				}else {
					document.getElementById("btn_ready").disabled = true;
					document.getElementById("btn_ready").style.cursor = "not-allowed";
					document.getElementById("btn_ready").style.border = "1px solid #dadada";
					document.getElementById("btn_ready").style.backgroundColor = "#dadada";
				}
				break;
			}
			case 'change_list':{
			    refresh_room();
				break;
			}
			case 'map':{
				if(MapOponentFlag==0){
					MapOponentFlag=1;
					map_oponent=res_message;
					//alert("OK "+res_message);
				}else{
					map_oponent=res_message;
					//alert(res_message);
					PlayGame();
				}
			    break;
			}
			case 'system':{
				document.getElementById("tcp").style.color="green";
				browser=id_browser;
				send_message("get_list","null",0,"null","null");
				break;}
			case 'into_room':{
				if(browser==id_browser){
				rival=res_message;
				document.getElementById("number_room_2").innerHTML=" 2/2";
         		document.getElementById("client_room_2").innerHTML=rival;
				}
					$('#table_list_room').remove();
					refresh_room();
				break;
			}	
			case 'exit_room':{
				if(browser==id_browser){
				    rival="";
				    if(owner==1){
					   // owner=0;
					    document.getElementById("number_room_2").innerHTML=" 1/2";
					    document.getElementById("client_room_2").innerHTML="";
				    }else{
						owner=1;
						document.getElementById("btn_ready").disabled = true;
	                 	document.getElementById("btn_ready").style.cursor = "not-allowed";
		                document.getElementById("btn_ready").style.border = "1px solid #dadada";
	                	document.getElementById("btn_ready").style.backgroundColor = "#dadada";
	                	document.getElementById("btn_ready").innerHTML="Play";
					    document.getElementById("number_room_2").innerHTML=" 1/2";
					    document.getElementById("client_room_2").innerHTML="";
					    document.getElementById("owner_room_2").innerHTML=usr;
				    }
    			}
					flag=0;
					$('#table_list_room').remove();
					refresh_room();
				break;
			}
			case 'browser_attact':{
                                //send_message("response_browser","OK",0,rival,usr);
				boat[id_remote+13].hide=0;
				if(boat[id_remote+13].flag==0){
				    myturn=1;
//                                    lock=0;	
         			temp="OK";	
				}else temp="Rung";
				myGameArea.Time=120;
				update_boat();
				send_message("response_browser",temp,0,rival,usr);
			    break;
			}
			case 'remote_ready':{
				if(number_remote==0){
					$('#no_remote').remove();
				}
				number_remote++;
     			list_remote.append('<a style="cursor: pointer" onclick="choose_remote('+id_remote.toString()+')" id="remote'+id_remote.toString()+'">Remote '+(number_remote).toString()+'</a>');
			    break;}
			case 'remote_unready':{
				if(res_message=="set"){
					$('#no_remote').remove();
					list_remote.append('<a style="cursor:no-drop;pointer-events:none;background-color:#ff0000" onclick="choose_remote('+id_remote.toString()+')" id="remote'+id_remote.toString()+'">Remote '+(number_remote).toString()+'</a>');
				}else{
					if(id_browser!=browser)	remote_paired(id_remote);
				}
			    break;}
			case 'remote_pair':{
				temp="remote"+id_remote.toString();
				document.getElementById(temp).style.backgroundColor = "#4CAF50";
				document.getElementById(temp).style.pointerEvents = "none";
				document.getElementById(temp).style.cursor = "not-allowed";
			    break;}
			case 'remote_data':{
				if(lock==0&&int_game!=0){
				    if(res_message=='UP'){
					    moveup(boat[temp_boat]);
				    }else if(res_message=='DOWN'){
					    movedown(boat[temp_boat]);
		    		}else if(res_message=='LEFT'){
			  		    moveleft(boat[temp_boat]);
				    }else if(res_message=='RIGHT'){
					    moveright(boat[temp_boat]);
			     	}else if(res_message=='ROTATE'){
					    rotate(boat[temp_boat]);
			     	}else if(res_message=='PUT'){
						putdown(boat[temp_boat]);	
					}
			    break;
				}
			}
			case 'remote_close':{
				if(number_remote==0){
					break;
				}else if(number_remote==1){
					list_remote.append('<a id="no_remote" style="cursor: pointer">No remote</a>');
				} 
				number_remote--;
				temp="#remote"+id_remote.toString();
				$(temp).remove();
			    break;}
			case 'remote_disconnect':{
				if(number_remote==1){
					list_remote.append('<a id="no_remote" style="cursor: pointer">No remote</a>');
				} 
				if(browser==id_browser){
					alert("Please connect to remote");
				}
				number_remote--;
				temp="#remote"+id_remote.toString();
				$(temp).remove();
			    break;
			}
			default:{
                            lock=0;
			    break;}
		}
	};
	
	websocket.onerror	= function(ev){ alert("Error to connect TCP"); 
	}; 
	websocket.onclose 	= function(ev){document.getElementById("tcp").style.color="red"; 
	    
	}; 
	//Message send button
	//Send message
$(window).on('beforeunload', function(){
	websocket.close();
	close_room();
    return 'Are you sure you want to leave?';
});
function send_message(type_input,message_input,id_remote_input,user_rival_input,username_input){		
		var msg = {
			type:type_input,
			message:message_input,
			id_remote: id_remote_input,
			user_rival:user_rival_input,
			username:username_input
		};
		websocket.send(JSON.stringify(msg));	
	}
function choose_remote(id){
	send_message("pair","null",id,"null",usr);
}
function remote_paired(id){
	var temp='remote'+id.toString();
	document.getElementById(temp).style.cursor = "not-allowed";
	document.getElementById(temp).style.backgroundColor = "#ff0000";
	document.getElementById(temp).style.pointerEvents = "none";
}
function enter_submit(a,b){
	var input = document.getElementById(a);
	input.addEventListener("keyup", function(event) {
		event.preventDefault();
		if (event.keyCode === 13) {
			document.getElementById(b).click();
		}
	});
}
function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}
function change_page(a,b) {
    document.getElementById(a).style.display = "none";
	document.getElementById(b).style.display = "block";
}
function close_room(){
	if(owner==1){temp="exit_room_owner";}
	else temp="exit_room_client";
	owner=0;
	flag=0;
	xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
			//alert(this.responseText);
			if(this.responseText=="OK"){
				refresh_room();
				change_page("onroom","pageroom");
				send_message("exit_room","null",0,rival,usr);
			}else alert("error");
		}
    };
	xmlhttp.open("GET", "ajax/refresh_room.php?q="+temp+"&id="+id+"&usr="+rival, true);
    xmlhttp.send();
}
function into_room(id2,nameroom2,ownername2) {	
    ownername=ownername2;
	id=id2;
	flag=1;
    if(owner==1){
		document.getElementById("btn_ready").disabled = true;
		document.getElementById("btn_ready").style.cursor = "not-allowed";
		document.getElementById("btn_ready").style.border = "1px solid #dadada";
		document.getElementById("btn_ready").style.backgroundColor = "#dadada";
		document.getElementById("btn_ready").innerHTML="Play";
		document.getElementById("id_room_2").innerHTML="ID Room : "+id2;
		document.getElementById("number_room_2").innerHTML=" 1/2";
		document.getElementById("owner_room_2").innerHTML=" "+ownername2;
		document.getElementById("name_room_2").innerHTML="Name Room : "+nameroom2;
		document.getElementById("client_room_2").innerHTML="";
	}
	else {
		rival=ownername2;
		document.getElementById("btn_ready").innerHTML="Ready";
		document.getElementById("btn_ready").disabled = false;
		document.getElementById("btn_ready").style.cursor = "pointer";
		document.getElementById("btn_ready").style.border = "1px solid #00ff00";
		document.getElementById("btn_ready").style.backgroundColor = "#00ff00";
		document.getElementById("id_room_2").innerHTML="ID Room : "+id2;
		document.getElementById("number_room_2").innerHTML=" 2/2";
		document.getElementById("owner_room_2").innerHTML=" "+ownername2;
		document.getElementById("client_room_2").innerHTML=" "+usr;
		document.getElementById("name_room_2").innerHTML="Name Room : "+nameroom2;
		xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(this.responseText=="OK"){
				send_message("into_room","null",0,rival,usr);
			}else{
				alert("Full");
			    refresh_room();
				change_page("onroom","pageroom");
			}
        };
		}
        xmlhttp.open("GET", "ajax/refresh_room.php?q=add_number&id="+id+"&usr="+rival, true);
        xmlhttp.send();
	}
	change_page("pageroom","onroom");
}
function create_new_room(){
	nameroom=document.getElementById("input_name_room").value;
	var id=Math.floor((Math.random() * 9999) + 1);
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(this.responseText=="OK"){
				owner=1;
				temp="<tr id='row"+id.toString()+"'><td>"+id.toString()+"</td><td>"+nameroom+"</td><td>"+usr+"</td><td>1/2</td><td><button class='btn_play' onclick='into_room("+id.toString()+",\""+nameroom+"\",\""+usr+"\")'><i class='fa fa-play'></i></button></td></tr>";
				send_message("change_list",temp,1,"null","null");
		        into_room(id,nameroom,usr);
				}else{alert("Error");}
            }
        };
        xmlhttp.open("GET", "ajax/create_room.php?name_room=" + nameroom + "&creator="+usr+"&id="+id, true);
        xmlhttp.send();
}
function refresh_room(){
	xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        document.getElementById("table_room").innerHTML=this.responseText;
		//change_page("onroom","pageroom");
		//alert(this.responseText);
        }
    };
    xmlhttp.open("GET", "ajax/refresh_room.php?q=get_table&id=0&usr=\"\"", true);
    xmlhttp.send();
}
function check_btn(){
        lock=0;
	if(owner==0){
		if(flag==0){
			flag=1;
			document.getElementById("btn_ready").innerHTML="Cancel";
			document.getElementById("btn_ready").style.border = "1px solid #ff0000";
			document.getElementById("btn_ready").style.backgroundColor = "#ff0000";
			send_message("rival","ready_ok",0,rival,usr);
		}else {
		    flag=0;
		    document.getElementById("btn_ready").innerHTML="Ready";
		    document.getElementById("btn_ready").style.border = "1px solid #00ff00";
		    document.getElementById("btn_ready").style.backgroundColor = "#00ff00";
		    send_message("rival","ready_no",0,rival,usr);
	    }
	}else{
		send_message("rival","OK",0,rival,usr);
		show_page_game();
		document.getElementById("btn_ready").disabled = true;
		document.getElementById("btn_ready").style.cursor = "not-allowed";
		document.getElementById("btn_ready").style.border = "1px solid #dadada";
		document.getElementById("btn_ready").style.backgroundColor = "#dadada";
		startGame();
	}
}
function show_page_game(){
	document.getElementById("onroom").style.display = "none";
	document.getElementById("table_room").style.display = "none";
	document.getElementById("gameboard").style.display = "block";
}
var temp_boat=0;
var int_boat=0;
var int_game=0;
var sound_move;
var sound_put;
var sound_shot;
var sound_shot1;
var sound_block;
var sound_error;
var sound_nochange;
var boat=[];
var num_boat=[4,3,3,2,2,2,1,1,1,1];
var value_boat=[14,12,11,9,8,7,5,4,3,2];
var boat_put=10;
var boat_destroyed=0;
var myturn=-1;
var lock=0;
var TimeOut;
var map_temp = [
				[0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0]
				
				];
var map_player = [
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0]
				];
var map_oponent = map_player;
function startGame() {
        lock=0;
	TimeOut = new component("30px", "Consolas", "black", 500, 80, "text",0);
	PlayerName = new component("30px", "Consolas", "black", 250, 120, "text",0);
	OponentName = new component("30px", "Consolas", "black", 750, 120, "text",0);
	WaitOponent = new component("30px", "Consolas", "black", 500, 160, "text",1);
	int_game=1;
	boat_component();
	sound_move=new sound("bootstrap/audio/move.mp3");
	sound_put=new sound("bootstrap/audio/put.mp3");
	sound_shot=new sound("bootstrap/audio/shot.wav");
	sound_shot1=new sound("bootstrap/audio/cannon.wav");
	sound_block=new sound("bootstrap/audio/error.wav");
	sound_error=new sound("bootstrap/audio/low.wav");
	sound_nochange=new sound("bootstrap/audio/nochange.wav");
	myGameArea.ready();
 	update_boat();
	boat[0].update();
	temp_boat=1;
	PlayerName.text="Player";
	OponentName.text="Oponent";
	WaitOponent.text="Waiting...";
	WaitOponent.flag=1;
	PlayerName.update();
	OponentName.update();
}
var myGameArea = {
    canvas : document.createElement("canvas"),
    ready : function() {
        this.canvas.width = 1100;
        this.canvas.height = 680;
        this.context = this.canvas.getContext("2d");
        document.getElementById("gameboard").appendChild(this.canvas);
		this.Time=180;
		this.interval = setInterval(myTimer, 1000);
    },
	start:function(){
		boat_component();
		update_boat();
	},
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
$(document).keypress(function(e) {
	if(lock==0){
	    if(e.which==119){moveup(boat[temp_boat]);}
		else if(e.which==115){movedown(boat[temp_boat]);} 
		else if(e.which==97){moveleft(boat[temp_boat]);}
        else if(e.which==100){moveright(boat[temp_boat]);}
	    else if(e.which==32){rotate(boat[temp_boat]);}
	    else if(e.which==13){putdown(boat[temp_boat]);	}	
	}
});
function component(width, height, color, x, y,type,hide) {
	this.type=type;
	if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y; 
	this.hide=hide;
    this.flag=0;	
	this.speedX = 0;
    this.speedY = 0;
	
    this.update = function() {
		if(this.hide==0){
			ctx = myGameArea.context;
		    if (this.type == "image") {
                ctx.drawImage(this.image, 
                    this.x, 
                    this.y,
                    this.width, this.height);
            }else if (this.type == "text") {
				ctx.font = this.width + " " + this.height;
				if(this.flag==1){
					ctx.fillStyle="red";
				}else ctx.fillStyle = color;
				ctx.fillText(this.text, this.x, this.y);
			} else{
			    if(this.flag==0&&int_game==1){
				    ctx.fillStyle = "red";
			    }else ctx.fillStyle = color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		    }
        }
    }
	this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;        
    }
	this.rotate=function(){
		var temp=this.width;
		this.width=this.height;
		this.height=temp;
	}
	this.clear=function(){
		ctx=myGameArea.context;
		if (this.type == "text") ctx.clearRect(this.x,this.y-40,200,60);
		else ctx.clearRect(this.x,this.y,this.width,this.height);
	}
}

function update_boat(){
	if(int_game==1){
		for(i=0;i<11;i++){
			boat[i].update();
		}
	}else if(int_game==2){
		for(i=11;i<boat.length;i++){
			boat[i].update();
		}
		boat[12].update();
	}
}

function updateGameArea(e) {
    e.clear();
    e.newPos();
    e.update();
	check_boat(e);
	update_boat();
}
function moveup(e) {
	if(e.y>280){
		sound_move.play();
		e.speedY = -40;
	}else{ 
	    e.speedY =0;
        sound_nochange.play();
	}		
	e.speedX=0;
	updateGameArea(e); 
}

function movedown(e) {
	if(e.y+e.height<640){
		sound_move.play();
		e.speedY = 40; 
	}else{
		sound_nochange.play();
		e.speedY =0; 
	}
	e.speedX=0;
	updateGameArea(e); 
}

function moveleft(e) {
	if(int_game==1){
		if(e.x>100){
			sound_move.play();
     		e.speedX = -40;
	    }else {
			sound_nochange.play();
		    e.speedX =0;
		}
	}else if(int_game==2){
		if(e.x>620){
			sound_move.play();
     		e.speedX = -40;
	    }else{
			sound_nochange.play();
			e.speedX =0;
		}
	}		
	e.speedY=0;
	updateGameArea(e); 
}

function moveright(e) {
	if(int_game==1){
		if(e.x+e.width<500){
			sound_move.play();
		    e.speedX = 40;	
	    }else {
			sound_nochange.play();
			e.speedX =0;
		}
	}else if(int_game==2){
		if(e.x+e.width<1020){
			sound_move.play();
		    e.speedX = 40;	
	    }else{
			sound_nochange.play();
  			e.speedX =0;
		}
	}		
	e.speedY=0;
	updateGameArea(e);
}
function rotate(e) {
	sound_move.play();
	e.speedY =0; 
	e.speedX=0;
	if(e.x+e.height<540 && e.y+e.width<680){
	    e.rotate();	
	}
	updateGameArea(e); 
}
function check_boat(e){
	if(int_game==1){
		if(e.x+e.width<540){e.flag=1;}
    	tempx=(e.x-100)/40;
	    tempy=(e.y-260)/40;
	    for(i=e.width/40;i>0;i--){
		    for(j=e.height/40;j>0;j--){
			    tx=tempx+i-1;
			    ty=tempy+j-1;
			    if(tx<10&&ty<10){	
			        if(map_temp[ty+1][tx+1]!=0){e.flag=0;}
			    }
	     	}
	    }
	}else if(int_game==2){
    	tempx=(e.x-620)/40;
	    tempy=(e.y-260)/40;
	    if(map_oponent[tempy][tempx]!=0){e.flag=1;}
		else e.flag=0;
	}	
}
function putdown(e){
	if(int_game==1){
		if(e.flag==1){
			sound_put.play();
		    tempx=(e.x-100)/40;
		    tempy=(e.y-260)/40;
			temp=(e.width>e.height)?e.width/40:e.height/40;
	    	for(i=e.width/40;i>0;i--){
		    	for(j=e.height/40;j>0;j--){
			    	ty=tempx+i-1;
				    tx=tempy+j-1;
				    if(tx<10&&ty<10){	
     				    map_player[tx][ty]=temp+boat_put;
					    map_temp[tx][ty]=1;
					    map_temp[tx][ty+1]=1;
					    map_temp[tx][ty+2]=1;
					    map_temp[tx+1][ty]=1;
					    map_temp[tx+1][ty+1]=1;
					    map_temp[tx+1][ty+2]=1;
					    map_temp[tx+2][ty]=1;
					    map_temp[tx+2][ty+1]=1;
					    map_temp[tx+2][ty+2]=1;
					}
		        }
	        }
			boat_put--;
			if(temp_boat<10){
				temp_boat++;
				boat[temp_boat].hide=0;
				boat[temp_boat+1].hide=0;
			}else if(temp_boat==10){
				if(MapOponentFlag==0){
					lock=1;
					WaitOponent.text="waiting...";
				    WaitOponent.hide=0;
				    WaitOponent.flag=1;
				    WaitOponent.update();
					send_message("map",map_player,0,rival,usr);
					MapOponentFlag=1;
					myturn=1;
				}else {
					send_message("map",map_player,0,rival,usr);
					myturn=-1;
                                        lock=1;
					//alert("PlayGame");
					PlayGame();
				}
		    }
		}else sound_block.play();
	}else if(int_game==2){
//              clearInterval(myGameArea.interval);
	lock=1;
		if(myturn==1){
			myGameArea.Time=120;
			tempx=(e.x-620)/40;
			tempy=(e.y-260)/40;
			if(boat[tempx*10+tempy+113].hide==1){
				if(e.flag==0){
				    sound_shot.play();
					WaitOponent.hide=0;
					WaitOponent.update();
					myturn=-1;
				}
				else {
					myturn=1;
					sound_shot1.play();
					dec_num(tempy,tempx);
					check_show_boat();
//					send_message('response_remote','',0,rival,usr);
                                    //    setTimeout(function(){},500);
					if(boat_destroyed==10){
						alert("you win");
						send_message("rival","endgame",0,rival,usr);
						OutGame();
					} 
				}
				boat[(tempx*10+tempy)+113].hide=0;
				boat[(tempx*10+tempy)+113].update();
				boat[12].update();
				send_message("rival","",tempx*10+tempy,rival,usr);
			}else {
			    sound_error.play();				
			}
			update_boat();
		}else sound_error.play();
//        myGameArea.interval=setInterval(myTimer,1000);
	}
}
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.getElementById("gameboard").appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}

function boat_component(){
	if(int_game==1){
	   boat[int_boat++]= new component(470, 470, "bootstrap/images/playerMap.png", 40,200,"image",0);	
	   boat[int_boat++]= new component(40, 160, "green", 540,380,"",0);	
	   boat[int_boat++]= new component(40, 120, "green",540,380,"",0);
       boat[int_boat++]= new component(40, 120, "green",540,380,"",1);
	   boat[int_boat++]= new component(40, 80, "green",540,380,"",1);
	   boat[int_boat++]= new component(40, 80, "green",540,380,"",1);
	   boat[int_boat++]= new component(40, 80, "green",540,380,"",1);
	   boat[int_boat++]= new component(40, 40, "green",540,380,"",1);	
	   boat[int_boat++]= new component(40, 40, "green",540,380,"",1);
	   boat[int_boat++]= new component(40, 40, "green",540,380,"",1);	
	   boat[int_boat++]= new component(40, 40, "green",540,380,"",1);
	   boat[int_boat++]= new component(470, 470, "bootstrap/images/oponentMap.png", 610,200,"image",0);
	   boat[int_boat++]= new component(40, 40, "bootstrap/images/target.png", 820,420,"image",1);	
	}else if(int_game==2){
		for(i=0;i<10;i++){
		    for(j=0;j<10;j++){
			    if(map_player[j][i]==0) boat[int_boat++]=new component(40, 40, "blue",(i*40+100),(j*40+260),"",1);	
			    else{ 
				    boat[int_boat++]=new component(40, 40,"red",(i*40+100),(j*40+260),"",1);
				    boat[int_boat-1].flag=1;
				}
		    }
	    }
	    for(i=0;i<10;i++){
		    for(j=0;j<10;j++){
				if(map_oponent[j][i]==0) boat[int_boat++]=new component(40, 40, "red",(i*40+620),(j*40+260),"",1);
				else boat[int_boat++]=new component(40, 40, "green",(i*40+620),(j*40+260),"",1);
			}
	    }		
	}
}
function show_boat(e){
	for(i=0;i<10;i++){
		for(j=0;j<10;j++){
			if(map_oponent[j][i]==e) {show_area(i,j);}
		}
	}
}
function check_show_boat(){
	for(i=0;i<10;i++){
		if(num_boat[i]==0){
			num_boat[i]=1;
			boat_destroyed++;
			show_boat(value_boat[i]); 
			break;
		}
	}
}
function show_area(x,y){
	t=x*10+y+113;
	if(x==0){
		if(y==0){
			boat[113].hide=0;
			boat[114].hide=0;
			boat[123].hide=0;
			boat[124].hide=0;
		}else if(y==9){
			boat[121].hide=0;
			boat[122].hide=0;
			boat[132].hide=0;
			boat[131].hide=0;
		}else{
			boat[t-1].hide=0;
			boat[t].hide=0;
			boat[t+1].hide=0;
			boat[t+9].hide=0;
			boat[t+10].hide=0;
			boat[t+11].hide=0;
		}
	}else if(x==9){
		if(y==0){
			boat[t].hide=0;
			boat[t-10].hide=0;
			boat[t+1].hide=0;
			boat[t-9].hide=0;
		}else if(y==9){
			boat[t].hide=0;
			boat[t-10].hide=0;
			boat[t-1].hide=0;
			boat[t-11].hide=0;
		}else{
			boat[t-1].hide=0;
			boat[t].hide=0;
			boat[t+1].hide=0;
			boat[t-10].hide=0;
			boat[t-11].hide=0;
			boat[t-9].hide=0;
		}
	}else{
		if(y==0){
			boat[t].hide=0;
			boat[t-10].hide=0;
			boat[t+10].hide=0;
			boat[t+1].hide=0;
			boat[t-9].hide=0;
			boat[t+11].hide=0;
		}else if(y==9){
			boat[t].hide=0;
			boat[t-10].hide=0;
			boat[t+10].hide=0;
			boat[t-1].hide=0;
			boat[t+9].hide=0;
			boat[t-11].hide=0;
		}else{
			boat[t].hide=0;
			boat[t+10].hide=0;
			boat[t-10].hide=0;
			boat[t+1].hide=0;
			boat[t-9].hide=0;
			boat[t+11].hide=0;
			boat[t-1].hide=0;
			boat[t-11].hide=0;
			boat[t+9].hide=0;
		}
	}
}
function dec_num(x,y){
	if(map_oponent[x][y]==14) num_boat[0]--;
	else if(map_oponent[x][y]==12) num_boat[1]--;
	else if(map_oponent[x][y]==11) num_boat[2]--;
	else if(map_oponent[x][y]==9) num_boat[3]--;
	else if(map_oponent[x][y]==8) num_boat[4]--;
	else if(map_oponent[x][y]==7) num_boat[5]--;	
	else if(map_oponent[x][y]==5) num_boat[6]--;	
	else if(map_oponent[x][y]==4) num_boat[7]--;	
	else if(map_oponent[x][y]==3) num_boat[8]--;	
	else if(map_oponent[x][y]==2) num_boat[9]--;	
}
function myTimer(){
	if(int_game==0){
		return;
	}else if(int_game==1){
		if(lock==0){WaitOponent.clear();}
		myGameArea.Time-=1;
		TimeOut.text="Time : "+ myGameArea.Time;
		TimeOut.clear();
		TimeOut.update();
		if(myGameArea.Time==0){
			//alert("Time Out: You loss");
			//myGameArea.hide();
			myGameArea.Time=120;
		}
	}else if(int_game==2){
		if(lock==0&&myturn==1){WaitOponent.clear();}
                else if(myturn==-1){ WaitOponent.update();}
		myGameArea.Time-=1;
		TimeOut.text="Time : "+ myGameArea.Time;
		TimeOut.clear();
		TimeOut.update();
		PlayerName.clear();
		OponentName.clear();
		if(myturn==1){ 
lock=0;
		    PlayerName.flag=1;
			OponentName.flag=0;
		}
		else {
			OponentName.flag=1;
			PlayerName.flag=0;
		}
		PlayerName.update();
		OponentName.update();
		if(myGameArea.Time==0&&myturn==1){
			myturn=-1;
			alert("Time out: You loss");
			myGameArea.Time=120;
			send_message("rival","endgame",1,rival,usr);
			OutGame();
		}else if(myGameArea.Time==0&&myturn==-1){
                       myGameArea.Time=0;
                     }
	}
}
function reset_game(){
	temp_boat=0;
	int_boat=0;
    int_game=0;
	num_boat=[4,3,3,2,2,2,1,1,1,1];
    value_boat=[14,12,11,9,8,7,5,4,3,2];
    boat_put=10;
    boat_destroyed=0;
    myturn=-1;
    ResetMap(map_oponent,10,10);
    ResetMap(map_player,10,10);
    ResetMap(map_temp,12,12);
	clearArray(boat);
	lock=0;
	MapOponentFlag=0;
	clearInterval(myGameArea.interval);
}
function OutGame(){
	reset_game();
	document.getElementById("onroom").style.display = "block";
	document.getElementById("table_room").style.display = "none";
	document.getElementById("gameboard").style.display = "none";
}
function ResetMap(x,width,height){
	for(i=0;i<width;i++){
		for(j=0;j<height;j++){
			x[j][i]=0;
		}
	}
}
function clearArray(array) {
  while (array.length) {
    array.pop();
  }
}
function PlayGame(){
      //  lock=0;
	if(int_game==1){
		lock=0;
		temp_boat+=2; 
		boat[temp_boat].hide=0;
		boat[temp_boat-1].hide=0;
		int_game=2;
		myGameArea.Time=120;
		myGameArea.start();
	}else if(int_game==2){
	if(myturn==-1)lock=1;
else lock=0;	
	}
}
function RandomMap(){
	temp=0;
	for(i=0;i<10;i++){
		
	}
}
