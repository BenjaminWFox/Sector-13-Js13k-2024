import { collides, degToRad, randInt, Sprite } from "kontra"
import { commsSprite, Enemy, getEnemyShip, getExplosion, getNumbers, getPowerup } from "./sprites"
import { resetPowerups, state } from "./state";
import { bombManager, bulletManager, enemyProjectileManager, explosionManager, Manager, powerupManager } from "./spriteManager";
import { data, Enemies } from "./data";
import { HEIGHT, SCALE, WIDTH } from "./constants";

type spawnStartTime = number;
type totalSpawns = number;
type spawnSpacing = number;
type spriteFactory = (enemy: Enemies) => Enemy;
type manager = Manager<Enemy>;
type SectorData = [spawnStartTime, totalSpawns, spawnSpacing, spriteFactory, Enemies, manager]

function checkProjectileAgainstPlayer(projectile: Sprite) {
  if (collides(projectile, data.sprites.player)) {
    managePlayerHit(projectile);
  }
}

function checkProjectileAgainstEnemies(manager: Manager<Enemy>, projectile: Sprite) {
  manager.assets.forEach(enemy => {
    if (enemy.opacity === 0) return;
    const shield = enemy.shield;

    if (shield) {
      if (collides(projectile, shield)) {
        enemy.hit();
        projectile.opacity = 0;
        explosionManager.add(getExplosion(projectile.x, projectile.y));
      }
    } else {
      if (collides(projectile, enemy)) {
        enemy.hit()
        projectile.opacity = 0;
        state.score += 100 * state.scoreMult;
        explosionManager.add(getExplosion(enemy.x, enemy.y));

        const powerup = getPowerup(enemy.x, enemy.y);
        if (powerup) powerupManager.add(powerup);
      }
    }
  })
}

function managePlayerHit(enemy: Sprite) {
  if (state.playershield > 0) {
    explosionManager.add(getExplosion(enemy.x, enemy.y));
    enemy.opacity = 0;
    state.playershield -= 1;
  } else if (state.lives >= 0) {
    resetPowerups();

    explosionManager.add(getExplosion(data.sprites.player.x, data.sprites.player.y));
    enemy.opacity = 0;
    data.sprites.player.opacity = 0;

    if (state.lives === 0) {
      endGame();
    } else {
      state.invulnerableAt = state.lives === 0 ? state.totalTime + 5000 : state.totalTime;
      state.invulnerable = true;

      setTimeout(() => {
        if (!state.gameOver) {
          data.sprites.player.opacity = .75
        }
      }, 250)
    }

    state.lives -= 1;
  }
}

export class Sector {
  data: Array<SectorData>
  loaded: boolean = false;
  started: boolean = false;
  completed: boolean = false;
  managersCompleted = 0;
  comms: Array<string>;
  powerupProbability: number | undefined;
  hasFirstSpawn = false;

  constructor(sector: Array<SectorData>, sectorComms: Array<string>, powerupProbability?: number) {
    this.data = sector;
    this.comms = sectorComms;
    this.powerupProbability = powerupProbability;
  }

  getRandomEnemy() {
    const enemies: Array<Sprite> = []
    this.data.forEach(([, , , , , manager]) => {
      manager.assets.forEach(asset => enemies.push(asset))
    })

    return enemies[randInt(0, enemies.length - 1)]
  }

  reset() {
    this.loaded = this.started = this.completed = false;
  }

  update() {
    this.data.forEach(([, , , , , manager]) => {
      manager.update()
    });
  }

  proceed() {
    this.started = true;
    state.sectorTime = 0;
  }

