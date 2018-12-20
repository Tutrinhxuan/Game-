<?php
    session_start();
    $session_user=$_SESSION['Username'];
	$time=time();
	$time_check=$time-300;
	
	$number_user_online="User online: 1";
    $server_username = "root";
    $server_password = "123123123";
    $server_host = "localhost";
    $database = "ban_tau";
	$tb_name="useronline";
	$count_user_online=0;
    $conn = mysqli_connect($server_host,$server_username,$server_password,$database);
	mysqli_query($conn,"SET NAMES 'UTF8'");
	mysqli_query($conn,"DELETE FROM $tb_name WHERE time < $time_check");
	$sql="select *from useronline where session='$session_user'";
    $rs=mysqli_query($conn,$sql);
	if(mysqli_num_rows($rs) > 0 ){
        $sql="UPDATE $tb_name SET time='$time' WHERE session='$session_user'";
		$rs=mysqli_query($conn,$sql);
		}else{
		$sql="INSERT INTO useronline(
	    			session,
					time
	    			) VALUES (
	    			'$session_user',
	    			'$time'
					)";	
        $rs=mysqli_query($conn,$sql);}
	$sql="SELECT * FROM `useronline`";
	$rs=mysqli_query($conn,$sql);
	if ($rs != false) {
        $count_user_online = mysqli_num_rows($rs);
		$number_user_online="User online: $count_user_online";
		}
	mysqli_close($conn);
?>