import {
  init,
  GameLoop,
  Button,
  initPointer,
} from 'kontra';

init();

initPointer()
let button: Button;

button = Button({
  // sprite properties
  x: 5,
  y: 5,
  anchor: { x: 0.5, y: 0.5 },

  // text properties
  text: {
    text: 'Click me',
    color: 'white',
    font: '20px Arial, sans-serif',
    anchor: { x: 0.5, y: 0.5 }
  },

  onDown() {
    button.color = 'red'
  },
  onUp() {
    button.color = 'blue'
  }
});

const loop = GameLoop({
  update: function () {
    button.update();
  },

  render: function () {
    button.render();
  }
});

loop.start()
