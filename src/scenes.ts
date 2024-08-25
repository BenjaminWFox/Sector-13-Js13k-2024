import { Scene } from 'kontra';
import { data } from './data';

const titleScene = Scene({ id: data.scenes.title, objects: [] });
const selectScene = Scene({ id: data.scenes.select, objects: [] });
const pregameScene = Scene({ id: data.scenes.pregame, objects: [] });
const gameScene = Scene({ id: data.scenes.game, objects: [] });

export { titleScene, selectScene, pregameScene, gameScene }
