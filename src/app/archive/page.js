"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ALL_SUBJECTS, ORIGINS, statusColor } from "../../lib/archive-subjects";

// ─── DECRYPTING SCREEN ────────────────────────────────────────────────────────
function DecryptingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [scanY, setScanY] = useState(0);
  const [chars, setChars] = useState("DECRYPTING...");

  useEffect(() => {
    const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!%&";
    const target = "DECRYPTING...";
    let frame = 0;
    const scramble = setInterval(() => {
      frame++;
      const revealed = Math.floor((frame / 20) * target.length);
      setChars(
        target.split("").map((ch, i) =>
          i < revealed ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        ).join("")
      );
      if (revealed >= target.length) clearInterval(scramble);
    }, 60);
    return () => clearInterval(scramble);
  }, []);

  useEffect(() => {
    const duration = 3200;
    const start = Date.now();
    let raf;
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      setScanY((elapsed % 1400) / 1400 * 100);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(onComplete, 600);
        }, 300);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "#010a12",
      zIndex: 200,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 18,
      opacity: fadeOut ? 0 : 1,
      transition: "opacity 0.6s ease-out",
      fontFamily: "'Courier New', monospace",
    }}>
      {/* Scanline overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "linear-gradient(rgba(0,180,255,0) 50%, rgba(0,180,255,0.025) 50%)",
        backgroundSize: "100% 3px",
        pointerEvents: "none",
      }} />

      {/* Corner brackets */}
      {[
        { top: 20, left: 20, borderTop: "2px solid #0af", borderLeft: "2px solid #0af" },
        { top: 20, right: 20, borderTop: "2px solid #0af", borderRight: "2px solid #0af" },
        { bottom: 20, left: 20, borderBottom: "2px solid #0af", borderLeft: "2px solid #0af" },
        { bottom: 20, right: 20, borderBottom: "2px solid #0af", borderRight: "2px solid #0af" },
      ].map((s, i) => (
        <div key={i} style={{ position: "absolute", width: 24, height: 24, opacity: 0.6, ...s }} />
      ))}

      {/* Face wireframe container */}
      <div style={{ position: "relative", width: 160, height: 200 }}>
        {/* Scan sweep line */}
        <div style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `${scanY}%`,
          height: 2,
          background: "linear-gradient(90deg, transparent 0%, #0af 40%, #0af 60%, transparent 100%)",
          opacity: 0.65,
          zIndex: 2,
          filter: "blur(1px)",
        }} />

        {/* SVG wireframe face */}
        <svg viewBox="0 0 160 200" style={{ width: "100%", height: "100%", filter: "drop-shadow(0 0 10px rgba(0,170,255,0.7))" }}>
          {/* Grid lines */}
          {[35, 60, 85, 110, 135, 160].map(y => (
            <line key={`gy${y}`} x1="10" y1={y} x2="150" y2={y} stroke="#0af" strokeWidth="0.3" opacity="0.18" />
          ))}
          {[30, 55, 80, 105, 130].map(x => (
            <line key={`gx${x}`} x1={x} y1="10" x2={x} y2="190" stroke="#0af" strokeWidth="0.3" opacity="0.18" />
          ))}

          {/* Head outline */}
          <ellipse cx="80" cy="95" rx="60" ry="78" fill="none" stroke="#0af" strokeWidth="1.2" opacity="0.55" />
          {/* Chin detail */}
          <path d="M 38 120 Q 80 178 122 120" fill="none" stroke="#0af" strokeWidth="0.8" opacity="0.4" />

          {/* Eye sockets */}
          <ellipse cx="56" cy="80" rx="16" ry="10" fill="none" stroke="#0af" strokeWidth="1.4" opacity="0.9" />
          <ellipse cx="104" cy="80" rx="16" ry="10" fill="none" stroke="#0af" strokeWidth="1.4" opacity="0.9" />
          {/* Eye pupils */}
          <circle cx="56" cy="80" r="4" fill="none" stroke="#0af" strokeWidth="1" opacity="1" />
          <circle cx="104" cy="80" r="4" fill="none" stroke="#0af" strokeWidth="1" opacity="1" />
          <circle cx="56" cy="80" r="1.5" fill="#0af" opacity="0.9" />
          <circle cx="104" cy="80" r="1.5" fill="#0af" opacity="0.9" />

          {/* Brow ridge */}
          <path d="M 38 68 Q 56 60 74 68" fill="none" stroke="#0af" strokeWidth="0.8" opacity="0.5" />
          <path d="M 86 68 Q 104 60 122 68" fill="none" stroke="#0af" strokeWidth="0.8" opacity="0.5" />

          {/* Nose bridge */}
          <path d="M 72 90 L 68 116 L 80 122 L 92 116 L 88 90" fill="none" stroke="#0af" strokeWidth="0.8" opacity="0.55" />

          {/* Mouth */}
          <path d="M 57 140 Q 80 155 103 140" fill="none" stroke="#0af" strokeWidth="1" opacity="0.65" />
          <line x1="57" y1="140" x2="57" y2="146" stroke="#0af" strokeWidth="0.6" opacity="0.4" />
          <line x1="103" y1="140" x2="103" y2="146" stroke="#0af" strokeWidth="0.6" opacity="0.4" />

          {/* Cheekbone lines */}
          <path d="M 22 95 L 42 105" fill="none" stroke="#0af" strokeWidth="0.6" opacity="0.35" />
          <path d="M 138 95 L 118 105" fill="none" stroke="#0af" strokeWidth="0.6" opacity="0.35" />

          {/* Forehead targeting line */}
          <line x1="65" y1="28" x2="95" y2="28" stroke="#0af" strokeWidth="0.8" opacity="0.5" />
          <circle cx="80" cy="28" r="1.5" fill="#0af" opacity="0.7" />

          {/* Center crosshair */}
          <circle cx="80" cy="95" r="3" fill="none" stroke="#0af" strokeWidth="1" opacity="0.8" />
          <line x1="75" y1="95" x2="85" y2="95" stroke="#0af" strokeWidth="0.8" opacity="0.8" />
          <line x1="80" y1="90" x2="80" y2="100" stroke="#0af" strokeWidth="0.8" opacity="0.8" />
        </svg>
      </div>

      {/* DECRYPTING label */}
      <div style={{
        fontSize: 11,
        letterSpacing: "0.55em",
        textTransform: "uppercase",
        color: "#0af",
        textShadow: "0 0 12px #0af, 0 0 24px rgba(0,170,255,0.4)",
        minWidth: 160,
        textAlign: "center",
      }}>
        {chars}
      </div>

      {/* Progress bar */}
      <div style={{ width: 200, height: 2, background: "rgba(0,170,255,0.12)", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute",
          left: 0, top: 0, bottom: 0,
          width: `${progress}%`,
          background: "linear-gradient(90deg, #0af, #00eeff)",
          boxShadow: "0 0 8px #0af",
        }} />
      </div>

      {/* Percentage */}
      <div style={{
        fontSize: 8,
        letterSpacing: "0.35em",
        color: "rgba(0,170,255,0.45)",
      }}>
        {Math.floor(progress)}% COMPLETE
      </div>
    </div>
  );
}

