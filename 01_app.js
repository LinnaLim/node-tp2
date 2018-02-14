const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.static('public'));
const bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
const MongoClient = require('mongodb').MongoClient;
/* on associe le moteur de vue au module «ejs» */
app.set('view engine', 'ejs'); // générateur de template


////////////////////////////////////////////////////////// Connexion à MongoDB à au Serveur Node.js
let db // variable qui contiendra le lien sur la BD
MongoClient.connect('mongodb://127.0.0.1:27017', (err, database) => {
	if (err) return console.log(err);
	db = database.db('carnet_adresse');
	// lancement du serveur Express sur le port 8081
	app.listen(8081, () => {
		console.log('connexion à la BD et on écoute sur le port 8081');
	});
});

///////////////////////////////////////////////////// Route /
app.get('/', function (req, res) {
	let cursor = db.collection('adresse').find().toArray((err, resultat) =>{
		if (err) return console.log(err);
		//console.log(JSON.stringfy(resultat));
		// transfert du contenu vers la vue index.ejs (renders)
		// affiche le contenu de la BD 
	  	res.render('accueil.ejs', {adresses: resultat});
  	});
});

///////////////////////////////////////////////////// Route /formulaire
app.get('/formulaire', function (req, res) {
	let cursor = db.collection('adresse').find().toArray((err, resultat) =>{
		if (err) return console.log(err);
		//console.log(JSON.stringfy(resultat));
		// transfert du contenu vers la vue index.ejs (renders)
		// affiche le contenu de la BD 
	  	res.render('formulaire.ejs', {adresses: resultat});
  	});
})

///////////////////////////////////////////////////// Route /membres
app.get('/membres', function (req, res) {
	let cursor = db.collection('adresse').find().toArray((err, resultat) =>{
		if (err) return console.log(err);
		//console.log(JSON.stringfy(resultat));
		// transfert du contenu vers la vue index.ejs (renders)
		// affiche le contenu de la BD 
	  	res.render('membres.ejs', {adresses: resultat});
  	});
})