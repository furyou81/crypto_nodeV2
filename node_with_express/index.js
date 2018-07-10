var express = require('express');

var app = express();

app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send('Acceuil');
});

app.get('/root1', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send('weqrheg');
});

app.get('/etage/:etagenum/chambre', function(req, res) {
    res.render('chambre.ejs', {etage: req.params.etagenum});
});

app.get('/etages/:etagenum/:chambre', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Vous etes a la chambre: ' + req.params.etagenum + '/' + req.params.chambre);
});


// pour gerer les erreurs 404
app.use(function(req, res, next) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable');
});

app.listen(8080);