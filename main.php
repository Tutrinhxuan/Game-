<?php
   include("lib/user_online.php");
   if (!isset($_SESSION['Username'])) {
      header("Location:index.php");
    }
	/**/
	$user_name=$_SESSION['Username'];
	/**/

?>
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
<link rel="stylesheet" href="bootstrap/css/mystyle.css" type="text/css" media="all">
<link rel="shortcut icon" type="image/x-icon" href="bootstrap/images/favicon.png" />
</head>
<body onload="refresh_room()"  >
<div class="topnav" id="myTopnav">
  <a href="#home" class="active">Trang chủ</a>
  <div class="dropdown">
    <button class="dropbtn">Thiết bị
      <i class="fa fa-caret-down"></i>
    </button>
    <div class="dropdown-content" id="list_remote">
	<a id="no_remote" style="cursor: pointer">Không có thiết bị</a>
    </div>
  </div> 
  <div class="dropdown">
    <button class="dropbtn_user"><?php echo $user_name;?> 
      <i class="fa fa-caret-down"></i>
    </button>
    <div class="dropdown-content">
    </div>
  </div> 
  <a href="lib/logout.php">Đăng xuất</a>
  <a id="tcp" >&#x25CF</a>

  <a href="javascript:void(0);" style="font-size:15px;" class="icon" onclick="myFunction()">&#9776;</a>
</div>
<center class ="game" id="onroom" style="width: 50%">
<div style="margin: auto;border: 1px solid #ffffff;width:100%;height:650px">
<div style="height:200px;margin-top:80px">
<i id="id_room_2" style="font-size:30px"></i><br></br>
<i id="name_room_2" style="font-size:30px"></i><br></br>
<i id="number_room_2" class="fa fa-male" onload="test()" style="font-size:30px"></i><br></br>
<i id="owner_room_2" class="fa fa-user" style="font-size:30px;color:green"></i><br></br>
<p>VS</p>
<i id="client_room_2" class="fa fa-user" style="font-size:30px"></i><br></br>
</div>
<div style="margin-top:170px">
<button id="btn_ready" onclick="check_btn()" class="btn" style="background-color:#00ff00;border: 1px solid #00ff00"></button><br></br>
<button id="btn_close" onclick="close_room()" class="btn"style="background-color:#ff0000;border: 1px solid #ff0000">Close</button><br></br>
</div>
</div>
</center>
<div style="display: none" id="gameboard"></div>
<center id="pageroom">
<div id="table_room" style="color:white;font-size:20px"></div> 
<label for="name_room"><b style="color:white;font-size:17px">Name</b></label><span>
<input type="text" id="input_name_room" placeholder="Enter Name" name="name_room" style="padding: 12px 25px;font-size:17px;border-radius= 40px" required></span>
<button id="submit_button_create" class="button_create" onclick="create_new_room(nameroom)">+ create</button>
</center>
<div id="user_name" style="display:none;"><?php echo $user_name?></div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="bootstrap/js/mymain.js"></script>
</body>
</html>
