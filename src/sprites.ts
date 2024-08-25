import {
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
import { titleScene } from './scenes';

export function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}

const loaded = [];
const totalLoads = 4;

let lettersBoldImg: HTMLImageElement = document.createElement('img');
let lettersImg: HTMLImageElement = document.createElement('img');
let numbersBoldImg: HTMLImageElement = document.createElement('img');
let numbersImg: HTMLImageElement = document.createElement('img');

let playerShip: Sprite = Sprite();
let enemySheet: SpriteSheet;

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

  lettersBoldImg.src = lettersBoldPath;
  lettersBoldImg.onload = () => {
    checkLoaded(lettersBoldImg)
  }

  lettersImg.src = lettersPath;
  lettersImg.onload = () => {
    checkLoaded(lettersImg)
  }

  numbersBoldImg.src = numbersBoldPath;
  numbersBoldImg.onload = () => {
    checkLoaded(numbersBoldImg)
  }

  numbersImg.src = numbersPath;
  numbersImg.onload = () => {
    checkLoaded(numbersImg)
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
    animations: enemySheet.animations
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
    image: lettersBoldImg,
    letterWidth: 7,
    letterHeight: 8,
    characters: 'ACELOPRSTU',
  },
  letter: {
    image: lettersImg,
    letterWidth: 4,
    letterHeight: 5,
    characters: 'ceorst',
  },
  numberBold: {
    image: numbersBoldImg,
    letterWidth: 7,
    letterHeight: 8,
    characters: '13',
  },
  number: {
    image: numbersImg,
    letterWidth: 4,
    letterHeight: 5,
    characters: '0123456789',
  },
}

function getTextSprite(text: string, x: number, y: number, type: TextType, scale: number, bold = true) {
  text = bold ? text.toUpperCase() : text;
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

  const textSprite = Sprite({
    image: textCanvas,
    scaleX: scale,
    scaleY: scale,
    x: x * SCALE,
    y: y * SCALE,
  });

  return textSprite;
}

const getBoldText = (text: string, x: number, y: number, scale = SCALE) => getTextSprite(text, x, y, textTypes.letterBold, scale);
const getText = (text: string, x: number, y: number, scale = SCALE) => getTextSprite(text, x, y, textTypes.letter, scale, false);
const getBoldNumbers = (text: string, x: number, y: number, scale = SCALE) => getTextSprite(text, x, y, textTypes.numberBold, scale);
const getNumbers = (text: string, x: number, y: number, scale = SCALE) => getTextSprite(text, x, y, textTypes.number, scale, false);

export { makeSprites, playerShip, getEnemyShip, getBoldText, getText, getBoldNumbers, getNumbers };
