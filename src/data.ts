import { Scene, Sprite, SpriteSheet } from "kontra";
import { HEIGHT, WIDTH } from "./constants";

function makeElement<T>(el: string) { return document.createElement(el) as T };
const makeImage = () => makeElement<HTMLImageElement>('img');

type Data = {
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
}

function initData(): Data {
  return {
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
    },
    labels,
    images: {
      letters: makeImage(),
      lettersBold: makeImage(),
      numbers: makeImage(),
      numbersBold: makeImage(),
      player: makeImage(),
      enemy: makeImage(),
    },
    sprites: {
      player: Sprite(),
      enemy: Sprite(),
    },
    spriteSheets: {
      player: undefined,
      enemy: undefined,
    },
    calculations: {
      canvasRatioWidth: 0,
      canvasRatioHeight: 0,
      canvasAdjustLeft: 0,
      canvasAdjustRight: 0,
      canvasMaxHeight: 0,
      canvasMaxWidth: 0,
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

export { data, initCalculations, initElements }