  render() {
    if (this.completed) {
      return;
    } else if (!this.loaded) {
      state.comms = this.comms;
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
        if (this.powerupProbability) {
          // Specially granted powerups from pre-sector communication:
          powerupManager.add(getPowerup(commsSprite.width / 2, commsSprite.y + commsSprite.height + 80, this.powerupProbability)!);
        }
        if (this.comms.length) {
          data.scenes.communication.show();
        } else {
          this.proceed()
        }
      }
    } else if (!this.completed) {
      if (!this.hasFirstSpawn) { state.sectorTime = 0; this.hasFirstSpawn = true }
      for (const [spawnStart, totalSpawn, spawnSpacing, spriteFactory, enemy, manager] of this.data) {
        console.log()
        if (state.sectorTime >= spawnStart && manager.spawned < totalSpawn && (state.sectorTime + spawnStart) % spawnSpacing === 0) {
          manager.add(spriteFactory(enemy))
        } else if (!manager.completed && manager.spawned >= totalSpawn && manager.assets.length === 0) {
          this.managersCompleted += 1;
          manager.completed = true;
        }

        if (!this.completed && this.managersCompleted === this.data.length) {
          this.completed = true;

          return;
        }

        // Check enemies against bullets
        bulletManager.assets.forEach(bullet => {
          if (bullet.opacity === 0) return;

          checkProjectileAgainstEnemies(manager, bullet);
        })

        // Check enemies against bombs
        bombManager.assets.forEach(bomb => {
          if (bomb.opacity === 0) return;

          checkProjectileAgainstEnemies(manager, bomb);
        })

        if (!state.invulnerable) {
          // Check enemies against player
          manager.assets.forEach(enemy => {
            if (collides(data.sprites.player, enemy.shield ? enemy.shield : enemy)) {
              managePlayerHit(enemy);
            }
          })

          // Check player against enemy projectiles
          if (!state.invulnerable) {
            enemyProjectileManager.assets.forEach(laser => {
              if (laser.opacity === 0) return;

              checkProjectileAgainstPlayer(laser);
            })
          }
        }

        manager.render();
      }
    }
  }
}

/**
 * 
 * @param shipXSpeed    X movement speed across spread, where LOWER number is FASTER
 * @param waveXSpread   Overall X spread distance, HIGHER number is FURTHER
 * @param xPosition     The initial starting position - scaled
 * @returns an updaterFn for the enemy
 */
const cosFn = (shipXSpeed: number, waveXSpread: number, xPosition: number, dy: number) =>
  (enemy: Enemy) => { if (!enemy.initialized) { enemy.dy = dy; enemy.initialized = true; } enemy.x = (Math.cos((enemy.y) / shipXSpeed) * waveXSpread) + xPosition }
const neutral = (startX: number, dy?: number) => (enemy: Enemy) => { enemy.x = startX; enemy.dy = dy || 8; }
const yellowOne = (startX: number, startY: number, dx: number, dy: number, rotation: 90 | 180 | 270 | 0, maxLife: number = 360) => (enemy: Enemy) => {
  if (!enemy.initialized) {
    enemy.x = startX * SCALE;
    enemy.y = startY * SCALE;
    enemy.dx = dx;
    enemy.dy = dy;
    enemy.odx = dx;
    enemy.ody = dy;
    enemy.rotation = degToRad(rotation);
    enemy.initialized = true;
    enemy.maxLife = maxLife;
  }

  if (dx < 0) {
    if (enemy.x < (startX - 8) * SCALE) enemy.dx = 0;
  } else {
    if (enemy.x > (startX + 8) * SCALE) enemy.dx = 0;
  }

  if (dy < 0) {
    if (enemy.y < (startY - 8) * SCALE) enemy.dy = 0;
  } else {
    if (enemy.y > (startY + 8) * SCALE) enemy.dy = 0;
  }

  if (enemy.lifespan > 360) {
    enemy.dx = dx * -1;
    enemy.dy = dy * -1;
  }
}
const zigZag = (startX: number, startY: number, dx: number, dy: number, rotation: 90 | 180 | 270 | 0 = 0) => (enemy: Enemy) => {
  if (!enemy.initialized) {
    enemy.x = startX * SCALE;
    enemy.y = startY;
    enemy.dx = dx;
    enemy.dy = dy;
    enemy.initialized = true;
    enemy.rotation = degToRad(rotation)
  }
  if ((enemy.x + (enemy.width * SCALE)) > WIDTH || (enemy.x - (enemy.width * SCALE)) < 0) {
    enemy.dx *= -1;
  }
}
const across = (startX: number, startY: number, dx: number) => (enemy: Enemy) => {
  if (!enemy.initialized) {
    enemy.x = startX;
    enemy.y = startY;
    enemy.dx = dx;
    enemy.initialized = true;
  }
}

