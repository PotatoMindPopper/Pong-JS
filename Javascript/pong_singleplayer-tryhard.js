//Copyright by Quinten Koehorst and Jeppe Vonk
//In dit document staat de code om de moeilijke singleplayer van Pong te spelen.
//De aanpassingen die zijn toegepast zijn het aanpassen van de variabelen en extra code om het spel te laten stoppen bij 10. 

// selecteer het canvas/speelbeeld
const cvs = document.getElementById("pong");
const ctx = cvs.getContext("2d");

//maak de speler zijn/haar stok
const speler = {
	x : 0,
	y : cvs.height/2 - 100/2,
	width : 10,
	height : 100,
	color : "white",
	score : 0
}

//maak de computer zijn/haar stok
const com = {
	x : cvs.width - 10,
	y : cvs.height/2 - 100/2,
	width : 10,
	height : 100,
	color : "white",
	score : 0
}

//maak de bal
const bal = {
	x : cvs.width/2,
	y : cvs.height/2,
	radius : 10,
	speed : 5,
	velocityX : 5,
	velocityY : 5,
	color : "white"
}

//een functie om een vierkant te maken
function tekenVierkant(x,y,w,h,color) {
	ctx.fillStyle = color;
	ctx.fillRect(x,y,w,h);
}

//maak het net
const net = {
	x : cvs.width/2 - 1,
	y : 0,
	width : 2,
	height : 10,
	color : "white"
}

//functie om het net daadwerkelijk te tekenen
function tekenNet() {
	for(let i = 0; i <= cvs.height; i+=15) {
		tekenVierkant(net.x, net.y + i, net.width, net.height, net.color);
	}
}

//functie om een cirkel te tekenen
function tekenCirkel(x,y,r,color) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x,y,r,0,Math.PI*2,false);
	ctx.closePath();
	ctx.fill();
}

//functie om tekst te plaatsen of te typen
function tekenTekst(text,x,y,color) {
	ctx.fillStyle = color;
	ctx.font = "45px fantasy";
	ctx.fillText(text,x,y);
}

//dit is om ervoor te zorgen dat alles ingeladen wordt.
function render() {
	//dit is om een zwarte achtergrond te tekenen
	tekenVierkant(0, 0, cvs.width, cvs.height, "black");
	
	//dit is om het net daadwerkelijk te tekenen door de functie aan te roepen.
	tekenNet();
	
	//de score van beide personen te tekenen.
	tekenTekst(speler.score,cvs.width/4,cvs.height/5,"white");
	tekenTekst(com.score,3*cvs.width/4,cvs.height/5,"white");	
	
	//de stokken van beide personen te tekenen.
	tekenVierkant(speler.x, speler.y, speler.width, speler.height, speler.color);
	tekenVierkant(com.x, com.y, com.width, com.height, com.color);
	
	//de bal tekenen door de functie van de bal aan te roepen.
	tekenCirkel(bal.x, bal.y, bal.radius, bal.color);

//AANPASSING: HET GAME OVER SCHERM IS TOEGEVOEGD OM ERVOOR TE ZORGEN DAT ER TEKST WORDT GETOOND, OM DE SPELER DUIDELIJK TE MAKEN WAT ER GEBEURD BIJ EEN SCORE VAN 10.	
	//het "Game over" scherm
	if(com.score >= 10 || speler.score >= 10) {
		//om de score op het einde weer te geven
		tekenTekst('Het spel is afgelopen.', 15, 125, 'grey');
		tekenTekst('Uw score is: '+speler.score, 15, 165, 'grey');
		tekenTekst('De score van de computer is: '+com.score, 15, 205, 'grey');
		tekenTekst('Druk op F5 om', 0, 300, 'grey');
		tekenTekst('nieuw spel te starten', 0, 350, 'grey');
//AANPASSING: MET DIT COMMANDO WORDT DE CODE STOP GEZET, DIT ZORGT ERVOOR DAT HET SPEL DAADWERKELIJK STOPT BIJ 10.
		//om het spel stop te zetten
		clearInterval(interval);
	}
	else {
		return;
	}	
}

