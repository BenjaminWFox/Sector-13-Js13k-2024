import { GameLoop } from "kontra"
import { SCALE } from "./constants"
import { sectors } from "./sectorManager"

function initState() {
  return {
    currentSectorNumber: 1,
    currentSectorClass: sectors[0],
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
    lives: 1,
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
    playershield: 0
  }
}

const state = { ...initState() }

function resetPowerups() {
  Object.keys(state.powerups).forEach((key) => {
    state.powerups[key as keyof typeof state.powerups] = false;
  })
}

export { state, resetPowerups }
