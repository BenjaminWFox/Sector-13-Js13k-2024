import { state } from './state';
import { collides, lerp, Sprite } from 'kontra'
import { data } from "./data";
import { SCALE } from './constants';
import { adjustFear, Enemy, EnemyBullet, getExplosion, scoreDisplay, getShield } from './sprites';
import { currentSector } from './sectorManager';
import { sfx } from './music';

console.log('6. SpriteManager');

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
        asset.opacity !== 0 &&
        asset.y - asset.height * SCALE > data.calculations.canvasMaxHeight ||
        asset.y + asset.height * SCALE < 0 ||
        asset.x + asset.width * SCALE < 0 ||
        asset.x - asset.width * SCALE > data.calculations.canvasMaxWidth
      ) {
        if (!!asset.type) {
          adjustFear(4)
        }
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

const bulletManager = new Manager();
const lifeManager = new Manager();
const powerupManager = new Manager(
  (powerup) => {
    if (state.gameOver || data.sprites.player.opacity === 0) return;

    if (collides(data.sprites.player, powerup)) {

      powerup.opacity = 0;

      sfx(data.sounds.powerup);

      adjustFear(-1);

      const kind = (powerup.currentAnimation.name as keyof typeof state.powerups);
      const frame = (powerup.currentAnimation.frames as unknown as string[])[0];
      if (frame === '6' && state.lives < 3) {
        state.lives += 1
      } else if (frame === '5') {
        state.playershield = 4;
        if (playerShieldManager.assets.length === 0) {
          playerShieldManager.add(getShield(state.playerX, state.playerY));
        }
      } else if (state.powerups[kind] || (frame === '6' && state.lives === 3)) {

        console.log('Score mult!');

        state.scoreMult += .5
        const m = Math.round(state.scoreMult)

        // Powerup Picked Up:
        if (m === state.scoreMult) scoreDisplay(m, powerup.x, powerup.y, true);
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

const enemyProjectileManager = new Manager();
const bombManager = new BombManager();
const scoreDisplayManager = new Manager((sprite) => sprite.opacity = sprite.opacity -= .05);
const scoreMultDisplayManager = new Manager((sprite) => sprite.opacity = sprite.opacity -= .01);



const explosionManager = new Manager(
  (explosion) => { explosion.animations.explode.isStopped ? explosion.opacity = 0 : explosion.opacity -= .05 }
);

export {
  bulletManager,
  lifeManager,
  explosionManager,
  powerupManager,
  playerShieldManager,
  bombManager,
  enemyProjectileManager,
  scoreDisplayManager,
  scoreMultDisplayManager
}
