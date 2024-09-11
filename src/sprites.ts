import {
  angleToTarget,
  clamp,
  movePoint,
  randInt,
  Sprite,
  SpriteClass,
  SpriteSheet,
} from 'kontra';
import playerShipPath from './assets/images/player-ship.gif';
import enemyBlueOnePath from './assets/images/enemy-ship.gif';
import enemyGreenPath from './assets/images/enemyGreen.gif';
import enemyYellowOnePath from './assets/images/enemyYellowOne.gif';
import enemyYellowTwoPath from './assets/images/enemyYellowTwo.gif';
import enemyPinkPath from './assets/images/enemyPink.gif';
import enemyBlueTwoPath from './assets/images/enemyBlueTwo.gif';
import enemyBulletPath from './assets/images/enemyBullet.gif';
import enemyBombPath from './assets/images/enemyBomb.gif';
import lettersBoldPath from './assets/images/lettersBold3.gif';
import numbersBoldPath from './assets/images/numbersBold.gif';
import lettersPath from './assets/images/letters.gif';
import lettersFullPath from './assets/images/lettersFull.gif';
import numbersPath from './assets/images/numbers2.gif';
import explosionPath from './assets/images/explosion.gif';
import powerupPath from './assets/images/powerups.gif';
import shieldPath from './assets/images/shield.png';
import { SCALE, WIDTH } from './constants';
import { data, Enemies } from './data';
import { state } from './state';
import { sfx } from './music';
import { enemyProjectileManager, scoreDisplayManager, scoreMultDisplayManager } from './spriteManager';

console.log('7. Sprites');

const loaded = [];
const totalLoads = 17;

