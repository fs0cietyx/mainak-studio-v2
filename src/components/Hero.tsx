import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { WordsPullUp } from './animations';
import { getSecureEmail } from '../utils/security';



/**
 * Enterprise-grade Navigation Bar.
 * 
 * Implements frost-glass aesthetics, GPU-accelerated hover states,
 * and secure protocol handling for contact relays.
 */

const CylinderRow = ({ text, href, direction, onClick, isExternal, isDownload }: any) => {
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
  const email: string = getSecureEmail();

  return (
    <>
      <nav className="absolute top-4 left-4 md:top-6 md:left-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-4 flex items-center justify-center transition-transform active:scale-95 group cursor-pointer"
        >
          <div className="relative flex flex-col justify-between w-6 h-4">
            <motion.span 
              animate={isOpen ? { rotate: 45, y: 7, backgroundColor: "#ef4444" } : { rotate: 0, y: 0, backgroundColor: "#E1E0CC" }} 
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="w-full h-[1.5px] block origin-center"
            />
            <motion.span 
              animate={isOpen ? { rotate: -45, backgroundColor: "#ef4444" } : { rotate: 0, backgroundColor: "#E1E0CC" }} 
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="w-full h-[1.5px] block origin-center"
            />
            <motion.span 
              animate={isOpen ? { rotate: -45, y: -7, backgroundColor: "#ef4444" } : { rotate: 0, y: 0, backgroundColor: "#E1E0CC" }} 
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
              className="fixed inset-0 z-40"
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

/**
 * High-Performance Cinematic Hero Section.
 * 
 * Adheres to Pillar III (Cinematic Motion) and Pillar IV (Core Web Vitals).
 * Utilizes GPU-accelerated transforms and optimized video rendering.
 */
export const Hero: React.FC = () => {
  const secureEmail: string = getSecureEmail();

  return (
    <section className="h-screen w-full p-4 md:p-6 bg-black relative overflow-hidden">
      <div className="w-full h-full rounded-2xl md:rounded-[2.5rem] overflow-hidden relative shadow-2xl">
        {/* Optimized Background Engine */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/hero-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none opacity-60"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Cinematic Overlays - GPU Rendered */}
        <div className="absolute inset-0 noise-overlay opacity-[0.4] mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

        <Navbar />

        {/* Adaptive Layout Canvas */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
            
            {/* Semantic Typography Engine */}
            <div className="md:col-span-8 flex flex-col items-start select-none">
              <WordsPullUp
                text="Mainak"
                className="font-display text-[18vw] sm:text-[15vw] md:text-[13vw] lg:text-[11vw] font-bold leading-[0.7] tracking-[-0.08em]"
                style={{ color: '#E1E0CC' }}
              />
              <WordsPullUp
                text="Biswas"
                showAsterisk
                className="font-display text-[18vw] sm:text-[15vw] md:text-[13vw] lg:text-[11vw] font-bold leading-[0.7] tracking-[-0.08em]"
                style={{ color: '#E1E0CC' }}
              />
            </div>

            {/* Strategic Conversion Content */}
            <div className="md:col-span-4 flex flex-col gap-8">
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
                className="text-primary/80 text-xs sm:text-sm md:text-base leading-[1.3] max-w-sm font-medium"
              >
                Creative Technologist & AI/ML Engineer at KIIT University. I teach silicon how to dream in high-definition. Building intelligent software so beautiful, even the machines get a little jealous.
              </motion.p>

              {/* Secure CTA Relay */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.6, ease: [0.19, 1, 0.22, 1] }}
              >
                {/* The GIF was removed from here per user request */}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
