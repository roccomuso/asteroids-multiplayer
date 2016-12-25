

var config =
{
  players:{
    numbersOfPlayer: 2
  },
  display:{height: 720, width:960}, 
  worldDim: { height: 1000 , width: 1000 }
}

/*
For Fullscreen put this code:

var w = window.innerWidth * window.devicePixelRatio,
    h = window.innerHeight * window.devicePixelRatio;
*/

var game = new Phaser.Game(config.display.width, config.display.height, Phaser.AUTO, 'gameContainer');

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('start', startState);

game.state.start('boot');
