module.exports = Object.freeze({
    PLAYER_RADIUS: 20,
    PLAYER_MAX_HP: 100,
    PLAYER_SPEED: 100,
    PLAYER_FIRE_COOLDOWN: 0.25,

    BULLET_RADIUS: 30,
    BULLET_SPEED: 0,
    BULLET_DAMAGE: 10,

    SCORE_BULLET_HIT: 20,
    SCORE_PER_SECOND: 1,

    MAP_SIZE: 500,
    MSG_TYPES: {
        JOIN_GAME: 'join_game',
        GAME_UPDATE: 'update',
        INPUT: 'input',
        GAME_OVER: 'dead'
    },
    MAP_WIDTH: 1440,
    MAP_HEIGHT: 900
});
