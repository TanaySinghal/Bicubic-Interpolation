export type Vec2 = {
  x: number;
  y: number;
};

export type Vec3 = {
  x: number;
  y: number;
  z: number;
};

export type Matrix<T> = {
  data: T[][];
  width: number;
  height: number;
};

export function matrixMap<T, U>(m: Matrix<T>, mapFn: (x: T) => U): Matrix<U> {
  return {
    data: m.data.map((row) => row.map((v) => mapFn(v))),
    width: m.width,
    height: m.height,
  };
}

export function clamp(val: number, min: number, max: number) {
  return Math.max(Math.min(val, max), min);
}

export function map(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  const result = outMin + ((outMax - outMin) * (value - inMin)) / (inMax - inMin);
  return clamp(result, outMin, outMax);
}

export function add(u: Vec2, v: Vec2) {
  return {
    x: u.x + v.x,
    y: u.y + v.y,
  };
}

export function mult(v: Vec2, c: number) {
  return {
    x: v.x * c,
    y: v.y * c,
  };
}
