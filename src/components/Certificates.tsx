import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { X, Minus, Maximize2 } from 'lucide-react';

export const Certificates = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const openModal = () => {
    setIsMaximized(false);
    setIsOpen(true);
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // GIF moves from right to center quickly
  const handX = useTransform(scrollYProgress, [0, 0.3], ["100vw", "0vw"]);
  
  // Pull down into the next section as the text finishes
  const handY = useTransform(scrollYProgress, [0.8, 1], ["0vh", "100vh"]);
  
  // Massive background text translating to the right
  const textX = useTransform(scrollYProgress, [0, 0.8], ["-50vw", "100vw"]);

  return (
    <section ref={containerRef} className="relative w-full h-[300vh] bg-black text-[#E1E0CC]">
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        
        {/* Massive Animated Background Text */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
          style={{ x: textX, willChange: "transform" }}
        >
          <span 
            className="text-[18vw] md:text-[14vw] text-[#E1E0CC]/15 drop-shadow-lg whitespace-nowrap tracking-tighter"
            style={{ fontFamily: "'Magazine Letter', system-ui" }}
          >
            RESUME
          </span>
        </motion.div>

        <motion.div 
          className="relative w-64 h-64 md:w-96 md:h-96 cursor-pointer flex items-center justify-center group"
          style={{
            x: handX,
            y: handY,
            willChange: "transform"
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openModal}
        >
          <img loading="lazy" decoding="async" 
            src="/cd-animation.gif" 
            alt="Interactive certificates portal" 
            className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:rotate-3"
          />
        </motion.div>

        {/* Modal Window for macOS folder contents */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                width: isMaximized ? "100vw" : "90vw",
                height: isMaximized ? "100vh" : "auto",
                borderRadius: isMaximized ? "0px" : "12px",
                top: isMaximized ? "0px" : "auto",
                left: isMaximized ? "0px" : "auto",
              }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`absolute z-50 max-w-3xl bg-[#1e1e1e]/95 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col ${isMaximized ? '!max-w-none !h-screen !w-screen !fixed inset-0' : 'min-h-[400px]'}`}
            >
              {/* macOS Window Header */}
              <div className="h-10 bg-gradient-to-b from-[#3a3a3a] to-[#2d2d2d] border-b border-black/50 flex items-center px-4 relative group/titlebar flex-shrink-0">
                <div className="flex gap-2 absolute left-4 z-10">
                  {/* Red (Close) */}
                  <button onClick={() => setIsOpen(false)} className="w-[12px] h-[12px] rounded-full bg-[#ff5f56] border border-[#e0443e] flex items-center justify-center overflow-hidden">
                    <X size={8} strokeWidth={3} className="text-black/60 opacity-0 group-hover/titlebar:opacity-100" />
                  </button>
                  {/* Yellow (Minimize) */}
                  <button onClick={() => setIsOpen(false)} className="w-[12px] h-[12px] rounded-full bg-[#ffbd2e] border border-[#dea123] flex items-center justify-center overflow-hidden">
                    <Minus size={8} strokeWidth={3} className="text-black/60 opacity-0 group-hover/titlebar:opacity-100" />
                  </button>
                  {/* Green (Maximize) */}
                  <button onClick={() => setIsMaximized(!isMaximized)} className="w-[12px] h-[12px] rounded-full bg-[#27c93f] border border-[#1aab29] flex items-center justify-center overflow-hidden">
                    <Maximize2 size={7} strokeWidth={3} className="text-black/60 opacity-0 group-hover/titlebar:opacity-100 rotate-45" />
                  </button>
                </div>
                <div className="w-full text-center font-sans text-[13px] font-semibold text-[#dfdfdf] tracking-wide pointer-events-none">
                  Research
                </div>
              </div>

              {/* Window Content */}
              <div className="flex-1 p-8 bg-[#1e1e1e] flex flex-wrap gap-8 content-start overflow-y-auto">
                <a 
                  href="/resume.pdf" 
                  target="_blank" 
                  rel="noreferrer"
                  className="group flex flex-col items-center justify-center w-24 rounded hover:bg-white/10 transition-colors cursor-pointer pt-2 pb-1"
                >
                  {/* macOS Style PDF Icon */}
                  <div className="relative w-14 h-16 bg-white rounded-sm shadow-md flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                     <div className="absolute top-0 right-0 w-4 h-4 bg-gray-200 border-b border-l border-gray-300 rounded-bl-sm"></div>
                     <span className="text-red-600 font-bold text-[10px] uppercase">PDF</span>
                  </div>
                  <span className="font-sans text-[11px] text-white group-hover:bg-[#0058d0] px-1 rounded truncate w-full text-center">Resume.pdf</span>
                </a>

                <a 
                  href="#" 
                  className="group flex flex-col items-center justify-center w-24 rounded hover:bg-white/10 transition-colors cursor-pointer pt-2 pb-1"
                >
                  {/* macOS Style Folder Icon */}
                  <div className="relative w-16 h-12 bg-[#30b0ff] rounded shadow-sm mb-4 mt-2 group-hover:scale-105 transition-transform border-t border-[#60c0ff]">
                     <div className="absolute -top-1.5 left-0 w-6 h-2 bg-[#30b0ff] rounded-t-sm border-t border-[#60c0ff] border-l"></div>
                  </div>
                  <span className="font-sans text-[11px] text-white group-hover:bg-[#0058d0] px-1 rounded truncate w-full text-center">Research</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
