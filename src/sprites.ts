import {
  Button,
  Sprite,
  SpriteSheet,
} from 'kontra';
import playerShipPath from './assets/images/player-ship.gif';
import enemyShipPath from './assets/images/enemy-ship.gif';

import lettersBoldPath from './assets/images/lettersBold.gif';
import numbersBoldPath from './assets/images/numbersBold.gif';
import lettersPath from './assets/images/letters.gif';
import numbersPath from './assets/images/numbers.gif';
import { SCALE } from './constants';
import { data } from './data';
// import { titleScene } from './scenes';

export function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}

const loaded = [];
const totalLoads = 6;

function makeSprites(startFn: () => void) {
  function checkLoaded(loadedImage: HTMLImageElement) {
    loaded.push(loadedImage);

    if (loaded.length === totalLoads && startFn) {
      startFn();
    }
  }

  const playerShipImg = new Image();
  playerShipImg.src = playerShipPath;
  playerShipImg.onload = function () {
    data.sprites.player = Sprite({
      x: 1100,
      y: 1000,
      scaleX: 10,
      scaleY: 10,
      anchor: { x: 0.5, y: 0.5 },
      animations: SpriteSheet({
        image: playerShipImg,
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

    checkLoaded(playerShipImg);
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
    characters: 'ACELOPRSTU',
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
  onDown?: () => void;
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

  const textSprite = {
    image: textCanvas,
    scaleX: options.scale || SCALE,
    scaleY: options.scale || SCALE,
    x: x * SCALE,
    y: y * SCALE,
  };

  return (options.button || !!options.onDown) ? Button({
    ...textSprite,
    onDown: options.onDown
  }) : Sprite({ ...textSprite });
}

const getBoldText = (text: string, x: number, y: number, options?: {}) => getTextSprite(text, x, y, textTypes.letterBold, { ...options, bold: true });
const getText = (text: string, x: number, y: number, options?: {}) => getTextSprite(text, x, y, textTypes.letter, options);
const getBoldNumbers = (text: string, x: number, y: number, options?: {}) => getTextSprite(text, x, y, textTypes.numberBold, { ...options, bold: true });
const getNumbers = (text: string, x: number, y: number, options?: {}) => getTextSprite(text, x, y, textTypes.number, options);

export { makeSprites, getEnemyShip, getBoldText, getText, getBoldNumbers, getNumbers };
