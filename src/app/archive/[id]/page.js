"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ALL_SUBJECTS, statusColor } from "../../../lib/archive-subjects";

const ORIGIN_FULL = {
  H: "H-ORIGIN // HUMAN DESIGNATION",
  A: "A-ORIGIN // ARTIFICIAL DESIGNATION",
  P: "P-ORIGIN // PHANTOM DESIGNATION",
  X: "X-ORIGIN // UNKNOWN DESIGNATION",
};

export default function SubjectDossierPage() {
  const router = useRouter();
  const params = useParams();
  const [glitchActive, setGlitchActive] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const subject = ALL_SUBJECTS.find(s => s.slug === params.id);

  // Random glitch trigger
  useEffect(() => {
    const t = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  if (!subject) return <div style={{color: 'red'}}>404: FILE_CORRUPTED</div>;

  return (
    <main style={{
      background: "#000",
      color: "#00ffff", // Technical cyan for labels
      maxWidth: "480px",
      margin: "0 auto",
      minHeight: "100vh",
      fontFamily: "'Courier New', monospace",
      padding: "10px",
      textTransform: "uppercase",
      position: "relative",
      overflowX: "hidden"
    }}>
      <style>{`
        @keyframes textGlitch {
          0% { transform: translate(0); text-shadow: none; }
          20% { transform: translate(-2px, 1px); text-shadow: 2px 0 #f00, -2px 0 #0ff; }
          40% { transform: translate(2px, -1px); }
          60% { transform: translate(-1px, 0); }
          100% { transform: translate(0); }
        }
        .glitch-active { animation: textGlitch 0.2s linear infinite; color: #fff !important; }
        
        .label-red { color: #cc2200; font-weight: 900; font-size: 11px; letter-spacing: 1px; margin-bottom: 4px; display: block; }
        .data-cyan { color: #00ffff; font-size: 10px; line-height: 1.2; }
        .data-white { color: #fff; font-size: 10px; }
        .border-red { border: 1px solid rgba(204, 34, 0, 0.4); }
        .divider { height: 1px; background: rgba(204, 34, 0, 0.3); margin: 6px 0; }
        
        /* Scanline effect overlay */
        .scanlines::before {
          content: " "; display: block; position: absolute; top: 0; left: 0; bottom: 0; right: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          z-index: 10; background-size: 100% 2px, 3px 100%; pointer-events: none;
        }
      `}</style>

      <div className="scanlines" />

      {/* ── TOP HEADER ── */}
      <div style={{ borderBottom: "2px solid #cc2200", paddingBottom: "4px", marginBottom: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className={`label-red ${glitchActive ? 'glitch-active' : ''}`} style={{fontSize: '14px'}}>
            STATUS : CLASSIFIED [||||||]
          </span>
          <span style={{color: '#fff', fontSize: '18px'}}>🔍 🛒</span>
        </div>
        <div style={{ color: "#00ffff", fontSize: "9px", letterSpacing: "1px" }}>
          {ORIGIN_FULL[subject.origin]}
        </div>
      </div>

      {/* ── TOP TIER: TWO COLUMN GRID ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "10px", marginBottom: "10px" }}>
        {/* Left: Main Sighting Photo */}
        <div style={{ border: "1px solid #333", position: "relative", minHeight: "220px" }}>
          <img
            src={subject.sightingPhoto}
            alt="Sighting"
            onClick={() => setLightbox(subject.sightingPhoto)}
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "contrast(1.2) grayscale(0.4)", cursor: "pointer" }}
          />
        </div>

        {/* Right: Summary / Observations / Assessment */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div>
            <span className="label-red">SUMMARY</span>
            <p className="data-cyan" style={{fontSize: '9px'}}>{subject.summary}</p>
          </div>
          <div>
            <span className="label-red">OBSERVATIONS</span>
            <p className="data-cyan" style={{fontSize: '9px'}}>{subject.observations}</p>
          </div>
          <div>
            <span className="label-red">ASSESSMENT</span>
            <p className="data-cyan" style={{fontSize: '9px'}}>{subject.assessment}</p>
          </div>
        </div>
      </div>

      {/* ── MIDDLE TIER: STATS BLOCK ── */}
      <div className="border-red" style={{ padding: "8px", background: "rgba(204, 34, 0, 0.05)", marginBottom: "10px" }}>
        <span className="label-red">SUBJECT CLASSIFICATION</span>
        <div className="data-cyan">{subject.type}</div>
        <div className="data-cyan" style={{borderBottom: '1px solid #333', paddingBottom: '4px', marginBottom: '4px'}}>
            BASELINE BIOLOGY // {subject.classification}
        </div>
        
        <div className={`data-white ${glitchActive ? 'glitch-active' : ''}`} style={{fontSize: '22px', fontWeight: '900'}}>
          {subject.name}
        </div>
        <div className="label-red" style={{fontSize: '12px'}}>ALIAS : {subject.alias}</div>
        <div style={{fontSize: '9px', color: '#444', marginBottom: '8px'}}>{subject.caseRef}</div>

        <span className="label-red">PHYSICAL STATS</span>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {[
            ["HEIGHT", subject.bio.height],
            ["WEIGHT", subject.bio.weight],
            ["AGE", `42 (DECEASED)`],
            ["BUILD", subject.bio.build],
            ["HAIR", "DARK BLONDE"],
            ["EYES", subject.bio.eyes]
          ].map(([label, val]) => (
            <div key={label} style={{ display: "flex", borderBottom: "1px solid #1a1a1a" }}>
              <span style={{ color: "#00ffff", width: "80px", fontSize: "9px" }}>{label}:</span>
              <span className="data-white" style={{ fontSize: "9px" }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── THIRD TIER: THREAT & ABILITIES ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <div>
           <span className="label-red">THREAT LEVEL :</span>
           <div style={{ fontSize: "40px", color: "#cc2200", fontWeight: "900", lineHeight: "1" }}>
              {subject.threatLevel}
           </div>
           <div style={{fontSize: '8px', color: '#cc2200'}}>{subject.threat}</div>
        </div>
        <div>
          <span className="label-red" style={{color: '#fff'}}>KNOWN ABILITIES</span>
          <div className="data-cyan" style={{fontSize: '9px'}}>
            {subject.abilities?.map(a => <div key={a}>+ {a}</div>)}
          </div>
        </div>
      </div>

      {/* ── BOTTOM GALLERY ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px", marginTop: "10px" }}>
        {[subject.photo, subject.sightingPhoto, subject.secondaryPhoto, ...(subject.extraPhotos || [])].filter(Boolean).map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`photo-${i}`}
            onClick={() => setLightbox(src)}
            style={{ width: "100%", aspectRatio: "1", objectFit: "cover", border: "1px solid #333", cursor: "pointer", transition: "opacity 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          />
        ))}
      </div>

      {/* ── FOOTER ── */}
      <div style={{ marginTop: "15px", borderTop: "1px solid #333", paddingTop: "10px" }}>
         <div style={{fontSize: '8px', color: 'rgba(0, 255, 255, 0.3)', textAlign: 'center'}}>
            FUSEDCORP ARCHIVES // INTERNAL DATABASE // PORTAL ACCESS 06-X
         </div>
         <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", alignItems: "center" }}>
            <span style={{fontSize: '20px'}}>🤖 🎵 📸</span>
            <button 
              onClick={() => router.push("/archive")}
              style={{ background: "#cc2200", color: "#fff", border: "none", padding: "5px 15px", fontWeight: "900", cursor: "pointer" }}
            >
              ← BACK
            </button>
         </div>
      </div>
      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 999,
            background: "rgba(0,0,0,0.95)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "16px",
          }}
        >
          <img
            src={lightbox}
            alt="fullscreen"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: "100%", maxHeight: "90vh", objectFit: "contain", border: "1px solid #cc2200" }}
          />
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: "absolute", top: "12px", right: "12px",
              background: "#cc2200", color: "#fff", border: "none",
              fontFamily: "'Courier New', monospace", fontWeight: 900,
              fontSize: "10px", letterSpacing: "0.2em",
              padding: "5px 12px", cursor: "pointer",
            }}
          >✕ CLOSE</button>
        </div>
      )}
    </main>
  );
}