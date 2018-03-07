// fs
const fs = require('fs');
// Body-parser
const bodyParser= require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//MongoDb
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
/* on associe le moteur de vue au module «ejs» */
app.set('view engine', 'ejs'); // générateur de template
// Cookie-parser
var cookieParser = require('cookie-parser');
app.use(cookieParser());
// i18n
const i18n = require("i18n");
i18n.configure({ 
   locales : ['fr', 'en'],
   cookie : 'langueChoisie', 
   directory : __dirname + '/locales' 
});
/* Ajouter l'objet i18n à l'objet global «res» */
app.use(i18n.init);

const peupler = require("./modules/peupler");
let util =  require("util");
//Express
const express = require('express');
const app = express();
app.use(express.static('public'));
// Socket.io
const http = require('http');
const server = http.Server(app);
const io = require('./modules/chat_socket').listen(server);


////////////////////////////////////////////////////////// Connexion à MongoDB à au Serveur Node.js
let db // variable qui contiendra le lien sur la BD
MongoClient.connect('mongodb://127.0.0.1:27017', (err, database) => {
	if (err) return console.log(err);
	db = database.db('carnet_adresse');
	// lancement du serveur Express sur le port 8081
	server.listen(8081, () => {
		console.log('connexion à la BD et on écoute sur le port 8081');
	});
});

///////////////////////////////////////////////////// Route /
app.get('/', function (req, res) {
	
		if(req.cookies.langueChoisie == null){
			res.cookie('langueChoisie', 'fr');
		}
		// affiche l'accueil'
	  	res.render('accueil.ejs');
});

///////////////////////////////////////////////////// Route /adresses
app.get('/adresses', function (req, res) {
	let cursor = db.collection('adresse').find().toArray((err, resultat) =>{
		if (err) return console.log(err);
		// affiche la page adresses
		let cle = "";
		let ordre = "";
	  	res.render('adresses.ejs', {adresses: resultat, cle, ordre });
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


///////////////////////////////////////////////////// Route /en ou fr
// Traduire MENU et TH de Tableau!!!!!!!!!
app.get('/:locale(en|fr)',  (req, res) => {
	// Sauver la langue dans un cookie
	res.cookie('langueChoisie', req.params.locale);
	// on récupère le paramètre de l'url pour enregistrer la langue
	res.setLocale(req.params.locale);

	console.log("PARAM: " + req.params.locale);
	//console.log("cookie: langue ", req.cookies.langueChoisie);

	// on peut maintenant traduire
	console.log(res.__('titreSite'));

	res.redirect(req.headers.referer);
});


///////////////////////////////////////////////////// Route /ajax_modifier
app.post('/ajax_modifier', (req, res) => {
    req.body._id = ObjectID(req.body._id);
    console.log(req.body._id);
    // Sauver l'objet dans la BDD
    db.collection('adresse').save(req.body, (err, result) => {
        if (err) return console.log(err);
        res.send(JSON.stringify(req.body));
    });
});

///////////////////////////////////////////////////// Route /ajax_ajouter
app.post('/ajax_ajouter', (req, res) => {
	db.collection('adresse').save(req.body, (err, result) => {
		if (err) return console.log(err);
		console.log(result);
		//ramene à la page Membres
		res.send(JSON.stringify(req.body));
	});
});

///////////////////////////////////////////////////// Route /ajax_detruire
app.post('/ajax_detruire', (req, res) => {
	db.collection('adresse').findOneAndDelete({'_id':ObjectID(req.body.id)}, (err, result) => {
		if (err) return console.log(err);
		//ramene à la page Membres
		res.send(JSON.stringify(req.body));
	});
});

app.get("/chat", (req, result) =>){
	res.render('socket_vue.ejs')
}