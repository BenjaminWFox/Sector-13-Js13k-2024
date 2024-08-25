import {
  init,
  Sprite,
  GameLoop,
} from 'kontra';
import { WIDTH, HEIGHT, SCALE } from './constants';
import { makeSprites, playerShip, getEnemyShip, getBoldText, getBoldNumbers } from './sprites';

const { canvas } = init();
const state = {
  playerX: 0,
  playerY: 0
}

let body;
let time = 0;
let scoreText: Sprite;
let pauseText: Sprite;
let sectorText: Sprite;
let thirteenText: Sprite;


// Enemy Spawn Numbers
const xPosition = 1000;
const waveXSpread = 200;
const shipXSpeed = 120; // Higher = Slower
const enemySpawnInterval = 40


export function getRandomIntMinMaxInclusive(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

class EnemyManager {
  enemies: Array<Sprite> = []
  spawned = 0;

  add() {
    console.log('Spawn Enemy');
    this.enemies.push(getEnemyShip());
    this.spawned += 1;
  }
  update() {
    for (const enemy of this.enemies) {
      enemy.x = (Math.cos((enemy.y) / shipXSpeed) * waveXSpread) + 750
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

const loop = GameLoop({
  update: function () {
    playerShip.update();
    playerShip.x = state.playerX;
    playerShip.y = state.playerY;

    enemyManager.update();
  },
  render: function () {
    time += 1;

    if (time % enemySpawnInterval === 0 && enemyManager.spawned < 13) {
      enemyManager.add();
    }

    playerShip.render();
    enemyManager.render();
    enemyManager.purge();
    // lettersSprite.render();
    scoreText.render();
    pauseText.render();
    sectorText.render();
    thirteenText.render();
  }
});

let cRatioW = canvas.offsetWidth / WIDTH;
let cRatioH = canvas.offsetHeight / HEIGHT;
let canvasAdjustLeft = canvas.offsetLeft / cRatioW;
let canvasAdjustRight = canvas.offsetTop / cRatioH;

let startGame = () => {
  body = document.getElementById('body')!;
  console.log('Starting Game', body, playerShip);

  cRatioW = canvas.offsetWidth / WIDTH;
  cRatioH = canvas.offsetHeight / HEIGHT;
  canvasAdjustLeft = canvas.offsetLeft / cRatioW;
  canvasAdjustRight = canvas.offsetTop / cRatioH;

  console.log('Canvas', canvas, canvas.offsetWidth, canvas.offsetHeight)
  state.playerX = ((body.offsetWidth / 2) / cRatioW) - canvasAdjustLeft;
  state.playerY = ((body.offsetHeight / 1.25) / cRatioH) - canvasAdjustRight;

  console.log('State', state.playerX, state.playerY)

  // const lScaledX = ((lettersSprite.x * SCALE));
  // const lScaledY = ((lettersSprite.y * SCALE));
  // lettersSprite.x = lScaledX;
  // lettersSprite.y = lScaledY;

  scoreText = getBoldText('score', 5, 7);
  pauseText = getBoldText('pause', 112, 7);
  sectorText = getBoldText('sector', 56, 2);
  thirteenText = getBoldNumbers('13', 70, 12)

  console.log('scoreText', scoreText);

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
