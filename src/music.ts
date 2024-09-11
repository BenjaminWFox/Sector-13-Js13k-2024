import { zzfx, zzfxX, zzfxP } from "./zzfx";
import { zzfxM } from "./zzfxm";

let audioContext = zzfxX;
let myAudioNode: any = null;

const song = [[[.5, 0, 43, .01, , .3, 2, , , , , , , , , .02, .01], [.5, 0, 270, , , .12, 3, 1.65, -2, , , , , 4.5, , .02], [.5, 0, 2200, , , .04, 3, 2, , , 800, .02, , 4.8, , .01, .1], [1.8, , 10, .07, , .28, 3, , 36, , -30, .11, , .4, 276, , .4, .68, .38, .31], [.8, , 238, .05, .17, .03, 4, 3.3, -4, , , , , .7, 1.7, , .02, , .03, , -1329], [.5, , 52, .18, .19, .21, 1, 1.4, , , 418, .14, .18, .2, , , .39, .63, .24]], [[[, , 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 21, 21, 33, 33], [1, , , , 13, 13, , , , , 13, 13, 13, , , , , , , , 13, 13, , , , , 13, 13, 13, 13, 13, , , , , , 13, 13, , , , , 13, 13, 13, , , , , , , , 13, 13, , , , , 13, 13, 13, 13, 13, , , ,], [2, , , , , , 18, , , , , , 18, 18, , , 18, , , , , , 18, , , , , , , 18, 18, , , , 18, , , , 18, , , , , , 18, 18, , , , , 18, 18, , , 18, , , , 18, , , 18, 18, , , ,]]], [0], , { "title": "Sector13_Depp_Remix", "Notes": "Unknown author", "instruments": ["Instrument 1", "Instrument 3", "Instrument 6", "Instrument 8", "Instrument 14", "Instrument 15"], "patterns": ["Pattern 4"] }]

export const sfx = (s: Array<number | undefined>) => zzfx(...s);

export function playSong() {
  if (myAudioNode) {
    audioContext.resume();
    return;
  }
  // @ts-ignore
  let mySongData = zzfxM(...song);
  myAudioNode = zzfxP(zzfxX, ...mySongData);
  myAudioNode.loop = true;
}
