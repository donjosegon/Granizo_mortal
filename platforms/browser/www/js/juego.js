var app = {

	inicio: function() {
		var sprites;
		fin = '';
		puntuacion = 0;
		total = 0;
		timer = 0;
		factor = 500;
		velocidadX = 0;
		velocidadY = 0;

		app.vigilaSensores();
		app.iniciaJuego();
	},

	iniciaJuego: function() {

		function preload() {

		    //  You can fill the preloader with as many assets as your game requires

		    //  Here we are loading an image. The first parameter is the unique
		    //  string by which we'll identify the image later in our code.

		    //  The second parameter is the URL of the image (relative)

			game.physics.startSystem(Phaser.Physics.ARCADE);



			game.stage.backgroundColor = '#f27d0c';

		    game.load.spritesheet('copo', 'assets/copo.png'), 20, 20, 18;
		    game.load.image('dude', 'assets/dude.png');
		}

		function create() {

			scoreText = game.add.text(16, 16, puntuacion, {fontSize: '100px', fill: '#757676'});

		    game.physics.arcade.gravity.y = 100;

		    dude = game.add.sprite(game.world.randomX, 420, 'dude');
		    game.physics.arcade.enable(dude, Phaser.Physics.ARCADE);
   			dude.body.collideWorldBounds = true;
		    sprites = game.add.physicsGroup(Phaser.Physics.ARCADE);

			gameOver = game.add.text(60, (document.documentElement.clientHeight/2 -50), fin, {fontSize: '40px', fill: '#757676'});

			releaseCopo();

			dude.body.onCollide = new Phaser.Signal();
		    dude.body.onCollide.add(collisionHandler, this);

		}

		function releaseCopo() {

		    var s = sprites.create(game.rnd.integerInRange(37, document.documentElement.clientWidth-37), 50, 'copo');

		    sprites.setAll('outOfdBoundsKill', true);

			if (puntuacion < -200) {
				final();
			}
		       
		    if (total > 20) {
		    	factor = 300;
		    } else if (total > 50) {
		    	factor = 200;
		    } else if (total > 75) {
		    	factor = 100;
		    }
		    puntuacion++;
		    scoreText.text = puntuacion;
			total++;
		    timer = game.time.now + factor;
		}

		function update() {

			if (fin != '') {
				gameOver();
			}

			dude.body.velocity.x = velocidadX * -200;
		    dude.body.velocity.y = 0;


		    game.physics.arcade.collide(dude, sprites);

			if (total < 2000 && game.time.now > timer) {
		        releaseCopo();
		    }
		}

		var game = new Phaser.Game(document.documentElement.clientWidth-17, document.documentElement.clientHeight-17, Phaser.CANVAS, 'phaser', { preload: preload, create: create, update: update });

		function collisionHandler(dude, sprites) {
			sprites.kill();
			dude.y = 420;
			puntuacion = puntuacion-50;
			scoreText.text = puntuacion;
		}

		function final() {
			fin = 'Game Over';
			gameOver.text = fin;
		}
	},

	vigilaSensores: function() {
		function onError() {
			console.log('onError!');
		}

		function onSuccess(datosAceleracion) {
			app.detectaAgitacion(datosAceleracion);
			app.registraDireccion(datosAceleracion);
		}

		navigator.accelerometer.watchAcceleration(onSuccess, onError, {frequency: 10});
	},

	detectaAgitacion: function(datosAceleracion) {
		var agitacionX = datosAceleracion.x > 10;
		var agitacionY = datosAceleracion.y > 10;

		if (agitacionX || agitacionY) {
			setTimeout(app.recomienza, 1000);
		}
	},

	recomienza: function() {
		document.location.reload(true);
	},

	registraDireccion: function(datosAceleracion) {
		velocidadX = datosAceleracion.x;
		velocidadY = datosAceleracion.y;
	}
};

if ('addEventListener' in document) {
	document.addEventListener('deviceready', function() {
		app.inicio();
	}, false);
}
