import { bicubicInterpolation } from './Bicubic';
import { Vec2, Matrix } from '../utils/math';

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

  const matrix: Matrix<Vec2> = {
    data: [],
    width: img.width,
    height: img.height,
  };
  for (let i = 0; i < img.height; ++i) {
    matrix.data[i] = [];
    for (let j = 0; j < img.width; ++j) {
      const data: Uint8ClampedArray = context.getImageData(i, j, 1, 1).data;
      data[0] = 0; // no red
      context.putImageData(new ImageData(data, 1, 1), i, j);
      matrix.data[i][j] = { x: data[1], y: data[2] };
    }
  }
  return matrix;
}

function matrixToImg(matrix: Matrix<Vec2>, scaleFactor = 1) {
  const w = matrix.width;
  const h = matrix.height;

  const canvas = createCanvas(w * scaleFactor, h * scaleFactor);
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  const imgData = context.createImageData(w * scaleFactor, h * scaleFactor);

  for (let i = 0; i < h * scaleFactor; ++i) {
    for (let j = 0; j < w * scaleFactor; ++j) {
      const oldI = i / scaleFactor;
      const oldJ = j / scaleFactor;

      const val = bicubicInterpolation(matrix, oldJ, oldI);
      const arrI = 4 * (j * h * scaleFactor + i);
      imgData.data[arrI] = 0;
      imgData.data[arrI + 1] = val.x;
      imgData.data[arrI + 2] = val.y;
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
