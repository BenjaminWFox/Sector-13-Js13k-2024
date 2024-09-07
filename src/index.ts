import {
  init,
  GameLoop,
  Button,
  initPointer,
} from 'kontra';

init();

initPointer()
let button: Button = Button({
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
    console.log('Button Down')
  },
  onUp() {
    console.log('Button Up')
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
