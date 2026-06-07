import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { WordsPullUp } from './animations';
import { getSecureEmail } from '../utils/security';

/**
 * Interface for navigation artifacts.
 */
interface NavItem {
  label: string;
  href: string;
  isExternal: boolean;
}

/**
 * Enterprise-grade Navigation Bar.
 * 
 * Implements frost-glass aesthetics, GPU-accelerated hover states,
 * and secure protocol handling for contact relays.
 */
const Navbar: React.FC = () => {
  const email: string = getSecureEmail();
  
  const navItems: NavItem[] = [
    { label: "About", href: "#about", isExternal: false },
    { label: "Focus", href: "#focus", isExternal: false },
    { label: "Portfolio", href: "#projects", isExternal: false },
    { label: "GitHub", href: "https://github.com/fs0cietyx", isExternal: true },
    { label: "Lab", href: `mailto:${email}?subject=Lab%20Inquiry`, isExternal: true }
  ];

  return (
    <nav className="absolute top-0 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center p-4">
      <div className="bg-black/80 backdrop-blur-md border border-[#E1E0CC]/10 rounded-full px-6 py-2 flex items-center gap-6 sm:gap-10 md:gap-14">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.isExternal ? '_blank' : '_self'}
            rel={item.isExternal ? 'noopener noreferrer' : ''}
            className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] transition-all duration-300 hover:text-[#E1E0CC] text-[#E1E0CC]/60 active:scale-95"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
};

/**
 * High-Performance Cinematic Hero Section.
 * 
 * Adheres to Pillar III (Cinematic Motion) and Pillar IV (Core Web Vitals).
 * Utilizes GPU-accelerated transforms and optimized video rendering.
 */
export const Hero: React.FC = () => {
  const secureEmail: string = getSecureEmail();

  return (
    <section className="h-screen w-full p-4 md:p-6 bg-black relative overflow-hidden">
      <div className="w-full h-full rounded-2xl md:rounded-[2.5rem] overflow-hidden relative shadow-2xl">
        {/* Optimized Background Engine */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/hero-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none opacity-60"
        >
          {/* Environment-agnostic video source */}
          <source src={import.meta.env.VITE_HERO_VIDEO_URL} type="video/mp4" />
        </video>

        {/* Cinematic Overlays - GPU Rendered */}
        <div className="absolute inset-0 noise-overlay opacity-[0.4] mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

        <Navbar />

        {/* Adaptive Layout Canvas */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
            
            {/* Semantic Typography Engine */}
            <div className="md:col-span-8 flex flex-col items-start select-none">
              <WordsPullUp
                text="Mainak"
                className="text-[18vw] sm:text-[15vw] md:text-[13vw] lg:text-[11vw] font-medium leading-[0.7] tracking-[-0.08em]"
                style={{ color: '#E1E0CC' }}
              />
              <WordsPullUp
                text="Biswas"
                showAsterisk
                className="text-[18vw] sm:text-[15vw] md:text-[13vw] lg:text-[11vw] font-medium leading-[0.7] tracking-[-0.08em]"
                style={{ color: '#E1E0CC' }}
              />
            </div>

            {/* Strategic Conversion Content */}
            <div className="md:col-span-4 flex flex-col gap-8">
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
                className="text-primary/80 text-xs sm:text-sm md:text-base leading-[1.3] max-w-sm font-medium"
              >
                Creative Technologist, AI/ML Engineer & Visual Storyteller. 
                Engineering the intersection of neural intelligence and cinematic imagination 
                at KIIT University. Designing software that resonates on a human level.
              </motion.p>

              {/* Secure CTA Relay */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.6, ease: [0.19, 1, 0.22, 1] }}
              >
                <a
                  href={`mailto:${secureEmail}?subject=Connection%20Request`}
                  className="group flex items-center gap-3 bg-primary w-fit rounded-full pl-8 pr-2 py-2 transition-all hover:bg-white active:scale-95 no-underline"
                >
                  <span className="text-black font-black text-sm uppercase tracking-widest">
                    Enter the lab
                  </span>
                  <div className="bg-black rounded-full w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-110">
                    <ArrowRight className="text-primary w-5 h-5" />
                  </div>
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
