import { Scene, Sprite, SpriteSheet } from "kontra";
import { HEIGHT, WIDTH } from "./constants";

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
    start: Sprite;
    pause: Sprite;
    restart: Sprite;
    sectors: Record<string, Sprite>;
  },
  powerupprobability: Record<string, Array<number>>
}

const labels = {
  sector: 'sector',
  pause: 'pause',
  score: 'score',
  thirteen: '13',
  start: 'start',
  select: 'select',
  title: 'title',
  game: 'game',
  pregame: 'pregame',
  stars: 'stars',
  end: 'end',
  restart: 'restart',
  gameover: 'gameover',
  winner: 'winner',
  loser: 'loser',
  extralife: 'extralife',
  communication: 'comms',
  fear: 'fear'
}

export enum Enemies {
  enemyBlueOne = 'blueOne',
  enemyBlueTwo = 'blueTwo',
  enemyGreen = 'green',
  enemyPink = 'pink',
  enemyYellowOne = 'yellowOne',
  enemyYellowTwo = 'yellowTwo',
}

function initData(): Data {
  return {
    sounds: {
      sectorClear: [1.5, , 52, .18, .19, .21, 1, 1.4, , , 418, .14, .18, .2, , , .39, .63, .24],
      bullet: [.2, , 450, .03, .08, .17, 1, 1.1, -6, 16, , , , , , , , .85, .2, , 161],
      explode: [1, , 39, .07, .13, .5, 2, 3.1, -8, , , , , .2, , .3, , .32, .06, , 1952],
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
    calculations: {
      canvasRatioWidth: 0,
      canvasRatioHeight: 0,
      canvasAdjustLeft: 0,
      canvasAdjustRight: 0,
      canvasMaxHeight: 0,
      canvasMaxWidth: 0,
    },
    buttons: {
      start: Sprite(),
      pause: Sprite(),
      restart: Sprite(),
      sectors: {}
    },
    powerupprobability: {
      wingshot: [1, 20],
      trishot: [100, 120],
      doublerate: [200, 205],
      bomb: [300, 315],
      wingbomb: [400, 405],
      shield: [500, 520],
      extralife: [600, 605],
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
