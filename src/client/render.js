// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#5-client-rendering
import {debounce} from 'throttle-debounce';
import {getAsset} from './assets';
import {getCurrentState} from './state';

const Constants = require('../shared/constants');

const {PLAYER_RADIUS, MAP_SIZE, BULLET_RADIUS} = Constants;

// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
context.lineCap = 'round';
context.lineWidth = 3;
context.strokeStyle = 'red';

setCanvasDimensions();

const assets = {
    voi: 'voi-logo.svg',
    lime: 'lime-logo.png',
    tier: 'tier-logo.png',
    moow: 'moow-logo.png',
    circ: 'circ-logo.png',
    vosh: 'vosh-logo.jpg',
    aimo: 'aimo-logo.png'
};

const colors = {
    voi: '#F46C62',
    lime: '#03D400',
    tier: '#001C6E',
    moow: '#0082CA',
    circ: '#FF5F00',
    vosh: '#E9FE03',
    aimo: 'black'
};

function setCanvasDimensions() {
    // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
    // 800 in-game units of width.
    const scaleRatio = 1;
    canvas.width = scaleRatio * window.innerWidth;
    canvas.height = scaleRatio * window.innerHeight;
}

window.addEventListener('resize', debounce(40, setCanvasDimensions));

function render() {
    const {me, others, powerUps} = getCurrentState();
    if (!me) {
        return;
    }

    // Draw background
    renderBackground(me.x, me.y);

    // Draw boundaries
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    // context.strokeRect(canvas.width / 2 - me.x, canvas.height / 2 - me.y, MAP_SIZE, MAP_SIZE);

    // Draw all players
    renderPlayer(me, me);
    renderPlayerLine(me);
    others.forEach(renderPlayer.bind(null, me));
    // others.forEach(renderPlayerLine.bind(player));
    others.forEach((player) => {
        renderPlayerLine(player);
    });

    powerUps.forEach((player) => {
        renderPowerUp(player);
        console.log(player);
    });

}

function renderBackground(x, y) {
    const backgroundX = MAP_SIZE / 2 - x + canvas.width / 2;
    const backgroundY = MAP_SIZE / 2 - y + canvas.height / 2;
    const backgroundGradient = context.createRadialGradient(
        backgroundX,
        backgroundY,
        MAP_SIZE / 10,
        backgroundX,
        backgroundY,
        MAP_SIZE / 2
    );
    backgroundGradient.addColorStop(0, 'gray');
    backgroundGradient.addColorStop(1, 'gray');
    context.fillStyle = backgroundGradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function renderPlayerLine(player) {
    const {locationHistory, selectedScooter} = player;
    // Draw history
    context.lineWidth = 5;
    context.strokeStyle = colors[selectedScooter];
    context.moveTo(locationHistory[locationHistory.length - 2].x, locationHistory[locationHistory.length - 2].y);
    context.lineTo(locationHistory[locationHistory.length - 1].x, locationHistory[locationHistory.length - 1].y);
    context.lineTo(player.x, player.y);

    // locationHistory.forEach(function(location) {
    //     context.lineTo(location.x, location.y);
    // });
    context.stroke();
}

// Renders a ship at the given coordinates
function renderPlayer(me, player) {
    const {x, y, direction, selectedScooter} = player;
    // const canvasX = canvas.width / 2 + x - me.x;
    // const canvasY = canvas.height / 2 + y - me.y;
    const canvasX = x;
    const canvasY = y;

    // Draw ship
    context.save();
    context.translate(canvasX, canvasY);
    context.rotate(direction);
    context.drawImage(
        getAsset(assets[selectedScooter]),
        -PLAYER_RADIUS,
        -PLAYER_RADIUS,
        PLAYER_RADIUS * 2,
        PLAYER_RADIUS * 2
    );

    context.restore();
}

function renderPowerUp(bullet) {

    const {x, y} = bullet;
    context.save();
    context.translate(x, y);

    context.drawImage(
        getAsset('cash.svg'),
        -BULLET_RADIUS,
        -BULLET_RADIUS,
        BULLET_RADIUS * 2,
        BULLET_RADIUS * 2
    );
    context.restore();
}


function renderMainMenu() {
    const t = Date.now() / 7500;
    const x = MAP_SIZE / 2 + 800 * Math.cos(t);
    const y = MAP_SIZE / 2 + 800 * Math.sin(t);
    renderBackground(x, y);
}

let renderInterval = setInterval(renderMainMenu, 1000 / 60);

// Replaces main menu rendering with game rendering.
export function startRendering() {
    clearInterval(renderInterval);
    renderInterval = setInterval(render, 1000 / 60);
}

// Replaces game rendering with main menu rendering.
export function stopRendering() {
    clearInterval(renderInterval);
    renderInterval = setInterval(renderMainMenu, 1000 / 60);
}