const spawns = 13

const sector1 = new Sector([
  [0, spawns, 40, getEnemyShip, Enemies.enemyBlueOne, new Manager(cosFn(80, 200, 1200, 4))],
  [0, spawns, 40, getEnemyShip, Enemies.enemyBlueOne, new Manager(cosFn(80, -200, 300, 4))],
], [
  'commander we are all rooting for you',
  'focus on flying we do the rest',
  'we manage your ship systems',
  'we fire weapons and make powerups',
  'dont let the enemies through',
  'good luck out there'
]);
const sector2 = new Sector([
  [0, spawns, 40, getEnemyShip, Enemies.enemyBlueTwo, new Manager(zigZag(130, 0, -12, 8))],
  [0, spawns, 40, getEnemyShip, Enemies.enemyBlueTwo, new Manager(zigZag(20, 0, 12, 8))],
], [
  'commander',
  'we have fashioned you a shield',
  'absorbs four projectiles',
  'or enemy collisions'
], data.powerupprobability.shield[0]);
const sector3 = new Sector([
  [0, spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(0, 500, 4))],
  [0, spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(WIDTH, 600, -4))],
  [0, spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(0, 800, 4))],
  [0, spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(WIDTH, 900, -4))],
], [])
const sector4 = new Sector([
  [0, 3, 120, getEnemyShip, Enemies.enemyGreen, new Manager(neutral(300, 4))],
  [0, 3, 120, getEnemyShip, Enemies.enemyGreen, new Manager(neutral(600, 5))],
  [0, 3, 120, getEnemyShip, Enemies.enemyGreen, new Manager(neutral(900, 5))],
  [0, 3, 120, getEnemyShip, Enemies.enemyGreen, new Manager(neutral(1200, 4))],
  [120 * 3, 1, 40, getEnemyShip, Enemies.enemyGreen, new Manager(neutral(750, 10))],
], [
  'commander',
  'watch out for shield enemies',
  'here is some extra firepower',
], data.powerupprobability.wingshot[0])
const sector5 = new Sector([
  [0, 1, 40, getEnemyShip, Enemies.enemyYellowOne, new Manager(yellowOne(150, 256, -4, -4, 0))],
  [0, 1, 40, getEnemyShip, Enemies.enemyYellowOne, new Manager(yellowOne(0, 256, 4, -4, 90))],
  [0, 1, 40, getEnemyShip, Enemies.enemyYellowOne, new Manager(yellowOne(0, 30, 4, 4, 180))],
  [0, 1, 40, getEnemyShip, Enemies.enemyYellowOne, new Manager(yellowOne(150, 30, -4, 4, 270))],
], [
  'commander here is a new powerup',
  'bomb locks on to a target',
  'good for enemies behind you',
  'blows up if target disappears',
], data.powerupprobability.bomb[0])
const sector6 = new Sector([
  [0, spawns, 40, getEnemyShip, Enemies.enemyPink, new Manager(neutral(300, 12))],
  [0, spawns, 40, getEnemyShip, Enemies.enemyPink, new Manager(neutral(600, 18))],
  [0, spawns, 40, getEnemyShip, Enemies.enemyPink, new Manager(neutral(900, 18))],
  [0, spawns, 40, getEnemyShip, Enemies.enemyPink, new Manager(neutral(1200, 12))],
], [])
const sector7 = new Sector([
  [0, spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(0, 500, 4))],
  [0, spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(WIDTH, 600, -4))],
  [0, spawns, 40, getEnemyShip, Enemies.enemyBlueOne, new Manager(cosFn(200, 200, 450, 8))],
  [0, spawns, 40, getEnemyShip, Enemies.enemyBlueOne, new Manager(cosFn(200, -200, 1050, 8))],
], [])
const sector8 = new Sector([
  [0, spawns, 40, getEnemyShip, Enemies.enemyPink, new Manager(neutral(300, 12))],
  [0, spawns, 40, getEnemyShip, Enemies.enemyPink, new Manager(neutral(1200, 12))],
  [spawns * 20, spawns, 40, getEnemyShip, Enemies.enemyPink, new Manager(neutral(750, 12))],
  [120, 1, 40, getEnemyShip, Enemies.enemyYellowOne, new Manager(yellowOne(150, 256, -4, -4, 0, spawns * 40))],
  [120, 1, 40, getEnemyShip, Enemies.enemyYellowOne, new Manager(yellowOne(0, 256, 4, -4, 90, spawns * 40))],
  [120, 1, 40, getEnemyShip, Enemies.enemyYellowOne, new Manager(yellowOne(0, 30, 4, 4, 180, spawns * 40))],
  [120, 1, 40, getEnemyShip, Enemies.enemyYellowOne, new Manager(yellowOne(150, 30, -4, 4, 270, spawns * 40))],

  [280, 1, 40, getEnemyShip, Enemies.enemyYellowOne, new Manager(yellowOne(150, 256, -4, -4, 0, spawns * 40))],
  [280, 1, 40, getEnemyShip, Enemies.enemyYellowOne, new Manager(yellowOne(0, 256, 4, -4, 90, spawns * 40))],
  [280, 1, 40, getEnemyShip, Enemies.enemyYellowOne, new Manager(yellowOne(0, 30, 4, 4, 180, spawns * 40))],
  [280, 1, 40, getEnemyShip, Enemies.enemyYellowOne, new Manager(yellowOne(150, 30, -4, 4, 270, spawns * 40))],
], []);
const sector9 = new Sector([
  [0, spawns, 120, getEnemyShip, Enemies.enemyGreen, new Manager(neutral(300, 8))],
  [0, spawns, 120, getEnemyShip, Enemies.enemyGreen, new Manager(neutral(600, 8))],
  [0, spawns, 120, getEnemyShip, Enemies.enemyGreen, new Manager(neutral(900, 8))],
  [0, spawns, 120, getEnemyShip, Enemies.enemyGreen, new Manager(neutral(1200, 8))],
  [120 * 3, 1, 40, getEnemyShip, Enemies.enemyGreen, new Manager(neutral(750, 10))],
  [120, spawns, 40, getEnemyShip, Enemies.enemyBlueTwo, new Manager(zigZag(130, 0, -8, 4))],
  [120, spawns, 40, getEnemyShip, Enemies.enemyBlueTwo, new Manager(zigZag(20, 0, 8, 4))],
  [80 * spawns, spawns, 40, getEnemyShip, Enemies.enemyBlueTwo, new Manager(zigZag(130, 0, -8, 4))],
  [80 * spawns, spawns, 40, getEnemyShip, Enemies.enemyBlueTwo, new Manager(zigZag(20, 0, 8, 4))],
], []);
const sector10 = new Sector([
  [0, spawns, 60, getEnemyShip, Enemies.enemyBlueOne, new Manager(cosFn(80, 400, 1000, 2))],
  [0, spawns, 60, getEnemyShip, Enemies.enemyBlueOne, new Manager(cosFn(80, -400, 500, 2))],

  [0, spawns, 60, getEnemyShip, Enemies.enemyGreen, new Manager(across(0, 1100, 4))],
  [0, spawns, 60, getEnemyShip, Enemies.enemyGreen, new Manager(across(WIDTH, 1200, -4))],

  [0, spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(0, 500, 4))],
  [40, spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(0, 700, 4))],
  [80, spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(0, 900, 4))],

  [0, spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(WIDTH, 600, -4))],
  [40, spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(WIDTH, 800, -4))],
  [80, spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(WIDTH, 1000, -4))],
], []);

