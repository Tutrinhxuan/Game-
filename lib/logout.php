<?php
   session_start();
   unset($_SESSION["Username"]);
   header('Refresh: 0; URL=../');
?>