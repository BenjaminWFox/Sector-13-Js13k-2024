import {
  randInt,
  Sprite,
  SpriteSheet,
} from 'kontra';
import playerShipPath from './assets/images/player-ship.gif';
import enemyShipPath from './assets/images/enemy-ship.gif';
import lettersBoldPath from './assets/images/lettersBold2.gif';
import numbersBoldPath from './assets/images/numbersBold.gif';
import lettersPath from './assets/images/letters.gif';
import numbersPath from './assets/images/numbers.gif';
import explosionPath from './assets/images/explosion.gif';
import powerupPath from './assets/images/powerups.gif';
import shieldPath from './assets/images/shield.png';
import { SCALE, WIDTH } from './constants';
import { data } from './data';
import { state } from './state';
import { sfx } from './music';

const loaded = [];
const totalLoads = 9;

function makeSprites(startFn: () => void) {
  function checkLoaded(loadedImage: HTMLImageElement) {
    loaded.push(loadedImage);

    if (loaded.length === totalLoads && startFn) {
      startFn();
    }
  }

  // const playerShipImg = new Image();
  data.images.player.src = playerShipPath;
  data.images.player.onload = function () {
    data.sprites.player = Sprite({
      x: 1100,
      y: 1000,
      scaleX: 10,
      scaleY: 10,
      anchor: { x: 0.5, y: 0.5 },
      animations: SpriteSheet({
        image: data.images.player,
        frameWidth: 17,
        frameHeight: 15,
        animations: {
          engine: {
            frames: '0..1',
            frameRate: 15
          }
        }
      }).animations
    });

    data.sprites.life = Sprite({
      scaleX: 6,
      scaleY: 6,
      animations: SpriteSheet({
        image: data.images.player,
        frameWidth: 17,
        frameHeight: 15,
        animations: {
          engine: {
            frames: '0',
            frameRate: 0
          }
        }
      }).animations
    })

    checkLoaded(data.images.player);
  }

  data.images.enemy.src = enemyShipPath;
  data.images.enemy.onload = function () {
    data.spriteSheets.enemy = SpriteSheet({
      image: data.images.enemy,
      frameWidth: 15,
      frameHeight: 12,
      animations: {
        engine: {
          frames: '0..1',
          frameRate: 10
        }
      }
    });

    checkLoaded(data.images.enemy);
  }

  data.images.shield.src = shieldPath;
  data.images.shield.onload = function () {
    data.spriteSheets.shield = SpriteSheet({
      image: data.images.shield,
      frameWidth: 21,
      frameHeight: 21,
      animations: {
        4: {
          frames: '0',
          frameRate: 0
        },
        3: {
          frames: '1',
          frameRate: 0
        },
        2: {
          frames: '2',
          frameRate: 0
        },
        1: {
          frames: '3',
          frameRate: 0
        }
      }
    });

    checkLoaded(data.images.shield);
  }

  data.images.powerups.src = powerupPath;
  data.images.powerups.onload = function () {
    data.spriteSheets.powerups = SpriteSheet({
      image: data.images.powerups,
      frameWidth: 7,
      frameHeight: 7,
      animations: {
        wingshot: {
          frames: '0',
          frameRate: 0,
        },
        trishot: {
          frames: '1',
          frameRate: 0
        },
        doublerate: {
          frames: '2',
          frameRate: 0
        },
        bomb: {
          frames: '3',
          frameRate: 0
        },
        wingbomb: {
          frames: '4',
          frameRate: 0
        },
        shield: {
          frames: '5',
          frameRate: 0
        },
        extralife: {
          frames: '6',
          frameRate: 0
        },
      }
    });

    checkLoaded(data.images.powerup);
  }

  data.images.lettersBold.src = lettersBoldPath;
  data.images.lettersBold.onload = () => {
    checkLoaded(data.images.lettersBold)
  }

  data.images.letters.src = lettersPath;
  data.images.letters.onload = () => {
    checkLoaded(data.images.letters)
  }

  data.images.numbersBold.src = numbersBoldPath;
  data.images.numbersBold.onload = () => {
    checkLoaded(data.images.numbersBold)
  }

  data.images.numbers.src = numbersPath;
  data.images.numbers.onload = () => {
    checkLoaded(data.images.numbers)
  }

  data.images.explosion.src = explosionPath;
  data.images.explosion.onload = () => {
    checkLoaded(data.images.explosion)
  }
}

function getEnemyShip() {
  return Sprite({
    x: 0,
    y: -10 * SCALE,
    scaleX: 10,
    scaleY: 10,
    anchor: { x: 0.5, y: 0.5 },
    dy: 4,
    animations: data.spriteSheets.enemy!.animations
  });
}

function getBullet(override = {}) {
  sfx(data.sounds.bullet);

  return Sprite({
    x: state.playerX - 10,
    y: state.playerY - 100,
    width: 10,
    height: 30,
    color: 'red',
    dy: -20,
    ...override
  })
}