//dit zorgt ervoor dat de speler daarwerkelijk zijn/haar stok kan gebruiken.
cvs.addEventListener("mousemove",beweegStok);

function beweegStok(evt) {
	let rect = cvs.getBoundingClientRect();
	
	speler.y = evt.clientY - rect.top - speler.height/2;
}

//dit is om te kijken of er een botsing plaats vindt met de stok en de bal.
function botsing(b,p) {
	b.top = b.y - b.radius;
	b.bottom = b.y + b.radius;
	b.left = b.x - b.radius;
	b.right = b.x + b.radius;
	
	p.top = p.y;
	p.bottom = p.y + p.height;
	p.left = p.x;
	p.right = p.x + p.width;
	
	return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

//dit zorgt ervoor dat de bal weer in het midden wordt geplaatst.
function resetBal() {
	bal.x = cvs.width/2;
	bal.y = cvs.height/2;
	
	bal.speed = 5;
	bal.velocityX = - bal.velocityX;
}

//deze functie zorgt ervoor dat alles wordt geüpdate: zoals positie, beweging, score, etc.
function update() {
	bal.x += bal.velocityX;
	bal.y += bal.velocityY;
	
	//dit is een makkelijke AI/computer om ervoor te zorgen dat de computer zijn/haar stok kan bewegen en een beetje tegenstand kan bieden.
	let computerLevel = 0.1;
	com.y += (bal.y - (com.y + com.height/2)) * computerLevel;
	
	if(bal.y + bal.radius > cvs.height || bal.y - bal.radius < 0) {
		bal.velocityY = - bal.velocityY;
	}
	
	let player = (bal.x < cvs.width/2) ? speler : com;
	
	if(botsing(bal,player)) {
		//waar de bal, de speler raakt.
		let collidePoint = bal.y - (player.y + player.height/2);
		
		//normalizatie ????????????
		collidePoint = collidePoint/(player.height/2);
		
		//bereken de hoek in Radialen.
		let angleRad = collidePoint * Math.PI/4;
		
		//X positie van de bal wanneer deze geraakt wordt.
		let direction = (bal.x < cvs.width/2) ? 1 : -1;
		
		//verander de snelheid/richting van X en Y    ?????????
		bal.velocityX = direction * bal.speed * Math.cos(angleRad);
		bal.velocityY =             bal.speed * Math.sin(angleRad);
		
		//iedere keer als de bal de stok raakt, wordt de snelheid van de bal verhoogt met 0,5.
		bal.speed += 0.5;
	}
	
	//update de score
	if(bal.x - bal.radius < 0) {
		//de computer wint, dus krijgt hij/zij een punt extra.
		com.score++;
		resetBal();
	}
	else if (bal.x + bal.radius > cvs.width) {
		//the speler wint, dus krijgt hij/zij een punt extra.
		speler.score++;
//AANPASSING: ER IS EEN MOEILIJKHEIDSGRAAT TOEGEVOEGD. ALS DE SPELER SCOORT, DAN WORDT HET SPEL MOEILIJKER.
		update.computerLevel += 0.1; //dit zorgt ervoor dat het spel moeilijker wordt naarmate de speler meer punten haalt.
		resetBal();
	}
}

//game initialisatie, oftewel de voorbereiding van de game. Ook zorgt dit ervoor dat het spel blijft draaien.
function game() {
	update();
	render();
}

//dit is om te zorgen dat de game in een cirkel wordt gezet, waardoor de code herhaalt wordt.
const framePerSecond = 50;
//AANPASSING: ER IS EEN VARIABELE VOOR DE INTERVAL TOEGEVOEGD. DIT IS GEDAAN, VANWEGE DAT WE CLEARINTERVAL BIJ 10 MOETEN KUNNEN DOEN. DAT KON IN ONZE OGEN ALLEEN MET HET AANROEPEN VAN EEN VARIABELEN. 
var interval = setInterval(game,1000/framePerSecond);