const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.static('public'));
const bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
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

///////////////////////////////////////////////////// Route /membres
app.get('/membres', function (req, res) {
	let cursor = db.collection('adresse').find().toArray((err, resultat) =>{
		if (err) return console.log(err);
		//console.log(JSON.stringfy(resultat));
		// transfert du contenu vers la vue index.ejs (renders)
		// affiche le contenu de la BD 
		let cle = "";
		let ordre = "";
	  	res.render('membres.ejs', {adresses: resultat, cle, ordre });
  	});
});

///////////////////////////////////////////////////// Route /detruire:id
app.get('/detruire/:id', (req, res) => {
	let id  = ObjectID(req.params.id);
	// Delete le ID de l'élément
	db.collection('adresse').findOneAndDelete( {'_id': id} ,(err, resultat) => {
		if (err) return res.send(500, err);
		//ramene à la page Membres
		res.redirect('/membres');
	}) ;
});

///////////////////////////////////////////////////// Route /ajouter
app.get('/ajouter', (req, res) => {
	let infoListe = {"prenom":"","nom":"","telephone":"","courriel":""};
	db.collection('adresse').save( infoListe, (err, result) => {
		if (err) return console.log(err);
		res.redirect('/membres');
	});
});

///////////////////////////////////////////////////// Route /modifier
app.post('/modifier', (req, res) => {
    //console.log('req.body' + req.body);
    var util = require("util");

    var oModif = {
        "_id": ObjectID(req.body['_id']),
        prenom: req.body.prenom,
        nom: req.body.nom,
        telephone: req.body.telephone,
        courriel: req.body.courriel
    }    

    db.collection('adresse').save(oModif, (err, result) => {
        if (err) return console.log(err);
        console.log('sauvegarder dans la BD');
        res.redirect('/membres');
    });
});


///////////////////////////////////////////////////// Route /trier
app.get('/trier/:cle/:ordre', (req, res) => {
    let cle = req.params.cle;
    let ordre = (req.params.ordre == 'asc' ? 1 : -1);
    let cursor = db.collection('adresse').find().sort(cle, ordre).toArray(function (err, resultat) {
        ordre = ordre == 1 ? 'desc' : 'asc';
        res.render('membres.ejs', {adresses: resultat, cle, ordre });
    });
});