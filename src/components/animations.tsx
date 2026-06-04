import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface WordsPullUpProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  showAsterisk?: boolean;
}

export const WordsPullUp: React.FC<WordsPullUpProps> = ({ text, className, style, showAsterisk }) => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const words = text.split(' ');

  return (
    <div ref={containerRef} className={`flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden relative mr-[0.2em] last:mr-0 pr-[0.35em] py-2 -my-2">
          <motion.span
            initial={{ y: "100%" }}
            animate={isInView ? { y: 0 } : { y: "100%" }}
            transition={{
              duration: 0.8,
              delay: i * 0.08,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="inline-block relative"
          >
            {word}
            {showAsterisk && i === words.length - 1 && (
              <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</span>
            )}
          </motion.span>
        </span>
      ))}
    </div>
  );
};

interface Segment {
  text: string;
  className?: string;
}

interface WordsPullUpMultiStyleProps {
  segments: Segment[];
  className?: string;
  style?: React.CSSProperties;
}

export const WordsPullUpMultiStyle: React.FC<WordsPullUpMultiStyleProps> = ({ segments, className, style }) => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  let globalWordIndex = 0;

  return (
    <div ref={containerRef} className={`flex flex-wrap justify-center ${className}`} style={style}>
      {segments.map((segment, sIdx) => {
        const words = segment.text.split(' ');
        return (
          <React.Fragment key={sIdx}>
            {words.map((word, wIdx) => {
              const currentIdx = globalWordIndex++;
              return (
                <span key={`${sIdx}-${wIdx}`} className="inline-block overflow-hidden mr-[0.25em] last:mr-0 py-2 -my-2">
                  <motion.span
                    initial={{ y: "100%" }}
                    animate={isInView ? { y: 0 } : { y: "100%" }}
                    transition={{
                      duration: 0.8,
                      delay: currentIdx * 0.08,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className={`inline-block ${segment.className || ''}`}
                  >
                    {word}
                  </motion.span>
                </span>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};
