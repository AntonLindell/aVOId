// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#6-client-input-%EF%B8%8F
import {updateDirection} from './networking';

function onKeyInput(e) {
  console.log(e.code);
  if (e.code == 'ArrowLeft') {
    updateDirection(-1/(2*Math.PI))
  } else if (e.code == 'ArrowRight') {
    updateDirection(1/(2*Math.PI))
  }
}

export function startCapturingInput() {
    window.addEventListener('keydown', onKeyInput);
}

export function stopCapturingInput() {
    window.addEventListener('keydown', onKeyInput);
}