const s11YellowOneSpawns: Array<SectorData> = []
new Array(5).fill('').forEach((_, i: number) => {
  s11YellowOneSpawns.push([380 * i, 1, 40, getEnemyShip, Enemies.enemyYellowOne, new Manager(yellowOne(150, 256, -4, -4, 0, 360))]);
  s11YellowOneSpawns.push([380 * i, 1, 40, getEnemyShip, Enemies.enemyYellowOne, new Manager(yellowOne(0, 256, 4, -4, 90, 360))]);
  s11YellowOneSpawns.push([380 * i, 1, 40, getEnemyShip, Enemies.enemyYellowOne, new Manager(yellowOne(0, 30, 4, 4, 180, 360))]);
  s11YellowOneSpawns.push([380 * i, 1, 40, getEnemyShip, Enemies.enemyYellowOne, new Manager(yellowOne(150, 30, -4, 4, 270, 360))]);
})

const sector11 = new Sector([
  ...s11YellowOneSpawns,
  [120, spawns, 120, getEnemyShip, Enemies.enemyBlueTwo, new Manager(zigZag(130, HEIGHT, -8, -4, 180))],
], []);

const sector12 = new Sector([
  [0, spawns, 40, getEnemyShip, Enemies.enemyBlueOne, new Manager(cosFn(120, 300, 1000, 10))],
  [0, spawns, 40, getEnemyShip, Enemies.enemyBlueOne, new Manager(cosFn(120, -300, 500, 10))],

  [spawns * 40 + 40, spawns * 2, 40, getEnemyShip, Enemies.enemyBlueOne, new Manager(cosFn(120, 300, 1000, 10))],
  [spawns * 40 + 40, spawns * 2, 40, getEnemyShip, Enemies.enemyBlueOne, new Manager(cosFn(120, -300, 500, 10))],

  [spawns * 2 * 40 + 40, spawns, 40, getEnemyShip, Enemies.enemyBlueOne, new Manager(cosFn(120, 300, 1000, 10))],
  [spawns * 2 * 40 + 40, spawns, 40, getEnemyShip, Enemies.enemyBlueOne, new Manager(cosFn(120, -300, 500, 10))],

  [spawns * 3 * 40 + 40, spawns * 2, 40, getEnemyShip, Enemies.enemyBlueOne, new Manager(cosFn(120, 300, 1000, 10))],
  [spawns * 3 * 40 + 40, spawns * 2, 40, getEnemyShip, Enemies.enemyBlueOne, new Manager(cosFn(120, -300, 500, 10))],

  [spawns * 4 * 40 + 40, spawns * 2, 40, getEnemyShip, Enemies.enemyBlueOne, new Manager(cosFn(120, 300, 1000, 10))],
  [spawns * 4 * 40 + 40, spawns * 2, 40, getEnemyShip, Enemies.enemyBlueOne, new Manager(cosFn(120, -300, 500, 10))],


  [0, spawns, 50, getEnemyShip, Enemies.enemyBlueTwo, new Manager(cosFn(80, 50, 1200, 5))],
  [0, spawns, 50, getEnemyShip, Enemies.enemyBlueTwo, new Manager(cosFn(80, -50, 300, 5))],

  [spawns * 80 + 80, spawns, 50, getEnemyShip, Enemies.enemyBlueTwo, new Manager(cosFn(80, 50, 1200, 5))],
  [spawns * 80 + 80, spawns, 50, getEnemyShip, Enemies.enemyBlueTwo, new Manager(cosFn(80, -50, 300, 5))],

  [spawns * 2 * 80 + 80, spawns, 50, getEnemyShip, Enemies.enemyBlueTwo, new Manager(cosFn(80, 50, 1200, 5))],
  [spawns * 2 * 80 + 80, spawns, 50, getEnemyShip, Enemies.enemyBlueTwo, new Manager(cosFn(80, -50, 300, 5))],


  [400, spawns * 2, 80, getEnemyShip, Enemies.enemyPink, new Manager(neutral(150, 24))],
  [400, spawns * 2, 80, getEnemyShip, Enemies.enemyPink, new Manager(neutral(1350, 24))],

  [400 + (spawns * 2), spawns, 80, getEnemyShip, Enemies.enemyPink, new Manager(neutral(150, 24))],
  [400 + (spawns * 2), spawns, 80, getEnemyShip, Enemies.enemyPink, new Manager(neutral(1350, 24))],

  [400, spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(0, 500, 8))],
  [450, spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(0, 700, 8))],
  [400, spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(WIDTH, 600, -8))],
  [450, spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(WIDTH, 800, -8))],

  [400 + (spawns * 40), spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(0, 500, 8))],
  [450 + (spawns * 40), spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(0, 700, 8))],
  [400 + (spawns * 40), spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(WIDTH, 600, -8))],
  [450 + (spawns * 40), spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(WIDTH, 800, -8))],

  [400 + (spawns * 40 * 2), spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(0, 500, 8))],
  [450 + (spawns * 40 * 2), spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(0, 700, 8))],
  [400 + (spawns * 40 * 2), spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(WIDTH, 600, -8))],
  [450 + (spawns * 40 * 2), spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(WIDTH, 800, -8))],

  [400 + (spawns * 40 * 3), spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(0, 500, 8))],
  [450 + (spawns * 40 * 3), spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(0, 700, 8))],
  [400 + (spawns * 40 * 3), spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(WIDTH, 600, -8))],
  [450 + (spawns * 40 * 3), spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(WIDTH, 800, -8))],

  [400 + (spawns * 40 * 4), spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(0, 800, 8))],
  [450 + (spawns * 40 * 4), spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(0, 1000, 8))],
  [400 + (spawns * 40 * 4), spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(WIDTH, 900, -8))],
  [450 + (spawns * 40 * 4), spawns, 40, getEnemyShip, Enemies.enemyYellowTwo, new Manager(across(WIDTH, 1100, -8))],
], []);

