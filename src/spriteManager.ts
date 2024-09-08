import { state } from './state';
import { collides, lerp, Sprite } from 'kontra'
import { data } from "./data";
import { SCALE } from './constants';
import { Enemy, EnemyBullet, getExplosion, getShield } from './sprites';
import { currentSector } from './sectorManager';

// Enemy Spawn Numbers
const xPosition = 300;
const waveXSpread = -200;
const shipXSpeed = 120; // Higher = Slower

type UpdaterFn<T extends Sprite | Enemy | EnemyBullet> = (sprite: T) => void;
export class Manager<T extends Sprite | Enemy> {
  assets: Array<T> = [];
  spawned = 0;
  id: string | undefined;
  completed: boolean = false;
  updater: UpdaterFn<T> = () => { };

  constructor(updaterFn?: UpdaterFn<T>, id?: string) {
    if (updaterFn) this.updater = updaterFn.bind(this);
    this.id = id;
  }

  add(sprite: T) {
    this.assets.push(sprite);
    this.spawned += 1;
  }
  pop() {
    this.assets.pop();
  }

  get total() {
    return this.assets.length;
  }
  update() {
    for (const asset of this.assets) {
      this.updater(asset);
      asset.update();
    }
  }
  render() {
    for (const asset of this.assets) {
      if (
        asset.y - asset.height * SCALE > data.calculations.canvasMaxHeight ||
        asset.y + asset.height * SCALE < 0
      ) {
        asset.opacity = 0;
      }
      asset.render()
    }

    this.purge();
  }
  purge() {
    this.assets = this.assets.filter(a => a.opacity !== 0)
  }
}

// const enemyManager = new EnemyManager();
const enemyManager = new Manager(
  (enemy) => enemy.x = (Math.cos((enemy.y) / shipXSpeed) * waveXSpread) + xPosition
)
const bulletManager = new Manager();

const lifeManager = new Manager();

const powerupManager = new Manager(
  (powerup) => {
    if (collides(data.sprites.player, powerup)) {

      powerup.opacity = 0;

      const kind = (powerup.currentAnimation.name as keyof typeof state.powerups);

      if ((powerup.currentAnimation.frames as unknown as string[])[0] === '6' && state.lives < 4) {
        state.lives += 1
      } else if ((powerup.currentAnimation.frames as unknown as string[])[0] === '5') {
        state.playershield = 4;
        if (playerShieldManager.assets.length === 0) {
          playerShieldManager.add(getShield(state.playerX, state.playerY));
        }
      } else if (state.powerups[kind]) {
        // Something about score multiplyer?
      } else {
        state.powerups[kind] = true;
      }
    }
  }
);

const playerShieldManager = new Manager(
  (shield) => {
    if (state.playershield === 0) {
      shield.opacity = 0;
    } else {
      shield.x = data.sprites.player.x
      shield.y = data.sprites.player.y
      shield.playAnimation(state.playershield.toString());
    }
  }
)

type targetInfo = {
  target: Sprite;
  isForward: boolean;
}
class BombManager extends Manager<Sprite> {
  targets: WeakMap<Sprite, targetInfo> = new WeakMap();

  constructor() {
    super()
  }

  update() {
    this.assets.forEach((bomb) => {
      if (bomb.opacity === 0) return;

      let { target, isForward } = this.targets.get(bomb) || {}

      if (target && target.opacity === 0) {
        explosionManager.add(getExplosion(bomb.x, bomb.y));
        bomb.opacity = 0;
        return;
      }

      if (!target) {
        const enemy = currentSector()?.getRandomEnemy()

        if (!enemy) {
          explosionManager.add(getExplosion(bomb.x, bomb.y));
          bomb.opacity = 0;
          return;
        }

        this.targets.set(bomb, { target: enemy, isForward: state.playerY < enemy.y })

        target = enemy
      }

      let lerpNum = isForward ? .1 : .025;

      bomb.x = lerp(bomb.x, target.x, lerpNum);
      bomb.y = lerp(bomb.y, target.y, lerpNum);

      bomb.update();
    })
  }
}

// const enemyLaserManager = new Manager();
// const enemyBulletManager = new Manager();
// const enemyBombManager = new Manager();
const enemyProjectileManager = new Manager();
const enemyBulletManager = new Manager<EnemyBullet>((bullet: EnemyBullet) => {

})

const bombManager = new BombManager();



const explosionManager = new Manager(
  (explosion) => { explosion.animations.explode.isStopped ? explosion.opacity = 0 : explosion.opacity -= .05 }
);

export {
  enemyManager,
  bulletManager,
  lifeManager,
  explosionManager,
  powerupManager,
  playerShieldManager,
  bombManager,
  enemyProjectileManager,
  enemyBulletManager,
}
