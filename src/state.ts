import { GameLoop } from "kontra"
import { SCALE } from "./constants"
import { Sector } from "./sectorManager"
// import { sectors } from "./sectorManager"

console.log('2. State');

const state = {
  // The android phone I tested on seemed to run at 2x speed, making lvl 11 impossible.
  // Tracking for special-case adjustments
  isAndroid: false,
  sectors: [] as Array<Sector>,
  currentSectorNumber: 1,
  currentSectorClass: undefined as unknown as Sector,
  shipEngaged: false,
  loop: undefined as unknown as GameLoop,
  paused: false,
  playerX: 75 * SCALE,
  moveToX: 75 * SCALE,
  playerY: 234 * SCALE,
  moveToY: 234 * SCALE,
  totalTime: 0,
  sectorTime: 0,
  touchOffset: 0,
  lives: 3,
  score: 0,
  scoreMult: 1,
  invulnerableAt: -500,
  invulnerable: false,
  invulnableralFlash: .1,
  gameOver: false,
  powerups: {
    wingshot: false,
    trishot: false,
    doublerate: false,
    bomb: false,
    wingbomb: false,
    shield: false,
  },
  playershield: 0,
  comms: [] as Array<string>,
  fear: 0,
  rofAdjust: 0,
  rngAdjust: 0,
  hardcore: false,
}

function resetPowerups() {
  state.scoreMult = 1;
  Object.keys(state.powerups).forEach((key) => {
    state.powerups[key as keyof typeof state.powerups] = false;
  })
}

export { state, resetPowerups }