const s13YellowOneSpawns: Array<SectorData> = []
new Array(10).fill('').forEach((_, i: number) => {
  s13YellowOneSpawns.push([380 * i, 1, 40, getEnemyShip, Enemies.enemyYellowOne, new Manager(yellowOne(0, 30, 4, 4, 180, 360))])
  s13YellowOneSpawns.push([380 * i, 1, 40, getEnemyShip, Enemies.enemyYellowOne, new Manager(yellowOne(150, 30, -4, 4, 270, 360))])
})

const sector13 = new Sector([
  [0, spawns, 260, getEnemyShip, Enemies.enemyGreen, new Manager(neutral(150, 8))],
  [0, spawns, 260, getEnemyShip, Enemies.enemyGreen, new Manager(neutral(550, 8))],
  [0, spawns, 260, getEnemyShip, Enemies.enemyGreen, new Manager(neutral(950, 8))],
  [0, spawns, 260, getEnemyShip, Enemies.enemyGreen, new Manager(neutral(1350, 8))],

  ...s13YellowOneSpawns,

  [80 * spawns, spawns, 40, getEnemyShip, Enemies.enemyBlueTwo, new Manager(zigZag(130, 0, -8, 4))],
  [80 * spawns, spawns, 40, getEnemyShip, Enemies.enemyBlueTwo, new Manager(zigZag(20, 0, 8, 4))],

  [130, spawns, 260, getEnemyShip, Enemies.enemyGreen, new Manager(neutral(150, 8))],
  [130, spawns, 260, getEnemyShip, Enemies.enemyGreen, new Manager(neutral(550, 8))],
  [130, spawns, 260, getEnemyShip, Enemies.enemyGreen, new Manager(neutral(950, 8))],
  [130, spawns, 260, getEnemyShip, Enemies.enemyGreen, new Manager(neutral(1350, 8))],
], [
  'commander this is it',
  ' ',
  'good luck'
]);
const sectors = [sector1, sector2, sector3, sector4, sector5, sector6, sector7, sector8, sector9, sector10, sector11, sector12, sector13]
const currentSector = () => sectors[state.currentSectorNumber - 1]

function endGame() {
  state.gameOver = true;
  setTimeout(() => {
    data.scenes.game.hide();
    data.scenes.end.show();
  }, 2000)
}

export { currentSector, sectors, sector1, sector2, sector3, endGame }
