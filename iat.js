var currBlock = -1;
var maxBlocks = 7;
var endTime = null;
var startTime = null;
var totalTimes = [];
var blocks = [];
var answers = [];
var instructionsBlock = [];
var codeLeftKey = 69;
var codeRightKey = 73;
var codeContinueKey = 32;
var i=-1;
var score="";

var endTimeTotal = null;
var startTimeTotal = null;

function FatalError(){ Error.apply(this, arguments); this.name = "FatalError"; }
FatalError.prototype = Object.create(Error.prototype);



function printDebrief(score)
{
	$("body").html(
	'<div class="container" style="text-align: center;padding-top:1em;padding-bottom:1em;width: 1100px;">'+
	    '<div class="row">'+
	      '<div class="col-12" style="color: white;margin-bottom: 0.5em;">'+
	        "<h3>Merci beaucoup d'avoir complété ce test !</h3>"+
	      '</div>'+
	    '</div>'+
	    '<div class="row" style="background-color: #EDEDED;border-radius: 50px;display: inline-block;">'+
			'<div class="col-12" style="text-align: center;padding:1.5em 1.2em 1em 1em;font-weight: bold;border-bottom: 2px solid black;font-size: 2em;">'+
				score+
			'</div>'+
			'<div class="col-12" style="padding:1.5em;text-align: left;border-bottom: 2px solid black;">'+
				"Le score à ce test peut être positif ou négatif. Il peut varier de -2 à +2. "+
				"Lorsqu'il est positif, il traduit des associations congruentes avec le stéréotype "+
				"(facilité pour associer garçons et maths, filles et lecture). "+
				"Lorsqu'il est négatif, il traduit des associations contre-stéréotypiques "+
				"(facilité pour associer filles et maths, garçons et lecture). "+
				"Plus le score est élevé, en valeur absolue, plus la force des associations est importante."+
				"<br/><br/>Pour te donner un ordre d'idée, avec ce test chez les adultes :<br/><ul>"+
				"<li>Le score moyen d'un échantillon extrait de la population en France est de 0.43 (Nosek et al., 2009, PNAS).</li>"+
				"<li>Le score moyen du comité national de la recherche scientifique (CNRS) est de 0.36 (Régner et al., 2019, Nature Human Behaviour).</li>"+
				"<li>Le score moyen de 61 pays ayant répondu à ce test est de 0.38 (Nosek et al., 2009, PNAS).</li></ul>"+
			'</div>'+
			'<div class="col-12" style="padding:1.5em;text-align: left;border-bottom: 2px solid black;">'+
				'<h4 style="text-align:center;">Quelques explications sur l’IAT et le calcul du score.</h4>'+
				"L’IAT maths-lecture-genre permet d’estimer la force des associations ancrées en mémoire sémantique entre une catégorie donnée "+
				"(en l’occurrence ici une catégorie de sexe) et les caractéristiques attribuées à cette catégorie par le stéréotype. "+
				"La force des associations est estimée à partir des temps de réponse (en millisecondes) à une tâche informatisée dite "+
				"de « catégorisation » consistant, au cours d’une centaine d’essais, à associer des mots à des catégories sémantiques "+
				"le plus vite possible, sachant que ces associations peuvent être congruentes (e.g., « garçons » / « maths ») ou "+
				"incongruentes (« filles »/« lecture ») avec le stéréotype. Dans le premier cas (congruence), "+
				"si le stéréotype est fortement ancré en mémoire sémantique (c'est-à-dire à l'origine d'associations automatiques), "+
				"les individus sont typiquement très rapides dans leurs associations de fait très automatiques. "+
				"Dans le second (incongruence), ils sont typiquement ralentis du fait d’associations contradictoires avec "+
				"le stéréotype (associations contre-stéréotypiques). Ce ralentissement n’a pas lieu d’être si le stéréotype "+
				"n'est pas ancré en mémoire. Ces différences dans les temps de réponse entre associations congruentes et incongruentes "+
				"constituent précisément la signature chronométrique du stéréotype dans les réseaux de la mémoire sémantique. "+
				"L’individu peut détecter un ralentissement de ses réponses pour les associations incongruentes, mais il lui est difficile de le "+
				"contrôler, c’est là tout l’intérêt du test IAT.<br/><br>"+
				
				"Le score IAT correspond à la différence entre les temps de réponse (TR) aux essais incongruents et congruents, "+
				"divisée par l'écart-type des TR sur l’ensemble des essais (ce qui permet d’extraire un score standardisé). "+
				"Ce score, qui peut être positif (indice d’une tendance stéréotypique) ou négatif (tendance contre-stéréotypique), "+
				"est ensuite testé par rapport à zéro. Un score positif statistiquement différent de zéro (effet IAT) est donc l’indice d’un "+
				"stéréotype installé dans les réseaux de la mémoire sémantique (souvent à l’insu du sujet lui-même). Les résultats "+
				"montrent que la grande majorité des individus obtiennent un score positif à l'IAT Sciences/Genre (celui chez les adultes), indépendamment "+
				"de leur sexe, âge, origine sociale, nationalité, culture, ce qui témoigne de la force et de la présence des stéréotypes "+
				"de genre dans toutes les sociétés. Certaines personnes, beaucoup moins nombreuses, obtiennent un score négatif qui traduit "+
				"des associations contre-stéréotypiques stockées en mémoire. Ce sont souvent des personnes qui ont été socialisées dans des "+
				"environnements (familiaux, scolaires, ou autres) marqués par la présence de modèles féminins de réussite en sciences ou aux "+
				"fonctions à responsabilité, ou en tout cas par une socialisation paritaire."+
			"</div>"+
			'<div class="col-12" style="padding:1.5em;text-align: left;">'+
				"Vous pouvez visiter le site d'Anthony Greenwald, un des créateurs de ce test, pour avoir plus d'informations "+
				"et consulter les publications associées "+
				"<a href='https://faculty.washington.edu/agg/iat_materials.htm' target='_blank' rel='noopener noreferrer'>en cliquant ici</a>."+
			"</div>"+
			'<div class="col-12" style="padding:1.5em;text-align: center;">'+
				'Tu peux maintenant quitter le site !'+
			'</div>'+
	    '</div>'+
	'</div>');
}


