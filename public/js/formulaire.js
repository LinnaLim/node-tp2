(function (){
	"use strict";
	/////////////////////////////// Bouton Ajouter /////////////////////////////
	let elmBoutonAjouter = document.getElementById('ajouter');
	elmBoutonAjouter.addEventListener('click', (evt) =>{
		//console.log("AJOUTER!!!!!!");
		evt.preventDefault();
		let xhr = new XMLHttpRequest();
		xhr.open('POST', "ajax_ajouter", true);
		let data = {
			"nom" : "",
			"prenom" : "",
			"telephone" : "",
			"courriel" : ""
		}
		let sData = JSON.stringify(data);
		xhr.setRequestHeader('Content-type', 'application/json');
		xhr.send(sData);
		xhr.addEventListener("readystatechange", (evt)=>{
			if(xhr.readyState == 4 && xhr.status == 200){
				let  maReponse = JSON.parse(xhr.responseText);
				let elmTableau = document.querySelector(".tableau");
	        	let ligneTab = document.querySelector(".gabaritTr");
				let clone = ligneTab.cloneNode(true);
				elmTableau.querySelector(".modifier").addEventListener("click", modifier, false);
				elmTableau.querySelector(".detruire").addEventListener("click", detruire, false);
				clone.classList.remove("gabaritTr");
				clone.querySelector("._id").innerText = maReponse._id;
				elmTableau.appendChild(clone);
			}
		}, false);
	});
	/////////////////////////////// Bouton Detruire /////////////////////////////
	let elmBoutonDetruire = document.querySelectorAll('.detruire');
	for(let btn of elmBoutonDetruire){
		btn.addEventListener('click', detruire, false);
	}
	/////////////////////////////// Bouton Modifier /////////////////////////////
	let btnsModif = document.querySelectorAll('.modifier');
	for(let btn of btnsModif){
		btn.addEventListener('click', modifier, false);
	};


	// FONCTION DETRUIRE //
	function detruire (evt){
		evt.preventDefault();
		let xhr = new XMLHttpRequest();
		xhr.open('POST', "ajax_detruire", true);

		let parent = this.parentNode.parentNode;
		let id = parent.querySelector("._id").innerText;
		let data = {
			"id" : id
		}

		let sData = JSON.stringify(data);
		xhr.setRequestHeader('Content-type', 'application/json');
		xhr.send(sData);
		evt.target.removeEventListener('click', detruire, false);
		parent.parentNode.removeChild(parent);
		xhr.addEventListener("readystatechange", traiterRequest, false);
	}
	// FONCTION MODIFIER //
	function modifier (evt){
		evt.preventDefault();
		// Extraction des donnés
		let parent = this.parentNode.parentNode;
		console.log(parent);
		let id = parent.querySelector("._id").innerText;
		console.log(id);
		let prenom = parent.querySelector(".prenom").innerText;
		let nom = parent.querySelector(".nom").innerText;
		let telephone = parent.querySelector(".telephone").innerText;
		let courriel = parent.querySelector(".courriel").innerText;
		//AJAX
		let xhr = new XMLHttpRequest();
		xhr.open('POST', "ajax_modifier", true);

		let data = {
			"prenom" : prenom,
			"nom" : nom,
			"telephone" : telephone,
			"courriel" : courriel,
			"_id" : id
		}

		let sData = JSON.stringify(data);
		xhr.setRequestHeader('Content-type', 'application/json');
		xhr.send(sData);
		xhr.addEventListener("readystatechange", traiterRequest, false);
	}


	function traiterRequest(e)  {
		//console.log("xhr.readyState = " + xhr.readyState);
		//console.log("xhr.status = " + xhr.status);
		if(xhr.readyState == 4 && xhr.status == 200){
			//console.log('ajax fonctionne')
			let  maReponse = JSON.parse(xhr.responseText);
			//console.log(xhr.responseText);
			//console.log(maReponse._id);
		}

	}

	function traiterRequestAjouter(e)  {
		

	}


})();
