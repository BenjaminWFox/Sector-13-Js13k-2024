import {
  init,
  Sprite,
  GameLoop,
  SpriteSheet,
} from 'kontra';
import { WIDTH, HEIGHT } from './constants';
import playerShipPath from './assets/images/player-ship.gif';

const { canvas } = init();

const loaded = [];
const totalLoads = 2;

const state = {
  playerX: 0,
  playerY: 0
}

function checkLoaded(loadedImage: HTMLImageElement) {
  loaded.push(loadedImage);
  if (loaded.length === totalLoads && startGame) {
    startGame();
  }
}

let playerShip: Sprite = Sprite();
const playerShipImg = new Image();
playerShipImg.src = playerShipPath;
playerShipImg.width = 35;
playerShipImg.height = 15;
playerShipImg.onload = function () {
  let spriteSheet = SpriteSheet({
    image: playerShipImg,
    frameWidth: 17,
    frameHeight: 15,
    animations: {
      engine: {
        frames: '0..1',
        frameRate: 15
      }
    }
  });

  playerShip = Sprite({
    x: 1100,
    y: 1000,
    scaleX: 10,
    scaleY: 10,
    anchor: { x: 0.5, y: 0.5 },
    animations: spriteSheet.animations
  });

  startGame()
}

let loop = GameLoop({
  update: function () {
    playerShip.update();
    playerShip.x = state.playerX;
    playerShip.y = state.playerY;
  },
  render: function () {
    playerShip.render();
  }
});

let cRatioW = canvas.offsetWidth / WIDTH;
let cRatioH = canvas.offsetHeight / HEIGHT;
let canvasAdjustLeft = canvas.offsetLeft / cRatioW;
let canvasAdjustRight = canvas.offsetTop / cRatioH;

window.addEventListener('resize', () => {
  cRatioW = canvas.offsetWidth / WIDTH;
  cRatioH = canvas.offsetHeight / HEIGHT;
  canvasAdjustLeft = canvas.offsetLeft / cRatioW;
  canvasAdjustRight = canvas.offsetTop / cRatioH;
})

function startGame() {
  const b = document.getElementById('b')!;
  playerShip.playAnimation('engine');

  cRatioW = canvas.offsetWidth / WIDTH;
  cRatioH = canvas.offsetHeight / HEIGHT;
  canvasAdjustLeft = canvas.offsetLeft / cRatioW;
  canvasAdjustRight = canvas.offsetTop / cRatioH;

  console.log(canvas.offsetWidth, canvas.offsetHeight)
  state.playerX = ((b.offsetWidth / 2) / cRatioW) - canvasAdjustLeft;
  state.playerY = ((b.offsetHeight / 1.25) / cRatioH) - canvasAdjustRight;

  console.log(state.playerX, state.playerY)

  loop.start();
}

// Mouse Handler
document.getElementById('c')!.addEventListener('mousemove', (e) => {
  console.log(e);

  state.playerX = (e.x / cRatioW) - canvasAdjustLeft;
  state.playerY = (e.y / cRatioH) - canvasAdjustRight;
});
