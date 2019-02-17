import { Matrix, clamp } from '../utils/math';

// Return 4x4 matrix
function getNeighbors<T>(img: Matrix<T>, imgX: number, imgY: number) {
  function getData(x: number, y: number) {
    const w = img.width - 1;
    const h = img.height - 1;
    return img.data[clamp(y, 0, w)][clamp(x, 0, h)];
  }

  const p: Matrix<T> = { data: [], width: 4, height: 4 };

  for (let i = 0; i < 4; ++i) {
    p.data[i] = [];
    for (let j = 0; j < 4; ++j) {
      p.data[i][j] = getData(imgX + (i - 1), imgY + (j - 1));
    }
  }
  return p;
}

/*
Sources:
https://blog.demofox.org/2015/08/15/resizing-images-with-bicubic-interpolation/
https://www.reddit.com/r/javascript/comments/jxa8x/bicubic_interpolation/
*/
export function bicubicInterpolation(matrix: Matrix<number>, x: number, y: number) {
  // At t = 0, return b. At t = 1, return c. b and c are directly neighboring pixels
  function cubicHermite(t: number, a: number, b: number, c: number, d: number) {
    return (
      0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * t) * t) * t + b
    );
  }
  const imgX = Math.floor(x);
  const imgY = Math.floor(y);
  const fractX = x - imgX;
  const fractY = y - imgY;

  const p = getNeighbors(matrix, imgX, imgY).data;

  const col0 = cubicHermite(fractX, p[0][0], p[1][0], p[2][0], p[3][0]);
  const col1 = cubicHermite(fractX, p[0][1], p[1][1], p[2][1], p[3][1]);
  const col2 = cubicHermite(fractX, p[0][2], p[1][2], p[2][2], p[3][2]);
  const col3 = cubicHermite(fractX, p[0][3], p[1][3], p[2][3], p[3][3]);
  return cubicHermite(fractY, col0, col1, col2, col3);
}
