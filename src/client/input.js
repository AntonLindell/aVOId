// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#6-client-input-%EF%B8%8F
import {updateDirection} from './networking';

function onKeyDown(e) {
    console.log(e.code);
    if (e.code === 'ArrowLeft') {
        updateDirection('leftDown');
    } else if (e.code === 'ArrowRight') {
        updateDirection('rightDown');
    }
}

function onKeyUp(e) {
    if (e.code === 'ArrowLeft') {
        updateDirection('leftUp');
    } else if (e.code === 'ArrowRight') {
        updateDirection('rightUp');
    }
}

export function startCapturingInput() {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
}

export function stopCapturingInput() {
    window.addEventListener('keydown', onKeyInput);
}
