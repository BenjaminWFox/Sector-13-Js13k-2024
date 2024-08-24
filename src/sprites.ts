import {
  init,
  Sprite,
  GameLoop,
  SpriteSheet,
} from 'kontra';
import playerShipPath from './assets/images/player-ship.gif';
import enemyShipPath from './assets/images/enemy-ship.gif';

function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}

const loaded = [];
const totalLoads = 2;

let playerShip: Sprite = Sprite();
let enemySheet: SpriteSheet;

function makeSprites(startFn: () => void) {

  function checkLoaded(loadedImage: HTMLImageElement) {
    console.log('checkloaded', loaded.length);
    loaded.push(loadedImage);

    if (loaded.length === totalLoads && startFn) {
      console.log('Start');
      startFn();
    }
  }

  const playerShipImg = new Image();
  playerShipImg.src = playerShipPath;
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

    checkLoaded(playerShipImg);
  }

  const enemyShipImg = new Image();
  enemyShipImg.src = enemyShipPath;
  enemyShipImg.onload = function () {
    enemySheet = SpriteSheet({
      image: enemyShipImg,
      frameWidth: 15,
      frameHeight: 12,
      animations: {
        engine: {
          frames: '0..1',
          frameRate: 10
        }
      }
    });

    checkLoaded(enemyShipImg);
  }
}

function getEnemyShip() {
  return Sprite({
    x: 1100,
    y: -100,
    scaleX: 10,
    scaleY: 10,
    anchor: { x: 0.5, y: 0.5 },
    dy: 4,
    animations: enemySheet.animations,
    id: uuidv4(),
    isAlive: () => { }
  });
}

export { makeSprites, playerShip, getEnemyShip };
