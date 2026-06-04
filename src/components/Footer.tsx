import { motion } from 'framer-motion';
import { Camera, Mail, Globe, User, ArrowUp } from 'lucide-react';
import { getSecureEmail } from '../utils/security';

export const Footer = () => {
  const email = getSecureEmail();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black py-20 px-6 border-t border-[#E1E0CC]/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand/Logo Section */}
          <div className="lg:col-span-2">
            <h2 className="text-[#E1E0CC] text-3xl font-medium tracking-tight mb-6">Mainak Biswas</h2>
            <p className="text-gray-500 max-w-sm text-sm leading-relaxed mb-8">
              Creative Technologist & AI Engineer. Bridging the gap between neural intelligence and cinematic imagination.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/fushigurp" target="_blank" rel="noopener noreferrer" className="bg-[#1A1A1A] p-3 rounded-full text-gray-400 hover:text-primary hover:bg-[#252525] transition-all">
                <Camera size={18} />
              </a>
              <a href="https://github.com/fs0cietyx" target="_blank" rel="noopener noreferrer" className="bg-[#1A1A1A] p-3 rounded-full text-gray-400 hover:text-primary hover:bg-[#252525] transition-all">
                <Globe size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="bg-[#1A1A1A] p-3 rounded-full text-gray-400 hover:text-primary hover:bg-[#252525] transition-all">
                <User size={18} />
              </a>
              <a href={`mailto:${email}`} className="bg-[#1A1A1A] p-3 rounded-full text-gray-400 hover:text-primary hover:bg-[#252525] transition-all">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-[#E1E0CC] font-medium mb-6 uppercase tracking-widest text-[10px]">Navigation</h4>
            <ul className="space-y-4">
              {["Hero", "About", "Focus", "Projects"].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="text-gray-500 hover:text-[#E1E0CC] text-sm transition-colors uppercase tracking-wider text-[11px]">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Inquiries Section */}
          <div>
            <h4 className="text-[#E1E0CC] font-medium mb-6 uppercase tracking-widest text-[10px]">Inquiries</h4>
            <p className="text-gray-500 text-sm mb-4">Interested in collaborating on AI or cinematic projects?</p>
            <a href={`mailto:${email}`} className="text-primary hover:underline text-sm font-medium">
              Connect
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-[#E1E0CC]/5 gap-6">
          <p className="text-gray-600 text-[10px] uppercase tracking-[0.2em]">
            © 2026 Mainak Biswas. All Rights Reserved.
          </p>
          <motion.button
            whileHover={{ y: -5 }}
            onClick={scrollToTop}
            className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors text-[10px] uppercase tracking-widest"
          >
            Back to Top <ArrowUp size={14} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};
