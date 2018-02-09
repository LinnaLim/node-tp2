const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.static('public'));
const bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
const MongoClient = require('mongodb').MongoClient;
/* on associe le moteur de vue au module «ejs» */
app.set('view engine', 'ejs'); // générateur de template



var db // variable qui contiendra le lien sur la BD

MongoClient.connect('mongodb://127.0.0.1:27017/carnet_adresse', (err, database) => {
	if (err) return console.log(err)
	db = database
	// lancement du serveur Express sur le port 8081
	app.listen(8081, () => {
		console.log('connexion à la BD et on écoute sur le port 8081')
	});
});



app.get('/', function (req, res) {
   	fs.readFile( __dirname + "/public/data/" + "membres.json", 'utf8',(err, data) => {
   		if (err) { 
   			return console.error(err);
   		}

        console.log( data );
        let resultat = JSON.parse(data);           
  		res.render('gabarit.ejs', {adresses: resultat});
  	});
});