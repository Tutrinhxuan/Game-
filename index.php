<?php
   //include("user_online.php");
   $link="Location:main.php";
   session_start();

   if (isset($_SESSION['Username'])) {
      header($link);
    }
    //$error_message="Bạn chưa đăng nhập!";
	$server_username = "root";
    $server_password = "123123123";
    $server_host = "localhost";
    $database = "ban_tau";
    $conn = mysqli_connect($server_host,$server_username,$server_password,$database);
	// mysqli_query($conn,"SET NAMES 'UTF8'");
	mysqli_set_charset($conn,"utf8");
    if (isset($_POST["login_submit"])) {
	    $username = $_POST["Username"];
	    $password = $_POST["Password"];
		//làm sạch thông tin, xóa bỏ các tag html, ký tự đặc biệt 
		//mà người dùng cố tình thêm vào để tấn công theo phương thức sql injection
	    $username = strip_tags($username);
	    $username = addslashes($username);
		$password = strip_tags($password);
		$password = addslashes($password);
		$sql = "select * from users where username = '$username' and password = '$password' ";
		$query = mysqli_query($conn,$sql);
		$num_rows = mysqli_num_rows($query);
			if ($num_rows==0) {
				$error_message="Tên người dùng hoặc mật khẩu không chính xác!";
			}else{
				$_SESSION['Username'] = $username;
                header($link);
			}
	}else if (isset($_POST["register_submit"])) {
		$Name     = $_POST['Name'];
		$username = $_POST['Username'];
		$password = $_POST['Password'];
        $Email    = $_POST['Email'];
        $sql="select * from users where username='$username'";
        $kt=mysqli_query($conn,$sql);
        if(mysqli_num_rows($kt) > 0 ){
            $error_message="Tài khoản đã tồn tại!";}
		else{
			$sql = "INSERT INTO users(
	    			username,
	    			password,
	    			Name,
					Email
	    			) VALUES (
	    			'$username',
	    			'$password',
				    '$Name',
					'$Email'						
	    			)";	
			$ch=mysqli_query($conn,$sql);
			if($ch>0){
			$_SESSION['Username']=$username;
			header($link);}
			}
		}	
	mysqli_close($conn);
?>



<!DOCTYPE html>
<html>

<!-- Head -->
<head>

<title>Login</title>

<!-- Meta-Tags -->
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="keywords" content="Existing Login Form Widget Responsive, Login Form Web Template, Flat Pricing Tables, Flat Drop-Downs, Sign-Up Web Templates, Flat Web Templates, Login Sign-up Responsive Web Template, Smartphone Compatible Web Template, Free Web Designs for Nokia, Samsung, LG, Sony Ericsson, Motorola Web Design">
<script type="application/x-javascript"> addEventListener("load", function() { setTimeout(hideURLbar, 0); }, false); function hideURLbar(){ window.scrollTo(0,1); } </script>
<!-- //Meta-Tags -->
<link rel="shortcut icon" type="image/x-icon" href="bootstrap/images/favicon.png" />
<link href="bootstrap/css/popuo-box.css" rel="stylesheet" type="text/css" media="all" />

<!-- Style --> <link rel="stylesheet" href="bootstrap/css/style.css" type="text/css" media="all">

<!-- Fonts -->
<link href="//fonts.googleapis.com/css?family=Quicksand:300,400,500,700" rel="stylesheet">
<!-- //Fonts -->

</head>
<!-- //Head -->

<!-- Body -->
<body>
    

	<h1> <b> >>>> Game Tàu Chiến <<<< </b> </h1>

	<div class="w3layoutscontaineragileits">
	<h2>Login here</h2>
		<form name="login" action="index.php" method="post">
			<input type="text" Name="Username" placeholder="Tên người dùng" required="">
			<input type="password" Name="Password" placeholder="Mật khẩu" required="">
			<ul class="agileinfotickwthree">
				<li>
					<input type="checkbox" id="brand1" value="">
					<label for="brand1"><span></span>Nhớ tên tài khoản</label>
				</li>
			</ul>  
			<div class="alert alert-danger">
			  	<!-- <?php echo $error_message?> -->
			</div>
			<div class="aitssendbuttonw3ls">
				<input type="submit" name="login_submit" value="Đăng nhập">
				<p><a class="w3_play_icon1" href="#small-dialog1">Đăng ký</a></p>
				<div class="clear"></div>
			</div>
		</form>
	</div>	
	<div id="small-dialog1" class="mfp-hide">
		<div class="contact-form1">
			<div class="contact-w3-agileits">
				<h3>Register new account</h3>
				<form action="index.php" method="post" onsubmit="return validateForm();">
				        <div class="form-sub-w3ls">
							<input id="Name"  placeholder="Name" Name="Name" type="text"  pattern="[A-Za-z]+[ ]+[A-Za-z]${3,}" 
							title="Tối thiểu 3 ký tự, và không có chứa các ký tự đặt biệt và ký tự số."  required="">
							<div class="icon-agile">
								<i class="fa fa-user" aria-hidden="true"></i>
							</div>
						</div>
						<div class="form-sub-w3ls">
							<input id="Username" placeholder="UserName" Name="Username" type="text"  pattern="[A-Za-z0-9]{4,}" 
							title="Tối thiểu 4 ký tự, và không có chứa các ký tự đặt biệt."  required="">
							<div class="icon-agile">
								<i class="fa fa-user" aria-hidden="true"></i>
							</div>
						</div>
						<div class="form-sub-w3ls">
							<input id="Email" placeholder="Email" Name="Email" class="mail" type="email"  required="">
							<div class="icon-agile">
								<i class="fa fa-envelope-o" aria-hidden="true"></i>
							</div>
						</div>
						<div class="form-sub-w3ls">
							<input id="pw"  placeholder="Password" Name="Password" type="password"  pattern=".{4,}"  
                             title="Tối thiểu 4 ký tự."	required="">
							<div class="icon-agile">
								<i class="fa fa-unlock-alt" aria-hidden="true"></i>
							</div>
						</div>
						<div class="form-sub-w3ls">
							<input id="conf_pw"  placeholder="Confirm Password"  type="password" pattern=".{6,}" required="">
							<div class="icon-agile">
								<i class="fa fa-unlock-alt" aria-hidden="true"></i>
							</div>
						</div>
						<div id=message_register> </div>
					<div class="submit-w3l">
						<input type="submit" name="register_submit" value="Register">								
					</div>
				</form>
			</div>
		</div>	
	</div>
	<script type="text/javascript" src="bootstrap/js/jquery-2.1.4.min.js"></script>
	<!-- pop-up-box-js-file -->  
		<script src="bootstrap/js/jquery.magnific-popup.js" type="text/javascript"></script>
	<!--//pop-up-box-js-file -->
	<script>
		$(document).ready(function() {
		$('.w3_play_icon,.w3_play_icon1,.w3_play_icon2').magnificPopup({
			type: 'inline',
			fixedContentPos: false,
			fixedBgPos: true,
			overflowY: 'auto',
			closeBtnInside: true,
			preloader: false,
			midClick: true,
			removalDelay: 300,
			mainClass: 'my-mfp-zoom-in'
		});
																		
		});
	</script>
    <script>
		function validateForm(){
           var password = document.getElementById('pw').value;
		   var config_password = document.getElementById('conf_pw').value;
           if (password == config_password){
              return true;
			  }else{document.getElementById("message_register").innerHTML = "Xác nhận mật khẩu không giống!";}
			return false;
        }
	</script>
</body>
<!-- //Body -->

</html>