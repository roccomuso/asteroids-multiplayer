
var sprite;
var cursors;

var bullet;
var bullets;
var bulletTime = 0;

var startState = {
    preload: function() {
        game.load.image('space', 'assets/img/deep-space.jpg');
        game.load.image('bullet', 'assets/img/bullets.png');
        game.load.image('ship', 'assets/img/ship.png');
        game.load.image('sparkle', 'assets/img/sparkle.png');
        //collision.bind(this);
    },
    create: function() {
        //  This will run in Canvas mode, so let's gain a little speed and display
        game.renderer.clearBeforeRender = false;
        game.renderer.roundPixels = true;

        //  We need arcade physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //  A spacey background
        game.add.tileSprite(0, 0, game.width, game.height, 'space');

        //  Our ships bullets
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;

        //  All 40 of them
        bullets.createMultiple(40, 'bullet');
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 0.5);

        //  Our player ship
        sprite = game.add.sprite(300, 300, 'ship');
        sprite.anchor.set(0.5);

        // Ship's sparkle
        sparkle = game.add.sprite(0, 0, 'sparkle');
        sparkle.angle = 180;
        sparkle.anchor.set(0.5);
        sprite.addChild(sparkle);

        //  and its physics settings
        game.physics.enable(sprite, Phaser.Physics.ARCADE);

        sprite.body.drag.set(100);
        sprite.body.maxVelocity.set(200);

        //  Game input
        cursors = game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
    },
    update: function() {

        if (cursors.up.isDown){
            game.physics.arcade.accelerationFromRotation(sprite.rotation, 200, sprite.body.acceleration);
            sparkle.visible = true;
        }else{
            sprite.body.acceleration.set(0);
            sparkle.body.acceleration.set(0);
            sparkle.visible = false;
        }

        if (cursors.left.isDown){
            sprite.body.angularVelocity = -300;
        }else if (cursors.right.isDown){
            sprite.body.angularVelocity = 300;
        }else{
            sprite.body.angularVelocity = 0;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
            fireBullet();
        }

        screenWrap(sprite);

        bullets.forEachExists(screenWrap, this);

    },
    render: function(){}
 };



function fireBullet () {

    if (game.time.now > bulletTime)
    {
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            bullet.reset(sprite.body.x + 16, sprite.body.y + 16);
            bullet.lifespan = 2000;
            bullet.rotation = sprite.rotation;
            game.physics.arcade.velocityFromRotation(sprite.rotation, 400, bullet.body.velocity);
            bulletTime = game.time.now + 50;
        }
    }

}

function screenWrap (sprite) {

    if (sprite.x < 0){
        sprite.x = game.width;
    }
    else if (sprite.x > game.width){
        sprite.x = 0;
    }

    if (sprite.y < 0){
        sprite.y = game.height;
    }
    else if (sprite.y > game.height){
        sprite.y = 0;
    }

}
