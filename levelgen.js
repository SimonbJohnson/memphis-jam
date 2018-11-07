function generateLevel(difficulty){
	var level = generateLevelObject(difficulty);
	return level;
}

function generateLevelObject(difficulty){
	var level = {'nodes' : []}
	var totalNodes = Math.ceil(difficulty/2)+2
	var nodeDifficulty = difficulty*2
	for(i=0;i<totalNodes;i++){
		level.nodes.push({'start':10,'connections':[]});
	}
	level.nodes.forEach(function(n){
		for(i=0;i<totalNodes;i++){
			n.connections.push(0);
		}
	});
	var minConnections = totalNodes < 5 ? 1 : 2;
	var maxConnections = Math.ceil(totalNodes/2+1);
	var totalConnections = Math.ceil(totalNodes * (minConnections+maxConnections)/(1.8+0.4*(difficulty % 2)));

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
	for(i=0;i<totalNodes;i++){
		var direction = Math.floor(Math.random() * 2)*2-1;
		level.nodes[i].connections[connectionsList.pop()] = direction;
		if(totalNodes>4){
			var direction = Math.floor(Math.random() * 2)*2-1;
			level.nodes[i].connections[connectionsList.pop()] = direction;
		}
	}
	while(connectionsList.length>0){
		var randomNode = Math.floor(Math.random()*totalNodes);
		var direction = Math.floor(Math.random() * 2)*2-1;
		level.nodes[randomNode].connections[connectionsList.pop()] = direction;
	}
	level = arrange(level,totalNodes);

	return level;
}

function arrange(level,nodes){
	level.nodes.forEach(function(n){
		shift = Math.floor(Math.random()*3);
		n.connections.forEach(function(c,i){
			level.nodes[i].start += -c*shift;
		});
	});

	return level
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

var layouts = [{}];
layouts.push({'background':'3nodes_1.png','nodes':[{'x':500,'y':450},{'x':500,'y':800},{'x':500,'y':1150}]});
layouts.push({'background':'4nodes_1.png','nodes':[{'x':150,'y':150},{'x':650,'y':350},{'x':500,'y':850},{'x':250,'y':1300}]});
layouts.push({nodes:[{'x':200,'y':200},{'x':600,'y':200},{'x':200,'y':400},{'x':600,'y':400},{'x':400,'y':300}]});