// ─── ENTITY CARD ─────────────────────────────────────────────────────────────
function EntityCard({ subject, index }) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/archive/${subject.slug}`)}
      style={{
        minWidth: 128,
        maxWidth: 128,
        background: "rgba(0,0,0,0.6)",
        border: "1px solid rgba(200,30,10,0.25)",
        flexShrink: 0,
        overflow: "hidden",
        animation: `entity-in 0.25s ease-out ${index * 0.06}s both`,
        cursor: "pointer",
        transition: "border-color 0.18s ease",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(200,30,10,0.7)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(200,30,10,0.25)"; }}
    >
      {/* Photo */}
      <div style={{ height: 96, overflow: "hidden", position: "relative", background: "#040208" }}>
        {subject.photo ? (
          <img
            src={subject.photo}
            alt={subject.alias}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", filter: "contrast(1.1) saturate(0.65)" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(200,30,10,0.04)" }}>
            <span style={{ fontSize: 28, color: "rgba(200,30,10,0.15)", fontFamily: "'Courier New', monospace" }}>?</span>
          </div>
        )}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(transparent 50%, rgba(4,2,8,0.9) 100%)",
        }} />
        <div style={{
          position: "absolute",
          bottom: 4, left: 6,
          fontSize: 6,
          color: "rgba(200,30,10,0.6)",
          letterSpacing: "0.15em",
          fontFamily: "'Courier New', monospace",
        }}>
          ID: {subject.id}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "7px 8px" }}>
        <div style={{
          fontSize: 9,
          fontWeight: 900,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "#fff",
          lineHeight: 1.2,
          marginBottom: 3,
          fontFamily: "'Barlow Condensed', sans-serif",
        }}>
          {subject.alias}
        </div>
        <div style={{
          fontSize: 7,
          color: "rgba(209,213,219,0.35)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: 6,
          lineHeight: 1.3,
          fontFamily: "'Courier New', monospace",
        }}>
          {subject.name}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 6, color: statusColor(subject.status), letterSpacing: "0.1em", textTransform: "uppercase" }}>
            ◆ {subject.status}
          </span>
          <span style={{ fontSize: 6, color: "#f87171", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            {subject.threat}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── ORIGIN ROW ───────────────────────────────────────────────────────────────
function OriginRow({ origin, subjects, expanded, onToggle }) {
  return (
    <div style={{ borderBottom: "1px solid rgba(200,30,10,0.12)" }}>
      {/* Clickable header */}
      <div
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "13px 14px",
          cursor: "pointer",
          gap: 11,
          background: expanded ? "rgba(200,30,10,0.07)" : "transparent",
          transition: "background 0.2s ease",
          userSelect: "none",
        }}
      >
        {/* Origin letter badge */}
        <div style={{
          width: 34,
          height: 34,
          border: "1px solid rgba(200,30,10,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          background: expanded ? "rgba(200,30,10,0.12)" : "rgba(200,30,10,0.05)",
          transition: "background 0.2s",
        }}>
          <span style={{
            fontSize: 12,
            fontWeight: 900,
            color: "#e63320",
            fontFamily: "'Barlow Condensed', sans-serif",
            letterSpacing: "0.04em",
          }}>
            {origin.key}
          </span>
        </div>

        {/* Labels */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#fff",
            fontFamily: "'Barlow Condensed', sans-serif",
            lineHeight: 1.2,
          }}>
            {origin.full}
          </div>
          <div style={{
            fontSize: 7,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(209,213,219,0.3)",
            marginTop: 2,
            fontFamily: "'Courier New', monospace",
          }}>
            {origin.sub}
          </div>
        </div>

        {/* Subject thumbnails */}
        <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
          {subjects.slice(0, 3).map(s => (
            <div key={s.id} style={{
              width: 28,
              height: 28,
              overflow: "hidden",
              border: "1px solid rgba(200,30,10,0.25)",
              background: "#0a0608",
              flexShrink: 0,
            }}>
              {s.photo ? (
                <img
                  src={s.photo}
                  alt={s.alias}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", filter: "grayscale(0.5) contrast(1.1)" }}
                />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 10, color: "rgba(200,30,10,0.2)" }}>?</span>
                </div>
              )}
            </div>
          ))}
          {subjects.length === 0 && (
            <div style={{
              width: 28,
              height: 28,
              border: "1px solid rgba(200,30,10,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <span style={{ fontSize: 10, color: "rgba(200,30,10,0.15)", fontFamily: "'Courier New', monospace" }}>—</span>
            </div>
          )}
        </div>

        {/* Expand chevron */}
        <div style={{
          fontSize: 9,
          color: "rgba(200,30,10,0.45)",
          transform: expanded ? "rotate(180deg)" : "none",
          transition: "transform 0.22s ease",
          flexShrink: 0,
        }}>
          ▼
        </div>
      </div>

      {/* Expanded entity carousel */}
      {expanded && (
        <div style={{
          paddingBottom: 14,
          paddingLeft: 14,
          paddingRight: 14,
          overflowX: "auto",
          display: "flex",
          gap: 8,
          animation: "section-down 0.22s ease-out",
          WebkitOverflowScrolling: "touch",
        }}>
          {subjects.length > 0 ? (
            subjects.map((s, i) => <EntityCard key={s.id} subject={s} index={i} />)
          ) : (
            <div style={{
              padding: "16px 0",
              fontSize: 8,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(200,30,10,0.25)",
              fontFamily: "'Courier New', monospace",
            }}>
              NO CATALOGUED ENTITIES — DATA PENDING
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function ArchivePage() {
  const router = useRouter();
  const alreadySeen = typeof window !== "undefined" && sessionStorage.getItem("arch-seen");
  const [decrypting, setDecrypting] = useState(!alreadySeen);
  const [pageVisible, setPageVisible] = useState(!!alreadySeen);
  const [expanded, setExpanded] = useState(null);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    if (!pageVisible) return;
    const t = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 130);
    }, 5500);
    return () => clearInterval(t);
  }, [pageVisible]);

  function handleDecryptComplete() {
    sessionStorage.setItem("arch-seen", "1");
    setDecrypting(false);
    setPageVisible(true);
  }

  function toggleOrigin(key) {
    setExpanded(prev => prev === key ? null : key);
  }

  const subjectsByOrigin = (key) => ALL_SUBJECTS.filter(s => s.origin === key);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Barlow:wght@400&display=swap');

        @keyframes entity-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes section-down {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @keyframes arch-page-glitch {
          0%,100% { transform: none; }
          15%     { transform: translateX(-3px); filter: hue-rotate(40deg) brightness(1.1); }
          30%     { transform: translateX(3px); }
          45%     { transform: none; }
        }

        .arch-glitch-flash { animation: arch-page-glitch 0.25s steps(1) forwards; }
      `}</style>

      {decrypting && <DecryptingScreen onComplete={handleDecryptComplete} />}

      <main
        className={glitch ? "arch-glitch-flash" : ""}
        style={{
          minHeight: "100vh",
          background: "#0a0608",
          color: "#d1d5db",
          maxWidth: 480,
          margin: "0 auto",
          fontFamily: "'Courier New', Courier, monospace",
          opacity: pageVisible ? 1 : 0,
          transition: "opacity 0.5s ease-in",
          position: "relative",
        }}
      >
        {/* Scanline overlay */}
        <div style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 50,
          backgroundImage: "linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.055) 50%)",
          backgroundSize: "100% 3px",
        }} />

        {/* ── STICKY HEADER ── */}
        <nav style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "rgba(8,4,5,0.97)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(200,30,10,0.22)",
        }}>
          <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", gap: 10 }}>
            {/* Skull */}
            <span style={{ fontSize: 15, lineHeight: 1, userSelect: "none" }}>💀</span>

            {/* Title */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#fff",
                fontFamily: "'Barlow Condensed', sans-serif",
                lineHeight: 1,
              }}>
                FUSEDCORP // BLACKSITE ARCHIVE
              </div>
            </div>

            {/* Icons */}
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(209,213,219,0.6)", fontSize: 14, padding: 0, lineHeight: 1 }}>
                🔍
              </button>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(209,213,219,0.6)", fontSize: 14, padding: 0, lineHeight: 1 }}>
                🛍
              </button>
            </div>
          </div>

          {/* Sub-header */}
          <div style={{
            padding: "4px 14px 8px",
            textAlign: "center",
            fontSize: 7,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "rgba(209,213,219,0.28)",
            borderTop: "1px solid rgba(255,255,255,0.04)",
          }}>
            INTERNAL ACCESS NODE
          </div>
        </nav>

        {/* STATUS BAR */}
        <div style={{
          background: "rgba(200,30,10,0.1)",
          borderBottom: "1px solid rgba(200,30,10,0.28)",
          padding: "6px 14px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          <span style={{
            fontSize: 8,
            fontWeight: 900,
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color: "#e63320",
          }}>
            ◆ STATUS: CLASSIFIED
          </span>
        </div>

        {/* ── HERO IMAGE ── */}
        <div style={{ position: "relative", height: 230, overflow: "hidden", background: "#040208" }}>
          <img
            src="/archive-backgrounds/bg-1.jpg"
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              filter: "contrast(1.2) saturate(0.45) brightness(0.55)",
            }}
            onError={e => { e.currentTarget.style.display = "none"; }}
          />
          {/* Gradient overlays */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(10,6,8,0.35) 0%, rgba(10,6,8,0.0) 35%, rgba(10,6,8,0.85) 100%)",
          }} />
          {/* Top-left label */}
          <div style={{
            position: "absolute",
            top: 12,
            left: 14,
            fontSize: 7,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(200,30,10,0.5)",
          }}>
            BLACKSITE VISUAL LOG
          </div>
          {/* Bottom entity count */}
          <div style={{
            position: "absolute",
            bottom: 14,
            left: 14,
            right: 14,
          }}>
            <div style={{
              fontSize: 8,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(209,213,219,0.35)",
            }}>
              {ALL_SUBJECTS.length} ENTITIES CATALOGUED // ACCESS GRANTED
            </div>
          </div>
        </div>

        {/* ── ORIGIN SECTIONS ── */}
        <div>
          {ORIGINS.map(origin => (
            <OriginRow
              key={origin.key}
              origin={origin}
              subjects={subjectsByOrigin(origin.key)}
              expanded={expanded === origin.key}
              onToggle={() => toggleOrigin(origin.key)}
            />
          ))}
        </div>

        {/* ── FOOTER ── */}
        <footer style={{ padding: "22px 14px 28px", borderTop: "1px solid rgba(200,30,10,0.12)" }}>
          {/* Social icons */}
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 20 }}>
            {/* TikTok */}
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0, opacity: 0.45 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.74a4.85 4.85 0 01-1.01-.05z" fill="#d1d5db"/>
              </svg>
            </button>
            {/* Instagram */}
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0, opacity: 0.45 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="#d1d5db" strokeWidth="2" fill="none"/>
                <circle cx="12" cy="12" r="4" stroke="#d1d5db" strokeWidth="2" fill="none"/>
                <circle cx="17.5" cy="6.5" r="1.5" fill="#d1d5db"/>
              </svg>
            </button>
          </div>

          {/* EXIT SYSTEM */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
            <button
              onClick={() => router.push("/")}
              style={{
                background: "none",
                border: "1px solid rgba(200,30,10,0.5)",
                color: "#e63320",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                padding: "10px 32px",
                cursor: "pointer",
                transition: "border-color 0.2s, background 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(200,30,10,0.08)"; e.currentTarget.style.borderColor = "rgba(200,30,10,0.8)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "rgba(200,30,10,0.5)"; }}
            >
              EXIT SYSTEM
            </button>
          </div>

          <div style={{ textAlign: "center" }}>
            <p style={{
              fontSize: 7,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(209,213,219,0.12)",
            }}>
              FUSEDCORP // ALL DATA CLASSIFIED ABOVE CLEARANCE LEVEL 4
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