function sendToScore()
{
	endTimeTotal = (new Date()).getTime();
	for(var s=0; s<blocks.length; s++)
	{
		for(var t=0; t<blocks[s]["stims"].length; t++)
		{
			delete blocks[s]["stims"][t].soundPlayed;
		}
	}
	var obj = 
	{
		"answers": answers,
		"rt": totalTimes,
		"blocks": blocks,
		"tempsMax": endTimeTotal - startTimeTotal
	};
	$.ajax(
	{
		url : 'submit_trials_answers.php',
		type : 'POST',
		dataType : "json",
		data: "data=" + JSON.stringify(obj),
		async : true,
		success : function(data, statut)
		{
		},
		error : function(resultat, statut, error)
		{
			$('body').html(error);
		}
	});
	$.ajax(
	{
		url : 'calcul_score.php',
		type : 'POST',
		dataType : "json",
		data: "data=" + JSON.stringify(obj),
		async : false,
		success : function(data, statut)
		{
			score = data['score'];
			console.log(score);
			printDebrief(score);
		},
		error : function(resultat, statut, error)
		{
			$('body').html(error);
		}
	});
}

function printStim()
{
	if(i >= blocks[currBlock]["stims"].length ) 
		throw new FatalError("Something went badly wrong!");

	// Sound
	blocks[currBlock]["stims"][i]["soundPlayed"].play();
	// Text
	$('#printStimP').html("<span style=\"color:"+blocks[currBlock]["stims"][i]["color"]+";\">"+blocks[currBlock]["stims"][i]["stim"]+"</span>");
	startTime = (new Date()).getTime();

	$('body').off('keydown').on('keydown', function(e){
		var codeKey = e.which;
		var isLeft = true;
		// 69=e, 73=i
		if( codeKey === codeLeftKey || codeKey === codeRightKey ) 
		{
			if( codeKey === codeRightKey )
				isLeft = false;
			// correct answer
			if( isLeft === blocks[currBlock]["stims"][i]["isLeft"] )
			{
				$('body').off('keydown');
				endTime = (new Date()).getTime();
				var rt = endTime - startTime;
				$('#printFalseAnswer').css("visibility","hidden");
				totalTimes[currBlock].push(rt);
				printBlank();
			}
			// incorrect answer
			else
			{
				$('#printFalseAnswer').css("visibility","visible");
				answers[currBlock][i] = false;
			}
		}
	});
}

