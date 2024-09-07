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
    lives: 3,
    invulnerableAt: 0,
    invulnerable: false,
    invulnableralFlash: .1,
  }
}

const state = { ...initState() }

export { state }
