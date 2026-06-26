import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const ScrollVideoTransition: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    let isSeeking = false;
    let queuedTime: number | null = null;
    const video = videoRef.current;

    const onSeeked = () => {
      isSeeking = false;
      // If we have a backlog of scroll updates, apply the most recent one
      if (queuedTime !== null && video) {
        const time = queuedTime;
        queuedTime = null;
        isSeeking = true;
        video.currentTime = time;
      }
    };

    if (video) {
      video.addEventListener('seeked', onSeeked);
    }

    let rafId: number;

    const unsubscribe = scrollYProgress.onChange((latest) => {
      if (video && !isNaN(video.duration)) {
        const targetTime = latest * video.duration;
        
        // Only set currentTime if the browser has finished processing the last frame request
        if (!isSeeking) {
          isSeeking = true;
          rafId = requestAnimationFrame(() => {
            if (video) video.currentTime = targetTime;
          });
        } else {
          // If browser is busy, queue the frame so we jump to it once ready
          queuedTime = targetTime;
        }
      }
    });

    return () => {
      unsubscribe();
      cancelAnimationFrame(rafId);
      if (video) {
        video.removeEventListener('seeked', onSeeked);
      }
    };
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} className="relative w-full h-[400vh] bg-black">
      <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden">
        
        <video 
          ref={videoRef}
          src="/scroll_ref.mp4"
          className="w-full h-full object-cover opacity-80"
          muted
          playsInline
          preload="auto"
          // We pause it to ensure it only moves when scrubbed
          onLoadedMetadata={(e) => {
            e.currentTarget.pause();
          }}
        />
        
        {/* Overlay Text that appears during the middle of the scroll */}
        <motion.div 
          className="absolute z-30 flex flex-col items-center justify-center pointer-events-none text-center px-4"
          style={{
            opacity: useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 1, 0]),
            scale: useTransform(scrollYProgress, [0.3, 0.7], [0.95, 1.05]),
            willChange: "transform, opacity"
          }}
        >
          <div className="w-16 h-1 bg-white/20 mb-8 mx-auto rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white"
              style={{
                width: useTransform(scrollYProgress, [0.3, 0.7], ["0%", "100%"])
              }}
            />
          </div>
          <h2 className="font-serif italic text-4xl md:text-6xl text-white tracking-tight drop-shadow-2xl uppercase max-w-3xl leading-tight">
            Translating <br className="md:hidden" /> Beep-Boop
            <span className="block font-sans font-black not-italic text-white/40 text-2xl md:text-4xl tracking-[0.3em] mt-4">
              Into Ooh-La-La
            </span>
          </h2>
        </motion.div>
        
        {/* Vignette effect */}
        <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
      </div>
    </div>
  );
};
