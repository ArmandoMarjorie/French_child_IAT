<?php
session_start();
header("Content-Type: text/plain");

require('database/DBConnect.php');
$dbManager = new DBConnect();
try
{
   $db = $dbManager->DBConnection();
}
catch(PDOException $e)
{
    echo "Connection to database FAILED : " . $e->getMessage();
}

if( isset($_POST['data']) )
{
	// Random group
	$_SESSION['group'] = random_int(0, 1);

	$resultArray = json_decode($_POST['data'], true);


	$req = $db->prepare('INSERT INTO user(ic_c, os, device) 
		VALUES(:ic_c, :os, :device);');
	$req->execute(array(
		'ic_c' => $_SESSION['group'],
		'os' => htmlspecialchars($resultArray['os']),
		'device' => htmlspecialchars($resultArray['device'])
	)) or exit(print_r($db->errorInfo()));
	$req->closeCursor();

	// session variables
	$_SESSION['idUser'] = $db->lastInsertId();
	$_SESSION['nbGoodTrials'] = 0;
	$_SESSION['acc'] = 0;
	$_SESSION['nbTotalItems'] = 0;
	$_SESSION['nbDeletedTrials'] = 0;
	$_SESSION['nb300'] = 0;

	echo "ok";
}
else
	echo "fail";