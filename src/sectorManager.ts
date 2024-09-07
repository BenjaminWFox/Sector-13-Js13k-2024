import { collides, Sprite } from "kontra"
import { getEnemyShip, getExplosion, getNumbers, getPowerup } from "./sprites"
import { explosionManager, Manager, powerupManager } from "./spriteManager";
import { data } from "./data";
import { resetPowerups, state } from "./state";
import { SCALE } from "./constants";

const cosFn = (shipXSpeed: number, waveXSpread: number, xPosition: number) =>
  (enemy: Sprite) => enemy.x = (Math.cos((enemy.y) / shipXSpeed) * waveXSpread) + xPosition
const neutral = (startX: number) => (enemy: Sprite) => { enemy.x = startX; enemy.dy = 8; }

type spawnStartTime = number;
type totalSpawns = number;
type spawnSpacing = number;
type spriteFactory = () => Sprite;
type manager = Manager;
type SectorData = [spawnStartTime, totalSpawns, spawnSpacing, spriteFactory, manager]

export class Sector {
  data: Array<SectorData>
  loaded: boolean = false;
  started: boolean = false;
  completed: boolean = false;
  managersCompleted = 0;

  constructor(sector: Array<SectorData>) {
    this.data = sector;
  }

  reset() {
    this.loaded = this.started = this.completed = false;
  }

  update() {
    this.data.forEach(([, , , , manager]) => {
      manager.update()
    });
  }

  render(t: number, bullets: Array<Sprite>) {
    if (this.completed) {
      return;
    } else if (!this.loaded) {
      // data.scenes.game.remove(data.scenes.game.objects[3]);
      // data.scenes.game.add(getNumbers(state.currentSectorNumber.toString(), state.currentSectorNumber < 10 ? 74 : 70, 12, { scale: 20 }));
      data.scenes.game.objects[3] = getNumbers(state.currentSectorNumber.toString(), state.currentSectorNumber < 10 ? 74 : 70, 12, { scale: 20 });
      (data.scenes.game.objects[2] as Sprite).y = 270 * SCALE;
      (data.scenes.game.objects[2] as Sprite).dy = -40;
      (data.scenes.game.objects[3] as Sprite).y = 280 * SCALE;
      (data.scenes.game.objects[3] as Sprite).dy = -40;
      this.loaded = true;
    } else if (!this.started) {
      if ((data.scenes.game.objects[2] as Sprite).y < 2 * SCALE) {
        (data.scenes.game.objects[2] as Sprite).y = 2 * SCALE;
        (data.scenes.game.objects[2] as Sprite).dy = 0;
        (data.scenes.game.objects[3] as Sprite).y = 12 * SCALE;
        (data.scenes.game.objects[3] as Sprite).dy = 0;
        this.started = true;
      }
    } else if (!this.completed) {
      for (const [spawnStart, totalSpawn, spawnSpacing, spriteFactory, manager] of this.data) {
        if (t >= spawnStart && manager.spawned < totalSpawn && t % spawnSpacing === 0) {
          manager.add(spriteFactory())
        } else if (!manager.completed && manager.spawned >= totalSpawn && manager.assets.length === 0) {
          this.managersCompleted += 1;
          manager.completed = true;
        }

        if (!this.completed && this.managersCompleted === this.data.length) {
          this.completed = true;

          return;
        }

        bullets.forEach(bullet => {
          if (bullet.opacity === 0) return;

          manager.assets.forEach(enemy => {
            if (enemy.opacity === 0) return;

            if (collides(bullet, enemy)) {
              enemy.opacity = 0;
              bullet.opacity = 0;
              state.score += 100 * state.scoreMult;
              explosionManager.add(getExplosion(enemy.x, enemy.y));
              const powerup = getPowerup(enemy.x, enemy.y);
              if (powerup) powerupManager.add(powerup);
            }

            if (state.invulnerable) return;

            if (collides(data.sprites.player, enemy)) {
              resetPowerups();

              if (state.lives >= 0) {
                explosionManager.add(getExplosion(data.sprites.player.x, data.sprites.player.y));
                enemy.opacity = 0;
                data.sprites.player.opacity = 0;
                state.invulnerableAt = state.lives === 0 ? state.totalTime + 5000 : state.totalTime;
                state.invulnerable = true;

                if (state.lives === 0) {
                  endGame();
                } else {
                  setTimeout(() => {
                    data.sprites.player.opacity = .75
                  }, 250)
                }

                state.lives -= 1;
              }
            }
          })
        })

        manager.render();
      }
    }
  }
}

const spawns = 13

const sector1 = new Sector([
  [0, spawns, 40, getEnemyShip, new Manager(cosFn(120, 200, 1200), 'A')],
  [0, spawns, 40, getEnemyShip, new Manager(cosFn(120, -200, 300), 'B')],
  // [13 * 20, 13, 40, getEnemyShip, new Manager(neutral(750))],
]);
const sector2 = new Sector([
  [0, spawns, 40, getEnemyShip, new Manager(cosFn(200, 200, 450))],
  [0, spawns, 40, getEnemyShip, new Manager(cosFn(200, -200, 1050))],
])
const sector3 = new Sector([
  [0, spawns, 40, getEnemyShip, new Manager(neutral(300))],
  [0, spawns, 40, getEnemyShip, new Manager(neutral(600))],
  [0, spawns, 40, getEnemyShip, new Manager(neutral(900))],
  [0, spawns, 40, getEnemyShip, new Manager(neutral(1200))],
])
const sectors = [sector1, sector2, sector3]
const currentSector = () => sectors[state.currentSectorNumber - 1]

function endGame() {
  state.gameOver = true;
  setTimeout(() => {
    data.scenes.game.hide();
    data.scenes.end.show();
  }, 2000)
}

export { currentSector, sectors, sector1, sector2, sector3, endGame }
