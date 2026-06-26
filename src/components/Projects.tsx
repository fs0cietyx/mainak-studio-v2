import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  asset: string;
  type: 'video' | 'image';
  link: string;
}

const projects: Project[] = [
  {
    id: "01",
    title: "Neural Cine-Synthesizer",
    category: "AI / Visual Storytelling",
    asset: "/neural-cine.gif",
    type: 'image',
    link: "#"
  },
  {
    id: "02",
    title: "Ambassador Hub",
    category: "Leadership / Community",
    asset: "/ambassador-hub.mp4",
    type: 'video',
    link: "#"
  },
  {
    id: "03",
    title: "AI Slop Detector",
    category: "AI Governance / NLP",
    asset: "/autonomous-frame.mp4",
    type: 'video',
    link: "https://github.com/fs0cietyx/ai-slop-detector"
  },
  {
    id: "04",
    title: "The Imagination Engine",
    category: "LLM / Generative Art",
    asset: "/imagination-engine.mp4",
    type: 'video',
    link: "#"
  }
];

export const Projects: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <section ref={containerRef} className="bg-black relative w-full pt-32 pb-40">
      
      {/* Intro Header */}
      <div className="flex flex-col items-center justify-center px-6 text-center mb-32">
        <span className="text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-8 block drop-shadow-lg">
          Portfolio_v2.0
        </span>
        <h2 className="text-[#E1E0CC] text-5xl md:text-8xl font-serif italic tracking-tight drop-shadow-2xl">
          Selected Works.
        </h2>
        <p className="text-[#E1E0CC]/50 mt-6 font-sans tracking-widest uppercase text-xs max-w-sm mx-auto leading-relaxed">
          A collection of recent artifacts and experiments.
        </p>
      </div>

      {/* Project Showcases */}
      <div className="relative z-10 w-full">
        {projects.map((project, index) => {
          return (
            <div key={project.id} className="min-h-[80vh] flex items-center justify-center px-4 sm:px-10 py-10">
              <motion.div 
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-20% 0px -20% 0px", once: false }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center"
              >
                {/* Project Details */}
                <div className={`space-y-8 ${index % 2 !== 0 ? 'lg:order-2' : ''} bg-[#111] p-8 md:p-12 rounded-[2rem] border border-white/5 shadow-2xl`}>
                  <p className="text-primary text-[10px] sm:text-xs font-black uppercase tracking-[0.4em]">
                    {project.id} // {project.category}
                  </p>
                  <h2 className="text-[#E1E0CC] text-4xl md:text-6xl font-medium leading-[1.1] tracking-tight">
                    {project.title}
                  </h2>
                  <p className="text-gray-400 text-base sm:text-lg leading-relaxed font-medium">
                    An interactive exploration of {project.title.toLowerCase()}. 
                    Designed to push the boundaries of {project.category.toLowerCase()} through 
                    cinematic engineering and neural optimization.
                  </p>

                  <a 
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-4 bg-[#E1E0CC] text-black px-8 py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-white active:scale-95 transition-all group no-underline shadow-xl mt-4"
                  >
                    Examine Artifact
                    <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </a>
                </div>

                {/* Media Presentation */}
                <div className={`relative aspect-video sm:aspect-square lg:aspect-[4/3] rounded-[2rem] overflow-hidden bg-black border border-white/10 shadow-2xl ${index % 2 !== 0 ? 'lg:order-1' : ''}`}>
                  {project.type === 'video' ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
                    >
                      <source src={project.asset} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={project.asset}
                      alt={project.title}
                      className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
                    />
                  )}
                  {/* Grain Overlay */}
                  <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none" />
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