function printBlank()
{
	$('body').off('keydown');
	$('#printStimP').html("");
	i++;
	if( i != blocks[currBlock]["stims"].length )
		setTimeout(printStim, 250);
	else
		begin();
}

function setScreen()
{
	$('body').off();
	if(currBlock==2 || currBlock==3 || currBlock==5 || currBlock==6)
		$("#instructions").html(
			'<div class="col-12 text-center" style="font-size:30px; height:50px; margin-top:0px;">'+
				'<span id="printFalseAnswer" style="visibility:hidden;color:red;">X</span><br/>'+
				'<span id="printStimP"></span>'+
			'</div>');
	else
		$("#instructions").html(
			'<div class="col-12 text-center" style="font-size:30px; height:50px; margin-top:70px;">'+
				'<span id="printFalseAnswer" style="visibility:hidden;color:red;">X</span><br/>'+
				'<span id="printStimP"></span>'+
			'</div>');
	printBlank();
}

function begin()
{
	$('body').off();
	currBlock++;
	if( currBlock < maxBlocks )
	{
		i=-1;
		totalTimes.push([]);
		answer = [];
		for(var numItem=0; numItem < blocks[currBlock]["stims"].length; numItem++)
			answer.push(true);
		answers.push(answer);

		$('body').html(
			'<div class="app mt-5">'+
			    '<div class="row align-items-start" style="padding-left: 1em;padding-right: 1em;padding-top: 0.5em;font-size:30px;">'+
			      '<div class="col-6 text-start" id="cat1">'+
			      	"<span>"+blocks[currBlock]["left"]+"</span>"+
			      '</div>'+
			      '<div class="col-6 text-end" id="cat2">'+
			      	"<span style='float:right;'>"+blocks[currBlock]["right"]+"</span>"+
			      '</div>'+
			    '</div>'+
			    '<div class="row" id="instructions" style="font-size: 16px;padding: 3em;">'+
			    	'<div class="col-12" style="text-align:center;">'+
			       		instructionsBlock[currBlock]+
			    	'</div>'+
			    '</div>'+
			'</div>');


		$('body').on('keydown', function(e){
			if(e.keyCode == codeContinueKey)
				setScreen();
		});
	}
	else
	{
		$("body").html(
			'<div class="container" style="text-align: center;padding-top: 5em;">'+
				'<div class="row" style="background-color: #D0EBE7;border-radius: 50px;display: inline-block;">'+
			      '<div class="col-12" style="text-align:center;padding:1.5em;">'+
			        'Veuillez patienter...'+
			      '</div>'+
				'</div>'+
			'</div>');
		sendToScore();
	}
}

