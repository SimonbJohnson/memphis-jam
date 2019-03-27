function mod(n, m) {
  return ((n % m) + m) % m;
}

class IntroScene extends Phaser.Scene {

	constructor (){
		super({ key: 'introScene'})
	}

	preload(){
		this.load.image('intro','assets/backgrounds/intro.png');
	}

	create(){

		let parent = this;

	    resize();		
		this.add.image(540, 540, 'intro');

		parent.input.keyboard.on('keydown', function (event) {
			if(!isNaN(event.key)){
				var key = parseInt(event.key);
				if(key==1){
					levelController(parent);
				}
			};
		});
	}
}

class LoadScene extends Phaser.Scene {
	constructor (){
		super({ key: 'loadScene'})
	}

	preload(){
		this.load.image('start','assets/backgrounds/start.png');
	}

	create(){

		let parent = this;
		//window.addEventListener('resize', resize);
	    resize();		
		this.add.image(540, 540, 'start');

		parent.input.keyboard.on('keydown', function (event) {
			if(!isNaN(event.key)){
				var key = parseInt(event.key);
				if(key==1){
					levelController(parent);
				}
			};
		});
	}	
}

class PlayScene extends Phaser.Scene {

	constructor ()
	    {
	        super({ key: 'playScene' });
	    }

	init(data){
		let layout = layouts[data.layout];
		let nodeCount = layout.nodes.length;
		this.level = generateLevel(data.difficulty,data.players,nodeCount);
		

		this.level.backgroundImage = layout.background;
		this.level.music = music[data.music];
		this.level.music.delta = 0;
		this.level.music.position = 0;

		this.level.nodes.forEach(function(node,i){
			node.value = node.start;
			node.x = layout.nodes[i].x
			node.y = layout.nodes[i].y
			node.state = 0;
			node.direction = 1;
		});

		this.level.players.forEach(function(p){
			p.state = 0;
			p.direction = 1;
		});
	}

	preload ()
	{

		var parent = this;

	    this.load.spritesheet('state_indicator', 
	        'assets/states_markers.png',
	        { frameWidth: 64, frameHeight: 64 }
	    );

	    this.load.image(this.level.backgroundImage,'assets/backgrounds/'+this.level.backgroundImage);

	    var samples = [];
	    this.level.music.tracks.forEach(function(track){
	    	track.forEach(function(beat){

	    		if(beat.length>0){
	    			beat.forEach(function(sample){
	    				if(samples.indexOf(sample)==-1){
	    					samples.push(sample);
	    				}
	    			});
	    		}
	    	});
	    });
	    samples.forEach(function(sample){
	    	parent.load.audio(sample,'assets/samples/'+sample);
	    });
	}

	create (data){
		let parent = this;
		var level = this.level;
		//window.addEventListener('resize', resize);
	    resize();
	    this.add.image(540, 540, level.backgroundImage);

		let circleGeom = new Phaser.Geom.Circle(0,0, radius);

		level.nodes.forEach(function(node,i){
			node.circle = parent.add.graphics();
			node.circle.fillStyle(0xffffff, 1);
			node.circle.setPosition(node.x,node.y);
			node.circle.fillCircleShape(circleGeom);
			node.circle.scaleX = 3-(node.start/5);
			node.circle.scaleY = 3-(node.start/5);
			//node.circle.setInteractive(circleGeom,Phaser.Geom.Circle.Contains);
			//node.circle.on('pointerdown', () => {level = onNodeClick(level,i,stateIndicators,parent)}, this);
		});

		level.nodes.forEach(function(node,i){
			let target = parent.add.graphics();
			let circleGeom = new Phaser.Geom.Circle(0,0, radius);
			target.setPosition(node.x,node.y);
			target.lineStyle(10, 0xff0000);
	    	target.strokeCircleShape(circleGeom);
	    	
		});

		level = this.addStateIndicators(this,level);

		parent.input.keyboard.on('keydown', function (event) {
			if(!isNaN(event.key)){
				var key = parseInt(event.key);
				if(key<6 && keys[key]==false){
					keys[key] = true;
					parent.onNodeClick(level,key-1,level.players[key-1].stateIndicators,parent)
				}
			};
		});
		parent.input.keyboard.on('keyup', function (event) {
			if(!isNaN(event.key)){
				var key = parseInt(event.key);
				if(key<6){
					keys[key] = false;
				}
			};
		});	
	}


	update (time, delta)
	{
		var parent = this;
		var music = this.level.music;
		music.delta+=delta;
		if(music.delta>music.interval){
			music.delta=0;
			music.tracks.forEach(function(track,i){
				var shiftPosition = music.position;
				if(i>0){
					shiftPosition = music.position+parent.level.players[i-1].state-parent.level.players[i-1].shift;
				}
				var beat = track[mod(shiftPosition, 32)];
				beat.forEach(function(sample){
					parent.sound.play(sample);
				});
			});
			music.position++;
		}
	}

