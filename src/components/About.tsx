import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface AnimatedCharProps {
  char: string;
  progress: MotionValue<number>;
  charProgress: number;
}

const AnimatedChar = ({ char, progress, charProgress }: AnimatedCharProps) => {
  const opacity = useTransform(
    progress,
    [Math.max(0, charProgress * 0.3 - 0.05), Math.min(0.3, charProgress * 0.3 + 0.05)],
    [0.2, 1]
  );
  return <motion.span style={{ opacity, willChange: "opacity" }}>{char}</motion.span>;
};

interface AnimatedTextRevealProps {
  text: string;
  progress: MotionValue<number>;
}

const AnimatedTextReveal = ({ text, progress }: AnimatedTextRevealProps) => {
  const words = text.split(' ');
  let charCounter = 0;
  const totalChars = text.length;

  return (
    <p className="font-mono text-[#DEDBC8] text-xl sm:text-2xl md:text-3xl leading-tight flex flex-wrap justify-center text-center">
      {words.map((word, wordIdx) => {
        const characters = word.split('');
        return (
          <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.25em] mb-[0.2em]">
            {characters.map((char, charIdx) => {
              const index = charCounter++;
              const charProgress = index / totalChars;
              return (
                <AnimatedChar 
                  key={charIdx} 
                  char={char} 
                  progress={progress} 
                  charProgress={charProgress} 
                />
              );
            })}
            {(() => { charCounter++; return null; })()}
          </span>
        );
      })}
    </p>
  );
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*?";

interface ScrambleCharProps {
  char: string;
  scrollYProgress: MotionValue<number>;
  charIndex: number;
  totalChars: number;
  className?: string;
}

const ScrambleChar = ({ char, scrollYProgress, charIndex, totalChars, className }: ScrambleCharProps) => {
  const [displayChar, setDisplayChar] = useState(char);
  const [isLocked, setIsLocked] = useState(false);
  
  const startProgress = (charIndex / totalChars) * 0.8; 
  const endProgress = startProgress + 0.2;

  const y = useTransform(scrollYProgress, [startProgress, endProgress], [-150, 0]);
  const opacity = useTransform(scrollYProgress, [startProgress, endProgress], [0, 1]);
  const filter = useTransform(scrollYProgress, [startProgress, endProgress], ["blur(12px)", "blur(0px)"]);
  const rotateX = useTransform(scrollYProgress, [startProgress, endProgress], [90, 0]);

  useEffect(() => {
    if (char === ' ') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayChar(' ');
      setIsLocked(true);
      return;
    }

    const interval = setInterval(() => {
      const current = scrollYProgress.get();
      
      if (current >= endProgress) {
        setDisplayChar(prev => prev !== char ? char : prev);
        setIsLocked(prev => !prev ? true : prev);
      } else if (current > startProgress && current < endProgress) {
        setDisplayChar(ALPHABET[Math.floor(Math.random() * ALPHABET.length)]);
        setIsLocked(prev => prev ? false : prev);
      } else {
        // When completely invisible (progress < startProgress), stop updating random chars to save CPU
        setDisplayChar(prev => prev === char ? ALPHABET[Math.floor(Math.random() * ALPHABET.length)] : prev);
        setIsLocked(prev => prev ? false : prev);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [char, startProgress, endProgress, scrollYProgress]);

  return (
    <motion.span 
      style={{ y, opacity, filter, rotateX, display: 'inline-block', whiteSpace: 'pre', transformOrigin: 'top', willChange: "transform, opacity, filter" }}
      className={isLocked ? className : `font-mono text-[#E1E0CC]/40 ${className}`}
    >
      {displayChar}
    </motion.span>
  );
};

export interface TextSegment {
  text: string;
  className?: string;
  newLine?: boolean;
  hasLasso?: boolean;
  hasUnderline?: number;
}

interface CreativeScrambleTextProps {
  segments: TextSegment[];
  className?: string;
  style?: React.CSSProperties;
  sectionScrollYProgress: MotionValue<number>;
}

export const CreativeScrambleText = ({ segments, className, style, sectionScrollYProgress }: CreativeScrambleTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.9', 'center 0.55'], 
  });

  // Choreographed animations based on the sticky section's scroll progress
  // 0.0 to 0.3: Lasso draws
  const lassoPathLength = useTransform(sectionScrollYProgress, [0.0, 0.3], [0, 1]);
  const lassoOpacity = useTransform(sectionScrollYProgress, [0.0, 0.1], [0, 0.8]);

  // 0.3 to 0.6: First underline draws
  const underline1Length = useTransform(sectionScrollYProgress, [0.3, 0.6], [0, 1]);
  const underline1Opacity = useTransform(sectionScrollYProgress, [0.3, 0.4], [0, 0.8]);

  // 0.6 to 0.9: Second underline draws
  const underline2Length = useTransform(sectionScrollYProgress, [0.6, 0.9], [0, 1]);
  const underline2Opacity = useTransform(sectionScrollYProgress, [0.6, 0.7], [0, 0.8]);

  let totalChars = 0;
  segments.forEach((seg) => {
    seg.text.split(' ').forEach((word: string) => {
      totalChars += word.length + 1;
    });
  });
  
  let globalCharIndex = 0;

  return (
    <div ref={containerRef} className={`${className} flex flex-wrap justify-center`} style={style}>
      {segments.map((seg, segIndex: number) => {
        // We split by space but keep the spaces so they render properly when segments are inline
        // Wait, ScrambleChar handles spaces internally.
        const words = seg.text.split(' ');
        return (
          <span key={segIndex} className={`inline-flex flex-wrap justify-center relative ${seg.newLine ? 'w-full my-2' : 'mx-1'}`}>
            {seg.hasLasso && (
              <motion.svg
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[105%] h-[160%] pointer-events-none z-0 text-primary opacity-80"
                viewBox="0 0 200 60"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M25,45 C15,35 15,15 40,10 C90,0 170,0 190,15 C200,25 190,45 160,50 C110,60 30,55 20,40 C15,30 25,20 45,15 C60,10 160,5 180,20 C195,30 185,55 140,55 C90,60 25,50 20,35"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#pencil-texture)"
                  style={{ vectorEffect: 'non-scaling-stroke', pathLength: lassoPathLength, opacity: lassoOpacity }}
                />
              </motion.svg>
            )}
            
            {seg.hasUnderline === 1 && (
              <motion.svg
                className="absolute -bottom-3 left-0 w-full h-[25px] pointer-events-none z-0 text-primary opacity-80"
                viewBox="0 0 100 25"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M2,10 Q50,15 98,8 Q50,18 5,12 Q50,22 95,14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#pencil-texture)"
                  style={{ vectorEffect: 'non-scaling-stroke', pathLength: underline1Length, opacity: underline1Opacity }}
                />
              </motion.svg>
            )}

            {seg.hasUnderline === 2 && (
              <motion.svg
                className="absolute -bottom-3 left-0 w-full h-[25px] pointer-events-none z-0 text-[#E1E0CC] opacity-80"
                viewBox="0 0 100 25"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M2,12 Q50,17 98,10 Q50,20 5,14 Q50,24 95,16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#pencil-texture)"
                  style={{ vectorEffect: 'non-scaling-stroke', pathLength: underline2Length, opacity: underline2Opacity }}
                />
              </motion.svg>
            )}

            {words.map((word: string, wordIndex: number) => {
              const chars = word.split('');
              return (
                <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.3em] relative z-10">
                  {chars.map((char: string, i: number) => {
                    const idx = globalCharIndex++;
                    return (
                      <ScrambleChar 
                        key={i} 
                        char={char} 
                        scrollYProgress={scrollYProgress} 
                        charIndex={idx} 
                        totalChars={totalChars} 
                        className={seg.className} 
                      />
                    );
                  })}
                  {(() => { globalCharIndex++; return null; })()}
                </span>
              );
            })}
          </span>
        );
      })}
    </div>
  );
};