function getBomb(override = {}) {
  sfx(data.sounds.bullet);

  return Sprite({
    x: state.playerX - 10,
    y: state.playerY - 100,
    width: 30,
    height: 30,
    color: 'purple',
    ...override
  })
}

function getPowerup(x: number, y: number): Sprite | undefined {
  const prob = randInt(1, 1000);
  for (const [key, value] of Object.entries(data.powerupprobability)) {
    if (prob >= value[0] && prob <= value[1]) {
      const s = Sprite({
        x,
        y,
        scaleX: SCALE,
        scaleY: SCALE,
        width: 7,
        height: 7,
        dy: randInt(2, 9),
        animations: data.spriteSheets.powerups?.animations
      });
      s.playAnimation(key);
      return s;
    }
  }

  return;
}

function getExplosion(x: number, y: number) {
  sfx(data.sounds.explode);
  const r = randInt(1, 4);
  return Sprite({
    x,
    y,
    scaleX: SCALE,
    scaleY: SCALE,
    rotation: r === 4 ? 90 : r === 3 ? 180 : r === 2 ? 270 : 0,
    anchor: { x: 0.5, y: 0.5 },
    animations: SpriteSheet({
      image: data.images.explosion,
      frameWidth: 17,
      frameHeight: 15,
      animations: {
        explode: {
          frames: '0..2',
          frameRate: 8,
          loop: false
        }
      }
    }).animations
  })
}

function getLife(x: number) {
  return Sprite({
    y: 210,
    x: WIDTH - ((18 * 6) * (1 + x)),
    scaleX: 6,
    scaleY: 6,
    anchor: { x: 0.5, y: 0.5 },
    animations: SpriteSheet({
      image: data.images.player,
      frameWidth: 17,
      frameHeight: 15,
      animations: {
        engine: {
          frames: '0',
          frameRate: 0
        }
      }
    }).animations
  })
}

function getShield(x: number, y: number) {
  return Sprite({
    x,
    y,
    scaleX: SCALE,
    scaleY: SCALE,
    anchor: { x: 0.5, y: 0.5 },
    animations: data.spriteSheets.shield?.animations
  })
}

type TextType = {
  image: HTMLImageElement,
  letterWidth: number,
  letterHeight: number,
  characters: string,
}
const textTypes: Record<string, TextType> = {
  letterBold: {
    image: data.images.lettersBold,
    letterWidth: 7,
    letterHeight: 8,
    characters: 'ACEGILMNOPRSTUVW',
  },
  letter: {
    image: data.images.letters,
    letterWidth: 4,
    letterHeight: 5,
    characters: 'ceorst',
  },
  numberBold: {
    image: data.images.numbersBold,
    letterWidth: 7,
    letterHeight: 8,
    characters: '13',
  },
  number: {
    image: data.images.numbers,
    letterWidth: 4,
    letterHeight: 5,
    characters: '0123456789',
  },
}
type Options = {
  bold?: boolean;
  scale?: number;
  button?: boolean;
}

function getTextSprite(text: string, x: number, y: number, type: TextType, options: Options = {}) {
  text = options.bold ? text.toUpperCase() : text;
  const { letterWidth, letterHeight, characters, image } = type;
  const textCanvas = document.createElement('canvas') as HTMLCanvasElement;
  const context = textCanvas.getContext('2d')!;
  textCanvas.height = letterHeight;
  textCanvas.width = letterWidth * text.length;
  const textArr = text.split('');

  for (let i = 0; i < textArr.length; i += 1) {
    const char = textArr[i];
    const charIndex = characters.indexOf(char);

    context.drawImage(image, charIndex * letterWidth, 0, letterWidth, letterHeight, i * letterWidth, 0, letterWidth, letterHeight);
  }

  return Sprite({
    image: textCanvas,
    scaleX: options.scale || SCALE,
    scaleY: options.scale || SCALE,
    x: x * SCALE,
    y: y * SCALE,
  });
}

const getBoldText = (text: string, x: number, y: number, options?: {}) => getTextSprite(text, x, y, textTypes.letterBold, { ...options, bold: true });
const getText = (text: string, x: number, y: number, options?: {}) => getTextSprite(text, x, y, textTypes.letter, options);
const getBoldNumbers = (text: string, x: number, y: number, options?: {}) => getTextSprite(text, x, y, textTypes.numberBold, { ...options, bold: true });
const getNumbers = (text: string, x: number, y: number, options?: {}) => getTextSprite(text, x, y, textTypes.number, options);
const getScore = () => getNumbers((new Array(10 - state.score.toString().length).fill(0).join('') + state.score.toString()), 5, 18);

export {
  makeSprites,
  getEnemyShip,
  getBoldText,
  getText,
  getBoldNumbers,
  getNumbers,
  getShield,
  getBullet,
  getLife,
  getScore,
  getExplosion,
  getPowerup,
  getBomb
};
