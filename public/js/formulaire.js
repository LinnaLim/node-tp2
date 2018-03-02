(function (){

	// Notre code JavaScript pour effectuer un transfert AJAX
	let elmBouton = document.getElementById('testAJAX');
	elmBouton.addEventListener('click', ()=>{
		console.log('ok');
		xhr = new XMLHttpRequest();
		xhr.open('POST', "ajax_modifier", true);
		data = {
			"nom" : "AAAA",
			"prenom" : "BBBB",
			"telephone" : "CCCC",
			"courriel" : "DDDD",
			"_id" : "5a96b0beaaea131f508700e8"
		}
		console.log(data);
		sData = JSON.stringify(data);
		xhr.setRequestHeader('Content-type', 'application/json');
		xhr.send(sData);
		xhr.addEventListener("readystatechange", traiterRequest, false);
	});



	let btnsModif = document.querySelectorAll('.modifier');
	console.log(btnsModif)
	//let formModif = document.getElementById('formModif');
	for(let btn of btnsModif){
		btn.addEventListener('click', (evt) =>{
			evt.preventDefault();
			// Extraction des donnés
			let parent = btn.parentNode.parentNode;
			console.log(parent);
			let id = parent.querySelector("._id").innerText;
			console.log(id);
			let prenom = parent.querySelector(".prenom").innerText;
			let nom = parent.querySelector(".nom").innerText;
			let telephone = parent.querySelector(".telephone").innerText;
			let courriel = parent.querySelector(".courriel").innerText;

			//AJAX
			xhr = new XMLHttpRequest();
			xhr.open('POST', "ajax_modifier", true);

			data = {
				"prenom" : prenom,
				"nom" : nom,
				"telephone" : telephone,
				"courriel" : courriel,
				"_id" : id
			}

			sData = JSON.stringify(data);
			xhr.setRequestHeader('Content-type', 'application/json');
			xhr.send(sData);
			xhr.addEventListener("readystatechange", traiterRequest, false);
			
		});
	};


	function traiterRequest(e)  {
		console.log("xhr.readyState = " + xhr.readyState);
		console.log("xhr.status = " + xhr.status);
		if(xhr.readyState == 4 && xhr.status == 200){
			console.log('ajax fonctionne')
			let  maReponse = JSON.parse(xhr.responseText);
			console.log(xhr.responseText);
			console.log(maReponse._id);
		}
	}


})();
