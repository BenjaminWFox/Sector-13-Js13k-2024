import {
  init,
  GameLoop,
  initPointer,
  lerp,
  collides,
  Sprite,
  setStoreItem,
} from 'kontra';
import { getBullet, getEnemyShip, getNumbers, makeSprites } from './sprites';
import { initScenes } from './scenes';
import { bulletManager, enemyManager } from './spriteManager';
import { data, initCalculations, initElements } from './data';
import { state } from './state'
import { currentSector, Sector, sector1, sector2, sector3, sectors } from './sectorManager';

const { canvas } = init();

export function getRandomIntMinMaxInclusive(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

let currentGameSector: Sector;
function nextSector() {
  state.sectorTime = 0;
  ++state.currentSector;
  if (state.currentSector > sectors.length) {
    loop.stop();
  } else {
    setStoreItem(`${state.currentSector}`, 1)
    currentGameSector = currentSector();
  }
}

const loop = GameLoop({
  update: function () {
    data.scenes.stars.update();
    data.sprites.player.x = state.playerX;
    data.sprites.player.y = state.playerY;
    data.sprites.player.update();

    if (!data.scenes.game.hidden) {
      // enemyManager.update();
      bulletManager.update();
      currentGameSector.update();
    }

    data.scenes.title.update();
    data.scenes.select.update();
    data.scenes.game.update();
  },

  render: function () {
    data.scenes.stars.render();

    data.sprites.player.render();

    if (!data.scenes.game.hidden) {

      if (state.totalTime % 20 === 0) {
        bulletManager.add(getBullet())
      }

      currentGameSector.render(state.sectorTime, bulletManager.assets);
      // console.log('Done render');
      if (currentGameSector.completed) {
        nextSector();
      }
      bulletManager.render();

    }

    data.scenes.title.render();
    data.scenes.select.render();
    data.scenes.game.render();

    state.totalTime += 1;
    state.sectorTime += 1;
  }
});

let startGame = () => {
  initPointer();
  initElements(canvas, document.getElementById('body')!)
  initCalculations(canvas);
  initScenes();
  state.loop = loop;
  data.scenes.title.show();
  currentGameSector = currentSector()
  // data.scenes.game.show();
  data.sprites.player.x = state.playerX;
  data.sprites.player.y = state.playerY;

  loop.start();
}

// Mouse Handler
document.getElementById('c')!.addEventListener('mousemove', (e) => {
  if (!data.scenes.game.hidden && state.shipEngaged) {
    state.playerX = lerp(state.playerX, (e.x / data.calculations.canvasRatioWidth) - data.calculations.canvasAdjustLeft, .05);
    state.playerY = lerp(state.playerY, (e.y / data.calculations.canvasRatioHeight) - data.calculations.canvasAdjustRight, .05);
  }
});
document.getElementById('c')!.addEventListener('touchmove', (e) => {
  if (!data.scenes.game.hidden && state.shipEngaged) {
    state.playerX = lerp(state.playerX, (e.targetTouches[0].clientX / data.calculations.canvasRatioWidth) - data.calculations.canvasAdjustLeft, .5);
    state.playerY = lerp(state.playerY, (e.targetTouches[0].clientY / data.calculations.canvasRatioHeight) - data.calculations.canvasAdjustRight - 150, .5);
  }
})

// Resize Handler
window.addEventListener('resize', () => {
  initCalculations(canvas);
})

function allowMove() {
  data.elements.body.style.cursor = "none";
  state.shipEngaged = true;
}
function preventMove() {
  data.elements.body.style.cursor = "pointer";
  state.shipEngaged = false;
}

window.ontouchstart = (e) => {
  if (e.touches.length === 1) allowMove();
}
window.ontouchend = (e) => { if (e.touches.length !== 1) preventMove() };
window.ontouchcancel = (e) => { if (e.touches.length !== 1) preventMove() };
window.onmousedown = allowMove;
window.onmouseup = preventMove;

window.onload = () => makeSprites(startGame);
