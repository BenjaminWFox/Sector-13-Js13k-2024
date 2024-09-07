import { getStoreItem, randInt, Sprite, SpriteClass } from 'kontra';
import { data } from './data';
import { getBoldText, getBoldNumbers, getText, getNumbers } from './sprites';
import { state } from './state';
import { HEIGHT, HEIGHT_ORIGINAL, SCALE, WIDTH_ORIGINAL } from './constants';
import { currentSector } from './sectorManager';
import { sfx } from './music';

const playGameSector = (i: number) => {
  console.log('Playing', i);
  sfx(data.sounds.sectorClear);
  state.currentSectorNumber = i;
  state.currentSectorClass = currentSector();

  data.buttons.pause = getBoldText(data.labels.pause, 112, 7)
  data.scenes.game.add(
    ...(() => [
      // score
      getBoldText(data.labels.score, 5, 7),
      // pause
      data.buttons.pause,
      // sector
      getBoldText(data.labels.sector, 56, 2),
      // sector number
      getNumbers(i.toString(), i < 10 ? 74 : 70, 12, { scale: 20 }),
      getNumbers('0000000000', 5, 18),
    ])(),
  );

  data.scenes.game.show();
  data.scenes.select.hide();
}

function initScenes() {
  data.scenes.title.hide();
  data.scenes.select.hide();
  data.scenes.game.hide();
  data.scenes.end.hide();

  data.buttons.start = getBoldText(data.labels.start, 59, 164),
    data.scenes.title.add(
      ...(() => [
        // title
        getBoldText(data.labels.sector, 11, 38, { scale: 32 }),
        // number 13
        getBoldNumbers(data.labels.thirteen, 59, 70, { scale: 32 }),
        // start
        data.buttons.start
      ])(),
    )

  // coordinates of each button for sector selection
  const arr = [[93, 234], [93, 205], [93, 176], [93, 147], [93, 118], [93, 89], [33, 234], [33, 205], [33, 176], [33, 147], [33, 118], [33, 89], [63, 58]];

  function clearUnreached(s: Sprite, i: number) {
    let n = `${i + 1}`;

    if (i > 0 && !getStoreItem(`${n}`)) {
      s.opacity = .5;
    }

    return s
  }

  const textSprites = [...arr.map(([x, y], i) => clearUnreached(
    getText(data.labels.sector, x, y), i)
  )]
  const numberSprites = [...arr.map(([x, y], i) => clearUnreached(
    getNumbers((i + 1).toString(), x + 8, y + 6), i
  ))]

  textSprites.forEach((s, i) => {
    console.log('Creating button', i)
    data.buttons.sectors[i] = Sprite({
      x: s.x,
      y: s.y,
      width: s.width,
      height: s.height + numberSprites[i].height,
      opacity: s.opacity,
      id: `Button ${i}`
    })
  })

  data.scenes.select.add(
    ...(() => [
      getBoldText(data.labels.select, 33, 21),
      getBoldText(data.labels.sector, 77, 21),
      // sector select buttons
      ...textSprites,
      ...numberSprites
    ])(),
  );

  data.buttons.restart = getBoldText(data.labels.restart, 52, 151)
  data.scenes.end.add(
    ...(() => [
      getBoldText(data.labels.gameover, 5, 51, { scale: 26 }),
      data.buttons.restart,
    ])()
  );
  data.scenes.end.onShow = () => {
    if (state.lives < 0) {
      data.scenes.end.add(getBoldText(data.labels.loser, 40, 101, { scale: 22 }))
    } else {
      data.scenes.end.add(getBoldText(data.labels.winner, 32, 101, { scale: 22 }))
    }
    data.sprites.player.dy = -30;
  }

  class Star extends SpriteClass {
    constructor(properties: any = {}) {
      super(properties);
      const { initial } = properties;
      const dy = [1, 2];
      if (!initial) {
        dy.push(5);
      }
      this.width = 10;
      this.height = 10;
      this.opacity = randInt(25, 75) * .01;
      this.color = '#fff';
      this.x = randInt(0, WIDTH_ORIGINAL) * SCALE;
      this.y = (initial ? randInt(0, HEIGHT_ORIGINAL) : randInt(-4, 0)) * SCALE;
      this.dy = dy.slice(randInt(0, dy.length - 1))[0];
    }

    update() {
      if (this.y >= HEIGHT) {
        data.scenes.stars.remove(this);
        data.scenes.stars.add(new Star())
      }

      super.update();
    }
  }

  for (let i = 0; i < 100; i += 1) {
    data.scenes.stars.add(new Star({ initial: true }))
  }

  data.scenes.stars.add()
}

export { initScenes, playGameSector }
