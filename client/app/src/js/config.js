/* Config file */

var config = {
    screenWrap: false,
    collisionDamage:2,
    nEnemies: 20,
    nAsteroids: 25,
    nMoons: 1,
    ship: {
        maxHealth: 12,
        bulletsDamage:4,
        nBullets: 4,
        rateOfFire: 180
    },
    players: {
        numbersOfPlayer: 2
    },
    display: {
        height: window.innerHeight * window.devicePixelRatio,
        width: window.innerWidth * window.devicePixelRatio
    },
    worldDim: {
        height: 2000,
        width: 2000
    }
};
