import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const AnimatedTextReveal = ({ text }: { text: string }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const words = text.split(' ');
  let charCounter = 0;
  const totalChars = text.length;

  return (
    <p ref={containerRef} className="text-[#DEDBC8] text-xl sm:text-2xl md:text-3xl leading-tight flex flex-wrap justify-center text-center">
      {words.map((word, wordIdx) => {
        const characters = word.split('');
        return (
          <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.25em] mb-[0.2em]">
            {characters.map((char, charIdx) => {
              const index = charCounter++;
              const charProgress = index / totalChars;
              const opacity = useTransform(
                scrollYProgress,
                [Math.max(0, charProgress - 0.1), Math.min(1, charProgress + 0.05)],
                [0.2, 1]
              );

              return (
                <motion.span key={charIdx} style={{ opacity, willChange: "opacity" }}>
                  {char}
                </motion.span>
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

const ScrambleChar = ({ char, scrollYProgress, charIndex, totalChars, className }: any) => {
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
      setDisplayChar(' ');
      setIsLocked(true);
      return;
    }

    const interval = setInterval(() => {
      const current = scrollYProgress.get();
      
      if (current >= endProgress) {
        setDisplayChar(char);
        setIsLocked(true);
      } else if (current > startProgress && current < endProgress) {
        setDisplayChar(ALPHABET[Math.floor(Math.random() * ALPHABET.length)]);
        setIsLocked(false);
      } else {
        setDisplayChar(ALPHABET[Math.floor(Math.random() * ALPHABET.length)]);
        setIsLocked(false);
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

export const CreativeScrambleText = ({ segments, className, style }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.9', 'center 0.4'], 
  });

  const totalChars = segments.reduce((acc: number, seg: any) => acc + seg.text.length, 0);
  let globalCharIndex = 0;

  return (
    <div ref={containerRef} className={`${className} flex flex-wrap justify-center`} style={style}>
      {segments.map((seg: any, segIndex: number) => {
        const words = seg.text.split(' ');
        return (
          <span key={segIndex} className="inline-flex flex-wrap justify-center w-full my-2">
            {words.map((word: string, wordIndex: number) => {
              const chars = word.split('');
              return (
                <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.3em]">
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
  const segments = [
    { text: "I am Mainak Biswas,", className: "font-display font-bold tracking-tight" },
    { text: "a Creative Technologist.", className: "font-serif italic text-primary" },
    { text: "Less \"beep boop,\" way more \"oh la la.\"", className: "font-display font-bold tracking-tight" },
  ];

  return (
    <section className="bg-black py-32 px-6 flex items-center justify-center">
      <div className="bg-[#101010] p-12 md:p-24 rounded-[2rem] max-w-6xl w-full text-center flex flex-col items-center gap-20">
        <div className="flex flex-col items-center gap-4 w-full">
          <span className="text-primary text-[10px] sm:text-xs uppercase tracking-widest mb-4">About me</span>
          <CreativeScrambleText
            segments={segments}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl max-w-5xl mx-auto leading-[1.1] w-full"
            style={{ color: '#E1E0CC' }}
          />
        </div>

        <div className="max-w-4xl mx-auto">
          <AnimatedTextReveal text="I engineer intelligent software solutions by combining the heavy lifting of AI/ML with the art of cinematic visual storytelling. Based out of KIIT University, I build digital experiences where complex back-end architecture meets jaw-dropping design, proving that smart code doesn't have to look boring." />
        </div>
      </div>
    </section>
  );
};
