import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useInView } from 'framer-motion';
import { WordsPullUp } from './animations';
import { Canvas, useFrame as useThreeFrame } from '@react-three/fiber';
import { Environment, Sparkles } from '@react-three/drei';
import { Model as RoboticArm } from './RoboticArm';
import { CustomCursor } from './CustomCursor';
import { easing } from 'maath';
interface CylinderRowProps {
  text: string;
  href: string;
  direction: number;
  onClick: () => void;
  isExternal?: boolean;
  isDownload?: boolean;
}

const CylinderRow: React.FC<CylinderRowProps> = ({ text, href, direction, onClick, isExternal, isDownload }) => {
  const items = text.length > 10 ? 3 : text.length > 6 ? 4 : 6;
  const degree = 360 / items;
  const fontSizeClass = text.length > 10 ? "text-[4.5vh] sm:text-[6vh]" : "text-[6vh] sm:text-[8vh]";
  
  return (
    <div className="relative w-full h-[10vh] sm:h-[12vh] flex items-center justify-center pointer-events-auto" style={{ perspective: '1200px' }}>
      <div className="absolute w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(-30vw)' }}>
        <motion.a
          href={href}
          onClick={onClick}
          target={isExternal ? '_blank' : '_self'}
          download={isDownload ? true : undefined}
          animate={{ rotateY: direction === 1 ? [0, -360] : [0, 360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute w-full h-full flex items-center justify-center group"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {[...Array(items)].map((_, i) => (
            <span
              key={i}
              className={`absolute text-[#E1E0CC]/50 group-hover:text-white transition-colors duration-300 font-sans font-bold uppercase tracking-tighter leading-none ${fontSizeClass} scale-y-110 whitespace-nowrap cursor-pointer`}
              style={{
                transform: `rotateY(${i * degree}deg) translateZ(35vw)`,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
              }}
            >
              {text}
            </span>
          ))}
        </motion.a>
      </div>
    </div>
  );
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <nav className="absolute top-12 left-4 md:top-14 md:left-6 z-[10001]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-4 flex items-center justify-center transition-transform active:scale-95 group cursor-pointer"
        >
          <div className="relative flex flex-col justify-between w-6 h-4">
            <motion.span 
              animate={isOpen ? { rotate: 45, y: 7, backgroundColor: "#ef4444" } : { rotate: 0, y: 0, backgroundColor: "#000000" }} 
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="w-full h-[1.5px] block origin-center"
            />
            <motion.span 
              animate={isOpen ? { rotate: -45, backgroundColor: "#ef4444" } : { rotate: 0, backgroundColor: "#000000" }} 
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="w-full h-[1.5px] block origin-center"
            />
            <motion.span 
              animate={isOpen ? { rotate: -45, y: -7, backgroundColor: "#ef4444" } : { rotate: 0, y: 0, backgroundColor: "#000000" }} 
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="w-full h-[1.5px] block origin-center"
            />
          </div>
        </button>
      </nav>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed inset-0 z-[10000]"
            >
              {/* Background Overlay */}
              <motion.div
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-black/95 backdrop-blur-xl"
              />
              
              {/* 3D Content Container */}
              <div className="absolute inset-0 flex flex-col items-center justify-center w-full h-full space-y-4 pointer-events-none">
                <CylinderRow text="RESUME" href="/resume.pdf" direction={1} onClick={() => setIsOpen(false)} isDownload={true} />
                <CylinderRow text="GITHUB" href="https://github.com/fs0cietyx" direction={-1} onClick={() => setIsOpen(false)} isExternal={true} />
                <CylinderRow text="MNIST SANDBOX" href="#mllab" direction={1} onClick={() => setIsOpen(false)} />
                <CylinderRow text="CONTACT ME" href="#contact" direction={-1} onClick={() => setIsOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </>
  );
};

// Smoothly pans the camera in opposition to the mouse, creating immense 3D depth
// Uses maath/easing to guarantee absolutely zero snappy movement.
const CameraRig = () => {
  useThreeFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [state.pointer.x * 0.1, state.pointer.y * 0.1, 6.5], // Almost locked so base stays put
      0.5,
      delta
    );
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

const Ticker = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-8 bg-black z-40 flex items-center overflow-hidden pointer-events-none">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <div className="flex items-center text-[#E1E0CC] font-sans font-bold text-[10px] sm:text-xs tracking-[0.2em] uppercase">
          {[...Array(15)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="px-4">pls hire me!!!</span>
              <span className="px-4 text-[#E1E0CC]/50">•</span>
            </React.Fragment>
          ))}
        </div>
        <div className="flex items-center text-[#E1E0CC] font-sans font-bold text-[10px] sm:text-xs tracking-[0.2em] uppercase">
          {[...Array(15)].map((_, i) => (
            <React.Fragment key={`dup-${i}`}>
              <span className="px-4">pls hire me!!!</span>
              <span className="px-4 text-[#E1E0CC]/50">•</span>
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export const Hero: React.FC = React.memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "0px 0px 500px 0px" });
  
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const handlePointerMove = (e: React.PointerEvent) => {
    mouseX.set(e.clientX / window.innerWidth);
    mouseY.set(e.clientY / window.innerHeight);
  };

  const springConfig = { damping: 45, stiffness: 60, mass: 1.2 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateY = useTransform(smoothX, [0, 1], [-18, 18]);
  const rotateX = useTransform(smoothY, [0, 1], [18, -18]);
  const translateX = useTransform(smoothX, [0, 1], [40, -40]);
  const translateY = useTransform(smoothY, [0, 1], [40, -40]);

  return (
    <section ref={containerRef} onPointerMove={handlePointerMove} className="h-screen w-full relative overflow-hidden" style={{ backgroundColor: '#E3E3D5' }}>
      
      <div className="w-full h-full relative pointer-events-auto" style={{ backgroundColor: '#E3E3D5' }}>
        
        <Ticker />
        <Navbar />

        {/* HERO TITLE - 3D Parallax Text */}
        <div className="absolute top-16 md:top-20 left-0 w-full flex justify-center z-10">
          <motion.div 
            style={{ rotateX, rotateY, x: translateX, y: translateY }}
            className="flex flex-row justify-center items-center select-none w-full max-w-full pointer-events-auto px-1"
          >
            <WordsPullUp
              text="Mainak Biswas"
              showAsterisk
              className="flex-nowrap font-display text-[12.5vw] sm:text-[13vw] md:text-[13.5vw] lg:text-[13.5vw] font-bold leading-[0.7] tracking-[-0.05em] whitespace-nowrap"
              style={{ color: '#000000' }}
            />
          </motion.div>
        </div>

        {/* Foreground 3D Canvas - Z-INDEX 9999 (In front of the cursor and text) */}
        <div className="absolute inset-0 z-[9999] pointer-events-none">
          <Canvas 
            eventSource={containerRef as any}
            camera={{ position: [0, 0, 8], fov: 45 }} 
            dpr={[1, 1.5]}
            frameloop={isInView ? "always" : "never"}
            performance={{ min: 0.5 }}
            gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
          >
            <CameraRig />
            
            <ambientLight intensity={0.4} />
            <Environment preset="city" blur={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={2.0} />
            <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} />
            
            <React.Suspense fallback={null}>
              <RoboticArm position={[0, -2.7, 0]} scale={3.6} />
              <Sparkles count={80} scale={12} size={1.5} speed={0.2} opacity={0.3} color="#000000" />
            </React.Suspense>
          </Canvas>
        </div>
      </div>
    </section>
  );
});
