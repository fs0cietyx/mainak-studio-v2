import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, X, Command } from 'lucide-react';
import { getSecureEmail } from '../utils/security';

interface HistoryItem {
  command: string;
  output: string | React.ReactNode;
}

export const Terminal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([
    { command: '', output: 'Mainak OS [Version 2.0.45]\n(c) 2026 Mainak Biswas. All rights reserved.\n\nType "help" to see available commands.' }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Pillar 4: Strict Input Validation & Length Limits
    // Aggressively sanitize input: strip non-alphanumeric/space/common terminal chars
    const sanitizedInput = input.trim().slice(0, 100).replace(/[^\w\s\.\-]/gi, '');
    if (!sanitizedInput) {
      setInput('');
      return;
    }

    const cmd = sanitizedInput.toLowerCase();
    let output: string | React.ReactNode = '';

    switch (cmd) {
      case 'help':
        output = 'Available commands:\n  ls projects   - View portfolio artifacts\n  whoami        - System user specifications\n  cat about.txt - Read the bio\n  sudo connect  - Initialize connection\n  clear         - Wipe terminal history\n  exit          - Close the session';
        break;
      case 'ls projects':
        output = (
          <div className="flex flex-col gap-1">
            <span className="text-primary font-bold">Selected Artifacts:</span>
            <span>- Neural Cine-Synthesizer (AI / Visual)</span>
            <span>- Ambassador Hub (Leadership)</span>
            <span>- Autonomous Frame Analysis (Computer Vision)</span>
            <span>- The Imagination Engine (LLM / GenArt)</span>
          </div>
        );
        break;
      case 'whoami':
        output = 'User: Mainak Biswas\nStatus: Google Student Ambassador\nOrigin: KIIT University (Sophomore)\nFocus: AI/ML Engineering & Cinematic Visuals';
        break;
      case 'cat about.txt':
        output = 'I am a Creative Technologist bridging AI/ML engineering with the power of visual storytelling. By leveraging my technical foundation at KIIT and my leadership as a Google Student Ambassador, I build intelligent software solutions while crafting cinematic narratives.';
        break;
      case 'sudo connect':
        output = 'Initializing secure connection relay... Authentication bypassed for system owner.';
        // Pillar 5: Use encoded mailto to prevent simple scraping
        const mail = getSecureEmail();
        setTimeout(() => {
          if (mail) window.open(`mailto:${mail}`);
        }, 1000);
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'exit':
        setIsOpen(false);
        setInput('');
        return;
      default:
        // Pillar 4: Completely neutralize reflected input
        // We use the sanitized version and further ensure it cannot be executed
        output = `Command not found: "${sanitizedInput}". Type "help" for a list of available commands.`;
    }

    setHistory([...history, { command: sanitizedInput, output }]);
    setInput('');
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[60] bg-primary text-black p-4 rounded-full shadow-2xl flex items-center justify-center hover:bg-[#C8C5B0] transition-colors"
      >
        <TerminalIcon size={24} />
      </motion.button>

      {/* Terminal Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
            />

            {/* Terminal Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-3xl h-[60vh] bg-black/80 backdrop-blur-xl border border-[#E1E0CC]/10 rounded-2xl overflow-hidden flex flex-col pointer-events-auto shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              {/* Noise Overlay */}
              <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none" />

              {/* Title Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#1A1A1A] border-b border-[#E1E0CC]/5">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-medium ml-2 flex items-center gap-1">
                    <Command size={10} /> mainak-os — bash
                  </span>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Output Area */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 font-mono text-sm leading-relaxed"
              >
                {history.map((item, idx) => (
                  <div key={idx} className="mb-4">
                    {item.command && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-primary">mainak@portfolio:~$</span>
                        <span className="text-[#E1E0CC]">{item.command}</span>
                      </div>
                    )}
                    <div className="text-gray-400 whitespace-pre-wrap">
                      {item.output}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <form onSubmit={handleCommand} className="p-4 bg-[#111] border-t border-[#E1E0CC]/5 flex items-center gap-3">
                <span className="text-primary font-mono text-sm">mainak@portfolio:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-[#E1E0CC] font-mono text-sm focus:ring-0"
                  spellCheck={false}
                  autoComplete="off"
                />
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
