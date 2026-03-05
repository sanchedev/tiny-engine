import type { AnimationKeyframe } from '../nodes/animation-player.js'

export function multiKF(kfs: AnimationKeyframe[]): AnimationKeyframe {
  return (time) => kfs.forEach((kf) => kf(time))
}
