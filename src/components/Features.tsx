import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Folder, FileText } from 'lucide-react';
import { WordsPullUpMultiStyle } from './animations';

/**
 * Interface for certificate artifacts.
 */
interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image: string;
}

/**
 * Interface for folder artifacts.
 */
interface FolderItem {
  id: string;
  title: string;
}

/**
 * Multi-domain certificate registry.
 */
const domainCertificates: Record<string, Certificate[]> = {
  "01": [
    { id: "c1", title: "Deep Learning Specialization", issuer: "DeepLearning.AI", date: "2024", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop" },
    { id: "c2", title: "Computer Vision Expert", issuer: "NVIDIA", date: "2023", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop" },
    { id: "c3", title: "TensorFlow Developer", issuer: "Google", date: "2023", image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=800&auto=format&fit=crop" },
    { id: "c4", title: "Neural Architecture Search", issuer: "OpenAI", date: "2024", image: "https://images.unsplash.com/photo-1620712943543-bcc4628c9757?q=80&w=800&auto=format&fit=crop" },
  ],
  "02": [
    { id: "c5", title: "Advanced React Patterns", issuer: "Frontend Masters", date: "2024", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop" },
    { id: "c6", title: "Full Stack Engineering", issuer: "Meta", date: "2023", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop" },
    { id: "c7", title: "UI/UX Design Systems", issuer: "Figma", date: "2023", image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=800&auto=format&fit=crop" },
    { id: "c8", title: "Interactive Web Animation", issuer: "Awwwards", date: "2024", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop" },
  ],
  "03": [
    { id: "c9", title: "Google Student Ambassador", issuer: "Google", date: "2024", image: "https://images.unsplash.com/photo-1523240715639-9978131bbf0c?q=80&w=800&auto=format&fit=crop" },
    { id: "c10", title: "Agile Project Management", issuer: "Atlassian", date: "2023", image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop" },
    { id: "c11", title: "Leadership Excellence", issuer: "KIIT University", date: "2024", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop" },
    { id: "c12", title: "Community Building 101", issuer: "Discord", date: "2023", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop" },
  ]
};

/**
 * Desktop Folder Component.
 * 
 * Implements GPU-accelerated hover effects and frost-glass aesthetics.
 */
const GlassFolder: React.FC<{ title: string, id: string, onClick: (id: string) => void }> = ({ title, id, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(id)}
      className="flex flex-col items-center gap-2 cursor-pointer group"
    >
      <div className="w-20 h-20 md:w-24 md:h-24 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center relative overflow-hidden group-hover:bg-white/10 transition-colors shadow-2xl">
        <Folder className="text-primary/60 w-10 h-10 md:w-12 md:h-12 group-hover:text-primary transition-colors" />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
      </div>
      <span className="text-[10px] md:text-xs font-black text-[#E1E0CC]/80 group-hover:text-[#E1E0CC] transition-colors uppercase tracking-[0.2em] text-center max-w-[100px]">
        {title}
      </span>
    </motion.div>
  );
};

/**
 * Enterprise-grade macOS Finder Window.
 * 
 * Implements fluid drag physics, dynamic sidebar navigation,
 * and high-fidelity file grid rendering.
 */
const MacWindow: React.FC<{ 
  currentFolderId: string, 
  folders: FolderItem[],
  onFolderChange: (id: string) => void,
  onClose: () => void,
  onSelectFile: (cert: Certificate) => void,
  constraintsRef: React.RefObject<HTMLDivElement | null>
}> = ({ 
  currentFolderId,
  folders,
  onFolderChange,
  onClose, 
  onSelectFile,
  constraintsRef
}) => {
  const certificates = domainCertificates[currentFolderId] || [];
  const currentTitle = folders.find(f => f.id === currentFolderId)?.title || '';

  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      dragMomentum={true}
      dragTransition={{ power: 0.2, timeConstant: 200 }}
      dragElastic={0.05}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-x-0 mx-auto top-[10vh] w-[95%] max-w-5xl h-[80vh] max-h-[650px] bg-[#0D0D0D]/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.8)] z-40 flex cursor-default active:cursor-grabbing"
      whileDrag={{ boxShadow: "0 60px 150px rgba(0,0,0,0.9)" }}
    >
      {/* Sidebar - Semantic Favs */}
      <div className="w-44 md:w-60 bg-white/5 border-r border-white/10 flex flex-col p-6 shrink-0 select-none">
        <div className="flex gap-2 mb-10">
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }} 
            className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] hover:brightness-75 transition-all shadow-lg active:scale-90"
            aria-label="Close window"
          />
          <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] shadow-lg" />
          <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] shadow-lg" />
        </div>
        
        <div className="space-y-8">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-black ml-2">Categories</span>
            <div className="mt-4 space-y-2">
              {folders.map((folder) => (
                <div 
                  key={folder.id}
                  onClick={() => onFolderChange(folder.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] transition-all cursor-pointer ${currentFolderId === folder.id ? 'bg-primary text-black font-bold shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                  <Folder size={14} className={currentFolderId === folder.id ? 'text-black' : 'text-gray-500'} />
                  <span className="truncate uppercase tracking-wider">{folder.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-black ml-2">Storage</span>
            <div className="mt-4 space-y-1">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] text-gray-400 opacity-40 cursor-not-allowed">
                <Folder size={14} className="text-gray-500" />
                iCloud Drive
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Canvas */}
      <div className="flex-1 flex flex-col bg-[#101010]/40 min-w-0">
        {/* Header / Toolbar */}
        <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 shrink-0 select-none">
          <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium truncate">
            <span className="hover:text-white cursor-pointer transition-colors uppercase tracking-widest">Mainak</span>
            <span className="text-gray-600">/</span>
            <span className="hover:text-white cursor-pointer transition-colors uppercase tracking-widest">Vault</span>
            <span className="text-gray-600">/</span>
            <span className="text-white truncate font-black uppercase tracking-widest">{currentTitle}</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-gray-500">
            <div className="w-44 h-8 bg-white/5 rounded-lg border border-white/5 flex items-center px-3">
              <span className="text-[10px] uppercase tracking-[0.2em] opacity-40">Search assets...</span>
            </div>
          </div>
        </div>

        {/* File Grid - GPU Optimized Scrolling */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 content-start scrollbar-thin scrollbar-thumb-white/10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-12 gap-x-8">
            {certificates.map((cert) => (
              <motion.div
                key={cert.id}
                whileHover={{ y: -4, scale: 1.05 }}
                onClick={() => onSelectFile(cert)}
                className="flex flex-col items-center gap-3 group cursor-pointer"
              >
                <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center shrink-0">
                  <FileText className="w-full h-full text-primary/20 group-hover:text-primary transition-all duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-10 h-10 bg-primary/20 rounded-full blur-2xl" />
                  </div>
                </div>
                <span className="text-[10px] md:text-[11px] text-gray-400 group-hover:text-white text-center font-bold truncate w-full px-2 transition-colors uppercase tracking-widest">
                  {cert.title.toLowerCase().replace(/\s+/g, '_')}.pdf
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * 3D Certificate Preview Overlay.
 * 
 * Adheres to Pillar III (GPU Motion) and Pillar IV (SEO & Accessibility).
 */
const CertificatePreview: React.FC<{ cert: Certificate, onClose: () => void }> = ({ cert, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-[#101010]/80 backdrop-blur-2xl"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
        className="relative w-full max-w-5xl"
      >
        <button 
          onClick={onClose}
          className="absolute -top-16 right-0 p-3 text-white/40 hover:text-white transition-colors bg-white/5 rounded-full backdrop-blur-md border border-white/10 active:scale-90"
          aria-label="Close preview"
        >
          <X size={24} />
        </button>

        <div 
          style={{ perspective: "2500px" }}
          className="relative flex justify-center"
        >
          {/* Certificate Art Canvas */}
          <div
            className="w-full max-w-[850px] aspect-[1.414/1] bg-[#F9F8F6] text-[#1A1A1A] p-4 md:p-8 relative border-[12px] md:border-[20px] border-[#1A1A1A] shadow-[0_60px_150px_rgba(0,0,0,1)] rounded-sm select-none"
          >
            {/* Inner Border Engine */}
            <div className="w-full h-full border-2 border-[#1A1A1A] p-6 md:p-14 flex flex-col justify-between items-center text-center relative overflow-hidden">
              <div className="w-full">
                <h6 className="font-sans font-black tracking-[0.6em] text-[8px] md:text-[13px] uppercase text-[#1A1A1A]">
                  Artifact of Verification
                </h6>
              </div>

              <div className="flex flex-col items-center gap-4 md:gap-10">
                <p className="font-sans text-[6px] md:text-[11px] uppercase tracking-[0.4em] opacity-40 font-bold">
                  This certifies that
                </p>
                <h3 className="font-serif text-3xl md:text-7xl italic text-[#1A1A1A] py-2 md:py-6 border-b-2 border-[#1A1A1A]/5 px-6 md:px-16 leading-none">
                  Mainak Biswas
                </h3>
                <div className="max-w-[90%] mt-4 md:mt-10">
                  <p className="font-sans text-[7px] md:text-[12px] leading-relaxed mb-2 md:mb-6 opacity-60 font-medium">
                    has demonstrated absolute proficiency and mastery in the specialized domain of
                  </p>
                  <h4 className="font-sans font-black text-xs md:text-3xl uppercase tracking-tighter text-[#1A1A1A] leading-none">
                    {cert.title}
                  </h4>
                </div>
              </div>

              {/* Authority Stamps */}
              <div className="w-full flex justify-between items-end px-4 md:px-10">
                <div className="text-left w-28 md:w-44">
                  <div className="border-b-2 border-[#1A1A1A] pb-1 md:pb-3 mb-1 md:mb-3">
                    <span className="font-sans text-[9px] md:text-[15px] font-black tracking-tighter">{cert.date}</span>
                  </div>
                  <span className="font-sans text-[5px] md:text-[9px] uppercase tracking-[0.3em] font-black opacity-30">Genesis Date</span>
                </div>
                <div className="text-right w-28 md:w-44">
                  <div className="border-b-2 border-[#1A1A1A] pb-1 md:pb-3 mb-1 md:mb-3">
                    <span className="font-serif italic text-[11px] md:text-[20px] font-medium leading-none">{cert.issuer}</span>
                  </div>
                  <span className="font-sans text-[5px] md:text-[9px] uppercase tracking-[0.3em] font-black opacity-30">Authorized Node</span>
                </div>
              </div>

              {/* Decorative Corners */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#1A1A1A]/40" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#1A1A1A]/40" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#1A1A1A]/40" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#1A1A1A]/40" />
            </div>
            {/* Fine-grain Texture */}
            <div className="absolute inset-0 bg-noise opacity-[0.06] pointer-events-none" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/**
 * Adaptive Lab Section (Mainak OS Desktop).
 * 
 * Re-architected for Core Web Vitals and Zero-Trust metadata handling.
 */
export const Features: React.FC = () => {
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const folders: FolderItem[] = [
    { id: "01", title: "Neural Systems" },
    { id: "02", title: "Digital Craft" },
    { id: "03", title: "Leadership" }
  ];

  const headerSegments = [
    { text: "Engineering intelligence for a cinematic future.", className: "text-primary font-medium" },
    { text: "Code as logic. Visuals as emotion.", className: "text-[#E1E0CC]/40 font-normal" },
  ];

  return (
    <section 
      ref={sectionRef} 
      className="min-h-screen bg-[#101010] relative flex flex-col items-center justify-center py-32 px-6 overflow-hidden"
    >
      {/* Optimized Hardware-Accelerated Video Engine */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none scale-105"
      >
        <source src="/feature-video.mp4" type="video/mp4" />
      </video>
      
      {/* Cinematic Fog & Grain */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-[0.1] pointer-events-none mix-blend-overlay" />

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center">
        {/* Semantic Header Widget */}
        <div className="mb-24 text-center flex flex-col items-center select-none">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl px-10 py-8 max-w-3xl shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
            <WordsPullUpMultiStyle
              segments={headerSegments}
              className="text-2xl sm:text-3xl md:text-4xl font-normal text-center justify-center leading-tight tracking-tight"
            />
          </div>
        </div>

        {/* Desktop Interface: Folders */}
        <div className="flex flex-wrap justify-center gap-16 md:gap-24">
          {folders.map((folder) => (
            <GlassFolder 
              key={folder.id} 
              id={folder.id} 
              title={folder.title} 
              onClick={setActiveFolderId} 
            />
          ))}
        </div>

        {/* Dynamic Finder Window Portal */}
        <AnimatePresence mode="wait">
          {activeFolderId && (
            <MacWindow 
              key="finder-window"
              currentFolderId={activeFolderId} 
              folders={folders}
              onFolderChange={setActiveFolderId}
              onClose={() => setActiveFolderId(null)}
              onSelectFile={setActiveCertificate}
              constraintsRef={sectionRef}
            />
          )}
        </AnimatePresence>

        {/* Full-Screen Artifact Overlay */}
        <AnimatePresence mode="wait">
          {activeCertificate && (
            <CertificatePreview 
              key={activeCertificate.id}
              cert={activeCertificate} 
              onClose={() => setActiveCertificate(null)} 
            />
          )}
        </AnimatePresence>
      </div>

      {/* Mainak OS System Status Bar */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 sm:gap-10 bg-[#101010]/60 backdrop-blur-2xl border border-white/10 px-8 py-4 rounded-full text-[8px] sm:text-[10px] uppercase tracking-[0.5em] text-gray-500 font-black whitespace-nowrap shadow-2xl select-none">
        <span className="text-[#E1E0CC]/60">Mainak OS v2.4</span>
        <div className="w-1.5 h-1.5 rounded-full bg-primary/60 shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
        <span className="text-[#E1E0CC]/40">System: Operational</span>
        <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]" />
        <span className="text-[#E1E0CC]/40">Assets: Encrypted</span>
      </div>
    </section>
  );
};
