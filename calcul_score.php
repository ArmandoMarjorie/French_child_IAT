<?php
session_start();
header('content-type:application/json;charset=utf-8');

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

function getAmplitude($d_score)
{
	if($d_score > 0.65 || $d_score < -0.65)
		return ", ce qui suggère une forte association automatique ";
	else if($d_score > 0.35 || $d_score < -0.35)
		return ", ce qui suggère une association automatique moyenne ";
	else if($d_score > 0.15 || $d_score < -0.15)
		return ", ce qui suggère une légère association automatique ";
	return ", ce qui suggère peu à pas d'association automatique entre genre et discipline.";
}

function getOrientation($d_score)
{
	if($d_score>0.15)
		return "entre garçons-maths et filles-lecture.";
	else if($d_score<-0.15)
		return "entre filles-maths et garçons-lecture.";
	return "";
}

function standardDeviation($blockA, $blockB)
{
	// Pooled
	$pooledRT = array_merge($blockA, $blockB);
	// Mean
	$sizeArr = count($pooledRT);
	if( $sizeArr > 0 )
  		$mean = array_sum($pooledRT)/(float)$sizeArr;
  	
  	$sumDeviation = 0;
  	for($i=0; $i<$sizeArr; $i++)
  	{
  		// Subtract the mean from each rt + Square each deviation
  		$sumDeviation += (($pooledRT[$i] - $mean) * ($pooledRT[$i] - $mean));
  	}
  	if( $sizeArr-1 > 0 )
  		return sqrt($sumDeviation/(float)($sizeArr-1));
  	else
  		return 0;
}

function isBlockCompatible($numBlock)
{
    if($_SESSION['group'] == 0)
    {
    	if( $numBlock == 2 || $numBlock == 3 )
    		return 1;
    	else if( $numBlock == 5 || $numBlock == 6 )
    		return 0;
    }
    if($_SESSION['group'] == 1)
    {
    	if( $numBlock == 2 || $numBlock == 3 )
    		return 0;
    	else if( $numBlock == 5 || $numBlock == 6 )
    		return 1;
    }
    return 2;
}


