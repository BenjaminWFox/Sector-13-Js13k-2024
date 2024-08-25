import {
  init,
  Sprite,
  GameLoop,
  initPointer,
  Button,
} from 'kontra';
import { WIDTH, HEIGHT } from './constants';
import { makeSprites, playerShip, getEnemyShip, getBoldText, getBoldNumbers, getText, getNumbers } from './sprites';
import { gameScene, selectScene, titleScene } from './scenes';
import { data } from './data';

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
const xPosition = 750;
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
    this.enemies.push(getEnemyShip());
    this.spawned += 1;
  }
  update() {
    for (const enemy of this.enemies) {
      enemy.x = (Math.cos((enemy.y) / shipXSpeed) * waveXSpread) + xPosition
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
    // playerShip.update();
    // playerShip.x = state.playerX;
    // playerShip.y = state.playerY;

    // enemyManager.update();
  },
  render: function () {
    time += 1;

    // if (time % enemySpawnInterval === 0 && enemyManager.spawned < 13) {
    //   enemyManager.add();
    // }

    // playerShip.render();
    // enemyManager.render();
    // enemyManager.purge();

    titleScene.render();
    // selectScene.render();
    // gameScene.render();
  }
});

let cRatioW = canvas.offsetWidth / WIDTH;
let cRatioH = canvas.offsetHeight / HEIGHT;
let canvasAdjustLeft = canvas.offsetLeft / cRatioW;
let canvasAdjustRight = canvas.offsetTop / cRatioH;

let startGame = () => {
  initPointer();
  body = document.getElementById('body')!;

  cRatioW = canvas.offsetWidth / WIDTH;
  cRatioH = canvas.offsetHeight / HEIGHT;
  canvasAdjustLeft = canvas.offsetLeft / cRatioW;
  canvasAdjustRight = canvas.offsetTop / cRatioH;

  state.playerX = ((body.offsetWidth / 2) / cRatioW) - canvasAdjustLeft;
  state.playerY = ((body.offsetHeight / 1.25) / cRatioH) - canvasAdjustRight;

  titleScene.add(
    ...(() => [
      // title
      getBoldText(data.labels.sector, 11, 38, 32),
      // number 13
      getBoldNumbers(data.labels.thirteen, 59, 70, 32),
      // start
      getBoldText(data.labels.start, 59, 164),
      // Sprite({
      //   x: 300,
      //   y: 400,
      //   anchor: { x: 0.5, y: 0.5 },

      //   // required for a rectangle sprite
      //   width: 200,
      //   height: 40,
      //   color: 'red'
      // }),
      // Button({
      //   x: 300,
      //   y: 100,
      //   anchor: { x: 0.5, y: 0.5 },

      //   // required for a rectangle sprite
      //   width: 200,
      //   height: 40,
      //   color: 'red',
      //   text: {
      //     text: 'Interact with me',
      //     color: 'white',
      //     font: '20px Arial, sans-serif',
      //     anchor: { x: 0.5, y: 0.5 }
      //   }
      // })
    ])(),
  )

  console.log(titleScene.objects[0])

  // coordinates of each button for sector selection
  const arr = [[93, 234], [93, 205], [93, 176], [93, 147], [93, 118], [93, 89], [33, 234], [33, 205], [33, 176], [33, 147], [33, 118], [33, 89], [63, 58]
  ];
  selectScene.add(
    ...(() => [
      getBoldText(data.labels.select, 33, 21),
      getBoldText(data.labels.sector, 77, 21),
      // sector select buttons
      ...arr.map(([x, y]) => getText(data.labels.sector, x, y)),
      ...arr.map(([x, y], i) => getNumbers((i + 1).toString(), x + 8, y + 6))
    ])(),
  )

  gameScene.add(
    ...(() => [
      // score
      getBoldText(data.labels.score, 5, 7),
      // pause
      getBoldText(data.labels.pause, 112, 7),
      // sector
      getBoldText(data.labels.sector, 56, 2),
      // 13
      getBoldNumbers(data.labels.thirteen, 70, 12)
    ])(),
  )

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