export const About = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const segments = [
    { text: "I am Mainak Biswas,", className: "font-display font-bold tracking-tight", newLine: true },
    { text: "a Creative Technologist.", className: "font-serif italic text-primary", hasLasso: true, newLine: true },
    { text: "Less", className: "font-display font-bold tracking-tight" },
    { text: "\"beep boop,\"", className: "font-display font-bold tracking-tight", hasUnderline: 1 },
    { text: "way more", className: "font-display font-bold tracking-tight" },
    { text: "\"oh la la\".", className: "font-display font-bold tracking-tight", hasUnderline: 2 },
  ];

  return (
    <section ref={containerRef} className="bg-black h-[250vh] relative">
      <div className="sticky top-0 h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* SVG Filter for Pencil Effect */}
        <svg className="w-0 h-0 absolute pointer-events-none">
          <defs>
            <filter id="pencil-texture" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>

        <div className="bg-black p-12 md:p-24 rounded-[2rem] max-w-6xl w-full text-center flex flex-col items-center gap-20 shadow-2xl relative z-10">
          <div className="flex flex-col items-center gap-4 w-full">
            <span className="text-primary text-[10px] sm:text-xs uppercase tracking-widest mb-4">About me</span>
            <CreativeScrambleText
              segments={segments}
              sectionScrollYProgress={scrollYProgress}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl max-w-5xl mx-auto leading-[1.1] w-full"
              style={{ color: '#E1E0CC' }}
            />
          </div>

          <div className="max-w-4xl mx-auto">
            <AnimatedTextReveal 
              text="Building intelligent software so beautiful, if they ever do take over, at least they'll do it with impeccable style." 
              progress={scrollYProgress}
            />
          </div>
        </div>
        
        {/* Subtle background element to emphasize the sticky section */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-primary/5 to-black/0 pointer-events-none" />
      </div>
    </section>
  );
};
