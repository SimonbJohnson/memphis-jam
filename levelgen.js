function generateLevel(difficulty,players,nodes){
	var level = generateLevelObject(difficulty,players,nodes);
	return level;
}

function generateLevelObject(difficulty,players,totalNodes){
	var level = {'nodes' : [],'players':[]}
	var nodeDifficulty = difficulty*2
	for(i=0;i<totalNodes;i++){
		level.nodes.push({'start':10});
	}

	for(i=0;i<players;i++){
		level.players.push({'connections':[]});
	}

	level.players.forEach(function(p){
		for(i=0;i<totalNodes;i++){
			p.connections.push(0);
		}
	});

	var totalConnections = difficulty;

	var connectionsList = [];

	for(i=0;i<totalNodes;i++){
		connectionsList.push(i);
		if(totalNodes>4){
			connectionsList.push(i);
		}
	}

	var remaining = totalConnections - connectionsList.length;
	for(i=0;i<remaining;i++){
		var newNode = Math.floor(Math.random() * totalNodes);
		connectionsList.push(newNode);
	}

	connectionsList = shuffle(connectionsList);

	level.players.forEach(function(p){
		var direction = Math.floor(Math.random() * 2)*2-1;
		p.connections[connectionsList.pop()] = direction;		
	});

	while(connectionsList.length>0){
		let connection = connectionsList.pop();
		let unassigned = 0;
		while(unassigned<50){
			let randomPlayer = Math.floor(Math.random()*players);
			let direction = Math.floor(Math.random() * 2)*2-1;
			unassigned++;

			if(level.players[randomPlayer].connections[connection]==0){
				level.players[randomPlayer].connections[connection] = direction;
				unassigned = 50;
			}
		}
	}

	level = arrange(level,totalNodes);
	if(levelCheck(level)<3){
		level = generateLevelObject(difficulty,players,totalNodes);
	}

	return level;
}

function arrange(level,nodes){
	level.players.forEach(function(p){
		shift = Math.floor(Math.random()*3);
		p.shift = shift;
		p.connections.forEach(function(c,i){
			level.nodes[i].start += -c*shift;
		});
	});

	return level
}

