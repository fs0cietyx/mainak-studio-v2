import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { WordsPullUpMultiStyle } from './animations';

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
    <p ref={containerRef} className="text-[#DEDBC8] text-xs sm:text-sm md:text-base leading-relaxed flex flex-wrap justify-center">
      {words.map((word, wordIdx) => {
        const characters = word.split('');
        return (
          <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.25em]">
            {characters.map((char, charIdx) => {
              const index = charCounter++;
              const charProgress = index / totalChars;
              const opacity = useTransform(
                scrollYProgress,
                [Math.max(0, charProgress - 0.1), Math.min(1, charProgress + 0.05)],
                [0.2, 1]
              );

              return (
                <motion.span key={charIdx} style={{ opacity }}>
                  {char}
                </motion.span>
              );
            })}
            {/* Increment for the space after the word */}
            {(() => { charCounter++; return null; })()}
          </span>
        );
      })}
    </p>
  );
};

export const About = () => {
  const segments = [
    { text: "I am Mainak Biswas,", className: "font-normal" },
    { text: "a Creative Technologist.", className: "font-serif italic" },
    { text: "I have skills in AI/ML engineering, software architecture, and cinematic storytelling.", className: "font-normal" },
  ];

  return (
    <section className="bg-black py-32 px-6 flex items-center justify-center">
      <div className="bg-[#101010] p-12 md:p-24 rounded-[2rem] max-w-6xl w-full text-center flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-4">
          <span className="text-primary text-[10px] sm:text-xs uppercase tracking-widest">About me</span>
          <WordsPullUpMultiStyle
            segments={segments}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-4xl mx-auto leading-[1.3] sm:leading-[1.2] w-full"
            style={{ color: '#E1E0CC' }}
          />
        </div>

        <div className="max-w-2xl mx-auto">
          <AnimatedTextReveal text="I am a Creative Technologist bridging AI/ML engineering with the power of visual storytelling. By leveraging my technical foundation at KIIT and my leadership as a Google Student Ambassador, I build intelligent software solutions while crafting cinematic narratives. My goal is to shape the intersection of intelligence and imagination, creating digital experiences that resonate on a deeply human level." />
        </div>
      </div>
    </section>
  );
};
