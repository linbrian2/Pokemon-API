var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var pokeDataUtil = require("./poke-data-util");
var _ = require("underscore");
var app = express();
var PORT = 3000;

// Restore original data into poke.json. 
// Leave this here if you want to restore the original dataset 
// and reverse the edits you made. 
// For example, if you add certain weaknesses to Squirtle, this
// will make sure Squirtle is reset back to its original state 
// after you restard your server. 
pokeDataUtil.restoreOriginalData();

// Load contents of poke.json into global variable. 
var _DATA = pokeDataUtil.loadData().pokemon;

/// Setup body-parser.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(req, res) {
    var contents = "<html>\n<body>\n<table>";
    for (var i in _DATA) {
    	var id = parseInt(i) + 1;
    	contents += "<tr><td>" + id + "</td><td><a href=\"/pokemon/" + id + "\">" + _DATA[i].name + "</a></td></tr>\n"
    }
    contents += "</table>\n</body>\n</html>"
    res.send(contents);
});

app.get("/pokemon/:pokemon_id", function(req, res) {
    if (req.params.pokemon_id <= 0 || req.params.pokemon_id > _DATA.length) {
    	res.send("Error: Pokemon not found.");
    }
    else {
    	var contents = "<html>\n<body>\n<table>";
    	for (var i in _DATA[req.params.pokemon_id - 1]) {
    		contents += "<tr><td>" + i + "</td><td>" + JSON.stringify(_DATA[req.params.pokemon_id - 1][i]) + "</td></tr>\n";
    	}
    	contents += "</table>\n</body>\n</html>"
    	res.send(contents);
    }
});

app.get("/pokemon/image/:pokemon_id", function(req, res) {
    if (req.params.pokemon_id <= 0 || req.params.pokemon_id > _DATA.length) {
    	res.send("Error: Pokemon not found.");
    }
    else {
    	for(var i in _DATA){
    		if(_DATA[i].id == req.params.pokemon_id){
    			res.send("<html><body><img src=\"" + _DATA[i].img + "\"></body></html>");
    		}
    	}
    }
});

app.get("/api/id/:pokemon_id", function(req, res) {
    var _id = parseInt(req.params.pokemon_id);
    var result = _.findWhere(_DATA, { id: _id })
    if (!result) return res.json({});
    res.json(result);
});

app.get("/api/evochain/:pokemon_name", function(req, res) {
	var evochain = [];
	for(var i in _DATA){
		if(_DATA[i].name == req.params.pokemon_name){
			var pokemon = _DATA[i];
			evochain.push(pokemon.name)
			if (pokemon.prev_evolution) {
				for (var j in pokemon.prev_evolution) {
					evochain.push(pokemon.prev_evolution[j].name)
				}
			}
			if (pokemon.next_evolution) {
				for (var j in pokemon.next_evolution) {
					evochain.push(pokemon.next_evolution[j].name)
				}			
			}
		}
	}
	res.send(evochain.sort());
});

app.get("/api/type/:type", function(req, res) {
	var pokemonOfType = [];
	for(var i in _DATA){
		var pokemon = _DATA[i];
		for (var j in pokemon.type) {
			if(pokemon.type[j] == req.params.type){
				pokemonOfType.push(pokemon.name)
			}
		}
	}
	res.send(pokemonOfType);
});

app.get("/api/type/:type/heaviest", function(req, res) {
	heaviestWeight = 0;
	heaviestPoke = "";
	for(var i in _DATA){
		var pokemon = _DATA[i];
		for (var j in pokemon.type) {
			if(pokemon.type[j] == req.params.type){
				if (parseInt(pokemon.weight) > heaviestWeight) {
					heaviestWeight = parseInt(pokemon.weight);
					heaviestPoke = pokemon.name;
				}
			}
		}
	}
	if (heaviestPoke == "") {
		res.send({});
	}
	else {
		res.send({"name": heaviestPoke, "weight": heaviestWeight});
	}
});

app.post("/api/weakness/:pokemon_name/add/:weakness_name", function(req, res) {
    var PokemonAddedTo = {};
    var weaknessExists = false;
    for(var i in _DATA) {
    	if (_DATA[i].name == req.params.pokemon_name) {
    		for (var j in _DATA[i].weaknesses) {
    			if(_DATA[i].weaknesses[j] === req.params.weakness_name) {
    				weaknessExists = true;
    			}
    		}
    		if (!weaknessExists) {
    			_DATA[i].weaknesses.push(req.params.weakness_name)
    			pokeDataUtil.saveData(_DATA);
    		}
    		PokemonAddedTo = {"name": _DATA[i].name, "weaknesses": _DATA[i].weaknesses};
    	}
    }
    res.send(PokemonAddedTo)
});


app.delete("/api/weakness/:pokemon_name/remove/:weakness_name", function(req, res) {
	var PokemonDeletedFrom = {};
	for(var i in _DATA) {
		if (_DATA[i].name == req.params.pokemon_name) {
			for (var j in _DATA[i].weaknesses) {
				if(_DATA[i].weaknesses[j] === req.params.weakness_name) {
					_DATA[i].weaknesses.splice(j, 1);
					pokeDataUtil.saveData(_DATA);
				}
			}
			PokemonDeletedFrom = {"name": _DATA[i].name, "weaknesses": _DATA[i].weaknesses};
		}
	}
    res.send(PokemonDeletedFrom)
});


// Start listening on port PORT
app.listen(PORT, function() {
	console.log('Server listening on port:', PORT);
});

// DO NOT REMOVE (for testing purposes)
exports.PORT = PORT
