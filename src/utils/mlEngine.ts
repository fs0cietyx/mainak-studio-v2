import weightsRaw from '../assets/cnn_weights.json';

const weights = weightsRaw as {
  conv_weight: number[][][][]; // [8, 1, 3, 3]
  conv_bias: number[];         // [8]
  fc_weight: number[][];       // [10, 1568]
  fc_bias: number[];           // [10]
};

// Zero-allocation pre-initialized buffers
const convOut = new Array(8).fill(0).map(() => new Array(28).fill(0).map(() => new Float32Array(28)));
const poolOut = new Array(8).fill(0).map(() => new Array(14).fill(0).map(() => new Float32Array(14)));
const flat = new Float32Array(8 * 14 * 14);
const out = new Float32Array(10);
const rawVec = new Float32Array(28 * 28);
const inputGrid = new Array(28).fill(0).map(() => new Float32Array(28));

const softmax = (arr: Float32Array | number[]): number[] => {
  const stdArr = Array.from(arr);
  const max = Math.max(...stdArr);
  const exps = stdArr.map(x => Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(x => x / sum);
};

export const predictFromCanvasData = (data: Uint8ClampedArray, width: number): number[] | null => {
  const gridSize = width / 28;
  
  let hasData = false;
  let minX = 28, maxX = -1, minY = 28, maxY = -1;

  for (let y = 0; y < 28; y++) {
    for (let x = 0; x < 28; x++) {
      let sum = 0;
      for (let dy = 0; dy < gridSize; dy++) {
        for (let dx = 0; dx < gridSize; dx++) {
          sum += data[((y * gridSize + dy) * width + (x * gridSize + dx)) * 4];
        }
      }
      const val = sum / (gridSize * gridSize);
      if (val > 0) {
        hasData = true;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
      rawVec[y * 28 + x] = val;
    }
  }

  if (!hasData) return null;

  const centerX = Math.floor((minX + maxX) / 2);
  const centerY = Math.floor((minY + maxY) / 2);
  const shiftX = 14 - centerX;
  const shiftY = 14 - centerY;

  for (let y = 0; y < 28; y++) {
    for (let x = 0; x < 28; x++) {
      const srcX = x - shiftX;
      const srcY = y - shiftY;
      if (srcX >= 0 && srcX < 28 && srcY >= 0 && srcY < 28) {
        const val = rawVec[srcY * 28 + srcX];
        inputGrid[y][x] = ((val / 255.0) - 0.1307) / 0.3081;
      } else {
        inputGrid[y][x] = ((0.0 / 255.0) - 0.1307) / 0.3081;
      }
    }
  }

  // --- FORWARD PASS: TINY CNN ---
  
  // 1. Conv2D (1 in, 8 out, 3x3 kernel, pad 1) + ReLU
  for (let c = 0; c < 8; c++) {
    for (let y = 0; y < 28; y++) {
      for (let x = 0; x < 28; x++) {
        let val = weights.conv_bias[c];
        for (let ky = 0; ky < 3; ky++) {
          for (let kx = 0; kx < 3; kx++) {
            const inY = y + ky - 1;
            const inX = x + kx - 1;
            if (inY >= 0 && inY < 28 && inX >= 0 && inX < 28) {
              val += inputGrid[inY][inX] * weights.conv_weight[c][0][ky][kx];
            }
          }
        }
        convOut[c][y][x] = Math.max(0, val); // ReLU
      }
    }
  }

  // 2. MaxPool2D (2x2)
  for (let c = 0; c < 8; c++) {
    for (let y = 0; y < 14; y++) {
      for (let x = 0; x < 14; x++) {
        let maxVal = -Infinity;
        for (let py = 0; py < 2; py++) {
          for (let px = 0; px < 2; px++) {
            const poolY = y * 2 + py;
            const poolX = x * 2 + px;
            if (poolY < 28 && poolX < 28) {
              maxVal = Math.max(maxVal, convOut[c][poolY][poolX]);
            }
          }
        }
        poolOut[c][y][x] = maxVal;
      }
    }
  }

  // 3. Flatten
  let idx = 0;
  for (let c = 0; c < 8; c++) {
    for (let y = 0; y < 14; y++) {
      for (let x = 0; x < 14; x++) {
        flat[idx++] = poolOut[c][y][x];
      }
    }
  }

  // 4. Linear (1568 -> 10)
  for (let i = 0; i < 10; i++) {
    let val = weights.fc_bias[i];
    for (let j = 0; j < 1568; j++) {
      val += flat[j] * weights.fc_weight[i][j];
    }
    out[i] = val;
  }

  return softmax(out);
};
