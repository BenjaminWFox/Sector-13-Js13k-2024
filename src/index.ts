import {
  init,
  Sprite,
  GameLoop,
  Text,
  load,
  setImagePath,
  imageAssets,
  SpriteSheet,
} from 'kontra';
import { WIDTH, HEIGHT } from './constants';
import runnerPath from './assets/images/runner.png';
import crowRawImage from './assets/images/crow-outline.png';

let { canvas } = init();

const loaded = [];
const totalLoads = 2;

function checkLoaded(loadedImage: HTMLImageElement) {
  loaded.push(loadedImage);
  if (loaded.length === totalLoads && startGame) {
    startGame();
  }
}

let runner: Sprite = Sprite();
let sprite: Sprite;
const runnerImg = new Image();
runnerImg.src = runnerPath;
runnerImg.width = 44;
runnerImg.height = 21;
runnerImg.onload = function() {

  // use spriteSheet to create animations from an image
  let spriteSheet = SpriteSheet({
    image: runnerImg,
    frameWidth: 11,
    frameHeight: 21,
    animations: {
      // create a named animation: run
      anythingelse: {
        frames: '0..3',  // frames 0 through 9
        frameRate: 30
      }
    }
  });
  sprite = Sprite({
    x: 500,
    y: 500,
    scaleX: 10,
    scaleY: 10,
    anchor: {x: 0.5, y: 0.5},

    // required for an animation sprite
    animations: spriteSheet.animations
  });

  // const runnerSheet = SpriteSheet({
  //   image: runnerImg,
  //   frameWidth: 11,
  //   frameHeight: 21,
  //   animations: {
  //     fly: {
  //       frames: '0..3',
  //       frameRate: 30,
  //     },
  //     stop: {
  //       frames: '1',
  //     },
  //     hit: {
  //       frames: '0',
  //     },
  //   }
  // });

  // runner = Sprite({
  //   x: 500,
  //   y: 200,
  //   scaleX: 10,
  //   scaleY: 10,
  //   animations: runnerSheet.animations,
  // });

  checkLoaded(runnerImg);
}

/* Crow Pixel Sprite Large */
const crowImg = new Image();
crowImg.src = crowRawImage;
crowImg.width = 650;
crowImg.height = 65;
let crowSprite: Sprite;
crowImg.onload = function () {
  let spriteSheet = SpriteSheet({
    image: crowImg,
    frameWidth: 65,
    frameHeight: 65,
    animations: {
      fly: {
        frames: '0..9',
        frameRate: 30,
      },
      stop: {
        frames: '3',
      },
      hit: {
        frames: '0',
      },
    },
  });

  crowSprite = Sprite({
    x: 200,
    y: 300,
    animations: spriteSheet.animations,
  });

  checkLoaded(crowImg);
};

// setImagePath('../src/assets/images');
// let sprite: Sprite = Sprite();
// load('gg.png').then(function() {
//   sprite = Sprite({
//     x: 20,
//     y: HEIGHT - 400,
//     width: 16,
//     height: 15,
//     scaleX: 10,
//     scaleY: 10,
//     image: imageAssets['gg']
//   });
// });

// const textBanner = Sprite({
//   x: 10,
//   y: HEIGHT - 410,
//   width: WIDTH - 20,
//   height: 400,
//   color: '#e3dc72'
// })

// const text = Text({
//   text: "Ahh, I see...it's natural to have some fear of the unknown. You know, I myself was afraid of growing up when I was your age...",
//   width: WIDTH - 10 - 210,
//   height: 380,
//   x: 10 + 200,
//   y: HEIGHT - 400,
//   font: '40px Times',
//   color: 'black',
//   textAlign: 'left',
// })

let loop = GameLoop({  // create the main game loop
  update: function() { // update the game state
    // sprite.update();
    sprite.update();
    crowSprite.update();

    // wrap the sprites position when it reaches
    // the edge of the screen
    // if (sprite.x > canvas.width) {
    //   console.log('Sprite', sprite.x)
    //   sprite.x = -sprite.width;
    // }
  },
  render: function() { // render the game state
    // textBanner.render();
    // sprite.render();
    // text.render();
    sprite.render();
    crowSprite.render();

    // if (runner.currentAnimation.name !== 'run') {
    //   console.log('Playing animation...')
    //   runner.playAnimation('fly');
    // } else {
    //   console.log(runner.currentAnimation);
    // }
  }
});

function startGame() {
  console.log('Starting game', sprite)
  sprite.playAnimation('anythingelse');
  crowSprite.playAnimation('fly');
  // console.log(sprite.animations, sprite.currentAnimation.name);
  loop.start();
}
