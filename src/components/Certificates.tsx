import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FileText, Award, X } from 'lucide-react';

export const Certificates = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

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
            className="text-[25vw] md:text-[20vw] font-black text-white/15 drop-shadow-2xl whitespace-nowrap tracking-tighter"
            style={{ fontFamily: "'Libre Mono', monospace" }}
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
          onClick={() => setIsOpen(true)}
        >
          <img 
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
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute z-50 w-[90vw] max-w-2xl bg-[#1e1e1e]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* macOS Window Header */}
              <div className="h-10 bg-black/40 border-b border-white/10 flex items-center px-4 relative">
                <div className="flex gap-2">
                  <button onClick={() => setIsOpen(false)} className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 flex items-center justify-center group/close">
                    <X size={8} className="text-black opacity-0 group-hover/close:opacity-100" />
                  </button>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 font-mono text-xs text-white/50">
                  Certificates
                </div>
              </div>

              {/* Window Content */}
              <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                <a 
                  href="/resume.pdf" 
                  target="_blank" 
                  rel="noreferrer"
                  className="group flex flex-col items-center justify-center p-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all cursor-pointer"
                >
                  <FileText size={48} className="text-[#E1E0CC] mb-4 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                  <span className="font-display font-bold text-lg text-white">Resume.pdf</span>
                  <span className="font-mono text-xs text-white/50 mt-2">1.2 MB</span>
                </a>

                <a 
                  href="#" 
                  className="group flex flex-col items-center justify-center p-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all cursor-pointer"
                >
                  <Award size={48} className="text-[#E1E0CC] mb-4 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                  <span className="font-display font-bold text-lg text-white">Certificates</span>
                  <span className="font-mono text-xs text-white/50 mt-2">4 Items</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