	levelWin(parent,level){
		let win = true;
		level.nodes.forEach(function(node){
			if(node.value!=10){
				win=false;
			}
		});
		if(win){
			parent.time.delayedCall(2000, function(){
				levelController(parent);
			});
		}
	}

	onNodeClick(level,i,stateIndicators,parent){
		let player = level.players[i];
		let shift = player.connections;
		level.players[i].state += player.direction;
		shift.forEach(function(s,j){
			level.nodes[j].value += s * player.direction;
			level.nodes[j].circle.scaleX = 3-(level.nodes[j].value/5);
			level.nodes[j].circle.scaleY = 3-(level.nodes[j].value/5);
		});
		if(level.players[i].state==0){
			level.players[i].direction = 1;
		}
		if(level.players[i].state==2){
			level.players[i].direction = -1;
		}
		let state = level.players[i].state;
		// now add a blank state indicator to image.  Use same system as before, but with blanks rather than moving image.
		player.stateIndicators.forEach(function(indicators){
			indicators.forEach(function(indicator){
				indicator.setFrame(0);
			})
		});
		player.stateIndicators.forEach(function(indicators){
			indicators[state].setFrame(i+1);
		});
		this.levelWin(parent,level);
		return level;
	}

	addStateIndicators(parent,level){
		let offset = 16;
		level.players.forEach(function(player,i){
			player.stateIndicators = [];
			player.connections.forEach(function(c,j){
				if(c!=0){
					let nodeIndicators = [];
					let angle = (-90 + offset*i) * radians;
					nodeIndicators[0] = parent.add.sprite(level.nodes[j].x+Math.sin(angle)*radius, level.nodes[j].y-Math.cos(angle)*radius, 'state_indicator');
					nodeIndicators[0].setFrame(i+1);
					angle = (0 + offset*i) * radians;
					nodeIndicators[1] = parent.add.sprite(level.nodes[j].x+Math.sin(angle)*radius, level.nodes[j].y-Math.cos(angle)*radius, 'state_indicator');
					nodeIndicators[1].setFrame(0);
					angle = (90 + offset*i) * radians;
					nodeIndicators[2] = parent.add.sprite(level.nodes[j].x+Math.sin(angle)*radius, level.nodes[j].y-Math.cos(angle)*radius, 'state_indicator');
					nodeIndicators[2].setFrame(0);
					nodeIndicators.forEach(function(ind,i){
						ind.scaleX = 0.5;
			    		ind.scaleY = 0.5;
					});
					player.stateIndicators.push(nodeIndicators);
				}
			});
			
	    	
		});
		return level;
	}
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


function showButtons(){
	document.getElementById("interface").style.display = "block";
}

function levelController(parent){
	sequencePosition++;
	let level = levelSequence[sequencePosition];
	console.log(sequencePosition);
	console.log(level);
	parent.scene.start(level.scene,level.data);
}

var levelSequence = [
	{'scene':'introScene','data':{}},
	{'scene':'loadScene','data':{}},
	{'scene':'playScene','data':{'difficulty':5,'layout':0,'players':2,'music':0}},
	{'scene':'loadScene','data':{}},
	{'scene':'playScene','data':{'difficulty':7,'layout':0,'players':3,'music':1}},
	{'scene':'loadScene','data':{}},
	{'scene':'playScene','data':{'difficulty':8,'layout':1,'players':3,'music':1}},
	{'scene':'loadScene','data':{}},
	{'scene':'playScene','data':{'difficulty':7,'layout':0,'players':4,'music':1}},
	{'scene':'loadScene','data':{}},
	{'scene':'playScene','data':{'difficulty':8,'layout':1,'players':4,'music':2}},
	{'scene':'loadScene','data':{}},
	{'scene':'playScene','data':{'difficulty':10,'layout':1,'players':4,'music':2}},
	{'scene':'loadScene','data':{}},
	{'scene':'playScene','data':{'difficulty':11,'layout':2,'players':4,'music':2}},
	{'scene':'loadScene','data':{}},
	{'scene':'playScene','data':{'difficulty':12,'layout':1,'players':5,'music':2}},
	{'scene':'loadScene','data':{}},
	{'scene':'playScene','data':{'difficulty':14,'layout':2,'players':5,'music':2}},
	{'scene':'loadScene','data':{}},
	{'scene':'playScene','data':{'difficulty':18,'layout':3,'players':5,'music':2}}
	];

var config = {
    type: Phaser.AUTO,
    width: 1080,
    height: 1080,
    backgroundColor: '#ffcc44',
    parent: 'app',
    scene: [IntroScene,LoadScene,PlayScene]
};

var radius = 70
var game = new Phaser.Game(config);
var keys = [false,false,false,false,false,false]
var sequencePosition = 0
var radians = (Math.PI / 180);