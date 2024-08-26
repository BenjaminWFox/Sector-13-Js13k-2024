import { GameLoop } from "kontra"
import { SCALE } from "./constants"

function initState() {
  return {
    currentSector: 0,
    shipEngaged: false,
    loop: undefined as unknown as GameLoop,
    paused: false,
    playerX: 75 * SCALE,
    playerY: 234 * SCALE,
    time: 0
  }
}

const state = { ...initState() }

export { state }
