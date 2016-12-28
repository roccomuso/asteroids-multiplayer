function Player(game){
  this.game = game;
  this.ship = this.game.add.sprite(200, 200, 'ship');
  this.sprite = this.ship;

  this.ship.anchor.set(0.5);
  game.physics.arcade.enable(this.ship);
  this.ship.maxHealth = config.ship.maxHealth;
  this.ship.health = this.ship.maxHealth;
  this.ship.healthBar = new HealthBar(game, {x: 150, y: config.display.height- 50 ,width: 250, height: 40});

  this.ship.healthBar.setFixedToCamera(true);

  if (!config.screenWrap)
      this.ship.body.collideWorldBounds = true;


}

Player.prototype.addSparkle = function(sparkle){
  this.ship.addChild(sparkle);
};

Player.prototype.cameraFollow = function(){
  this.game.camera.follow(this.ship);
};

Player.prototype.enablePhysics = function(){
  //  ship's physics settings
  this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);
  this.ship.body.bounce.set(1);

  this.ship.body.drag.set(100);
  this.ship.body.maxVelocity.set(200);
};
