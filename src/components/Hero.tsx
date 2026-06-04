import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { WordsPullUp } from './animations';
import { getSecureEmail } from '../utils/security';

const Navbar = () => {
  const email = getSecureEmail();
  const navItems = [
    { label: "About", href: "#about" },
    { label: "Focus", href: "#focus" },
    { label: "Portfolio", href: "#projects" },
    { label: "GitHub", href: "https://github.com/fs0cietyx" },
    { label: "Lab", href: `mailto:${email}` }
  ];
  return (
    <nav className="absolute top-0 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center p-4">
      <div className="bg-black/80 backdrop-blur-md border border-[#E1E0CC]/10 rounded-full px-6 py-2 flex items-center gap-6 sm:gap-10 md:gap-14">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.href.startsWith('http') ? '_blank' : '_self'}
            rel={item.href.startsWith('http') ? 'noopener noreferrer' : ''}
            className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] transition-colors"
            style={{ color: 'rgba(225, 224, 204, 0.7)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#E1E0CC')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(225, 224, 204, 0.7)')}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
};

export const Hero = () => {
  return (
    <section className="h-screen w-full p-4 md:p-6 bg-black relative">
      <div className="w-full h-full rounded-2xl md:rounded-[2rem] overflow-hidden relative">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/hero-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={import.meta.env.VITE_HERO_VIDEO_URL} type="video/mp4" />
        </video>

        {/* Overlays */}
        <div className="absolute inset-0 noise-overlay opacity-[0.7] mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

        <Navbar />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            {/* Heading */}
            <div className="md:col-span-8 flex flex-col items-start">
              <WordsPullUp
                text="Mainak"
                className="text-[16vw] sm:text-[14vw] md:text-[12vw] lg:text-[11vw] xl:text-[10vw] 2xl:text-[11vw] font-medium leading-[0.75] tracking-[-0.08em]"
                style={{ color: '#E1E0CC' } as React.CSSProperties}
              />
              <WordsPullUp
                text="Biswas"
                showAsterisk
                className="text-[16vw] sm:text-[14vw] md:text-[12vw] lg:text-[11vw] xl:text-[10vw] 2xl:text-[11vw] font-medium leading-[0.75] tracking-[-0.08em]"
                style={{ color: '#E1E0CC' } as React.CSSProperties}
              />
            </div>

            {/* Description & CTA */}
            <div className="md:col-span-4 flex flex-col gap-6">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-primary/70 text-xs sm:text-sm md:text-base leading-[1.2] max-w-sm"
              >
                Mainak Biswas is a Creative Technologist, AI/ML Engineer & Visual Storyteller. Shaping the intersection of intelligence and imagination, I leverage AI/ML engineering principles at KIIT University and my platform as a Google Student Ambassador to build next-generation software, while directing cinematic narratives that connect with people on a human level.
              </motion.p>

              <motion.a
                href={`mailto:${getSecureEmail()}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="group flex items-center gap-2 bg-primary w-fit rounded-full pl-6 pr-1 py-1 transition-all hover:gap-3 cursor-pointer no-underline"
              >
                <span className="text-black font-medium text-sm sm:text-base uppercase tracking-wider">Join the lab</span>
                <div className="bg-black rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-transform group-hover:scale-110">
                  <ArrowRight className="text-primary w-5 h-5" />
                </div>
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