if( isset($_POST['data']) && isset($_SESSION['group']) && isset($_SESSION['idUser']) )
{
	$resultArray = json_decode($_POST['data'], true);
	$idUser = (int) $_SESSION['idUser'];

	$tempsMax = (float) htmlspecialchars($resultArray['tempsMax']);
	$noScore = false;
	$nbBlocks = sizeof($resultArray['blocks']);
	$nb300 = 0;
	$nbCorrect = 0;
	$nbTotalItems = 0;
	$meanBlocks = [];
	$numBlockExp = [2,3,5,6];
	$blockRTcorrect = [];

	for( $numBlock=0; $numBlock<$nbBlocks; $numBlock++ )
	{
		$nbItemLeft = 0;
		$nbItemRight = 0;
		$nbGoodTrials = 0;
		$mean = 0;
		$catLeftRT = 0;
		$catRightRT = 0;
		$nbStims = sizeof($resultArray['blocks'][$numBlock]['stims']);
		$rtCorrect = [];
	    $areCatCompatible = isBlockCompatible($numBlock);
	    $catLeft = strip_tags($resultArray['blocks'][$numBlock]['left']);
	    $catRight = strip_tags($resultArray['blocks'][$numBlock]['right']);

		// For each stim in the current block
		for ( $numStim = 0; $numStim < $nbStims; $numStim++ ) 
		{
		    $acc = (int) htmlspecialchars($resultArray['answers'][$numBlock][$numStim]);
		    $stim = htmlspecialchars($resultArray['blocks'][$numBlock]['stims'][$numStim]['stim']);
		    $isLeft = (int) htmlspecialchars($resultArray['blocks'][$numBlock]['stims'][$numStim]['isLeft']);
		    $rt = (float) htmlspecialchars($resultArray['rt'][$numBlock][$numStim]);
		    $exclude = 1;

		    $nbCorrect += $acc;
	    	if( $rt < 300 )
	    		$nb300++;
			if( $rt <= 10000 && $rt >= 400 )
			{
				$nbGoodTrials++;
				$exclude = 0;
				$mean += $rt;

				if( in_array($numBlock, $numBlockExp) )
					$rtCorrect[] = $rt;
				
				if($isLeft)
				{
					$catLeftRT += $rt;
					$nbItemLeft++;
				}
				else
				{
					$catRightRT += $rt;
					$nbItemRight++;
				}
			}
	    	$nbTotalItems++;
	    }

		if($nbItemLeft > 0)
			$catLeftRT = $catLeftRT / (float) $nbItemLeft;
		if($nbItemRight > 0)
			$catRightRT = $catRightRT / (float) $nbItemRight;

		// Mettre dans summaryBlocks
		
	    $req = $db->prepare('INSERT INTO summaryblocks(idUser, numBlock, catLeft, catRight, areCatCompatible, meanCatLeftRT, meanCatRightRT) 
			VALUES(:idUser, :numBlock, :catLeft, :catRight, :areCatCompatible, :meanCatLeftRT, :meanCatRightRT);');
		$req->execute(array(
			'idUser' => $idUser,
			'numBlock' => ($numBlock+1),
			'catLeft' => $catLeft,
			'catRight' => $catRight,
			'areCatCompatible' => $areCatCompatible,
			'meanCatLeftRT' => $catLeftRT,
			'meanCatRightRT' => $catRightRT
		)) or exit(print_r($db->errorInfo()));
		$req->closeCursor();
		
		
	    	
		// Calcul mean for blocks 3, 4, 6, 7 
		// (Remember indexes in array starts at 0, so for us it's block 2, 3, 5, 6)
		if( in_array($numBlock, $numBlockExp) )
		{
			$blockRTcorrect[] = $rtCorrect;
			if($nbGoodTrials>0)
				$meanBlocks[] = (float)$mean/(float)$nbGoodTrials;
			else
				$meanBlocks[] = 0;
		}
	}
	
	$propRT300 = ((float)$nb300/(float)$nbTotalItems)*100;
	$percentCorrect = ((float)$nbCorrect/(float)$nbTotalItems)*100;



	// No score given if the user is exclude
	if( $propRT300 > 10 )
		$noScore = true;

	// Calcul std for B3-B6 B4-B7
	$pooled_std_b3b6 = standardDeviation($blockRTcorrect[0], $blockRTcorrect[2]);
	$pooled_std_b4b7 = standardDeviation($blockRTcorrect[1], $blockRTcorrect[3]);

	if( $_SESSION['group']==0 )
	{
		$diff_b6b3 = 0;
		if($pooled_std_b3b6 != 0)
			$diff_b6b3 = ($meanBlocks[2] - $meanBlocks[0]) / $pooled_std_b3b6;
		$diff_b4b7 = 0;
		if($pooled_std_b4b7)
			$diff_b4b7 = ($meanBlocks[3] - $meanBlocks[1]) / $pooled_std_b4b7;
	}
	else
	{
		$diff_b6b3 = 0;
		if($pooled_std_b3b6!=0)
			$diff_b6b3 = ($meanBlocks[0] - $meanBlocks[2]) / $pooled_std_b3b6;
		$diff_b4b7 = 0;
		if($pooled_std_b4b7)
			$diff_b4b7 = ($meanBlocks[1] - $meanBlocks[3]) / $pooled_std_b4b7;		
	}
	$d_score = ($diff_b6b3 + $diff_b4b7) / 2;

    $req = $db->prepare(
    	'INSERT INTO resultssummary(
		idUser,
		tempsMax, 
		entireExp, 
		exclude, 
		meanB3, 
		meanB4,
		meanB6,
		meanB7,
		stdB3B6,
		stdB4B7,
		da,
		db,
		dScore,
		percentCorrect,
		propRT300) 
		VALUES (
		:idUser,
		:tempsMax,
		:entireExp,
		:exclude,
		:meanB3, 
		:meanB4,
		:meanB6,
		:meanB7,
		:stdB3B6,
		:stdB4B7,
		:da,
		:db,
		:dScore,
		:percentCorrect,
		:propRT300
		);');
	$req->execute(array(
		'idUser' => $idUser,
		'tempsMax' => $tempsMax,
		'entireExp' => 1,
		'exclude' => (int) ($propRT300 > 10),
		'meanB3' => $meanBlocks[0],
		'meanB4' => $meanBlocks[1],
		'meanB6' => $meanBlocks[2],
		'meanB7' => $meanBlocks[3],
		'stdB3B6' => $pooled_std_b3b6,
		'stdB4B7' => $pooled_std_b4b7,
		'da' => $diff_b6b3,
		'db' => $diff_b4b7,
		'dScore' => $d_score,
		'percentCorrect' => $percentCorrect,
		'propRT300' => $propRT300
	)) or exit(print_r($db->errorInfo()));
	$req->closeCursor();
	

	if($noScore)
		echo json_encode(array(
			"success" => true,
			"score" => "Ton score n'a pas pu être calculé car tu as fait trop d'erreurs, ou tu as répondu trop rapidement ou trop lentement pour générer un score."
		));
	else
		echo json_encode(array(
			"success" => true,
			"score" => "Ton score est de ".(round($d_score*100)/100).getAmplitude($d_score).getOrientation($d_score)
		));

}
else
	echo json_encode(array(
		"success" => false,
		"score" => "ERREUR. Les données n'ont pas été envoyées."
	));