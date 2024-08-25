import {
  init,
  GameLoop,
  initPointer,
} from 'kontra';
import { makeSprites } from './sprites';
import { initScenes } from './scenes';
import { enemyManager } from './enemyManager';
import { data, initCalculations, initElements } from './data';
import { state } from './state'

const { canvas } = init();

const enemySpawnInterval = 40

export function getRandomIntMinMaxInclusive(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const loop = GameLoop({
  update: function () {
    data.sprites.player.update();
    data.sprites.player.x = state.playerX;
    data.sprites.player.y = state.playerY;

    enemyManager.update();
  },
  render: function () {
    state.time += 1;

    if (state.time % enemySpawnInterval === 0 && enemyManager.spawned < 13) {
      enemyManager.add();
    }

    data.sprites.player.render();
    enemyManager.render();
    enemyManager.purge();

    data.scenes.title.render();
    data.scenes.select.render();
    // gameScene.render();
  }
});

let startGame = () => {
  initPointer();
  initElements(canvas, document.getElementById('body')!)
  initCalculations(canvas);
  initScenes();

  loop.start();
}

// Mouse Handler
document.getElementById('c')!.addEventListener('mousemove', (e) => {
  state.playerX = (e.x / data.calculations.canvasRatioWidth) - data.calculations.canvasAdjustLeft;
  state.playerY = (e.y / data.calculations.canvasRatioHeight) - data.calculations.canvasAdjustRight;
});

// Resize Handler
window.addEventListener('resize', () => {
  initCalculations(canvas);
})

makeSprites(startGame);
