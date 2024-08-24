import {
  init,
  Sprite,
  GameLoop,
  SpriteSheet,
} from 'kontra';
import { WIDTH, HEIGHT } from './constants';
import { makeSprites, playerShip, getEnemyShip } from './sprites';

const { canvas } = init();
const state = {
  playerX: 0,
  playerY: 0
}

let body;
let time = 0;


export function getRandomIntMinMaxInclusive(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

class EnemyManager {
  enemies: Array<Sprite> = []

  add() {
    console.log('Spawn Enemy');
    this.enemies.push(getEnemyShip());
  }
  update() {
    for (const enemy of this.enemies) {
      enemy.x = (Math.cos(enemy.y / 40) * 400) + 1000
      enemy.update();
    }
  }
  render() {
    for (const enemy of this.enemies) {
      if (enemy.y > (canvas.offsetHeight / cRatioH)) {
        enemy.opacity = 0;
      }
      enemy.render()
    }
  }
  purge() {
    this.enemies = this.enemies.filter((e) => e.opacity !== 0)
  }
}
const enemyManager = new EnemyManager();

let loop = GameLoop({
  update: function (dt) {
    playerShip.update();
    playerShip.x = state.playerX;
    playerShip.y = state.playerY;

    enemyManager.update();
  },
  render: function () {
    time += 1;

    if (time % 30 === 0) {
      enemyManager.add();
    }

    playerShip.render();
    enemyManager.render();
    enemyManager.purge();
  }
});

let cRatioW = canvas.offsetWidth / WIDTH;
let cRatioH = canvas.offsetHeight / HEIGHT;
let canvasAdjustLeft = canvas.offsetLeft / cRatioW;
let canvasAdjustRight = canvas.offsetTop / cRatioH;

function startGame() {
  body = document.getElementById('body')!;
  playerShip.playAnimation('engine');

  cRatioW = canvas.offsetWidth / WIDTH;
  cRatioH = canvas.offsetHeight / HEIGHT;
  canvasAdjustLeft = canvas.offsetLeft / cRatioW;
  canvasAdjustRight = canvas.offsetTop / cRatioH;

  console.log(canvas.offsetWidth, canvas.offsetHeight)
  state.playerX = ((body.offsetWidth / 2) / cRatioW) - canvasAdjustLeft;
  state.playerY = ((body.offsetHeight / 1.25) / cRatioH) - canvasAdjustRight;

  console.log(state.playerX, state.playerY)

  loop.start();
}

// Mouse Handler
document.getElementById('c')!.addEventListener('mousemove', (e) => {
  state.playerX = (e.x / cRatioW) - canvasAdjustLeft;
  state.playerY = (e.y / cRatioH) - canvasAdjustRight;
});

// Resize Handler
window.addEventListener('resize', () => {
  cRatioW = canvas.offsetWidth / WIDTH;
  cRatioH = canvas.offsetHeight / HEIGHT;
  canvasAdjustLeft = canvas.offsetLeft / cRatioW;
  canvasAdjustRight = canvas.offsetTop / cRatioH;

})

makeSprites(startGame);
