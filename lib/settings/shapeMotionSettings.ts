// lib/settings/shapeMotionSettings.ts

export type ShapeKey = "cube" | "torus" | "cylinder" | "wave";

export const shapeMotionSettings: Record<
  ShapeKey,
  {
    gain: number;
    max: number;
    damp: number;
    baseVelocity: number;
  }
> = {
  cube: {
    gain: 2.0,
    max: 0.1,
    damp: 0.94,
    baseVelocity: 0.002,
  },
  torus: {
    baseVelocity: 0.005,
    gain: 1.2,
    max: 0.2,
    damp: 0.93,
  },
  cylinder: {
    baseVelocity: 0.005,
    gain: 1.2,
    max: 0.2,
    damp: 0.93,
  },
  wave: {
    baseVelocity: 0.005,
    gain: 1.2,
    max: 0.2,
    damp: 0.93,
  },
};
