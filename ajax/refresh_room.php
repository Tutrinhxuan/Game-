<?php
$conn = mysqli_connect("localhost","root","123123123","ban_tau")or die("error");
$rq = $_REQUEST["q"];
$id = $_REQUEST["id"];
$usr = $_REQUEST["usr"];
if($rq=="get_table"){
	$sql="SELECT * FROM `room`";
	$rs=mysqli_query($conn,$sql);
	if ($rs != false) {
		if(mysqli_num_rows($rs)==0){
			echo "No room was created, please create a new Room";
		}else{
        echo "<table id='table_list_room'>
		      <tr>
			  <th style='width:10%'>ID</th>
			  <th style='width:20%'>Name</th>
			  <th style='width:30%'>Creator</th>
			  <th style='width:20%'>Number</th>
			  <th style='width:20%'></th>
			  </tr>";
	    while($row = mysqli_fetch_array($rs)) {
			echo "<tr id='row".$row['ID']."'>";
			echo "<td>" . $row['ID'] . "</td>";
			echo "<td>" . $row['name'] . "</td>";
			echo "<td id='owner".$row['owner']."'>".$row['owner'] . "</td>";
			echo "<td id='number".$row['owner']."'>" . $row['number'] . "/2</td>";
			echo "<td><button id='btn".$row['owner']."' class='btn_play'";
			if($row['number']==2) echo " style='display:none'";
			echo " onclick='into_room(".$row['ID'];
			echo ",\"".$row['name']."\",\"".$row['owner'];
			echo "\")'><i class='fa fa-play'></i></button></td>";
			echo "</tr>";
		}
		echo "</table>";
		}
	}
}
else if($rq=="add_number"){
	$sql = "SELECT number FROM `room` WHERE id='$id'";
	$rs=mysqli_query($conn,$sql)->fetch_object()->number;
	if($rs==2)echo "ERROR";
	else {
		$sql = "UPDATE room SET number=2 WHERE id='$id'";
		$check=mysqli_query($conn,$sql);
		if($check){
			echo "OK";
		}else echo"ERROR";
	}
}
else if($rq=="exit_room_client"){
	$sql = "UPDATE room SET number=1 WHERE id='$id'";
	$check=mysqli_query($conn,$sql);
	if($check){
		echo "OK";
	}else echo "ERROR";
}
else if($rq="exit_room_owner"){
	$sql="SELECT number FROM `room` WHERE id='$id'";
	$rs=mysqli_query($conn,$sql)->fetch_object()->number;
	if($rs==1){
		$sql = "DELETE FROM `room` WHERE id='$id'";
		$check=mysqli_query($conn,$sql);
		if($check){
			echo "OK";
			}else echo "ERROR";
	}else if($rs==2){	
	    $sql = "UPDATE `room` SET number=1,owner='$usr' WHERE id='$id'";
		$check=mysqli_query($conn,$sql);
		if($check){
			echo "OK";
		}else echo "ERROR";
	}else echo"ERROR";
}
mysqli_close($conn);
?>