function levelCheck(level){
	let offs = 0;
	level.nodes.forEach(function(node){
		if(node.start != 10){
			offs++
		}
	});
	return offs;
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

var layouts = [];
layouts.push({'background':'3nodes_1.png','nodes':[{'x':640,'y':240},{'x':640,'y':540},{'x':640,'y':840}]});
layouts.push({'background':'4nodes_1.png','nodes':[{'x':404,'y':441},{'x':741,'y':236},{'x':874,'y':574},{'x':471,'y':878}]});
layouts.push({'background':'5nodes_2.png','nodes':[{'x':640,'y':338},{'x':438,'y':540},{'x':640,'y':540},{'x':843,'y':540},{'x':640,'y':743}]});
layouts.push({'background':'6nodes_1.png','nodes':[{'x':370,'y':360},{'x':550,'y':541},{'x':822,'y':181},{'x':374,'y':888},{'x':728,'y':900},{'x':821,'y':721}]});

var music = [];
var tune = {'interval':208,'tracks':[]};
tune.tracks.push([['piano-ff-042.wav','piano-ff-030.wav'],[],[],[],[],[],[],[],['piano-ff-042.wav','piano-ff-030.wav'],[],[],[],[],[],[],[],['piano-ff-037.wav','piano-ff-025.wav'],[],[],[],[],[],[],[],['piano-ff-040.wav','piano-ff-028.wav'],[],[],[],[],[],[],[]]);
tune.tracks.push([['piano-ff-054.wav'],[],[],[],[],[],[],[],['piano-ff-054.wav'],[],[],[],[],[],[],[],['piano-ff-054.wav'],[],[],[],[],[],[],[],['piano-ff-056.wav'],[],[],[],[],[],[],[]]);
tune.tracks.push([[],['piano-ff-052.wav'],[],[],[],[],[],[],[],['piano-ff-052.wav'],[],[],[],[],[],[],[],['piano-ff-052.wav'],[],[],[],[],[],[],[],['piano-ff-054.wav'],[],[],[],[],[],[]]);


music.push(tune);

var tune = {'interval':208,'tracks':[]};
tune.tracks.push([['piano-ff-042.wav','piano-ff-030.wav'],[],[],[],[],[],[],[],['piano-ff-042.wav','piano-ff-030.wav'],[],[],[],[],[],[],[],['piano-ff-037.wav','piano-ff-025.wav'],[],[],[],[],[],[],[],['piano-ff-040.wav','piano-ff-028.wav'],[],[],[],[],[],[],[]]);
tune.tracks.push([['piano-ff-054.wav'],[],[],[],[],[],[],[],['piano-ff-054.wav'],[],[],[],[],[],[],[],['piano-ff-054.wav'],[],[],[],[],[],[],[],['piano-ff-056.wav'],[],[],[],[],[],[],[]]);
tune.tracks.push([[],['piano-ff-052.wav'],[],[],[],[],[],[],[],['piano-ff-052.wav'],[],[],[],[],[],[],[],['piano-ff-052.wav'],[],[],[],[],[],[],[],['piano-ff-054.wav'],[],[],[],[],[],[]]);
tune.tracks.push([[],[],['piano-ff-049.wav'],[],[],[],[],[],[],[],['piano-ff-049.wav'],[],[],[],[],[],[],[],['piano-ff-049.wav'],[],[],[],[],[],[],[],['piano-ff-049.wav'],[],[],[],[],[]]);

music.push(tune);

var tune = {'interval':208,'tracks':[]};
tune.tracks.push([['piano-ff-042.wav','piano-ff-030.wav'],[],['piano-ff-042.wav','piano-ff-030.wav'],[],['piano-ff-042.wav','piano-ff-030.wav'],[],['piano-ff-042.wav','piano-ff-030.wav'],[],['piano-ff-041.wav','piano-ff-029.wav'],[],['piano-ff-041.wav','piano-ff-029.wav'],[],['piano-ff-041.wav','piano-ff-029.wav'],[],['piano-ff-041.wav','piano-ff-029.wav'],[],['piano-ff-037.wav','piano-ff-025.wav'],[],['piano-ff-037.wav','piano-ff-025.wav'],[],['piano-ff-037.wav','piano-ff-025.wav'],[],['piano-ff-037.wav','piano-ff-025.wav'],[],['piano-ff-044.wav','piano-ff-032.wav'],[],['piano-ff-044.wav','piano-ff-032.wav'],[],['piano-ff-044.wav','piano-ff-032.wav'],[],['piano-ff-044.wav','piano-ff-032.wav'],[]]);
tune.tracks.push([['piano-ff-056.wav'],[],[],[],[],[],[],[],['piano-ff-054.wav'],[],[],[],[],[],[],[],['piano-ff-053.wav'],[],[],[],[],[],[],[],['piano-ff-049.wav'],[],[],[],[],[],[],[]]);
tune.tracks.push([[],[],['piano-ff-056.wav'],[],[],[],[],[],[],[],['piano-ff-054.wav'],[],[],[],[],[],[],[],['piano-ff-053.wav'],[],[],[],[],[],[],[],['piano-ff-049.wav'],[],[],[],[],[]]);
tune.tracks.push([[],[],[],[],['piano-ff-056.wav'],[],[],[],[],[],[],[],['piano-ff-054.wav'],[],[],[],[],[],[],[],['piano-ff-053.wav'],[],[],[],[],[],[],[],['piano-ff-049.wav'],[],[],[]]);
tune.tracks.push([[],[],[],[],[],[],['piano-ff-056.wav'],[],[],[],[],[],[],[],['piano-ff-054.wav'],[],[],[],[],[],[],[],['piano-ff-053.wav'],[],[],[],[],[],[],[],['piano-ff-049.wav'],[]]);

music.push(tune);


