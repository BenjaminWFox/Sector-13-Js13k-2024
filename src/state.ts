import { SCALE } from "./constants"

function initState() {
  return {
    playerX: 75 * SCALE,
    playerY: 234 * SCALE,
    time: 0
  }
}

const state = { ...initState() }

export { state }
