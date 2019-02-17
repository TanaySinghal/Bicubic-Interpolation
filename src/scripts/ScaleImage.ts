import { bicubicInterpolation } from './Bicubic';
import { Matrix, matrixMap } from '../utils/math';

type ImagePixels = Uint8ClampedArray;

export function scaleImage(url: string, scaleFactor: number) {
  const promise = loadImage(url);
  promise.then(function(img) {
    console.log('IMAGE LOADED');
    const matrix = imgToMatrix(img);
    matrixToImg(matrix, scaleFactor);
  });
}

function imgToMatrix(img: HTMLImageElement) {
  const canvas = createCanvas(img.width, img.height);
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  context.drawImage(img, 0, 0);

  const matrix: Matrix<ImagePixels> = {
    data: [],
    width: img.width,
    height: img.height,
  };
  for (let i = 0; i < img.height; ++i) {
    matrix.data[i] = [];
    for (let j = 0; j < img.width; ++j) {
      const data = context.getImageData(i, j, 1, 1).data.slice();
      context.putImageData(new ImageData(data, 1, 1), i, j);
      matrix.data[i][j] = data;
    }
  }
  return matrix;
}

function matrixToImg(matrix: Matrix<ImagePixels>, scaleFactor = 1) {
  const w = matrix.width;
  const h = matrix.height;

  const canvas = createCanvas(w * scaleFactor, h * scaleFactor);
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  const imgData = context.createImageData(w * scaleFactor, h * scaleFactor);

  const matrixR = matrixMap(matrix, (v) => v[0]);
  const matrixG = matrixMap(matrix, (v) => v[1]);
  const matrixB = matrixMap(matrix, (v) => v[2]);

  for (let i = 0; i < h * scaleFactor; ++i) {
    for (let j = 0; j < w * scaleFactor; ++j) {
      const oldI = i / scaleFactor;
      const oldJ = j / scaleFactor;

      const arrI = 4 * (j * h * scaleFactor + i);
      imgData.data[arrI] = bicubicInterpolation(matrixR, oldJ, oldI);
      imgData.data[arrI + 1] = bicubicInterpolation(matrixG, oldJ, oldI);
      imgData.data[arrI + 2] = bicubicInterpolation(matrixB, oldJ, oldI);
      imgData.data[arrI + 3] = 255;
    }
  }

  context.putImageData(imgData, 0, 0);
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>(function(resolve, reject) {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
  });
}

function createCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas') as HTMLCanvasElement;
  canvas.width = width;
  canvas.height = height;
  const body = document.getElementsByTagName('body')[0];
  body.appendChild(canvas);
  return canvas;
}
