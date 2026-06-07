import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Plus, Minus } from 'lucide-react';
import { WordsPullUpMultiStyle } from './animations';

/**
 * Interface for project artifacts.
 */
interface Project {
  id: string;
  title: string;
  category: string;
  asset: string;
  type: 'video' | 'image';
  link: string;
}

/**
 * Registry of selected artifacts.
 */
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

/**
 * Specialized Folder Artifact Component.
 * 
 * Implements GPU-accelerated layout transitions and high-fidelity 
 * media rendering.
 */
const FolderItem: React.FC<{ 
  project: Project; 
  isOpen: boolean; 
  onClick: () => void;
  index: number;
}> = ({ 
  project, 
  isOpen, 
  onClick, 
  index 
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1,
        layout: { type: "spring", stiffness: 350, damping: 35 }
      }}
      className="relative w-full mb-[-15px] last:mb-0"
    >
      {/* Folder Tab Portal */}
      <div 
        onClick={onClick}
        className={`
          relative z-10 w-fit px-8 py-4 cursor-pointer
          bg-[#151515] border-t border-x border-[#E1E0CC]/10
          rounded-t-3xl transition-all duration-500
          flex items-center gap-6 select-none
          ${isOpen ? 'bg-[#1A1A1A] border-[#E1E0CC]/25 px-10' : 'hover:bg-[#1A1A1A]'}
        `}
      >
        <span className="text-primary text-[11px] font-black font-mono opacity-40 tracking-tighter">
          {project.id}
        </span>
        <h3 className="text-[#E1E0CC] text-xs sm:text-sm font-black tracking-[0.2em] uppercase">
          {project.title}
        </h3>
        {isOpen ? (
          <Minus className="w-4 h-4 text-primary" />
        ) : (
          <Plus className="w-4 h-4 text-primary opacity-30" />
        )}
      </div>

      {/* Artifact Vault Body */}
      <motion.div
        layout
        className={`
          relative overflow-hidden bg-[#151515] border border-[#E1E0CC]/10
          rounded-tr-[3rem] rounded-b-[3rem] -mt-[1px]
          ${isOpen ? 'z-20 shadow-[0_50px_150px_rgba(0,0,0,0.9)]' : 'z-0'}
        `}
        animate={{
          height: isOpen ? 'auto' : '0px',
          opacity: isOpen ? 1 : 0.95,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 40
        }}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="p-10 md:p-16"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-10">
                  <div className="space-y-4">
                    <p className="text-primary text-[10px] sm:text-xs font-black uppercase tracking-[0.4em]">
                      {project.category}
                    </p>
                    <h2 className="text-[#E1E0CC] text-4xl md:text-6xl font-medium leading-[1.1] tracking-tight">
                      {project.title}
                    </h2>
                    <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-lg font-medium">
                      An interactive exploration of {project.title.toLowerCase()}. 
                      Designed to push the boundaries of {project.category.toLowerCase()} through 
                      cinematic engineering and neural optimization.
                    </p>
                  </div>

                  <a 
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-4 bg-primary text-black px-10 py-5 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-white active:scale-95 transition-all group no-underline shadow-xl"
                  >
                    Examine Artifact
                    <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </a>
                </div>

                {/* Media Engine */}
                <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-black/60 border border-[#E1E0CC]/5 shadow-2xl group">
                  {project.type === 'video' ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                    >
                      <source src={project.asset} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={project.asset}
                      alt={`Visualization for ${project.title}`}
                      className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                    />
                  )}
                  {/* Fine-grain Overlay */}
                  <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

/**
 * Enterprise Portfolio Section.
 * 
 * Adheres to Pillar I (Architectural Perfection) and Pillar III (GPU Motion).
 */
export const Projects: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>("01");

  const headerSegments = [
    { text: "Selected Artifacts.", className: "text-[#E1E0CC] font-medium" },
    { text: "Where code meets canvas.", className: "text-[#E1E0CC]/30 font-normal" },
  ];

  return (
    <section className="bg-black py-40 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Semantic Headers */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10">
          <div className="max-w-2xl">
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-8 block select-none">
              Portfolio_v2.0
            </span>
            <WordsPullUpMultiStyle
              segments={headerSegments}
              className="text-5xl sm:text-6xl md:text-7xl font-medium leading-[0.9] text-left justify-start tracking-tighter"
            />
          </div>
          <div className="pb-3 border-l-2 border-white/5 pl-8 max-w-sm hidden sm:block">
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
              A collection of high-performance systems and cinematic stories 
              engineered to push the boundaries of digital interaction.
            </p>
          </div>
        </div>

        {/* Stacked Interactive Canvas */}
        <div className="flex flex-col gap-0 relative">
          {projects.map((project, index) => (
            <FolderItem 
              key={project.id} 
              project={project} 
              index={index}
              isOpen={activeId === project.id}
              onClick={() => setActiveId(activeId === project.id ? null : project.id)}
            />
          ))}
        </div>

        {/* Archive CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-40 flex justify-center"
        >
          <button className="text-[#E1E0CC]/50 border-b border-[#E1E0CC]/10 pb-2 text-[10px] font-black uppercase tracking-[0.4em] hover:text-primary hover:border-primary transition-all active:scale-95">
            Access Full Archive_
          </button>
        </motion.div>
      </div>
    </section>
  );
};
