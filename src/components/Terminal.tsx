import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, X, Command } from 'lucide-react';
import { getSecureEmail, sanitizeTerminalInput } from '../utils/security';

/**
 * Interface for terminal history artifacts.
 */
interface HistoryItem {
  command: string;
  output: string | React.ReactNode;
}

/**
 * Enterprise-grade Terminal Interface.
 * 
 * Implements weaponized input handling, GPU-accelerated motion,
 * and zero-trust security for contact relays.
 */
export const Terminal: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([
    { 
      command: '', 
      output: 'Mainak OS [Version 2.0.45]\n(c) 2026 Mainak Biswas. All rights reserved.\n\nType "help" to see available commands.' 
    }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Auto-scroll synchronization for history mutations.
   */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  /**
   * Focus management for modal lifecycle.
   */
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  /**
   * Orchestrates command execution and secure response generation.
   */
  const handleCommand = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // Pillar IV: Aggressive Sanitization
    const sanitizedInput = sanitizeTerminalInput(input);
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
            <span>- AI Slop Detector (AI Governance / NLP)</span>
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
        const mail = getSecureEmail();
        // [AppSec] Protocol Reliability: Using standard anchor behavior for mailto
        setTimeout(() => {
          if (mail) {
            window.location.href = `mailto:${mail}?subject=Secure%20Connection%20Request`;
          }
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
        output = `Command not found: "${sanitizedInput}". Type "help" for a list of available commands.`;
    }

    setHistory(prev => [...prev, { command: sanitizedInput, output }]);
    setInput('');
  }, [input]);

  return (
    <>
      {/* Floating Trigger - GPU Optimized */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        aria-label="Open system terminal"
        className="fixed bottom-8 right-8 z-[60] bg-primary text-black p-4 rounded-full shadow-2xl flex items-center justify-center hover:bg-[#C8C5B0] transition-colors"
      >
        <TerminalIcon size={24} />
      </motion.button>

      {/* Terminal Portal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-none">
            {/* Backdrop with Frost Effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md pointer-events-auto"
            />

            {/* Terminal Window - GPU Accelerated Transitions */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              className="relative w-full max-w-3xl h-[65vh] bg-black/90 backdrop-blur-xl border border-[#E1E0CC]/10 rounded-2xl overflow-hidden flex flex-col pointer-events-auto shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
            >
              {/* Noise Grain Overlay */}
              <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />

              {/* macOS-style Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#1A1A1A] border-b border-[#E1E0CC]/5 select-none">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black/10" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black/10" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-black/10" />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-bold ml-2 flex items-center gap-1.5">
                    <Command size={10} /> mainak-os — terminal
                  </span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="text-gray-500 hover:text-white transition-colors p-1"
                  aria-label="Close terminal"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Output Canvas */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 font-mono text-sm leading-relaxed scrollbar-thin scrollbar-thumb-white/10"
              >
                {history.map((item, idx) => (
                  <div key={idx} className="mb-5 last:mb-0">
                    {item.command && (
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-primary font-bold">mainak@os:~$</span>
                        <span className="text-[#E1E0CC]">{item.command}</span>
                      </div>
                    )}
                    <div className="text-gray-400 whitespace-pre-wrap pl-2 border-l border-white/5">
                      {item.output}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Gateway */}
              <form 
                onSubmit={handleCommand} 
                className="p-5 bg-black/50 border-t border-[#E1E0CC]/5 flex items-center gap-3"
              >
                <span className="text-primary font-mono text-sm font-bold">mainak@os:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-[#E1E0CC] font-mono text-sm focus:ring-0 placeholder:opacity-30"
                  spellCheck={false}
                  autoComplete="off"
                  aria-label="Terminal input"
                />
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
