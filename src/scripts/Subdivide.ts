import { Vec2, Matrix, add, mult } from '../utils/math';

export function subdivide(data: Matrix<Vec2>) {
  const img: Matrix<Vec2> = {
    data: [],
    width: 2 * data.width - 1,
    height: 2 * data.height - 1,
  };

  // Fill in known points
  for (let i = 0; i < img.height; ++i) {
    img.data[i] = [];
    for (let j = 0; j < img.width; ++j) {
      if (i % 2 === 0 && j % 2 === 0) {
        img.data[i][j] = data.data[i / 2][j / 2];
      } else {
        img.data[i][j] = { x: 0, y: 0 };
      }
    }
  }

  // Fill in face points
  for (let i = 1; i < img.height - 1; i += 2) {
    for (let j = 1; j < img.width - 1; j += 2) {
      img.data[i][j] = mult(
        add(
          add(img.data[i - 1][j - 1], img.data[i - 1][j + 1]),
          add(img.data[i + 1][j - 1], img.data[i + 1][j + 1])
        ),
        0.25
      );
    }
  }

  // Fill in edge points
  for (let i = 0; i < img.height; ++i) {
    for (let j = 0; j < img.width; ++j) {
      if (i % 2 === 0 && j % 2 === 1) {
        if (i === 0 || i === img.height - 1) {
          img.data[i][j] = mult(add(img.data[i][j - 1], img.data[i][j + 1]), 0.5);
        } else {
          img.data[i][j] = mult(
            add(
              add(img.data[i][j - 1], img.data[i][j + 1]),
              add(img.data[i - 1][j], img.data[i + 1][j])
            ),
            0.25
          );
        }
      } else if (i % 2 === 1 && j % 2 === 0) {
        if (j === 0 || j === img.width - 1) {
          img.data[i][j] = mult(add(img.data[i - 1][j], img.data[i + 1][j]), 0.5);
        } else {
          img.data[i][j] = mult(
            add(
              add(img.data[i][j - 1], img.data[i][j + 1]),
              add(img.data[i - 1][j], img.data[i + 1][j])
            ),
            0.25
          );
        }
      }
    }
  }
  return img;
}
