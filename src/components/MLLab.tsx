import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { predictFromCanvasData } from '../utils/mlEngine';

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
  
  // Text moves from far left to far right (accounting for 250vw width)
  const textX = useTransform(scrollYProgress, [0, 0.5], ["-200vw", "200vw"]);
  
  // GIF moves from right and stops in the middle
  const gifX = useTransform(scrollYProgress, [0, 0.2], ["100vw", "0vw"]);
  
  // GIF stays stationary until 0.5 (waiting for text to completely exit), then moves down
  const introY = useTransform(scrollYProgress, [0.5, 0.6], ["0vh", "100vh"]);
  const introOpacity = useTransform(scrollYProgress, [0.5, 0.6], [1, 0]);

  // Sandbox glides in exactly as the GIF drops
  const sandboxOpacity = useTransform(scrollYProgress, [0.5, 0.6, 0.9, 1], [0, 1, 1, 0]);
  const sandboxY = useTransform(scrollYProgress, [0.5, 0.6], [50, 0]);

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
    const probabilities = predictFromCanvasData(data, canvas.width);
    
    if (probabilities) {
      setProbs(probabilities);
      setPrediction(probabilities.indexOf(Math.max(...probabilities)));
    }
  };

  return (
    <section ref={containerRef} className="relative w-full h-[400vh] bg-black text-white">
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
              className="text-[18vw] md:text-[14vw] text-[#E1E0CC]/15 drop-shadow-lg whitespace-nowrap tracking-tighter"
              style={{ fontFamily: "'Magazine Letter', system-ui" }}
            >
              NEURAL SANDBOX
            </span>
          </motion.div>

          {/* GIF Sweep */}
          <motion.div 
            className="relative w-72 md:w-[450px]"
            style={{ x: gifX, willChange: "transform" }}
          >
            <img loading="lazy" decoding="async" 
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
