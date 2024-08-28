import { collides, Sprite } from "kontra"
import { getEnemyShip } from "./sprites"
import { Manager } from "./spriteManager";
import { data } from "./data";

const cosFn = (shipXSpeed: number, waveXSpread: number, xPosition: number) =>
  (enemy: Sprite) => enemy.x = (Math.cos((enemy.y) / shipXSpeed) * waveXSpread) + xPosition
const neutral = () => (enemy: Sprite) => enemy.x = 750;

type spawnStartTime = number;
type totalSpawns = number;
type spawnSpacing = number;
type spriteFactory = () => Sprite;
type manager = Manager;
type SectorData = [spawnStartTime, totalSpawns, spawnSpacing, spriteFactory, manager]

class Sector {
  data: Array<SectorData>

  constructor(sector: Array<SectorData>) {
    this.data = sector;
  }

  update() {
    this.data.forEach(([spawnStart, totalSpawn, spawnSpacing, spriteFactory, manager]) => {
      manager.update()
    });
  }

  render(t: number, bullets: Array<Sprite>) {
    this.data.forEach(([spawnStart, totalSpawn, spawnSpacing, spriteFactory, manager]) => {
      if (t >= spawnStart && manager.spawned < totalSpawn && t % spawnSpacing === 0) {
        manager.add(spriteFactory())
      }

      bullets.forEach(bullet => {
        if (bullet.opacity === 0) return;

        manager.assets.forEach(enemy => {
          if (collides(bullet, enemy)) {
            enemy.opacity = 0;
            bullet.opacity = 0;
          }
          if (collides(data.sprites.player, enemy)) {
            enemy.opacity = 0;
            data.sprites.player.opacity = 0;
          }
        })

      })

      manager.render();

    })
  }
}

const sector1 = new Sector([
  [0, 13, 40, getEnemyShip, new Manager(cosFn(120, 200, 1200))],
  [0, 13, 40, getEnemyShip, new Manager(cosFn(120, -200, 300))],
]);
const sector2 = new Sector([
  [13 * 40, 13, 40, getEnemyShip, new Manager(cosFn(200, 200, 450))],
  [13 * 40, 13, 40, getEnemyShip, new Manager(cosFn(200, -200, 1050))],
])

export { sector1, sector2 }
