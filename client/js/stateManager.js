

var config = {
    screenWrap: false,
    players: {
        numbersOfPlayer: 2
    },
    display: {
        height: 720,
        width: 960
    },
    worldDim: {
        height: 2000,
        width: 2000
    }
};

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
