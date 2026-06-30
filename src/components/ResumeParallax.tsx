import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue, useSpring } from 'framer-motion';
import Floating, { FloatingElement } from './fancy/image/parallax-floating';

// 16 images from the extracted zip
const caseStudyImages = Array.from({ length: 16 }, (_, i) => 
  `/case-studies/draft7_page-${String(i + 1).padStart(4, '0')}.jpg`
);

// Predefined positions and depths to spread them widely across the screen
const imageConfig = [
  // Top edge
  { top: '2%', left: '5%', depth: 1.2, width: 'w-32 md:w-44' },
  { top: '5%', left: '30%', depth: 2.0, width: 'w-36 md:w-52' },
  { top: '1%', left: '60%', depth: 1.5, width: 'w-32 md:w-44' },
  { top: '8%', left: '85%', depth: 0.8, width: 'w-28 md:w-36' },
  
  // Upper middle / Sides
  { top: '30%', left: '2%', depth: 2.5, width: 'w-40 md:w-60' },
  { top: '20%', left: '20%', depth: 1.1, width: 'w-28 md:w-40' },
  { top: '35%', left: '75%', depth: 3.0, width: 'w-48 md:w-64' },
  { top: '25%', left: '90%', depth: 1.8, width: 'w-32 md:w-48' },
  
  // Lower middle / Sides
  { top: '60%', left: '8%', depth: 1.4, width: 'w-36 md:w-52' },
  { top: '50%', left: '25%', depth: 0.6, width: 'w-24 md:w-36' },
  { top: '70%', left: '65%', depth: 2.2, width: 'w-40 md:w-56' },
  { top: '55%', left: '85%', depth: 1.3, width: 'w-32 md:w-44' },
  
  // Bottom edge
  { top: '88%', left: '10%', depth: 1.0, width: 'w-28 md:w-36' },
  { top: '82%', left: '40%', depth: 1.7, width: 'w-36 md:w-52' },
  { top: '90%', left: '60%', depth: 1.5, width: 'w-32 md:w-48' },
  { top: '78%', left: '88%', depth: 2.8, width: 'w-40 md:w-60' },
];

export const ResumeParallax = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Track from when the top of container hits the top of viewport, 
    // to when the bottom of container hits the bottom of viewport
    offset: ["start start", "end end"] 
  });
  
  // Smooth out the scroll wheel for buttery cinematic physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const textX = useTransform(smoothProgress, [0, 1], ["20%", "-20%"]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[300vh] bg-black"
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden flex justify-center items-center">
        {/* Floating Layer (Text + Images) */}
        <div className="absolute inset-0 z-10">
          <Floating sensitivity={-0.6} className="overflow-hidden w-full h-full flex items-center justify-center">
            
            {/* Background Parallax Text */}
            <FloatingElement depth={0.4} className="z-0 pointer-events-none flex items-center justify-center w-full h-full">
              <motion.div 
                className="flex items-center justify-center w-full"
                style={{ x: textX, willChange: "transform" }}
              >
                <span 
                  className="text-[10vw] md:text-[8vw] lg:text-[6vw] text-white/15 drop-shadow-lg whitespace-nowrap tracking-tighter font-pixelify"
                >
                  Case Study
                </span>
              </motion.div>
            </FloatingElement>

            {caseStudyImages.map((src, index) => (
              <ParallaxScrollImage 
                key={src} 
                src={src} 
                index={index} 
                config={imageConfig[index]} 
                scrollYProgress={smoothProgress} 
              />
            ))}
          </Floating>
        </div>
      </div>
    </section>
  );
};

const ParallaxScrollImage = ({ src, index, config, scrollYProgress }: { src: string, index: number, config: any, scrollYProgress: MotionValue<number> }) => {
  // 0.0 -> 0.3: Fly in from the bottom/sides
  // 0.3 -> 0.7: Pause (locked in place so user can see them)
  // 0.7 -> 1.0: Fly out to the top/sides
  
  const y = useTransform(
    scrollYProgress, 
    [0, 0.3, 0.7, 1], 
    [800 * config.depth, 0, 0, -800 * config.depth]
  );
  
  const xOffset = (index % 2 === 0 ? -150 : 150) * config.depth;
  const x = useTransform(
    scrollYProgress, 
    [0, 0.3, 0.7, 1], 
    [xOffset, 0, 0, -xOffset]
  );
  
  const rotate = useTransform(
    scrollYProgress, 
    [0, 0.3, 0.7, 1], 
    [-20 * config.depth, 0, 0, 20 * config.depth]
  );

  return (
    <FloatingElement 
      depth={config.depth} 
      className="absolute"
      style={{ top: config.top, left: config.left }}
    >
      <motion.img
        style={{ y, x, rotate, willChange: 'transform' }}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.15, zIndex: 50 }}
        viewport={{ once: true, margin: "100px" }}
        transition={{ duration: 0.8, delay: index * 0.05 }}
        src={src}
        loading="lazy"
        decoding="async"
        className={`${config.width} h-auto object-cover cursor-pointer rounded border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.9)]`}
        alt={`Case Study Page ${index + 1}`}
      />
    </FloatingElement>
  );
};
