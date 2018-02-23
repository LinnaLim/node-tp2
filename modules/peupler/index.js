"use strict";
// Chercher le fichier avec le tablaux
const tableau = require("./tableaux.js");

const maxPrenom = tableau.tabPrenom.length;
const maxNom = tableau.tabNom.length;
const maxIndicatif = tableau.tabIndicatif.length;
const maxDomaine = tableau.tabDomaine.length;

const peupler = () =>{
	//console.log("ok");
	let liste = [];
	// Randomize une liste de 5 membres
	for (let j=0; j<5; j++){

		let personne = {};
		// choisir un prénom au hazard
		let position = Math.floor(Math.random() * maxPrenom);
		personne.prenom = tableau.tabPrenom[position];

		// choisir un nom au hazard
		position = Math.floor(Math.random() * maxNom);
		personne.nom = tableau.tabNom[position];

		// choisir un indicatif au hazard et telephone au hazard
		position = Math.floor(Math.random() * maxIndicatif);
		personne.telephone = tableau.tabIndicatif[position];
		for (let i=0; i<7; i++){
			if (i==0 || i == 3){
				personne.telephone += "-" + Math.floor(Math.random() * 9).toString();
			} else{
				personne.telephone += Math.floor(Math.random() * 9).toString();
			}
			
		}

		// choisir un domaine au hazard
		position = Math.floor(Math.random() * maxDomaine);
		personne.courriel = personne.nom + personne.prenom + tableau.tabDomaine[position];

		liste.push(personne);
	}

	return liste;
}

module.exports = peupler;