"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  ArrowLeft, 
  FolderOpen, 
  X, 
  Fingerprint, 
  AlertCircle 
} from 'lucide-react';

// --- DATA ---
const ARCHIVE_DATA = [
  {
    id: "099-SC",
    name: "THE PORCELAIN PHANTOM",
    status: "DE-INITIALIZED",
    date: "2026.03.25",
    // Ensure this path matches where you stored your image (e.g., /IMG_2255.JPG in public folder)
    image: "/IMG_2255.JPG", 
    report: "Subject's pulse synced to porcelain. Identity overwrite successful."
  },
  {
    id: "102-SC",
    name: "NEURAL_SENTINEL",
    status: "LINKED",
    date: "2026.02.10",
    image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=500",
    report: "Biometric data purged. No original DNA traces remain."
  }
];

// --- MODAL COMPONENT ---
function CaseFile({ subject, onClose }) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-2xl bg-black border-2 border-blue-600 overflow-hidden shadow-[0_0_50px_rgba(37,99,235,0.4)]"
      >
        <div className="bg-blue-600 p-2 flex justify-between items-center text-black font-black text-[10px] uppercase">
          <span><AlertCircle size={14} className="inline mr-2" /> RESTRICTED_FILE // {subject.id}</span>
          <button onClick={onClose}><X size={18} /></button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <img src={subject.image} alt="Mask" className="border border-blue-900 grayscale contrast-125" />
          <div className="space-y-4">
            <h2 className="text-2xl font-black italic text-white leading-none">{subject.name}</h2>
            <p className="text-[10px] text-blue-400 leading-relaxed uppercase">{subject.report}</p>
            <div className="pt-4 border-t border-blue-900/50">
              <p className="text-[9px] text-blue-900 font-bold uppercase">Last_Active: {subject.date}</p>
              <p className="text-[9px] text-blue-900 font-bold uppercase">Status: {subject.status}</p>
            </div>
            <button className="w-full bg-blue-600 text-black py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-colors">
              [DOWNLOAD_LOGS]
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- MAIN PAGE ---
export default function ArchivePage() {
  const router = useRouter();
  const [activeSubject, setActiveSubject] = useState(null);

  return (
    <main className="min-h-screen bg-black text-blue-500 font-mono p-6 relative">
      {/* Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(0,0,255,0.02),rgba(0,255,0,0.01),rgba(255,0,0,0.01))] bg-[length:100%_4px,4px_100%]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-12 space-y-4 border-b border-blue-900/30 pb-8">
          <button 
            onClick={() => router.back()} 
            className="text-[10px] font-black text-blue-900 hover:text-white flex items-center gap-2 uppercase tracking-widest"
          >
            <ArrowLeft size={12} /> [BACK_TO_SYSTEM]
          </button>
          <h1 className="text-4xl md:text-7xl font-black italic uppercase text-white flex items-center gap-4">
            <Database className="text-blue-600" size={48} /> Archive
          </h1>
        </header>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ARCHIVE_DATA.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border border-blue-900/40 bg-[#050505] overflow-hidden group hover:border-blue-600 transition-colors"
            >
              <div className="aspect-square overflow-hidden grayscale group-hover:grayscale-0 transition-all opacity-40 group-hover:opacity-100">
                <img src={item.image} alt="Mask" className="w-full h-full object-cover" />
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-blue-900">ID: {item.id}</span>
                  <span className="text-[9px] bg-blue-600/10 px-2 py-0.5 text-blue-400 font-bold uppercase">{item.status}</span>
                </div>
                <h3 className="text-xl font-black text-white italic uppercase">{item.name}</h3>
                <button 
                  onClick={() => setActiveSubject(item)}
                  className="w-full border border-blue-600/50 py-3 text-[10px] font-black uppercase text-blue-600 hover:bg-blue-600 hover:text-black transition-all flex items-center justify-center gap-2"
                >
                  <FolderOpen size={14} /> [EXTRACT_METADATA]
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeSubject && (
          <CaseFile subject={activeSubject} onClose={() => setActiveSubject(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}