import {
  init,
  Sprite,
  GameLoop,
  Text,
  load,
  setImagePath,
  imageAssets
} from 'kontra';
import { WIDTH, HEIGHT } from './constants';

let { canvas } = init();

setImagePath('../src/assets/images');
let sprite: Sprite = Sprite();

load('gg.png').then(function() {
  console.log(imageAssets['gg']);
  sprite = Sprite({
    x: 20,
    y: HEIGHT - 400,
    width: 16,
    height: 15,
    scaleX: 10,
    scaleY: 10,
    image: imageAssets['gg']
  });
});

const textBanner = Sprite({
  x: 10,
  y: HEIGHT - 410,
  width: WIDTH - 20,
  height: 400,
  color: '#e3dc72'
})

const text = Text({
  text: "Ahh, I see...it's natural to have some fear of the unknown. You know, I myself was afraid of growing up when I was your age...",
  width: WIDTH - 10 - 210,
  height: 380,
  x: 10 + 200,
  y: HEIGHT - 400,
  font: '40px Times',
  color: 'black',
  textAlign: 'left',
})


let loop = GameLoop({  // create the main game loop
  update: function() { // update the game state
    sprite.update();

    // wrap the sprites position when it reaches
    // the edge of the screen
    if (sprite.x > canvas.width) {
      console.log('Sprite', sprite.x)
      sprite.x = -sprite.width;
    }
  },
  render: function() { // render the game state
    textBanner.render();
    sprite.render();
    text.render();
  }
});

loop.start();

// window.onload = () => {
//   const rect = canvas.getBoundingClientRect();
//   canvas.style.width = `${rect.width}px`;
//   canvas.style.height = `${rect.height}px`;
// }

// window.onresize = () => {
//   const rect = canvas.getBoundingClientRect();
//   canvas.style.width = `${rect.width}px`;
//   canvas.style.height = `${rect.height}px`;
// }
