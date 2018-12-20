<?php
    $name_room = $_REQUEST["name_room"];
	$usr=$_REQUEST["creator"];
	$id=$_REQUEST["id"];
    $conn = mysqli_connect("localhost","root","123123123","ban_tau")or die("error");
	$sql = "INSERT INTO room(
	                ID,
	    			name,
	    			owner
	    			) VALUES (
					'$id',
	    			'$name_room',
					'$usr'
	    			)";	
			$check=mysqli_query($conn,$sql);
			if($check){
				echo "OK";
				}else echo"ERROR";
	mysqli_close($conn);
?>