function makeSprites(startFn: () => void) {
  console.log('10. Window Loaded');
  function checkLoaded(loadedImage: HTMLImageElement) {
    loaded.push(loadedImage);

    if (loaded.length === totalLoads && startFn) {
      console.log('11. All sprites loaded');
      startFn();
    }
  }

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

  data.images[Enemies.enemyBlueOne].src = enemyBlueOnePath;
  data.images[Enemies.enemyBlueOne].onload = function () {
    data.spriteSheets[Enemies.enemyBlueOne] = SpriteSheet({
      image: data.images[Enemies.enemyBlueOne],
      frameWidth: 15,
      frameHeight: 12,
      animations: {
        engine: {
          frames: '0..1',
          frameRate: 10
        }
      }
    });

    checkLoaded(data.images[Enemies.enemyBlueOne]);
  }

  data.images[Enemies.enemyGreen].src = enemyGreenPath;
  data.images[Enemies.enemyGreen].onload = function () {
    data.spriteSheets[Enemies.enemyGreen] = SpriteSheet({
      image: data.images[Enemies.enemyGreen],
      frameWidth: 15,
      frameHeight: 16,
      animations: {
        engine: {
          frames: '0..1',
          frameRate: 10
        }
      }
    });

    checkLoaded(data.images[Enemies.enemyGreen]);
  }

  data.images[Enemies.enemyYellowOne].src = enemyYellowOnePath;
  data.images[Enemies.enemyYellowOne].onload = function () {
    data.spriteSheets[Enemies.enemyYellowOne] = SpriteSheet({
      image: data.images[Enemies.enemyYellowOne],
      frameWidth: 11,
      frameHeight: 11,
      animations: {
        engine: {
          frames: '0..1',
          frameRate: 10
        }
      }
    });

    checkLoaded(data.images[Enemies.enemyYellowTwo]);
  }

  data.images[Enemies.enemyYellowTwo].src = enemyYellowTwoPath;
  data.images[Enemies.enemyYellowTwo].onload = function () {
    data.spriteSheets[Enemies.enemyYellowTwo] = SpriteSheet({
      image: data.images[Enemies.enemyYellowTwo],
      frameWidth: 11,
      frameHeight: 11,
      animations: {
        engine: {
          frames: '0..1',
          frameRate: 10
        }
      }
    });

    checkLoaded(data.images[Enemies.enemyYellowTwo]);
  }

  data.images[Enemies.enemyPink].src = enemyPinkPath;
  data.images[Enemies.enemyPink].onload = function () {
    data.spriteSheets[Enemies.enemyPink] = SpriteSheet({
      image: data.images[Enemies.enemyPink],
      frameWidth: 9,
      frameHeight: 16,
      animations: {
        engine: {
          frames: '0..1',
          frameRate: 10
        }
      }
    });

    checkLoaded(data.images[Enemies.enemyPink]);
  }

  data.images[Enemies.enemyBlueTwo].src = enemyBlueTwoPath;
  data.images[Enemies.enemyBlueTwo].onload = function () {
    data.spriteSheets[Enemies.enemyBlueTwo] = SpriteSheet({
      image: data.images[Enemies.enemyBlueTwo],
      frameWidth: 15,
      frameHeight: 13,
      animations: {
        engine: {
          frames: '0..1',
          frameRate: 10
        }
      }
    });

    checkLoaded(data.images[Enemies.enemyBlueTwo]);
  }

  data.images.enemyBullet.src = enemyBulletPath;
  data.images.enemyBullet.onload = function () {
    data.spriteSheets.enemyBullet = SpriteSheet({
      image: data.images.enemyBullet,
      frameWidth: 3,
      frameHeight: 3,
      animations: {
        engine: {
          frames: '0',
          frameRate: 0
        }
      }
    });

    checkLoaded(data.images.enemyBullet);
  }

  data.images.enemyBomb.src = enemyBombPath;
  data.images.enemyBomb.onload = function () {
    data.spriteSheets.enemyBomb = SpriteSheet({
      image: data.images.enemyBomb,
      frameWidth: 5,
      frameHeight: 5,
      animations: {
        engine: {
          frames: '0..1',
          frameRate: 4
        }
      }
    });

    checkLoaded(data.images.enemyBomb);
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

  data.images.lettersFull.src = lettersFullPath;
  data.images.lettersFull.onload = () => {
    checkLoaded(data.images.lettersFull)
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

export class Enemy extends SpriteClass {
  initialized = false;
  startTime = 0;
  shield?: Sprite = undefined;
  shieldIntegrity: number = 0;
  type: Enemies;
  odx: number = 0;
  ody: number = 0;
  maxLife: number = 360;
  points: number = 10;
  spawnAdjust: number;

  constructor(properties: any) {
    super(properties);
    this.type = properties.type;
    this.points = data.points[this.type];
    this.startTime = state.totalTime;
    this.spawnAdjust = state.isAndroid && state.currentSectorNumber === 11 ? 2 : 1;

    if (this.type === Enemies.enemyGreen) {
      this.shield = getShield(this.x, this.y)
      this.shieldIntegrity = 4;
    }
  }

  get lifespan() {
    return state.totalTime - this.startTime;
  }

  hit() {
    if (this.shield) {
      this.shieldIntegrity -= 1;
    } else {
      const points = Math.round(this.points * state.scoreMult)
      scoreDisplay(points, this.x, this.y)
      state.score += points;
      this.opacity = 0;
      adjustFear(-1)
    }
  }

  update() {
    this.shield?.update();
    super.update()
  }

  render() {
    this.shield?.render();
    super.render();
  }

  draw() {
    switch (this.shieldIntegrity) {
      default:
      case 0:
        this.shield = undefined;
        break;
      case 1:
        this.shield?.playAnimation('1')
        break;
      case 2:
        this.shield?.playAnimation('2')
        break;
      case 3:
        this.shield?.playAnimation('3')
        break;
      case 4:
        this.shield?.playAnimation('4')
        break;
    }

    if (this.shield) {
      this.shield.x = this.x;
      this.shield.y = this.y;
    }

    switch (this.type) {
      case Enemies.enemyBlueOne:
        if (randInt(0, 500) === 0) {
          enemyProjectileManager.add(getEnemyLaser(this.x, this.y, { dy: this.dy + 10 }))
        }
        break;
      case Enemies.enemyYellowOne:
        if (this.lifespan % (120 * this.spawnAdjust) === 0) {
          enemyProjectileManager.add(getEnemyBomb(this.x, this.y, { dy: this.ody, dx: this.odx }))
        }
        break;
      case Enemies.enemyBlueTwo:
        if (randInt(0, 250 * this.spawnAdjust) === 0) {
          enemyProjectileManager.add(getEnemyBullet(this.x, this.y))
        }
        break;
      default:
        break;
    }

    super.draw();
  }
}

function getEnemyShip(type: Enemies) {
  return new Enemy({
    x: 0,
    y: -10 * SCALE,
    scaleX: 10,
    scaleY: 10,
    anchor: { x: 0.5, y: 0.5 },
    animations: data.spriteSheets[type]!.animations,
    type
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
    color: 'orange',
    ...override
  })
}

function getEnemyLaser(x: number, y: number, override = {}) {
  return Sprite({
    x,
    y,
    width: 10,
    height: 100,
    color: '#ff00ff',
    ...override
  })
}

function getEnemyBomb(x: number, y: number, override = {}) {
  return Sprite({
    x,
    y,
    scaleX: 10,
    scaleY: 10,
    animations: data.spriteSheets.enemyBomb?.animations,
    ...override
  })
}

export function scoreDisplay(num: number, x: number, y: number, isPowerup: boolean = false) {
  let manager = isPowerup ? scoreMultDisplayManager : scoreDisplayManager;
  let dxDir;

  if (isPowerup) {
    dxDir = 1;

  } else {
    dxDir = (!!randInt(0, 1) ? -1 : 1);
  }

  const dx = (isPowerup ? 0 : randInt(3, 7)) * dxDir;
  const dy = isPowerup ? -1 : -randInt(4, 8);

  const options = {
    opacity: isPowerup ? 1 : .8,
    anchor: { x: 0, y: 0 },
    dx,
    dy,
  }

  let _x = (isPowerup ? data.sprites.player.x : x) * .1 + (isPowerup ? 8 : 0);
  let _y = (isPowerup ? data.sprites.player.y : y) * .1 - (isPowerup ? 10 : 0);

  if (isPowerup) manager.add(getText('x', _x - 3, _y + 1, { ...options, scale: 7 }));
  manager.add(getNumbers((num).toString(), _x, _y, { ...options }));
}

const commsSprite = Sprite({
  x: 30, width: WIDTH - 60, y: 800, height: 800, color: 'black',
  render: function () {
    this.draw();
    this.context!.strokeStyle = 'white';
    this.context!.lineWidth = 10;
    this.context!.strokeRect(0, 0, this.width!, this.height!);
  }
})

const fearSprite = Sprite({
  x: 22 * SCALE,
  y: 256 * SCALE,
  width: WIDTH - (26 * SCALE),
  height: 7 * SCALE,
  color: 'black',
  render: function () {
    this.draw();
    this.context!.strokeStyle = 'white';
    this.context!.lineWidth = 10;
    this.context!.strokeRect(0, 0, this.width!, this.height!);
  }
})

const fearSpriteInner = Sprite({
  x: fearSprite.x + 20,
  y: fearSprite.y + 25,
  width: fearSprite.width - 40,
  height: fearSprite.height - 50,
  color: 'white',
})

function adjustFear(amount: number = 0) {
  state.fear = clamp(0, 100, state.fear + amount);
  state.rofAdjust = Math.ceil((0 + state.fear) / 10) || 0
  state.rngAdjust = Math.floor(0 + state.fear) * 4 || 0
  fearSpriteInner.width = (fearSprite.width - 40) * (state.fear / 100);
}

export class EnemyBullet extends SpriteClass {
  angle: number;
  speed: number;

  constructor(properties: any) {
    super(properties)
    this.angle = angleToTarget(this, data.sprites.player)
    this.speed = state.isAndroid && state.currentSectorNumber === 11 ? 5 : 20;
  }

  draw() {
    const { x, y } = movePoint(this, this.angle, this.speed);
    this.x = x;
    this.y = y;
    super.draw()
  }
}

function getEnemyBullet(x: number, y: number, override = {}) {
  return new EnemyBullet({
    x,
    y,
    scaleX: 10,
    scaleY: 10,
    animations: data.spriteSheets.enemyBullet?.animations,
    ...override
  })
}

function getPowerup(x: number, y: number, override?: number): Sprite | undefined {
  const prob = override || randInt(1, 1000 - state.rngAdjust);

  // No shield renew
  if (!override && state.playershield > 0 && prob >= data.powerupprobability.shield[0] && prob <= data.powerupprobability.shield[1]) {
    return

  }

  for (const [key, [lowBound, highBound, firstSectorAllowed]] of Object.entries(data.powerupprobability)) {
    if (prob >= lowBound && prob <= highBound && state.currentSectorNumber >= firstSectorAllowed) {
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
    y: 230,
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

function getShield(x: number, y: number, overrides = {}) {
  return Sprite({
    x,
    y,
    scaleX: SCALE,
    scaleY: SCALE,
    anchor: { x: 0.5, y: 0.5 },
    animations: data.spriteSheets.shield?.animations,
    ...overrides
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
    characters: 'ACDEGHILMNOPRSTUVWY',
  },
  letter: {
    image: data.images.letters,
    letterWidth: 4,
    letterHeight: 5,
    characters: 'ceorst',
  },
  letterFull: {
    image: data.images.lettersFull,
    letterWidth: 4,
    letterHeight: 5,
    characters: 'abcdefghijklmnopqrstuvwxyz',
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
  sectorButton?: boolean;
  anchor?: { x: number, y: number };
  dx?: number;
  dy?: number;
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
    dx: options.dx || 0,
    dy: options.dy || 0,
    anchor: options.anchor || { x: 0, y: 0 },
    render: function () {
      // draw the game object normally (perform rotation and other transforms)
      this.draw();
      if (options.button || options.sectorButton) {
        // outline the game object
        this.context!.strokeStyle = 'white';
        this.context!.lineWidth = 1;
        this.context!.strokeRect(-2, -2, this.width! + (options.bold ? 2 : 3), this.height! + (options.sectorButton ? 10 : 4));
      }
    }
  });
}

const getScoreText = (score?: number) => (new Array(10 - (score || state.score).toString().length).fill(0).join('') + (score || state.score).toString());
const getBoldText = (text: string, x: number, y: number, options?: {}) => getTextSprite(text, x, y, textTypes.letterBold, { ...options, bold: true });
const getText = (text: string, x: number, y: number, options?: {}) => getTextSprite(text, x, y, textTypes.letterFull, options);
const getBoldNumbers = (text: string, x: number, y: number, options?: {}) => getTextSprite(text, x, y, textTypes.numberBold, { ...options, bold: true });
const getNumbers = (text: string, x: number, y: number, options?: {}) => getTextSprite(text, x, y, textTypes.number, options);
const getScore = (score?: number) => getNumbers(getScoreText(score), 5, 18);

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
  getBomb,
  getEnemyLaser,
  getEnemyBomb,
  getEnemyBullet,
  commsSprite,
  fearSprite,
  fearSpriteInner,
  adjustFear,
  getScoreText
};
