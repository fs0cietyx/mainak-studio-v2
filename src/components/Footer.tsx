import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const socials = [
  { platform: "Instagram", handle: "fushigurp", link: "https://www.instagram.com/fushigurp" },
  { platform: "GitHub", handle: "fs0cietyx", link: "https://github.com/fs0cietyx" },
  { platform: "Email", handle: "mainakbiswas22", link: "mailto:mainakbiswas22@gmail.com" }
];

export const Footer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["50vh", "-70vh"]);

  return (
    <footer ref={containerRef} className="relative w-full h-[200vh] bg-[#E1E0CC] text-black border-t border-black/10">
      {/* Background Noise for Texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between">
        
        {/* Stationary Center @ */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-20">
          <span className="text-[5.5vw] md:text-[4vw] font-mono leading-none text-black tracking-tighter" style={{ willChange: "transform" }}>
            @
          </span>
        </div>

        {/* Scrolling Social List */}
        <motion.div style={{ y, willChange: "transform", translateZ: 0 }} className="absolute w-full flex flex-col items-center z-10 top-1/2 -translate-y-1/2 pt-[20vh]">
          {socials.map((social, i) => (
            <a 
              key={i} 
              href={social.link} 
              target="_blank" 
              rel="noreferrer" 
              className="flex w-full items-center justify-center py-4 md:py-6 group cursor-pointer hover:opacity-50 transition-opacity duration-300"
            >
              {/* Left Side: Platform */}
              <div className="flex-1 flex justify-end">
                <span className="text-[5.5vw] md:text-[4vw] font-mono uppercase tracking-tighter leading-none group-hover:italic transition-all duration-300">
                  {social.platform}
                </span>
              </div>
              
              {/* Ultra-tight center gap perfectly matched to @ width in mono font */}
              <div className="w-[5.5vw] md:w-[4vw]" />

              {/* Right Side: Handle */}
              <div className="flex-1 flex justify-start">
                <span className="text-[5.5vw] md:text-[4vw] font-mono tracking-tighter leading-none whitespace-nowrap">
                  {social.handle}
                </span>
              </div>
            </a>
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
