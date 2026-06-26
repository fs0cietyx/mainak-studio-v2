import React, { useEffect, Suspense } from 'react';
import Lenis from 'lenis';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Footer } from './components/Footer';
import { Terminal } from './components/Terminal';
import { Certificates } from './components/Certificates';

// Lazy load heavy components (Three.js, Video, and ML Weights) to make initial load lightning fast
const InteractiveSculpture = React.lazy(() => import('./components/InteractiveSculpture').then(module => ({ default: module.InteractiveSculpture })));
const ScrollVideoTransition = React.lazy(() => import('./components/ScrollVideoTransition').then(module => ({ default: module.ScrollVideoTransition })));
const MLLab = React.lazy(() => import('./components/MLLab').then(module => ({ default: module.MLLab })));

function App() {
  useEffect(() => {
    // Initialize Lenis for lightning-fast, buttery smooth scrolling
    const lenis = new Lenis({
      autoRaf: true, 
      lerp: 0.05, // Optimal balance of buttery smoothness and instant response
      wheelMultiplier: 1, // Standardized wheel tracking for precision
      syncTouch: true, // Forces native-like smooth scrolling on mobile devices
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-black min-h-screen text-white selection:bg-white selection:text-black">
      <main className="relative">
        <div id="hero">
          <Hero />
        </div>
        <div id="about">
          <About />
        </div>
        <div id="certificates">
          <Certificates />
        </div>
        
        {/* Suspense boundaries prevent these heavy components from blocking the main thread */}
        <Suspense fallback={<div className="h-screen w-full bg-black" />}>
          <ScrollVideoTransition />
        </Suspense>
        
        <Suspense fallback={<div className="h-screen w-full bg-black flex items-center justify-center"><span className="text-white/20 font-mono text-sm tracking-widest">LOADING ARTIFACTS...</span></div>}>
          <div id="artifacts">
            <InteractiveSculpture />
          </div>
        </Suspense>

        <div id="mllab" className="relative z-20 bg-black">
          <Suspense fallback={<div className="h-[300vh] w-full bg-black flex items-center justify-center"><span className="text-white/20 font-mono text-sm tracking-widest">INITIALIZING_NEURAL_ENGINE...</span></div>}>
            <MLLab />
          </Suspense>
        </div>

        <div id="contact">
          <Footer />
        </div>
        <Terminal />
      </main>
    </div>
  );
}

export default App;
