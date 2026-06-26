import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
// Raw JS Convolutional Neural Network Implementation
// Blisteringly fast, runs in <1ms without TFJS dependencies
import weightsRaw from '../assets/cnn_weights.json';

const weights = weightsRaw as {
  conv_weight: number[][][][]; // [8, 1, 3, 3]
  conv_bias: number[];         // [8]
  fc_weight: number[][];       // [10, 1568]
  fc_bias: number[];           // [10]
};

// Softmax activation
const softmax = (arr: number[]) => {
  const max = Math.max(...arr);
  const exps = arr.map(x => Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(x => x / sum);
};

export const MLLab: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [probs, setProbs] = useState<number[]>(new Array(10).fill(0));

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const headerOpacity = useTransform(scrollYProgress, [0.2, 0.3, 0.4, 0.5], [0, 1, 1, 0]);
  const headerY = useTransform(scrollYProgress, [0.2, 0.3, 0.4, 0.5], [50, 0, 0, -50]);
  
  const textX = useTransform(scrollYProgress, [0, 0.35], ["-50vw", "100vw"]);
  const gifX = useTransform(scrollYProgress, [0, 0.35], ["100vw", "0vw"]);
  const introY = useTransform(scrollYProgress, [0.35, 0.45], ["0vh", "-100vh"]);
  const introOpacity = useTransform(scrollYProgress, [0.35, 0.45], [1, 0]);

  const sandboxOpacity = useTransform(scrollYProgress, [0.45, 0.55, 0.8, 0.9], [0, 1, 1, 0]);
  const sandboxY = useTransform(scrollYProgress, [0.45, 0.55], [50, 0]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    }
  }, []);

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    }
    setProbs(Array(10).fill(0));
    setPrediction(null);
  };

  const runInference = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const gridSize = canvas.width / 28;
    const rawVec = new Array(28 * 28).fill(0);
    
    let hasData = false;
    let minX = 28, maxX = -1, minY = 28, maxY = -1;

    for (let y = 0; y < 28; y++) {
      for (let x = 0; x < 28; x++) {
        let sum = 0;
        for (let dy = 0; dy < gridSize; dy++) {
          for (let dx = 0; dx < gridSize; dx++) {
            sum += data[((y * gridSize + dy) * canvas.width + (x * gridSize + dx)) * 4];
          }
        }
        let val = sum / (gridSize * gridSize);
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

    if (!hasData) return;

    const centerX = Math.floor((minX + maxX) / 2);
    const centerY = Math.floor((minY + maxY) / 2);
    const shiftX = 14 - centerX;
    const shiftY = 14 - centerY;

    const inputGrid = new Array(28).fill(0).map(() => new Array(28).fill(0));
    for (let y = 0; y < 28; y++) {
      for (let x = 0; x < 28; x++) {
        const srcX = x - shiftX;
        const srcY = y - shiftY;
        if (srcX >= 0 && srcX < 28 && srcY >= 0 && srcY < 28) {
          let val = rawVec[srcY * 28 + srcX];
          inputGrid[y][x] = ((val / 255.0) - 0.1307) / 0.3081;
        } else {
          inputGrid[y][x] = ((0.0 / 255.0) - 0.1307) / 0.3081;
        }
      }
    }

    // --- FORWARD PASS: TINY CNN ---
    
    // 1. Conv2D (1 in, 8 out, 3x3 kernel, pad 1) + ReLU
    const convOut = new Array(8).fill(0).map(() => new Array(28).fill(0).map(() => new Array(28).fill(0)));
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
    const poolOut = new Array(8).fill(0).map(() => new Array(14).fill(0).map(() => new Array(14).fill(0)));
    for (let c = 0; c < 8; c++) {
      for (let y = 0; y < 14; y++) {
        for (let x = 0; x < 14; x++) {
          let maxVal = -Infinity;
          for (let py = 0; py < 2; py++) {
            for (let px = 0; px < 2; px++) {
              maxVal = Math.max(maxVal, convOut[c][y * 2 + py][x * 2 + px]);
            }
          }
          poolOut[c][y][x] = maxVal;
        }
      }
    }

    // 3. Flatten
    const flat = new Array(8 * 14 * 14);
    let idx = 0;
    for (let c = 0; c < 8; c++) {
      for (let y = 0; y < 14; y++) {
        for (let x = 0; x < 14; x++) {
          flat[idx++] = poolOut[c][y][x];
        }
      }
    }

    // 4. Linear (1568 -> 10)
    const out = new Array(10).fill(0);
    for (let i = 0; i < 10; i++) {
      let val = weights.fc_bias[i];
      for (let j = 0; j < 1568; j++) {
        val += flat[j] * weights.fc_weight[i][j];
      }
      out[i] = val;
    }

    const probabilities = softmax(out);
    setProbs(probabilities);
    setPrediction(probabilities.indexOf(Math.max(...probabilities)));
  };

  return (
    <section ref={containerRef} className="relative w-full h-[300vh] bg-black text-white">
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        
        {/* Step 1: Animated Text & GIF Sequence */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          style={{ y: introY, opacity: introOpacity, willChange: "transform, opacity" }}
        >
          {/* Background Text Sweep */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ x: textX, willChange: "transform" }}
          >
            <span 
              className="text-[18vw] font-black text-white/10 whitespace-nowrap tracking-tighter"
              style={{ fontFamily: "'Libre Mono', monospace" }}
            >
              NEURAL SANDBOX
            </span>
          </motion.div>

          {/* GIF Sweep */}
          <motion.div 
            className="relative w-72 md:w-[450px]"
            style={{ x: gifX, willChange: "transform" }}
          >
            <img 
              src="/hero-gif.gif" 
              alt="Neural Lab Intro" 
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </motion.div>
        </motion.div>

        {/* Step 2: Ultra Minimal ML Sandbox */}
        <motion.div 
          style={{ opacity: sandboxOpacity, y: sandboxY }}
          className="absolute inset-0 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 z-20"
        >
          {/* Canvas Section */}
          <div className="flex flex-col gap-6 w-[240px] md:w-[280px]">
            <div className="flex justify-between items-end border-b border-white/20 pb-2">
              <span className="font-mono text-[10px] text-white/50 tracking-[0.2em] uppercase">Input</span>
              <span className="font-mono text-[8px] text-primary/70 tracking-widest uppercase">Draw Center</span>
            </div>
            
            {/* Tech Grid Canvas Container */}
            <div className="relative w-full aspect-square bg-[#050505] overflow-hidden group">
              {/* Subtle Grid Background */}
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none" 
                style={{ 
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', 
                  backgroundSize: '28px 28px' 
                }} 
              />
              
              {/* Corner Reticles */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/40 pointer-events-none transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/40 pointer-events-none transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/40 pointer-events-none transition-transform group-hover:-translate-x-1 group-hover:translate-y-1" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/40 pointer-events-none transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
              
              <canvas
                ref={canvasRef}
                width={280}
                height={280}
                onMouseDown={() => setIsDrawing(true)}
                onMouseMove={draw}
                onMouseUp={() => { setIsDrawing(false); runInference(); }}
                onMouseOut={() => { setIsDrawing(false); runInference(); }}
                onTouchStart={(e) => { setIsDrawing(true); draw(e); }}
                onTouchMove={draw}
                onTouchEnd={() => { setIsDrawing(false); runInference(); }}
                className="absolute inset-0 w-full h-full cursor-crosshair touch-none mix-blend-screen"
              />
            </div>
            
            <button 
              type="button"
              onClick={clearCanvas}
              className="text-left font-mono text-[10px] text-white/30 hover:text-primary hover:tracking-widest uppercase transition-all duration-300 w-fit cursor-pointer pointer-events-auto relative z-30"
            >
              [ Clear Canvas ]
            </button>
          </div>

          {/* Output Section */}
          <div className="flex flex-col gap-6 w-[240px] md:w-[280px]">
            <div className="flex justify-between items-end border-b border-white/20 pb-2">
              <span className="font-mono text-[10px] text-white/50 tracking-[0.2em] uppercase">Output</span>
              <span className="font-mono text-[8px] text-white/30 tracking-widest uppercase">Softmax</span>
            </div>
            
            <div className="flex flex-col gap-3">
              {probs.map((p, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <span className={`font-mono text-xs w-3 transition-colors ${prediction === i ? 'text-primary font-bold' : 'text-white/20 group-hover:text-white/50'}`}>
                    {i}
                  </span>
                  <div className="flex-1 h-[1px] bg-white/5 relative">
                    <motion.div 
                      className={`absolute inset-y-0 left-0 ${prediction === i ? 'bg-primary shadow-[0_0_8px_rgba(200,197,176,0.6)]' : 'bg-white/40'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${p * 100}%` }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  </div>
                  <span className={`font-mono text-[10px] w-8 text-right transition-colors ${prediction === i ? 'text-primary' : 'text-white/20'}`}>
                    {(p * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>

            <div className="h-8 flex items-center">
              {prediction !== null && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-mono text-[10px] text-primary/70 tracking-widest flex items-center gap-3"
                >
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  PREDICTION: <span className="text-primary font-bold text-lg">{prediction}</span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
