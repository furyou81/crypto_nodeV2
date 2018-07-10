var http = require('http');
var url = require('url');
var querystring = require('querystring'); // recupere params GET
var EventEmitter = require('events').EventEmitter; // pour emettre ses propres evenements
var bjr = require('testmodule');

var jeu = new EventEmitter();

// on demarre le server http
// req contient les parametres de la requete
// res contient les resultats de la requete
var server = http.createServer(function(req, res) {
	var page = url.parse(req.url).pathname; // on recupere l'url pour le rooter
	console.log(page);
	var a = "";
	var unknowUrl = 0;
	res.writeHead(200, {"Content-Type": "text/html"}); // type MIME
	if (page == '/') {
		a = "acceuil";
	} else if (page == "/test"){
		a = "test";
		jeu.emit('test', 'you loose'); // premier param = nom de l'event et on peut mettre autant de params qu'on veut (message...)
	}
	else if (page == "/testGET") {
		var params = querystring.parse(url.parse(req.url).query);
		if ('prenom' in params && 'nom' in params) { // tester si le tableaux de params contient bien ces entrees
			a = params['prenom'] + " " + params['nom'];
		}
	}
	else {
		res.writeHead(404);
		res.end();
		unknowUrl = 1;
	}
	// res.write pour ecrire le reponse en plusieurs temps
	if (!unknowUrl) {
		res.write('<!DOCTYPE html>' +
		'<html>' + 
			'<head>' +
				'<meta charset="utf-8"/>' +
				'<title> Ma page </title>' +
			'</head>' +
			'<body>' +
				'<p> Hello this is <strong> html :</strong>' + a + '</p>' +
			'</body>' +
		'</html>');
	
		res.end(); // res.end doit tjrs etre appele en dernier pour terminer la reponse
	}
});

jeu.on('test', function(message) {
	console.log(message);
});

server.on('close', function() {
	console.log('closing');
})

bjr.bonjour();
server.listen(8080);

//server.close(function() {
//	console.log('close2');
//}); // close server
