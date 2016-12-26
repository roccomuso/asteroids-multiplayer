
var ship;
var cursors;

var bullet;
var bullets;
var bulletTime = 0;
var AUDIO = {};

var nEnemies = 40;
var enemies = [];

var startState = {
    preload: function () {
        game.load.image('space', 'assets/img/deep-space.jpg');
        game.load.image('bullet', 'assets/img/bullets.png');
        game.load.image('ship', 'assets/img/ship.png');
        game.load.image('sparkle', 'assets/img/sparkle.png');
        game.load.image("asteroid", "assets/img/asteroid2.png");

        // Audio
        game.load.audio("boost", "assets/sounds/boost_ship.wav");
        game.load.audio("fire", "assets/sounds/ship_bullets_fire.wav");
        game.load.audio("ship_collision", "assets/sounds/ship_collision.wav");
    },
    create: function () {

        // Audio Effect
        AUDIO.boost = game.add.sound("boost");
        AUDIO.fire = game.add.sound("fire");
        AUDIO.ship_collision = game.add.sound("ship_collision");
        AUDIO.boost.volume = 0.5;
        AUDIO.fire.volume = 0.5;
        AUDIO.ship_collision.volume = 0.5;

        // Set world dimension
        game.world.setBounds(0, 0, config.worldDim.width, config.worldDim.height);

        //  This will run in Canvas mode, so let's gain a little speed and display
        game.renderer.clearBeforeRender = false;
        game.renderer.roundPixels = true;

        //  We need arcade physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //  A spacey background
        game.add.tileSprite(0, 0, game.world.width, game.world.height, 'space');

        //  Our ships bullets
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;

        //  All 40 of them
        bullets.createMultiple(40, 'bullet');
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 0.5);
        if (!config.screenWrap)
            bullets.forEach(function (elem) {
                elem.body.collideWorldBounds = true;
                elem.body.bounce.setTo(1, 1);
            });

        // enemies
        for (var i = 0; i < nEnemies; i++){
          enemies[i] = game.add.sprite(300+(i*100), 300+(i*100),'ship');
          enemies[i].animations.add('flash', [0,1,2,3,2,1,0], 24, false);
        }
        game.physics.arcade.enable(enemies);
        enemies.forEach(function(enemy){
          if (!config.screenWrap)
            enemy.body.collideWorldBounds = true;
          enemy.body.velocity.setTo(200, 200);
          enemy.body.bounce.set(1);
          enemy.body.onCollide = new Phaser.Signal();
          enemy.body.onCollide.add(shipsCollision, this);
        });

        //  Our player ship
        ship = game.add.sprite(200, 200, 'ship');
        ship.anchor.set(0.5);
        game.physics.arcade.enable(ship);
        if (!config.screenWrap)
            ship.body.collideWorldBounds = true;

        // Ship's sparkle
        sparkle = game.add.sprite(0, 0, 'sparkle');
        sparkle.angle = 180;
        sparkle.anchor.set(0.5);
        ship.addChild(sparkle);

        // Camera Gesture
        game.camera.x = ship.x;
        game.camera.y = ship.y;
        game.camera.height = game.height;
        game.camera.width = game.width;
        game.camera.follow(ship);

        //  ship's physics settings
        game.physics.enable(ship, Phaser.Physics.ARCADE);
        ship.body.bounce.set(1);
        ship.body.onCollide = new Phaser.Signal();
        ship.body.onCollide.add(shipsCollision, this);

        ship.body.drag.set(100);
        ship.body.maxVelocity.set(200);

        // Collision
        ship.animations.add('flash', [0,1,2,3,2,1,0], 24, false);

        //  Game input
        cursors = game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);



    },
    update: function () {

        game.physics.arcade.collide(enemies, ship, shipsCollision);
        game.physics.arcade.collide(enemies, enemies);

        if (cursors.up.isDown) {
            game.physics.arcade.accelerationFromRotation(ship.rotation, 200, ship.body.acceleration);
            if (!AUDIO.boost.isPlaying) AUDIO.boost.play();
            sparkle.visible = true;
        } else {
            ship.body.acceleration.set(0);
            sparkle.body.acceleration.set(0);
            sparkle.visible = false;
            AUDIO.boost.pause();
        }

        if (cursors.left.isDown) {
            ship.body.angularVelocity = -300;
        } else if (cursors.right.isDown) {
            ship.body.angularVelocity = 300;
        } else {
            ship.body.angularVelocity = 0;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            fireBullet();
        }

        if (config.screenWrap) {
            screenWrap(ship);
            bullets.forEachExists(screenWrap, this);
        }

    },
    render: function () { }
};



function fireBullet() {

    if (game.time.now > bulletTime) {
        bullet = bullets.getFirstExists(false);

        if (bullet) {
            bullet.reset(ship.body.x + 16, ship.body.y + 16);
            bullet.lifespan = 2000;
            bullet.rotation = ship.rotation;
            game.physics.arcade.velocityFromRotation(ship.rotation, 400, bullet.body.velocity);
            bulletTime = game.time.now + 50;
            AUDIO.fire.play();
        }
    }

}

function screenWrap(ship) {

    if (ship.x < 0) {
        ship.x = game.world.width;
    } else if (ship.x > game.world.width) {
        ship.x = 0;
    }

    if (ship.y < 0) {
        ship.y = game.world.height;
    } else if (ship.y > game.world.height) {
        ship.y = 0;
    }

}

function shipsCollision(sprite1, sprite2) {
    AUDIO.ship_collision.play();
    // TODO, fix animations...
    sprite1.play('flash');
    sprite2.play('flash');
}
