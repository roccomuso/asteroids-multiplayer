
var ship;
var cursors;

var bullet;
var bullets;
var bulletTime = 0;
var AUDIO = {};

// enemies
var nEnemies = 20;
var enemies = [];

// asteroids
var nAsteroids = 20;
var asteroids = [];

// moon
var nMoons = 1;
var moons = [];

var startState = {
    preload: function () {
        game.load.image('space', 'assets/img/deep-space.jpg');
        game.load.image('bullet', 'assets/img/bullets.png');
        game.load.image('ship', 'assets/img/ship.png');
        game.load.image('sparkle', 'assets/img/sparkle.png');
        game.load.image("asteroid1", "assets/img/asteroid1.png");
        game.load.image("asteroid2", "assets/img/asteroid2.png");
        game.load.image("asteroid3", "assets/img/asteroid3.png");
        game.load.image("asteroid4", "assets/img/asteroid4.png");
        game.load.image("moon", "assets/img/moon.png");

        // Audio
        game.load.audio("boost", "assets/sounds/boost_ship.wav");
        game.load.audio("fire", "assets/sounds/ship_bullets_fire.wav");
        game.load.audio("ship_collision", "assets/sounds/ship_collision.wav");
    },
    create: function () {

        // Window resize
        game.scale.scaleMode = Phaser.ScaleManager.RESIZE;    

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
        bullets.createMultiple(config.ship.nBullets, 'bullet');
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 0.5);
        bullets.setAll('body.mass', 0.001);
        if (!config.screenWrap)
            bullets.forEach(function (elem) {
                elem.body.collideWorldBounds = true;
                elem.body.bounce.setTo(1, 1);
            });

        // enemies
        for (var i = 0; i < nEnemies; i++){
          enemies[i] = game.add.sprite(300+(i*100), 300+(i*100),'ship');
          enemies[i].anchor.set(0.5);
        }
        game.physics.arcade.enable(enemies);
        enemies.forEach(function(enemy){
          if (!config.screenWrap)
            enemy.body.collideWorldBounds = true;
          enemy.body.velocity.setTo(200, 200);
          enemy.body.bounce.set(1);
          enemy.maxHealth = 3;
          enemy.health = enemy.maxHealth;
          enemy.healthBar = new HealthBar(game,{x: enemy.x, y: enemy.y -20 , width: 40, height: 4,});
        });

        // asteroids
        for (var k = 0; k < nAsteroids; k++){
          asteroids[k] = game.add.sprite(300+(k*100), 300+(k*100),'asteroid'+(Math.floor(Math.random()*4)+1));
          asteroids[k].anchor.set(0.5);
        }
        game.physics.arcade.enable(asteroids);
        asteroids.forEach(function(asteroid){
          if (!config.screenWrap)
            asteroid.body.collideWorldBounds = true;
          asteroid.body.velocity.setTo(100, 150);
          asteroid.body.angularVelocity = 50;
          asteroid.body.mass = (asteroid.body.sprite.texture.baseTexture.source.src.match(/asteroid4/)) ? 10 : 1;
          asteroid.maxHealth = (asteroid.body.sprite.texture.baseTexture.source.src.match(/asteroid4/)) ? 10 : 1
          asteroid.health = asteroid.maxHealth;
          asteroid.body.bounce.set(1);
        });

        // moon
        for (k = 0; k < nMoons; k++){
          moons[k] = game.add.sprite(300+(k*100), 300+(k*100),'moon');
          moons[k].anchor.set(0.5);
          
        }
        game.physics.arcade.enable(moons);
        moons.forEach(function(moon){
          if (!config.screenWrap)
            moon.body.collideWorldBounds = true;
          moon.body.velocity.setTo(100, 100);
          moon.body.angularVelocity = -30;
          moon.scale.setTo(1.5, 1.5);
          moon.body.mass = 30;
          moon.maxHealth = 15;
          moon.health = moon.maxHealth; 
          moon.body.bounce.set(1);
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

        //  Game input
        cursors = game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);



    },
    update: function () {
        // Health bar update position
        enemies.forEach(function(enemi)
        {
            enemi.healthBar.setPosition(enemi.x, enemi.y-20);
        });


        // Bullets collision
        bullets.forEach(function (bull){
            game.physics.arcade.collide(enemies, bull, bulletsCollision);    
            game.physics.arcade.collide(moons, bull, bulletsCollision);
            game.physics.arcade.collide(asteroids, bull, bulletsCollision);
        });

        game.physics.arcade.collide(enemies, ship, shipsCollision);
        game.physics.arcade.collide(enemies, enemies);
        game.physics.arcade.collide(asteroids, ship, asteroidCollision);
        game.physics.arcade.collide(asteroids, asteroids);
        game.physics.arcade.collide(asteroids, enemies);
        game.physics.arcade.collide(moons, moons);
        game.physics.arcade.collide(moons, asteroids);
        game.physics.arcade.collide(moons, ship, asteroidCollision);
        game.physics.arcade.collide(moons, enemies);

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
    render: function () { },
    resize: function (width, height)
    {

    }
};



function fireBullet() {

    if (game.time.now > bulletTime) {
        bullet = bullets.getFirstExists(false);

        if (bullet) {
            bullet.reset(ship.body.x + 16, ship.body.y + 16);
            bullet.lifespan = 2000;
            bullet.rotation = ship.rotation;
            game.physics.arcade.velocityFromRotation(ship.rotation, 400, bullet.body.velocity);
            bulletTime = game.time.now + config.ship.rateOfFire;
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
    //sprite1.play('flash');
    //sprite2.play('flash');
}

function bulletsCollision(enemy, bullet) {
    AUDIO.ship_collision.play();
    enemy.health -= config.ship.bulletsDamage;
    if (enemy.healthBar)
        enemy.healthBar.setPercent( (enemy.health/enemy.maxHealth) * 100);
    if (enemy.health <= 0)
    {
        if (enemy.healthBar)
            enemy.healthBar.kill();
        enemy.destroy();
    }
    bullet.kill();
}

function asteroidCollision(s1, s2){

}