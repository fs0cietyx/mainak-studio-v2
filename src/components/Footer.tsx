import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const socials = [
  { platform: "Instagram", handle: "fushigurp", link: "https://www.instagram.com/fushigurp" },
  { platform: "GitHub", handle: "fs0cietyx", link: "https://github.com/fs0cietyx" },
  { platform: "Email", handle: "mainakbiswas22", link: "mailto:mainakbiswas22@gmail.com" }
];

const SocialRow = ({ social, index, scrollYProgress }: { social: typeof socials[0], index: number, scrollYProgress: import('framer-motion').MotionValue<number> }) => {
  const centerP = (70 + index * 20) / 150;
  const startP = centerP - 0.15;
  const endP = centerP + 0.15;

  const pushProgress = useTransform(
    scrollYProgress,
    [startP, centerP, endP],
    [0, 1, 0]
  );
  
  const xOffset = useTransform(pushProgress, v => Math.pow(Math.max(0, v), 1.5) * 60);
  const textOpacity = useTransform(pushProgress, v => 0.3 + (Math.pow(Math.max(0, v), 1.5) * 0.7));

  return (
    <motion.a 
      href={social.link} 
      target="_blank" 
      rel="noreferrer" 
      style={{ opacity: textOpacity, willChange: "opacity" }}
      className="flex w-full h-[20vh] items-center justify-center group cursor-pointer transition-colors duration-300 hover:!opacity-100"
    >
      {/* Left Side: Platform (Moves Left) */}
      <motion.div 
        style={{ x: useTransform(xOffset, v => -v), willChange: "transform" }} 
        className="flex-1 flex justify-end"
      >
        <span className="text-[10vw] md:text-[7vw] font-handwritten leading-none transition-all duration-300">
          {social.platform}
        </span>
      </motion.div>
      
      {/* Tightly coupled gap that matches the stationary @ */}
      <div className="w-[12vw] md:w-[8vw] shrink-0" />

      {/* Right Side: Handle (Moves Right) */}
      <motion.div 
        style={{ x: xOffset, willChange: "transform" }} 
        className="flex-1 flex justify-start"
      >
        <span className="text-[10vw] md:text-[7vw] font-handwritten leading-none whitespace-nowrap">
          {social.handle}
        </span>
      </motion.div>
    </motion.a>
  );
};

export const Footer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["50vh", "-100vh"]);

  // Paint streak physics (Squash and stretch)
  // At 0.2, leading edge hits 50vh (top 20vh + height 30vh).
  // From 0.2 to 0.25, leading edge stays at 50vh while the tail (top) catches up to 50vh, reducing height to 0.
  const streakHeight = useTransform(scrollYProgress, [0.05, 0.2, 0.25], ["0vh", "30vh", "0vh"]);
  const streakTop = useTransform(scrollYProgress, [0.05, 0.2, 0.25], ["0vh", "20vh", "50vh"]);

  // @ symbol bursts out just as the tail crashes in (0.23) with an elastic overshoot
  const atOpacity = useTransform(scrollYProgress, [0.23, 0.26], [0, 1]);
  const atScale = useTransform(scrollYProgress, [0.23, 0.28, 0.35], [0, 1.3, 1]);
  
  // The @ symbol stays perfectly centered until the final 'Email' row reaches it (at 0.733).
  // After that, it locks onto the Email row and scrolls upward with it naturally to -40vh.
  const atY = useTransform(scrollYProgress, [0, 0.733, 1.0], ["0vh", "0vh", "-40vh"]);

  return (
    <footer ref={containerRef} className="relative w-full h-[200vh] bg-[#E1E0CC] text-black border-t border-black/10">
      {/* Background Noise for Texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between">
        
        {/* The Black Paint Streak */}
        <motion.div 
          className="absolute left-1/2 w-1.5 md:w-2.5 bg-black z-30 -translate-x-1/2 rounded-full"
          style={{ 
            top: streakTop,
            height: streakHeight,
            willChange: "height, top" 
          }}
        />

        {/* Stationary Center @ */}
        <motion.div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-20"
          style={{
            opacity: atOpacity,
            scale: atScale,
            y: atY,
            willChange: "transform, opacity"
          }}
        >
          <span className="text-[6.5vw] md:text-[5vw] font-mono leading-none text-black tracking-tighter font-bold drop-shadow-md">
            @
          </span>
        </motion.div>

        {/* Scrolling Social List */}
        <motion.div style={{ y, willChange: "transform", translateZ: 0 }} className="absolute w-full flex flex-col items-center z-10 top-0">
          <div className="h-[60vh] w-full shrink-0" />
          {socials.map((social, i) => (
            <SocialRow key={i} index={i} social={social} scrollYProgress={scrollYProgress} />
          ))}
        </motion.div>

        {/* Bottom Bar attached to sticky container */}
        <div className="absolute bottom-0 w-full flex flex-col md:flex-row justify-between items-center gap-6 px-6 pb-8 z-30 pointer-events-auto">
          <p className="text-black/60 text-[10px] font-bold uppercase tracking-[0.2em]">
            © 2026 Mainak Biswas. All Rights Reserved.
          </p>
          <motion.button
            whileHover={{ y: -5 }}
            onClick={scrollToTop}
            className="flex items-center gap-2 text-black/60 hover:text-black transition-colors text-[10px] font-bold uppercase tracking-[0.2em]"
          >
            Back to Top <ArrowUp size={14} strokeWidth={3} />
          </motion.button>
        </div>

      </div>
    </footer>
  );
};