function instructionsWelcome()
{
	$('body').css('cursor', 'default');
	var instructionsWelcomeA = "";
	var instructionsWelcomeB = "";
	// load blocks
	$.ajax(
	{
		url : 'get_blocks.php',
		type : 'POST',
		dataType : "json",
		async : false,
		success : function(data, statut)
		{
			blocks = data;
			for(var s=0; s<blocks.length; s++)
			{
				for(var t=0; t<blocks[s]["stims"].length; t++)
				{
					blocks[s]["stims"][t]["soundPlayed"] = new Howl({
		  				src: [blocks[s]["stims"][t]["sound"]]
					});
				}
			}
		},
		error : function(resultat, statut, error)
		{
			console.log(resultat+" "+statut+" "+error);
		}
	});
	// load informations
	$.ajax(
	{
		url : 'get_informations.php',
		type : 'POST',
		dataType : "json",
		async : false,
		success : function(data, statut)
		{
			maxBlocks = data['nbBlockMax'];
			codeLeftKey = data['leftKey'];
			codeRightKey = data['rightKey'];
			codeContinueKey = data['continueKey'];
			instructionsWelcomeA = data["instructionsWelcomeA"];
			instructionsWelcomeB = data["instructionsWelcomeB"];
  			instructionsBlock = data["instructionsBlock"];
		},
		error : function(resultat, statut, error)
		{
			$('body').html(error);
		}
	});
	// load categories and items
	$.ajax(
	{
		url : 'get_stims.php',
		type : 'POST',
		dataType : "json",
		async : false,
		success : function(data, statut)
		{
			startTimeTotal = (new Date()).getTime();
			// Message welcome
			var htmlContent =
			  '<div class="container" style="padding-top: 1em;text-align: center;">'+
			    '<div class="row">'+
			      '<div class="col-12">'+
			        '<h1 style="color:white;">Exercice des catégories des mots</h1>'+
			      '</div>'+
			      '<div class="col-12">'+
			        '<span style="font-style:italic;color:#CFCFCF;"> Lis attentivement l\'énoncé, puis appuie sur la barre d\'espace pour commencer le test.</span>'+
			      '</div>'+
			    '</div>'+
			  '</div>'+
			  '<div class="container" style="padding-top: 1.3em;width:950px;">'+
			    '<div class="row">'+
			      '<div class="col-12">'+
			        '<span style="color:white;font-size:28px;">Enoncé</span>'+
			      '</div>'+
			      '<div class="col-12" style="background-color: #EDEDED;border-radius: 10px;padding:0.5em;font-style:15px;">'+
			        'Des mots apparaitront un par un au centre de l’écran. Une voix lit également les mots qui apparaissent. Tu dois les classer aussi vite que possible, en faisant le moins d\'erreur possible, dans les catégories situées en haut à gauche et à droite de l’écran.<br/>'+
			        'Pour cela, il faut appuyer sur la touche "e" de ton clavier pour classer un mot dans la catégorie de gauche, et sur la touche "i" de ton clavier pour classer un mot dans la catégorie de droite.'+
			        '<br/>Garde un doigt de ta main gauche sur la touche "e" de ton clavier, et un doigt de ta main droite sur la touche "i" de ton clavier. Tu vas ainsi pouvoir répondre rapidement, car il ne faut pas aller trop lentement.<br/>'+
			        "Attends-toi à faire quelques erreurs parce que tu vas vite. Ce n\’est pas grave. Si tu fais une erreur, une croix rouge apparaitra au dessus du mot. Il faudra alors corriger l'erreur en appuyant sur la bonne touche du clavier.<br/>"+
			        'Voici quelques exemples :'+
			      '</div>'+
			    '</div>'+
			  '</div>';
            htmlContent += 
            	'</div>'+
			  '<div style="text-align:center;">'+
			    '<div class="row">'+
			      '<!--<div class="col-12">'+
			        '<span style="color:white;font-size:28px;">Garde en tête !</span>'+
			      '</div>-->'+
			      '<div>'+
			        '<img src="img/ex.PNG" style="width:70em;">'+
			      '</div>'+
			    '</div>'+
			  '</div>'+
			  
			  '<div class="container" style="padding-top: 1em;text-align: center;color:white;padding-bottom:0.5em; font-size: 15px;">'+
			    '<div class="row">'+
			      '<div class="col-12">'+
			        '<span>Appuie sur la <b>barre d\'espace</b> pour commencer.</span>'+
			      '</div>'+
			    '</div>'+
			  '</div>';

			$('body').html(htmlContent);
		    // Begin the experiment with the space bar pressed
			$('body').on('keydown', function(e){
				if(e.keyCode == codeContinueKey)
					begin();
			});
		},
		error : function(resultat, statut, error)
		{
			$('body').html(error);
		}
	});
}

$(document).ready(function()
{
	$(".container").html(
		'<div class="row" style="background-color: #D0EBE7;border-radius: 50px;display: inline-block;">'+
	      '<div class="col-12" style="text-align:center;padding:1.5em;">'+
	        'Veuillez patienter...'+
	      '</div>'+
		'</div>');
	var obj = 
	{
		"device": device.type,
		"os": device.os
	};
	$.ajax(
	{
		url : 'save_user_info.php',
		type : 'POST',
		dataType : "text",
		data: "data=" + JSON.stringify(obj),
		async : false,
		success : function(data, statut)
		{
			console.log(data);
			if(data=="ok")
			    instructionsWelcome();
		},
		error : function(resultat, statut, error)
		{
			console.log(resultat+" "+statut+" "+error);
			$('body').html(error);
		}
	});
});