<?php
   include("../user_online.php");
   if (!isset($_SESSION['Username'])) {
      header("Location:../index.php");
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
<link rel="stylesheet" href="../bootstrap/css/style1.css" type="text/css" media="all">
<link rel="shortcut icon" type="image/x-icon" href="../favicon.png" />
</head>
<body onload="refresh_room()">
<div class="topnav" id="myTopnav">
  <a href="#home" class="active">Home</a>
  <div class="dropdown">
    <button class="dropbtn">Device
      <i class="fa fa-caret-down"></i>
    </button>
    <div class="dropdown-content">
      <a href="#">My Device</a>
      <a href="#">Add Device</a>
    </div>
  </div> 
  <div class="dropdown">
    <button class="dropbtn_user"><?php echo $user_name;?> 
      <i class="fa fa-caret-down"></i>
    </button>
    <div class="dropdown-content">
      <a href="account.php">Accout</a>
      <a href="logout.php">Logout</a>
    </div>
  </div> 
  <div class="text">
		<a>User online:<?php echo $count_user_online;?></a>
  </div>
 
  <a href="javascript:void(0);" style="font-size:15px;" class="icon" onclick="myFunction()">&#9776;</a>
</div>
</body>
</html>