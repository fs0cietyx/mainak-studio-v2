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
 * Pure function to map terminal commands to outputs
 */
const processCommand = (cmd: string): string | React.ReactNode => {
  switch (cmd) {
    case 'help':
      return 'Available commands:\n  ls projects   - View portfolio artifacts\n  whoami        - System user specifications\n  cat about.txt - Read the bio\n  sudo connect  - Initialize connection\n  clear         - Wipe terminal history\n  exit          - Close the session';
    case 'ls projects':
      return (
        <div className="flex flex-col gap-1">
          <span className="text-primary font-bold">Selected Artifacts:</span>
          <span>- CytoGraph ML (AI / Machine Learning)</span>
          <span>- Maze Crawler (Algorithms / Pathfinding)</span>
          <span>- AI Slop Detector (AI Governance / NLP)</span>
          <span>- Semantic Repo Mapper (AST / Code Analysis)</span>
        </div>
      );
    case 'whoami':
      return 'User: Mainak Biswas\nRole: Creative Technologist\nStatus: Engineer & Designer\nFocus: Cinematic Web Experiences & AI Architecture';
    case 'cat about.txt':
      return 'I am Mainak Biswas, a Creative Technologist. I bridge the gap between heavy engineering and high-end aesthetic design. Less "beep boop," way more "oh la la".';
    case 'sudo connect': {
      const mail = getSecureEmail();
      if (mail) {
        setTimeout(() => {
          window.location.href = `mailto:${mail}?subject=Secure%20Connection%20Request`;
        }, 1000);
      }
      return 'Initializing secure connection relay... Authentication bypassed for system owner.';
    }
    default:
      return `Command not found: "${cmd}". Type "help" for a list of available commands.`;
  }
};

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
    
    if (cmd === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }
    
    if (cmd === 'exit') {
      setIsOpen(false);
      setInput('');
      return;
    }

    const output = processCommand(cmd);
    
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
              className="absolute inset-0 bg-[#101010]/60 backdrop-blur-md pointer-events-auto"
            />

            {/* Terminal Window - GPU Accelerated Transitions */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              className="relative w-full max-w-3xl h-[65vh] bg-[#101010]/90 backdrop-blur-xl border border-[#E1E0CC]/10 rounded-2xl overflow-hidden flex flex-col pointer-events-auto shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
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
                className="p-5 bg-[#101010]/50 border-t border-[#E1E0CC]/5 flex items-center gap-3"
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
