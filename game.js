var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 1600,
    backgroundColor: '#ffcc44',
    scene: {
    	init: init,
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function init(data){
    var difficulty = 1;
	if(data.difficulty!==undefined){
		var difficulty = data.difficulty;
	}
	this.level = generateLevel(difficulty);
	this.level.difficulty = difficulty;

	let layoutNum = Math.ceil(difficulty/2);
	let layout = layouts[layoutNum];
	console.log(layout.background);
	this.level.backgroundImage = layout.background;

	this.level.nodes.forEach(function(node,i){
		node.value = node.start;
		node.x = layout.nodes[i].x
		node.y = layout.nodes[i].y
		node.state = 0;
		node.direction = 1;
	});
}

function preload ()
{
	this.load.spritesheet('state_indicator', 
        'assets/state_indicator.png',
        { frameWidth: 64, frameHeight: 64 }
    );
	console.log(this.level.backgroundImage);
    this.load.image(this.level.backgroundImage,'assets/backgrounds/'+this.level.backgroundImage);
}

function create (data){
	let parent = this;
	var level = this.level;

	window.addEventListener('resize', resize);
    resize();
    this.add.image(500, 800, level.backgroundImage);

	let circleGeom = new Phaser.Geom.Circle(0,0, 100);

	level.nodes.forEach(function(node,i){
		node.circle = parent.add.graphics();
		node.circle.fillStyle(0xffffff, 1);
		node.circle.setPosition(node.x,node.y);
		node.circle.fillCircleShape(circleGeom);
		node.circle.scaleX = 3-(node.start/5);
		node.circle.scaleY = 3-(node.start/5);
		node.circle.setInteractive(circleGeom,Phaser.Geom.Circle.Contains);
		node.circle.on('pointerdown', () => {level = onNodeClick(level,i,stateIndicators,parent)}, this);
	});

	level.nodes.forEach(function(node,i){
		let target = parent.add.graphics();
		let circleGeom = new Phaser.Geom.Circle(0,0, 100);
		target.setPosition(node.x,node.y);
		target.lineStyle(10, 0xff0000);
    	target.strokeCircleShape(circleGeom);
    	
	});

	var stateIndicators = addStateIndicators(this,level);
}

function resize() {
    var canvas = game.canvas, width = window.innerWidth, height = window.innerHeight;
    var wratio = width / height, ratio = canvas.width / canvas.height;
 
    if (wratio < ratio) {
        canvas.style.width = width + "px";
        canvas.style.height = (width / ratio) + "px";
    } else {
        canvas.style.width = (height * ratio) + "px";
        canvas.style.height = height + "px";
    }
}

function addStateIndicators(parent,level){
	let stateIndicators = [];

	level.nodes.forEach(function(node){
		let nodeIndicators = [];
		nodeIndicators[0] = parent.add.sprite(node.x-100, node.y, 'state_indicator');
		nodeIndicators[0].setFrame(1);
		nodeIndicators[1] = parent.add.sprite(node.x, node.y-100, 'state_indicator');
		nodeIndicators[2] = parent.add.sprite(node.x+100, node.y, 'state_indicator');
		nodeIndicators.forEach(function(ind,i){
			ind.scaleX = 0.5;
    		ind.scaleY = 0.5;
		});
		stateIndicators.push(nodeIndicators);
    	
	});
	return stateIndicators;
}

function onNodeClick(level,i,stateIndicators,parent){
	let node = level.nodes[i];
	let shift = node.connections;
	level.nodes[i].state += node.direction;
	shift.forEach(function(s,j){
		level.nodes[j].value += s * node.direction;
		level.nodes[j].circle.scaleX = 3-(level.nodes[j].value/5);
		level.nodes[j].circle.scaleY = 3-(level.nodes[j].value/5);
	});
	if(level.nodes[i].state==0){
		level.nodes[i].direction = 1;
	}
	if(level.nodes[i].state==2){
		level.nodes[i].direction = -1;
	}
	stateIndicators[i].forEach(function(indicator){
		indicator.setFrame(0);
	});
	stateIndicators[i][level.nodes[i].state].setFrame(1);
	levelWin(parent,level);
	return level;
}

function levelWin(parent,level){
	let win = true;
	level.nodes.forEach(function(node){
		if(node.value!=10){
			win=false;
		}
	});
	if(win){
		parent.time.delayedCall(2000, function(){
			parent.scene.restart({'difficulty':level.difficulty+1});
		});
	}
}

function update ()
{

}