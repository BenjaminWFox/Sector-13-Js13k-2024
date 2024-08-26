import { Sprite } from 'kontra'
import { getEnemyShip } from './sprites';
import { data } from "./data";

// Enemy Spawn Numbers
const xPosition = 750;
const waveXSpread = 200;
const shipXSpeed = 120; // Higher = Slower

class EnemyManager {
  enemies: Array<Sprite> = []
  spawned = 0;

  add() {
    this.enemies.push(getEnemyShip());
    this.spawned += 1;
  }
  update() {
    for (const enemy of this.enemies) {
      enemy.x = (Math.cos((enemy.y) / shipXSpeed) * waveXSpread) + xPosition
      enemy.update();
    }
  }
  render() {
    for (const enemy of this.enemies) {
      if (enemy.y > (data.elements.canvas.offsetHeight / data.calculations.canvasRatioHeight)) {
        enemy.opacity = 0;
      }
      enemy.render()
    }
  }
  purge() {
    this.enemies = this.enemies.filter((e) => e.opacity !== 0)
  }
}
const enemyManager = new EnemyManager();

export { enemyManager }
