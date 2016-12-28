
var ship;
var cursors;

var bullet;
var bullets;
var bulletTime = 0;
var AUDIO = {};

// enemies
var nEnemies = config.nEnemies;
var enemies = [];

// asteroids
var nAsteroids = config.nAsteroids;
var asteroids = [];

// moon
var nMoons = config.nMoons;
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
        game.load.audio("bullet_hit_ship", "assets/sounds/bullet_hit_ship.wav");
        game.load.audio("bullet_hit_asteroid", "assets/sounds/bullet_hit_asteroid.wav");
    },
    create: function () {

        // Window resize
        game.scale.scaleMode = Phaser.ScaleManager.RESIZE;

        // Audio Effect
        AUDIO.boost = game.add.sound("boost");
        AUDIO.fire = game.add.sound("fire");
        AUDIO.ship_collision = game.add.sound("ship_collision");
        AUDIO.bullet_hit_ship = game.add.sound("bullet_hit_ship");
        AUDIO.bullet_hit_asteroid = game.add.sound("bullet_hit_asteroid");
        AUDIO.boost.volume = 0.5;
        AUDIO.fire.volume = 0.5;
        AUDIO.ship_collision.volume = 0.5;
        AUDIO.bullet_hit_ship.volume = 1;
        AUDIO.bullet_hit_asteroid.volume = 1;

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
          enemy.maxHealth = config.ship.maxHealth;
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
          asteroid.maxHealth = (asteroid.body.sprite.texture.baseTexture.source.src.match(/asteroid4/)) ? 45 : 4;
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
          moon.body.mass = 10 ;
          moon.maxHealth = 100;
          moon.health = moon.maxHealth;
          moon.body.bounce.set(1);
        });

        //  Our player ship
        ship = new Player(game);
        console.log('ship instance', ship);
        // Ship's sparkle
        sparkle = game.add.sprite(0, 0, 'sparkle');
        sparkle.angle = 180;
        sparkle.anchor.set(0.5);
        ship.addSparkle(sparkle);


        // Camera Gesture
        game.camera.x = ship.x;
        game.camera.y = ship.y;
        game.camera.height = game.height;
        game.camera.width = game.width;
        ship.cameraFollow();

        ship.enablePhysics();


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
            game.physics.arcade.collide(enemies, bull, bulletsCollisionShip);
            game.physics.arcade.collide(moons, bull, bulletsCollisionAsteroid);
            game.physics.arcade.collide(asteroids, bull, bulletsCollisionAsteroid);
        });

        game.physics.arcade.collide(enemies, ship.sprite, shipCollission);
        game.physics.arcade.collide(enemies, enemies, bodyCollision);
        game.physics.arcade.collide(asteroids, ship.sprite, shipCollission);
        game.physics.arcade.collide(asteroids, asteroids, bodyCollision);
        game.physics.arcade.collide(asteroids, enemies, bodyCollision); // bodyCollision
        game.physics.arcade.collide(moons, moons, bodyCollision);
        game.physics.arcade.collide(moons, asteroids, bodyCollision);
        game.physics.arcade.collide(moons, ship.sprite, shipCollission);
        game.physics.arcade.collide(moons, enemies, bodyCollision);

        if (cursors.up.isDown) {
            game.physics.arcade.accelerationFromRotation(ship.sprite.rotation, 200, ship.sprite.body.acceleration);
            if (!AUDIO.boost.isPlaying) AUDIO.boost.play();
            sparkle.visible = true;
        } else {
            ship.sprite.body.acceleration.set(0);
            sparkle.body.acceleration.set(0);
            sparkle.visible = false;
            AUDIO.boost.pause();
        }

        if (cursors.left.isDown) {
            ship.sprite.body.angularVelocity = -300;
        } else if (cursors.right.isDown) {
            ship.sprite.body.angularVelocity = 300;
        } else {
            ship.sprite.body.angularVelocity = 0;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            fireBullet();
        }

        if (config.screenWrap) {
            screenWrap(ship.sprite);
            bullets.forEachExists(screenWrap, this);
        }

    },
    render: function () { },
};



function fireBullet() {

    if (game.time.now > bulletTime) {
        bullet = bullets.getFirstExists(false);

        if (bullet) {
            bullet.reset(ship.sprite.body.x + 16, ship.sprite.body.y + 16);
            bullet.lifespan = 2000;
            bullet.rotation = ship.sprite.rotation;
            game.physics.arcade.velocityFromRotation(ship.sprite.rotation, 400, bullet.body.velocity);
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

function damageBody(body, damage)
{
    if (!body.health) return true;

    body.health -= damage;

    if (body.healthBar)
        body.healthBar.setPercent( (body.health/body.maxHealth) * 100);
    if (body.health <= 0)
    {
        if (body.healthBar)
            body.healthBar.kill();
        body.destroy();
    }
}

function shipCollission(body, ship)
{
    AUDIO.ship_collision.play();
    if (!body.timeOutCollision)
    {
        damageBody(body, config.collisionDamage);
        body.timeOutCollision = true;
        setTimeout(function () { body.timeOutCollision = false}, 500);
    }
    if (!ship.timeOutCollision)
    {
        ship.timeOutCollision = true;
        setTimeout(function () { ship.timeOutCollision = false}, 500);
        ship.health -= config.collisionDamage;
        ship.healthBar.setPercent((ship.health/ship.maxHealth) * 100);
        console.log(ship.health);
        if (ship.health <=  0)
        {
            game.state.start(gameOverState);
            console.log("calling gameOverState");
        }
    }
}

function bodyCollision(body1, body2)
{
    //AUDIO.ship_collision.play();

    if (!body1.timeOutCollision)
    {
        damageBody(body1, config.collisionDamage);
        body1.timeOutCollision = true;
        setTimeout(function () { body1.timeOutCollision = false}, 500);
    }
    if (!body2.timeOutCollision)
    {
        damageBody(body2, config.collisionDamage);
        body2.timeOutCollision = true;
        setTimeout(function () { body2.timeOutCollision = false}, 500);
    }
}

function bulletsCollisionShip (enemy, bullet)
{
    AUDIO.bullet_hit_ship.play();
    damageBody(enemy, config.ship.bulletsDamage);
    bullet.kill();
}

function bulletsCollisionAsteroid (enemy, bullet)
{
    AUDIO.bullet_hit_asteroid.play();
    damageBody(enemy,config.ship.bulletsDamage);
    bullet.kill();
}
