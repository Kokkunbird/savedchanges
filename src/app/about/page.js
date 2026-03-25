"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  Terminal, 
  Camera, 
  Clapperboard, 
  Activity,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

// Optimized Typewriter with Functional State Updates (Blue Cursor)
const Typewriter = ({ text, delay = 0, speed = 30 }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i));
        i++;
        if (i > text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay, speed]);

  return (
    <span className="relative">
      {displayedText}
      {displayedText.length < text.length && (
        <span className="inline-block w-2 h-4 bg-blue-600 ml-1 animate-pulse" />
      )}
    </span>
  );
};

export default function AboutPage() {
  const router = useRouter();
  const [isAccessGranted, setIsAccessGranted] = useState(false);
  const [showMainContent, setShowMainContent] = useState(false);

  useEffect(() => {
    // 1. Audio handling (wrapped in user interaction check)
    const playSound = () => {
      const audio = new Audio('https://www.soundjay.com/communication/sounds/beep-01a.mp3');
      audio.volume = 0.1;
      audio.play().catch(() => {});
    };

    const timer1 = setTimeout(() => {
      setIsAccessGranted(true);
      playSound();
    }, 800);

    const timer2 = setTimeout(() => {
      setShowMainContent(true);
    }, 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-black text-blue-600 font-mono p-4 md:p-12 relative overflow-hidden selection:bg-blue-600 selection:text-black">
      
      {/* Scanline CRT Overlay (Slightly adjusted blue mix) */}
      <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(0,0,255,0.03),rgba(0,255,0,0.01),rgba(255,0,0,0.02))] bg-[length:100%_3px,3px_100%]" />

      <AnimatePresence mode="wait">
        {!showMainContent ? (
          <motion.div 
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(15px)" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          >
            <div className="text-center space-y-6">
              <motion.div 
                animate={{ 
                  boxShadow: ["0 0 0px #1e3a8a", "0 0 20px #1e3a8a", "0 0 0px #1e3a8a"],
                  borderColor: ["#1e3a8a", "#2563eb", "#1e3a8a"]
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="border-2 px-10 py-6 bg-blue-950/10"
              >
                <h1 className="text-3xl md:text-6xl font-black tracking-[0.3em] uppercase italic text-blue-600">
                  {isAccessGranted ? "ACCESS_GRANTED" : "DECRYPTING..."}
                </h1>
              </motion.div>
              <div className="overflow-hidden h-1 w-full bg-blue-950/30 relative">
                 <motion.div 
                   className="absolute inset-0 bg-blue-600"
                   initial={{ x: "-100%" }}
                   animate={{ x: "0%" }}
                   transition={{ duration: 1.5, ease: "easeInOut" }}
                 />
              </div>
              <p className="text-[10px] text-blue-900 animate-pulse tracking-[1em] uppercase font-bold">Establishing Secure Link</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="main"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10"
          >
            {/* BACK BUTTON (Now blue) */}
            <motion.button
              variants={itemVariants}
              onClick={() => router.back()}
              className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-900 hover:text-white transition-all group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> [TERMINATE_SESSION]
            </motion.button>

            <motion.main 
              className="max-w-4xl mx-auto border border-blue-900/40 bg-[#000105] p-6 md:p-16 shadow-[0_0_80px_rgba(29,78,216,0.1)] relative"
            >
              {/* HEADER SECTION (Now blue) */}
              <motion.header variants={itemVariants} className="border-b border-blue-900/50 pb-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-blue-900/10 border border-blue-600/50 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                    <ShieldAlert size={36} className="text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white italic leading-none">Save Changes</h1>
                    <p className="text-[9px] tracking-[0.4em] text-blue-900 font-bold mt-2 uppercase">Protocol: IDENTITY_OVERWRITE // 099-SC</p>
                  </div>
                </div>
                <div className="bg-blue-950/20 px-4 py-2 border border-blue-900/50">
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                    <Typewriter text="SYSTEM_STATUS: CORE_STABLE" speed={40} />
                  </p>
                </div>
              </motion.header>

              {/* CORE NARRATIVE (Updated blue direct quote) */}
              <div className="space-y-12 mb-16">
                <motion.div variants={itemVariants} className="border-l-4 border-blue-600 pl-8 py-4">
                  <div className="space-y-4">
                    <h2 className="text-white text-xl font-black uppercase flex items-center gap-3">
                      <ChevronRight size={20} className="text-blue-600" /> DIRECTIVE: THE PORCELAIN PULSE
                    </h2>
                    <p className="text-lg md:text-xl leading-relaxed text-blue-500/90 font-medium italic">
                      <Typewriter delay={800} text='"The mask doesn’t hide your face—it unchains the entity that was always waiting for a stage. Step in, and let your old self fade."' speed={25} />
                    </p>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div variants={itemVariants} className="space-y-4 bg-white/[0.02] p-8 border border-blue-900/20 hover:border-blue-600/40 transition-colors">
                    <h3 className="text-white font-black uppercase flex items-center gap-2 tracking-widest"><Terminal size={16} /> The Breach</h3>
                    <p className="text-sm leading-loose text-gray-500">
                      <Typewriter delay={2500} text="We facilitate Corruption Events. Our hardware consists of physical patches for the human glitch. Slip on the stars; inhabit the myth." speed={15} />
                    </p>
                  </motion.div>
                  <motion.div variants={itemVariants} className="space-y-4 bg-white/[0.02] p-8 border border-blue-900/20 hover:border-blue-600/40 transition-colors">
                    <h3 className="text-white font-black uppercase flex items-center gap-2 tracking-widest"><Activity size={16} /> Neural Warning</h3>
                    <p className="text-sm leading-loose text-gray-500">
                      <Typewriter delay={3500} text="Once the seal is locked, your pulse will sync to the porcelain. Side effects include loss of name and compulsive stillness." speed={15} />
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* WARNING BOX (Now blue) */}
              <motion.div variants={itemVariants} className="bg-blue-950/10 border-2 border-dashed border-blue-900/30 p-8 mb-12 group">
                <p className="text-[11px] uppercase leading-relaxed text-blue-900 group-hover:text-blue-700 transition-colors">
                  <Typewriter delay={4500} text="NOTICE: Save Changes is a creative mask shop. All neural overwrites are aesthetic. We are not responsible for what you become in the shadows." speed={10} />
                </p>
              </motion.div>

              {/* FOOTER (Now blue) */}
              <motion.footer variants={itemVariants} className="pt-12 border-t border-blue-900/30 flex flex-col md:flex-row justify-between items-center gap-8">
                <p className="text-[10px] text-gray-700 uppercase tracking-widest font-bold">© 2026 Save Changes // No Refunds // No Reality</p>
                <div className="flex gap-4">
                  <motion.a 
                    href="https://instagram.com/savechanges.store" 
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3, color: "#fff" }} 
                    className="p-3 border border-blue-900 text-blue-600 hover:bg-blue-600/10 transition-colors"
                  >
                    <Camera size={18} />
                  </motion.a>
                  <motion.a 
                    href="https://tiktok.com/@savechanges.store" 
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3, color: "#fff" }} 
                    className="p-3 border border-blue-900 text-blue-600 hover:bg-blue-600/10 transition-colors"
                  >
                    <Clapperboard size={18} />
                  </motion.a>
                </div>
              </motion.footer>
            </motion.main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}