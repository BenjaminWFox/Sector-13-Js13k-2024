import {
  init,
  GameLoop,
  lerp,
  setStoreItem,
  Sprite,
} from 'kontra';
import { state } from './state'
import { adjustFear, getBomb, getBullet, getLife, getScore, makeSprites } from './sprites';
import { initScenes, playGameSector } from './scenes';
import { bombManager, bulletManager, enemyProjectileManager, explosionManager, lifeManager, playerShieldManager, powerupManager, scoreDisplayManager, scoreMultDisplayManager } from './spriteManager';
import { adjustedX, adjustedY, data, initCalculations, initElements } from './data';
import { currentSector, endGame, getAllSectors } from './sectorManager';
import { playSong, sfx } from './music';
import { SCALE } from './constants';

console.log('9. Index');

const { canvas } = init();

export function getRandomIntMinMaxInclusive(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function nextSector() {
  state.sectorTime = 0;
  ++state.currentSectorNumber;

  sfx(data.sounds.sectorClear);

  if (state.currentSectorNumber > state.sectors.length) {
    endGame();
  } else {
    setStoreItem(`${state.currentSectorNumber}`, 1)
    state.currentSectorClass = currentSector();
  }
}

let lastScoreUpdate = 0;

const loop = GameLoop({
  update: function () {
    data.scenes.stars.update();
    if (!state.gameOver) {
      data.sprites.player.x = state.playerX;
      data.sprites.player.y = state.playerY;
    }
    data.sprites.player.update();

    if (!data.scenes.game.hidden) {
      /**
       * GAME UPDATES
       */
      bulletManager.update();
      lifeManager.update();
      explosionManager.update();
      state.currentSectorClass.update();
      powerupManager.update();
      playerShieldManager.update();
      bombManager.update()
      enemyProjectileManager.update();
      scoreDisplayManager.update();
      scoreMultDisplayManager.update();
    }

    data.scenes.title.update();
    data.scenes.select.update();
    data.scenes.game.update();
    data.scenes.end.update();
    data.scenes.communication.update();
    data.scenes.fear.update();
  },

  render: function () {
    data.scenes.stars.render();

    data.sprites.player.render();

    if (!data.scenes.game.hidden) {
      if (lastScoreUpdate !== state.score) {
        data.scenes.game.objects[4] = getScore();
        lastScoreUpdate = state.score;
      }

      // Weaponry
      if (!state.gameOver) {
        // Singe shot (possible double ROF)
        if (!state.gameOver && state.totalTime % (state.powerups.doublerate ? 15 - state.rofAdjust : 20 - state.rofAdjust) === 0) {
          bulletManager.add(getBullet())
        }

        // Tri-shot (regular ROF)
        if (state.powerups.trishot && state.totalTime % 20 - state.rofAdjust === 0) {
          bulletManager.add(getBullet({ dx: -10 }))
          bulletManager.add(getBullet({ dx: 10 }))
        }

        // Wing-show (regular ROF)
        if (state.powerups.wingshot && state.totalTime % 20 - state.rofAdjust === 0) {
          bulletManager.add(getBullet({ x: state.playerX - 90, y: state.playerY }))
          bulletManager.add(getBullet({ x: state.playerX + 90, y: state.playerY }))
        }

        // Single-Bomb
        if (state.powerups.bomb && state.totalTime % 60 - state.rofAdjust === 0) {
          bombManager.add(getBomb())
        }

        // Single-Bomb
        if (state.powerups.wingbomb && state.totalTime % 60 - state.rofAdjust === 0) {
          bombManager.add(getBomb({ x: state.playerX - 80, y: state.playerY }))
          bombManager.add(getBomb({ x: state.playerX + 80, y: state.playerY }))
        }
      }

      if (state.lives >= 0) {
        while (lifeManager.assets.length < state.lives) {
          lifeManager.add(getLife(lifeManager.assets.length))
        }
        while (lifeManager.assets.length > state.lives) {
          lifeManager.pop();
        }
      }

      if (!state.gameOver && state.invulnerable) {
        // Loop runs 60fps, so 2.25 seconds invulnerable:
        if (state.totalTime - state.invulnerableAt > 135) {
          state.invulnerable = false;
          data.sprites.player.opacity = 1;
        } else {
          data.sprites.player.opacity += state.invulnableralFlash;
          if (data.sprites.player.opacity >= 1 || data.sprites.player.opacity < .5) {
            state.invulnableralFlash *= -1
          }
        }
      }

      state.currentSectorClass.render();

      if (state.currentSectorClass.completed && !state.gameOver) {
        nextSector();
      }
      /**
       * GAME RENDERS
       */
      bulletManager.render();
      lifeManager.render();
      explosionManager.render();
      powerupManager.render();
      playerShieldManager.render();
      bombManager.render();
      enemyProjectileManager.render();
    }

    data.scenes.title.render();
    data.scenes.select.render();
    data.scenes.game.render();
    data.scenes.end.render();
    data.scenes.communication.render();
    data.scenes.fear.render();
    scoreDisplayManager.render();
    scoreMultDisplayManager.render();

    state.totalTime += 1;
    state.sectorTime += 1;

    if (Math.abs(state.playerX - state.moveToX) > 5) {
      state.playerX = lerp(state.playerX, adjustedX(state.moveToX), .5);
    }
    if (Math.abs(state.playerY - state.moveToY) > 5) {
      state.playerY = lerp(state.playerY, adjustedY(state.moveToY) - state.touchOffset, .5);
    }
  }
});

let startGame = () => {
  console.log('12. StartGame')

  state.isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1 ? true : false;

  initElements(canvas, document.getElementById('body')!)

  initCalculations(canvas);

  initScenes();

  adjustFear();

  state.sectors = getAllSectors();
  state.loop = loop;

  // data.scenes.end.show();
  // data.scenes.game.show();
  // data.scenes.fear.show();
  // data.scenes.communication.show();

  data.scenes.title.show();
  data.sprites.player.x = state.playerX;
  data.sprites.player.y = state.playerY;

  loop.start();
  console.log('-------------------- Finishing Here --------------------\n')
}

// Mouse Handler
document.getElementById('c')!.addEventListener('mousemove', (e) => {
  if (!data.scenes.game.hidden && state.shipEngaged && !state.loop.isStopped && data.scenes.communication.hidden && e.y > 200) {
    state.touchOffset = 150;
    state.moveToX = e.x;
    state.moveToY = e.y;
  }
});
document.getElementById('c')!.addEventListener('touchmove', (e) => {
  if (!data.scenes.game.hidden && state.shipEngaged && !state.loop.isStopped && data.scenes.communication.hidden) {
    state.touchOffset = 150;
    state.moveToX = e.targetTouches[0].clientX;
    state.moveToY = e.targetTouches[0].clientY;
  }
})

let lastDownX = 0;
let lastDownY = 0;
let lastUpX = 0;
let lastUpY = 0;
let inComms = false;
function clickedInBounds(s: Sprite, scale = SCALE) {
  if (
    lastDownX > s.x - 20 && lastUpX > s.x - 20 &&
    lastDownX < s.x + (s.width * scale) + 20 && lastUpX < s.x + (s.width * scale) + 20 &&
    lastDownY > s.y - 20 && lastUpY > s.y - 20 &&
    lastDownY < s.y + (s.height * scale) + 20 && lastUpY < s.y + (s.height * scale) + 20
  ) {
    const r = !data.scenes.communication.hidden ? inComms : true;
    if (r) sfx(data.sounds.button);
    return r;
  }

  return false;
}
document.getElementById('c')!.addEventListener('mousedown', (e) => {
  lastDownX = adjustedX(e.x);
  lastDownY = adjustedY(e.y);
  inComms = data.scenes.communication.hidden ? false : true;
})

document.getElementById('c')!.addEventListener('mouseup', (e) => {
  lastUpX = adjustedX(e.x);
  lastUpY = adjustedY(e.y);

  if (!data.scenes.title.hidden) {
    if (clickedInBounds(data.buttons.story)) {
      data.scenes.title.hide(); data.scenes.select.show();
      playSong();
    }

    if (clickedInBounds(data.buttons.hardcore)) {
      data.scenes.title.hide(); data.scenes.select.show();
      state.hardcore = true;
      playSong();
    }
  }

  if (!data.scenes.game.hidden && data.scenes.communication.hidden) {
    if (clickedInBounds(data.buttons.pause)) {
      state.loop.isStopped ? state.loop.start() : state.loop.stop()
    }
  }

  if (!data.scenes.communication.hidden) {
    if (clickedInBounds(data.scenes.communication.objects[0] as Sprite, 1)) {
      data.scenes.communication.hide();
    }
  }

  if (!data.scenes.select.hidden) {
    for (const [index, sprite] of Object.entries(data.buttons.sectors)) {
      if (clickedInBounds(sprite) && sprite.opacity === 1) {
        playGameSector(Number(index) + 1)
      }
    }
  }

  if (!data.scenes.end.hidden) {
    if (clickedInBounds(data.buttons.restart)) {
      window.location.reload();
    }
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
