import { Scene, Sprite, SpriteSheet } from "kontra";
import { HEIGHT, WIDTH } from "./constants";

console.log('3. Data');

function makeElement<T>(el: string) { return document.createElement(el) as T };
const makeImage = () => makeElement<HTMLImageElement>('img');

type Data = {
  sounds: Record<string, Array<number | undefined>>
  elements: {
    body: HTMLElement,
    canvas: HTMLCanvasElement
  };
  scenes: Record<string, Scene>;
  labels: Record<string, string>;
  images: Record<string, HTMLImageElement>;
  sprites: Record<string, Sprite>;
  spriteSheets: Record<string, SpriteSheet | undefined>;
  calculations: Record<string, number>;
  buttons: {
    pause: Sprite;
    restart: Sprite;
    story: Sprite;
    hardcore: Sprite;
    sectors: Record<string, Sprite>;
  },
  points: Record<string, number>,
  powerupprobability: Record<string, Array<number>>
}

const labels = {
  sector: 'sector',
  pause: 'pause',
  score: 'score',
  thirteen: '13',
  select: 'select',
  title: 't',
  game: 'g',
  pregame: 'pg',
  stars: 'st',
  end: 'e',
  restart: 'restart',
  gameover: 'gameover',
  winner: 'you win',
  loser: 'you lose',
  extralife: 'xl',
  communication: 'co',
  fear: 'fear',
  highscore: 'highscore',
  story: 'story',
  hardcore: 'hardcore',
}

export enum Enemies {
  enemyBlueOne = 'a',
  enemyBlueTwo = 'b',
  enemyGreen = 'c',
  enemyPink = 'd',
  enemyYellowOne = 'e',
  enemyYellowTwo = 'f',
}

function initData(): Data {
  return {
    sounds: {
      sectorClear: [1.1, , 31, .05, .07, .31, 2, 3.2, , , , , , .6, , .3, , .41, .25], // [1.5, , 52, .18, .19, .21, 1, 1.4, , , 418, .14, .18, .2, , , .39, .63, .24],
      bullet: [.2, , 450, .03, .08, .17, 1, 1.1, -6, 16, , , , , , , , .85, .2, , 161],
      explode: [1, , 39, .07, .13, .5, 2, 3.1, -8, , , , , .2, , .3, , .32, .06, , 1952],
      powerup: [.7, .01, 65.40639, , .01, , , 1.9, , , 100, .04, , .5, , .1, , .98, .03, , 329],
      button: [.5, 0, 216, , .01, .02, 3, 4.3, , , 349, .04, , , , , , .64, .03, , -648]
    },
    elements: {
      body: makeElement<HTMLElement>('body'),
      canvas: makeElement<HTMLCanvasElement>('canvas')!,
    },
    scenes: {
      title: Scene({ id: labels.title }),
      select: Scene({ id: labels.select }),
      pregame: Scene({ id: labels.pregame }),
      game: Scene({ id: labels.game }),
      stars: Scene({ id: labels.stars }),
      end: Scene({ id: labels.end }),
      communication: Scene({ id: labels.communication }),
      fear: Scene({ id: labels.fear })
    },
    labels,
    images: {
      letters: makeImage(),
      lettersFull: makeImage(),
      lettersBold: makeImage(),
      numbers: makeImage(),
      numbersBold: makeImage(),
      player: makeImage(),
      explosion: makeImage(),
      powerups: makeImage(),
      shield: makeImage(),
      enemyBullet: makeImage(),
      enemyBomb: makeImage(),
      [Enemies.enemyBlueOne]: makeImage(),
      [Enemies.enemyBlueTwo]: makeImage(),
      [Enemies.enemyGreen]: makeImage(),
      [Enemies.enemyYellowOne]: makeImage(),
      [Enemies.enemyYellowTwo]: makeImage(),
      [Enemies.enemyPink]: makeImage(),
    },
    sprites: {
      player: Sprite(),
      enemy: Sprite(),
      life: Sprite(),
      explosion: Sprite(),
      powerup: Sprite(),
    },
    spriteSheets: {
      player: undefined,
      explosion: undefined,
      powerups: undefined,
      shield: undefined,
      enemyBullet: undefined,
      enemyBomb: undefined,
      [Enemies.enemyBlueOne]: undefined,
      [Enemies.enemyBlueTwo]: undefined,
      [Enemies.enemyGreen]: undefined,
      [Enemies.enemyYellowOne]: undefined,
      [Enemies.enemyYellowTwo]: undefined,
      [Enemies.enemyPink]: undefined,
    },
    points: {
      [Enemies.enemyBlueOne]: 20,
      [Enemies.enemyBlueTwo]: 40,
      [Enemies.enemyGreen]: 60,
      [Enemies.enemyYellowOne]: 100,
      [Enemies.enemyYellowTwo]: 10,
      [Enemies.enemyPink]: 80,
    },
    calculations: {
      canvasRatioWidth: 0,
      canvasRatioHeight: 0,
      canvasAdjustLeft: 0,
      canvasAdjustRight: 0,
      canvasMaxHeight: 0,
      canvasMaxWidth: 0,
    },
    buttons: {
      pause: Sprite(),
      restart: Sprite(),
      story: Sprite(),
      hardcore: Sprite(),
      sectors: {}
    },
    // Index 0 & 1 are bounds for RNG. Index 2 is first sector powerup is found.
    powerupprobability: {
      wingshot: [1, 20, 3],
      trishot: [30, 50, 7],
      doublerate: [60, 65, 1],
      bomb: [70, 85, 5],
      wingbomb: [90, 95, 8],
      shield: [100, 120, 2],
      extralife: [130, 135, 6],
    }
  }
}

const data = { ...initData() }

function initCalculations(c: HTMLCanvasElement) {
  data.calculations.canvasRatioWidth = c.offsetWidth / WIDTH;
  data.calculations.canvasRatioHeight = c.offsetHeight / HEIGHT;
  data.calculations.canvasAdjustLeft = c.offsetLeft / data.calculations.canvasRatioWidth;
  data.calculations.canvasAdjustRight = c.offsetTop / data.calculations.canvasRatioHeight;
  data.calculations.canvasMaxHeight = data.elements.canvas.offsetHeight / data.calculations.canvasRatioHeight;
  data.calculations.canvasMaxWidth = data.elements.canvas.offsetWidth / data.calculations.canvasRatioWidth;
}
function initElements(c: HTMLCanvasElement, b: HTMLElement) {
  data.elements.canvas = c;
  data.elements.body = b;
}
function adjustedX(x: number) {
  return (x / data.calculations.canvasRatioWidth) - data.calculations.canvasAdjustLeft
}

function adjustedY(y: number) {
  return (y / data.calculations.canvasRatioHeight) - data.calculations.canvasAdjustRight
}

export { data, initCalculations, initElements, adjustedX, adjustedY }
