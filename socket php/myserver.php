<?php
$host = 'localhost'; //host
$port = '9000'; //port
$null = NULL; //null var
$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
set_time_limit(0);
socket_set_option($socket, SOL_SOCKET, SO_REUSEADDR, 1);
socket_bind($socket,0, $port);
socket_listen($socket);
$clients = array($socket);
$remotes = array();
$browsers = array();
$id_remote=0;
$id_browser=0;
$id_rival=0;
$user_rival="";
$user_remote_array=array();
$user_id_array=array();
while (true) {
	$changed = $clients;
	socket_select($changed, $null, $null, 0, 10);
	if (in_array($socket, $changed)) 
	{ 
		$socket_new = socket_accept($socket); //accpet new socket	
        $clients[] = $socket_new;		
		$header = socket_read($socket_new, 1024); //read data sent by the socket
		if($header==="connect_from_remote"){
			$remotes[] = $socket_new; //add socket to client array
			socket_getpeername($socket_new, $ip); 
			send_message($socket_new,"OK\r\n");
			$found_socket = array_search($socket, $changed);
		    unset($changed[$found_socket]);
		}
	    else{ 
		perform_handshaking($header, $socket_new, $host, $port); //perform websocket handshake
		socket_getpeername($socket_new, $ip); //get ip address of connected socket
		$browsers[] = $socket_new; //add socket to client array
		$found_socket = array_search($socket, $changed);
		unset($changed[$found_socket]);
		}
	}
	foreach ($changed as $changed_socket)  
	{
		while(socket_recv($changed_socket, $buf, 1024, 0) >= 1)
		{
			if(in_array($changed_socket,$browsers)){
			$received_text = unmask($buf); //unmask data
			$tst_msg = json_decode($received_text, true); //json decode 
			$type = $tst_msg['type'];
			$message = $tst_msg['message'];
			$id_remote = $tst_msg['id_remote'];
			$user_rival = $tst_msg['user_rival'];
			$user_name = $tst_msg['username'];
			$id_browser= array_search($changed_socket,$browsers);
			switch ($type) {
				case'response_browser':{
                                        $response_text= mask(json_encode(array('type'=>"OK")));
					$found=find_key($user_rival,$user_id_array,"user");
					$id_rival=$user_id_array[$found]->id;
//                                       $check=find_key($id_rival,$user_remote_array,"user");
  //                                      $check1=find_key($id_browser,$user_remote_array,"user");
    //                                    $id_remote=$user_remote_array[$check]->remote;
      //                                  $id_remote1=$user_remote_array[$check1]->remote;
        //                                send_message($remotes[$id_remote],$message."2\r\n");
          //                              send_message($remotes[$id_remote1],$message."1\r\n");
					send_message($browsers[$id_rival],$response_text);
					break;
				}
				case 'map':{
					$response = mask(json_encode(array('type'=>'map', 'message'=>$message)));
					$found=find_key($user_rival,$user_id_array,"user");
					$id_rival=$user_id_array[$found]->id;
					send_message($browsers[$id_rival],$response);
					break;
				}
				case'change_list':{
					$response = mask(json_encode(array('type'=>'change_list', 'message'=>$message,'id_remote'=>$id_remote)));
					send_message_all($browsers,$response);
					break;
				}
				case 'pair':{
					$user_remote=new remote_user();
                    $user_remote->user=$id_browser;
                    $user_remote->remote=$id_remote;
					$user_remote_array[]=$user_remote;
					send_message($remotes[$id_remote],"pair\r\n");
					break;
				}
				case 'exit_room':{
					$found=find_key($user_rival,$user_id_array,"user");
					$id_rival=$user_id_array[$found]->id;
					$response_text = mask(json_encode(array('type'=>'exit_room','message'=>$user_name,'id_browser'=>$id_rival)));
					send_message_all($browsers,$response_text);
					//send_message($browsers[$id_rival],$response_text);
					break;
				}
				case 'into_room':{
					$found=find_key($user_rival,$user_id_array,"user");
					$id_rival=$user_id_array[$found]->id;
					$response_text = mask(json_encode(array('type'=>'into_room','message'=>$user_name,'id_browser'=>$id_rival)));
					send_message_all($browsers,$response_text);
					break;
				}
				case 'rival':{
					if($message=='ready_ok'){
						$response_text = mask(json_encode(array('type'=>'ready_play', 'message'=>'OK')));
					}else if($message=='ready_no'){
						$response_text = mask(json_encode(array('type'=>'ready_play', 'message'=>'NO')));
					}else if($message=='OK'){
						$response_text = mask(json_encode(array('type'=>'play_game','message'=>'play_game')));
						echo "play_game";
					}else if($message=='endgame'){
						$response_text = mask(json_encode(array('type'=>'play_game', 'message'=>'endgame','id_remote'=>$id_remote)));
					}else{
						$response_text = mask(json_encode(array('type'=>'browser_attact','id_remote'=>$id_remote)));
					}
					$found=find_key($user_rival,$user_id_array,"user");
					$id_rival=$user_id_array[$found]->id;
					send_message($browsers[$id_rival],$response_text);
					break;
				}
			//	case'response_remote':{
			//		    $found=find_key($user_name,$user_id_array,"user");
			//		    $found1=find_key($user_rival,$user_id_array,"user");
			//	     	$id_browser=$user_id_array[$found]->id;
			//	     	$id_browser1=$user_id_array[$found1]->id;
					//	$check=find_key($id_browser,$user_remote_array,"user");
					//	$check1=find_key($id_browser1,$user_remote_array,"user");
					//	$id_remote=$user_remote_array[$check]->remote;
					  //      send_message($remotes[$id_remote],"RUNGLT");
					//	$id_remote1=$user_remote_array[$check1]->remote;
					//	send_message($remotes[$id_remote1],"RUNGDK");	
			//		break;
			//	}
				case'username':{
					echo $user_name;
					$found=find_key($user_name,$user_id_array,"user");
					if($found===false){
						echo " conneted\r\n";
						$user_id=new usr_id();
						$user_id->user =$user_name;
						$user_id->id=$id_browser;
						$user_id_array[]=$user_id;
						$response = mask(json_encode(array('type'=>'system', 'message'=>'connected','id_browser'=>$id_browser))); 
						send_message($changed_socket,$response);
						
					}else{
						echo " reconneted\r\n";
						$user_id_array[$found]->id=$id_browser;
						$response = mask(json_encode(array('type'=>'system', 'message'=>'connected','id_browser'=>$id_browser))); 
						send_message($changed_socket,$response);
					}
					break;
				}
				case 'get_list':{
					if(count($remotes)>0){
					foreach($remotes as $temp_socket){
						$check=find_key(array_search($temp_socket,$remotes),$user_remote_array,"remote");
						if($check===false){			
							$id_remote= array_search($temp_socket,$remotes);
							$response = mask(json_encode(array('type'=>'remote_ready', 'message'=>'','id_remote'=>$id_remote)));
							send_message($changed_socket,$response);
						}else {
							$id_remote= array_search($temp_socket,$remotes);
							$response = mask(json_encode(array('type'=>'remote_unready','message'=>'set','id_browser'=>$id_browser,'id_remote'=>$id_remote)));
							send_message($changed_socket,$response);
						}
					}
					
					}else{
						$response = mask(json_encode(array('type'=>'remote_close')));
					    send_message($changed_socket,$response);
					}
					break;
				}
				default:{
					break;
				}
			}
			break 2;
			}
			else if(in_array($changed_socket,$remotes)){
				
				switch($buf){
					case'ready':{
						send_message($changed_socket,"wait_to_pair\r\n");
						break;
					}
					case'waiting':{
						$id_remote= array_search($changed_socket,$remotes);
						$response = mask(json_encode(array('type'=>'remote_ready', 'message'=>'ready','id_remote'=>$id_remote)));
						send_message($changed_socket,"OK\r\n");
						send_message_all($browsers,$response);
						echo "1 Remote connected";
						break;
					}
					case'paired':{
						$id_remote= array_search($changed_socket,$remotes);
						$response_text = mask(json_encode(array('type'=>'remote_pair','id_remote'=>$id_remote)));
						$found=find_key($id_remote,$user_remote_array,"remote");
						$id_browser=$user_remote_array[$found]->user;
						send_message($changed_socket,"OK\r\n");
						send_message($browsers[$id_browser],$response_text);
						$response_text = mask(json_encode(array('type'=>'remote_unready','message'=>'change','id_browser'=>$id_browser,'id_remote'=>$id_remote)));
						send_message_all($browsers,$response_text);
						break;
					}
					default:{
						$response_text = mask(json_encode(array('type'=>'remote_data', 'message'=>$buf)));
						$id_remote= array_search($changed_socket,$remotes);
						$found=find_key($id_remote,$user_remote_array,"remote");
						$id_browser=$user_remote_array[$found]->user;
						send_message($browsers[$id_browser],$response_text);
						break;
					}
				}
			break 2;
			}
			break 2;
		}		
		$buf = @socket_read($changed_socket, 1024, PHP_NORMAL_READ);
		if ($buf === false) { // check disconnected client	
	        close_connect:
			$found_socket = array_search($changed_socket, $clients);
			unset($clients[$found_socket]);
			$found_socket = array_search($changed_socket, $changed);
			unset($changed[$found_socket]);
			$found_socket = array_search($changed_socket, $changed);
			unset($changed[$found_socket]);
			if(in_array($changed_socket,$remotes)){
				$found_socket = array_search($changed_socket, $remotes);
				$check=find_key($found_socket,$user_remote_array,"remote");
				if($check===false){
					echo "1 Remote Disconnect\r\n ";
					if(count($browsers)>0){
					$response_text = mask(json_encode(array('type'=>'remote_close', 'id_remote'=>$found_socket)));
					send_message_all($browsers,$response_text);
					unset($remotes[$found_socket]);
					}
				}else {
					echo "1 Remote Disconnect and Unpair\r\n ";
					$id_browser=$user_remote_array[$check]->user;
					$response_text = mask(json_encode(array('type'=>'remote_disconnect', 'id_remote'=>$found_socket,'id_browser'=>$id_browser)));
					send_message_all($browsers,$response_text);
					unset($user_remote_array[$check]);
                    unset($remotes[$found_socket]);					
				}
			}else if(in_array($changed_socket,$browsers)){
				$found_socket = array_search($changed_socket, $browsers);
				
				$check=find_key($found_socket,$user_id_array,"id");
				$temp_user=$user_id_array[$check]->user;
				$check=find_key($temp_user,$user_remote_array,"user");
				echo $temp_user." Disconnect\r\n";
				unset($browsers[$found_socket]);
				//echo $user_remote_array[$check]->id;
			//	echo $user_remote_array[$check]->user;
			//	echo "false";
			//	break;
				if($check!=false){
					unset($user_remote_array[$check]);
				}
				//echo count($remotes);
			}
			
		}
		
	}
}
socket_close($socket);
function send_message_all($str,$msg){
	foreach($str as $changed_socket){
		@socket_write($changed_socket,$msg,strlen($msg));
    }
	return true;
}
function send_message($socket,$msg){		
    socket_write($socket,$msg,strlen($msg));
	return true;
}
//Unmask incoming framed message
function unmask($text) {
	$length = ord($text[1]) & 127;
	if($length == 126) {
		$masks = substr($text, 4, 4);
		$data = substr($text, 8);
	}
	elseif($length == 127) {
		$masks = substr($text, 10, 4);
		$data = substr($text, 14);
	}
	else {
		$masks = substr($text, 2, 4);
		$data = substr($text, 6);
	}
	$text = "";
	for ($i = 0; $i < strlen($data); ++$i) {
		$text .= $data[$i] ^ $masks[$i%4];
	}
	return $text;
}
//Encode message for transfer to client.
function mask($text){
	$b1 = 0x80 | (0x1 & 0x0f);
	$length = strlen($text);
	
	if($length <= 125)
		$header = pack('CC', $b1, $length);
	elseif($length > 125 && $length < 65536)
		$header = pack('CCn', $b1, 126, $length);
	elseif($length >= 65536)
		$header = pack('CCNN', $b1, 127, $length);
	return $header.$text;
}
//handshake new client.
function perform_handshaking($receved_header,$client_conn, $host, $port){
	$headers = array();
	$lines = preg_split("/\r\n/", $receved_header);
	foreach($lines as $line)
	{
		$line = chop($line);
		if(preg_match('/\A(\S+): (.*)\z/', $line, $matches))
		{
			$headers[$matches[1]] = $matches[2];
		}
	}

	$secKey = $headers['Sec-WebSocket-Key'];
	$secAccept = base64_encode(pack('H*', sha1($secKey . '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')));
	//hand shaking header
	$upgrade  = "HTTP/1.1 101 Web Socket Protocol Handshake\r\n" .
	"Upgrade: websocket\r\n" .
	"Connection: Upgrade\r\n" .
	"WebSocket-Origin: $host\r\n" .
	"WebSocket-Location: ws://$host:$port/demo/shout.php\r\n".
	"Sec-WebSocket-Accept:$secAccept\r\n\r\n";
	socket_write($client_conn,$upgrade,strlen($upgrade));
}
class usr_id{
	public $id;
	public $user;
}
class remote_user{
	public $remote;
	public $user;
}
function find_key($needle,$obs,$type){
	$temp=0;
	foreach($obs as $ob){
		if($ob->$type === $needle) return $temp;
		$temp=$temp+1;
	}
	return false;
}
function check($arr){
	foreach($arr as $ar){
		echo $ar->user." : ".$ar->remote; echo"\r\n";
	}
}
?>
