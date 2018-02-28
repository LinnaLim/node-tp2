//Express
const express = require('express');
const app = express();
app.use(express.static('public'));
// fs
const fs = require('fs');
// Body-parser
const bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
//MongoDb
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
/* on associe le moteur de vue au module «ejs» */
app.set('view engine', 'ejs'); // générateur de template
// i18n
const i18n = require("i18n")
/* Ajouter l'objet i18n à l'objet global «res» */
app.use(i18n.init);
// Cookie-parser
var cookieParser = require('cookie-parser');
app.use(cookieParser());

const peupler = require("./modules/peupler");
let util =  require("util");

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
		// affiche l'accueil'
	  	res.render('accueil.ejs', {adresses: resultat});
  	});
});

///////////////////////////////////////////////////// Route /membres
app.get('/adresses', function (req, res) {
	let cursor = db.collection('adresse').find().toArray((err, resultat) =>{
		if (err) return console.log(err);
		// affiche la page adresses
		let cle = "";
		let ordre = "";
	  	res.render('adresses.ejs', {adresses: resultat, cle, ordre });
  	});
});

///////////////////////////////////////////////////// Route /detruire:id
app.get('/detruire/:id', (req, res) => {
	let id  = ObjectID(req.params.id);
	// Delete le ID de l'élément
	db.collection('adresse').findOneAndDelete( {'_id': id} ,(err, resultat) => {
		if (err) return res.send(500, err);
		//ramene à la page Membres
		res.redirect('/adresses');
	}) ;
});

///////////////////////////////////////////////////// Route /ajouter
app.get('/ajouter', (req, res) => {
	let infoListe = {"prenom":"","nom":"","telephone":"","courriel":""};
	db.collection('adresse').save( infoListe, (err, result) => {
		if (err) return console.log(err);
		//ramene à la page Membres
		res.redirect('/adresses');
	});
});

///////////////////////////////////////////////////// Route /modifier
app.post('/modifier', (req, res) => {
    //console.log('req.body' + req.body);
    //let util = require("util");
    // Objet avec les champs modifiés
    let oModif = {
        "_id": ObjectID(req.body['_id']),
        prenom: req.body.prenom,
        nom: req.body.nom,
        telephone: req.body.telephone,
        courriel: req.body.courriel
    }    
    // Sauver l'objet dans la BDD
    db.collection('adresse').save(oModif, (err, result) => {
        if (err) return console.log(err);
        //console.log('sauvegarder dans la BD');
        //ramene à la page Membres
        res.redirect('/adresses');
    });
});


///////////////////////////////////////////////////// Route /trier
app.get('/trier/:cle/:ordre', (req, res) => {
    let cle = req.params.cle;
    let ordre = (req.params.ordre == 'asc' ? 1 : -1);
    let cursor = db.collection('adresse').find().sort(cle, ordre).toArray((err, resultat) =>{
        ordre = ordre == 1 ? 'desc' : 'asc';
        res.render('adresses.ejs', {adresses: resultat, cle, ordre });
    });
});

//////////////////////////////////////////////////// Route /peupler
app.get('/peupler', (req, res) => {
	let infoPeupler = peupler();
	db.collection('adresse').insert(infoPeupler, (err, result) => {
		if (err) return console.log(err);
		//ramene à la page Membres
		res.redirect('/adresses');
	});
});

//////////////////////////////////////////////////// Route /vider
app.get('/vider', (req, res) => {
	db.collection('adresse').remove(req.body, (err, result) => {
		if (err) return console.log(err);
		//ramene à la page Membres
		res.redirect('/adresses');
	});
});


//////////////////////////////////////////////////// Route /rechercher
app.post('/rechercher', (req, res) => {
	// Trouver le mot de recherche
	let inputRecherche = req.body.requete;
	// Verifier le texte mit dans le input dans toute les categorie de la BDD
    let requete = { 
    				$or: [ 
    						{ 'prenom': {'$regex': '^' + inputRecherche,  '$options' : 'i' }},
    						{ 'nom': {'$regex': '^' + inputRecherche,  '$options' : 'i' }},
    						{ 'telephone': {'$regex': '^' + inputRecherche,  '$options' : 'i' }},
    						{ 'courriel': {'$regex': '^' + inputRecherche,  '$options' : 'i' }}
    				]
    			};

    // Trouver l'élément chercher dans la BDD
    db.collection('adresse').find(requete).toArray((err, resultat) => {
    	//console.log(resultat);
        if (err) return console.log(err);
        //console.log('sauvegarder dans la BD');
        let cle = "";
		let ordre = "";
		// Affiche la page d'adresses
        res.render('adresses.ejs', {adresses: resultat, cle, ordre });
    });
});


///////////////////////////////////////////////////// Route /profil
app.get('/profil/:id', (req, res) =>{
	let id  = ObjectID(req.params.id);
	let cursor = db.collection('adresse').find({'_id': id}).toArray((err, resultat) =>{
		if (err) return console.log(err);
		// affiche de la page du profil du membre
	  	res.render('profil.ejs', {adresses: resultat});
  	});
});


///////////////////////////////////////////////////// Route /en
app.get('/en', (req, res) => {
	// 'en' est enregistré comme langue
	res.setLocale('en');
	// on en profite pour sauver la langue dans un cookie
	res.cookie('moncookie', 'en');
	// retourne le catalogue
	console.log('res.getCatalog() = ' + res.getCatalog());
	// retourne la langue qui a été choisie
	console.log('res.getLocale() = ' + res.getLocale());
	var bienvenue = 'hello';
	console.log('en= ' + res.__('bienvenue');

});

///////////////////////////////////////////////////// Route /en ou fr
// Traduire MENU et TH de Tableau!!!!!!!!!
app.get('/:locale(en|fr',  (req, res) => {
	// on récupère le paramètre de l'url pour enregistrer la langue
	res.setLocale(req.params.locale);
	// on peut maintenant traduire
	console.log('res.__(leMotAtraduire) = ' + res.__(leMotAtraduire));
});