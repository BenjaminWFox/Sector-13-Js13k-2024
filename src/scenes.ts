import { data } from './data';
import { getBoldText, getBoldNumbers, getText, getNumbers } from './sprites';

function initScenes() {
  data.scenes.title.add(
    ...(() => [
      // title
      getBoldText(data.labels.sector, 11, 38, { scale: 32 }),
      // number 13
      getBoldNumbers(data.labels.thirteen, 59, 70, { scale: 32 }),
      // start
      getBoldText(data.labels.start, 59, 164, { button: true, onDown: () => { data.scenes.title.hide(); data.scenes.select.show(); } }),
    ])(),
  )

  // coordinates of each button for sector selection
  const arr = [[93, 234], [93, 205], [93, 176], [93, 147], [93, 118], [93, 89], [33, 234], [33, 205], [33, 176], [33, 147], [33, 118], [33, 89], [63, 58]];
  const playGameSector = (i: number) => { console.log('Playing', i) }
  data.scenes.select.add(
    ...(() => [
      getBoldText(data.labels.select, 33, 21),
      getBoldText(data.labels.sector, 77, 21),
      // sector select buttons
      ...arr.map(([x, y], i) => getText(data.labels.sector, x, y, { onDown: () => playGameSector(i + 1) })),
      ...arr.map(([x, y], i) => getNumbers((i + 1).toString(), x + 8, y + 6, { onDown: () => playGameSector(i + 1) }))
    ])(),
  );
  data.scenes.select.hide();

  data.scenes.game.add(
    ...(() => [
      // score
      getBoldText(data.labels.score, 5, 7),
      // pause
      getBoldText(data.labels.pause, 112, 7),
      // sector
      getBoldText(data.labels.sector, 56, 2),
      // 13
      getBoldNumbers(data.labels.thirteen, 70, 12)
    ])(),
  );
  data.scenes.game.hide();
}

export { initScenes }
