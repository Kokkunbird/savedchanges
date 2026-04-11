"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

// ─── CATEGORY SECTIONS ────────────────────────────────────────────────────────
const SECTIONS = [
  {
    name: "IDENTITIES",
    sub: "MASKS . COSTUME",
    path: "/shop/identities",
    img: "/categories/category-identities.jpg",
    fallback: "/story1.jpg",
    pos: "left center",
  },
  {
    name: "ARMORY",
    sub: "COSTUME . ARMOUR",
    path: "/shop/armory",
    img: "/categories/category-armory.jpg",
    fallback: "/story3.jpg",
    pos: "left center",
  },
  {
    name: "ARSENAL",
    sub: "KATANAS . PROPS",
    path: "/shop/arsenal",
    img: "/categories/category-arsenal.jpg",
    fallback: "/oni.jpg",
    pos: "left center",
  },
  {
    name: "ACCESSORIES",
    sub: "PENDANTS . EARRINGS . BRACELETS",
    path: "/shop/accessories",
    img: "/categories/category-accessories.jpg",
    fallback: "/story2.jpg",
    pos: "center center",
  },
  {
    name: "APPAREL",
    sub: "CLOTHING . GEAR",
    path: "/shop/apparel",
    img: "/categories/category-apparel.jpg",
    fallback: "/story4.jpg",
    pos: "left center",
  },
];

// ─── SMART IMAGE ──────────────────────────────────────────────────────────────
function SectionImage({ src, fallback, pos, alt }) {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={() => imgSrc !== fallback && setImgSrc(fallback)}
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        width: "58%",
        height: "100%",
        objectFit: "cover",
        objectPosition: pos,
        filter: "brightness(0.7) saturate(0.85)",
        transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)",
      }}
    />
  );
}

// ─── WELCOME SCREEN ───────────────────────────────────────────────────────────
function WelcomeScreen({ onDone }) {
  const [phase, setPhase] = useState("enter"); // enter → hold → exit
  const [glitchText, setGlitchText] = useState("WELCOME");
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#@%!?█▓░";
  const intervalRef = useRef(null);
  const target = "WELCOME";

  // Scramble effect on mount
  useEffect(() => {
    let frame = 0;
    const total = 22;
    intervalRef.current = setInterval(() => {
      if (frame >= total) {
        setGlitchText(target);
        clearInterval(intervalRef.current);
        return;
      }
      setGlitchText(
        target
          .split("")
          .map((c, i) =>
            i < Math.floor((frame / total) * target.length)
              ? c
              : CHARS[Math.floor(Math.random() * CHARS.length)]
          )
          .join("")
      );
      frame++;
    }, 55);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Phase timing
  useEffect(() => {
    const holdTimer = setTimeout(() => setPhase("exit"), 2200);
    const doneTimer = setTimeout(() => onDone(), 2800);
    return () => {
      clearTimeout(holdTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        opacity: phase === "exit" ? 0 : 1,
        transition: phase === "exit" ? "opacity 0.6s ease-in" : "opacity 0.3s ease-out",
      }}
    >
      {/* Scanline */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.1) 50%)",
          backgroundSize: "100% 3px",
          pointerEvents: "none",
        }}
      />

      {/* Red horizontal scan sweep */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 2,
          background:
            "linear-gradient(90deg, transparent, rgba(220,40,10,0.9), transparent)",
          animation: "nm-scan 1.8s ease-in-out forwards",
          top: 0,
        }}
      />

      {/* Corner brackets */}
      {[
        { top: 20, left: 20, borderTop: "1px solid #cc2200", borderLeft: "1px solid #cc2200" },
        { top: 20, right: 20, borderTop: "1px solid #cc2200", borderRight: "1px solid #cc2200" },
        { bottom: 20, left: 20, borderBottom: "1px solid #cc2200", borderLeft: "1px solid #cc2200" },
        { bottom: 20, right: 20, borderBottom: "1px solid #cc2200", borderRight: "1px solid #cc2200" },
      ].map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 24,
            height: 24,
            opacity: 0.7,
            animation: "nm-corners 0.4s ease-out forwards",
            animationDelay: `${i * 0.06}s`,
            ...s,
          }}
        />
      ))}

      {/* Label above */}
      <div
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 10,
          letterSpacing: "0.45em",
          textTransform: "uppercase",
          color: "rgba(220,40,10,0.7)",
          animation: "nm-fadein 0.5s ease-out 0.3s both",
        }}
      >
        SAVECHANGES FX // ACCESS GRANTED
      </div>

      {/* WELCOME */}
      <div
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: "clamp(64px, 20vw, 88px)",
          fontWeight: 900,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "#cc2200",
          lineHeight: 1,
          textShadow:
            "0 0 10px rgba(220,40,10,0.9), 0 0 30px rgba(220,40,10,0.4), 0 0 60px rgba(220,40,10,0.2)",
          animation: "nm-welcome 0.6s ease-out 0.1s both",
          position: "relative",
        }}
      >
        {glitchText}
        {/* Glitch slice 1 */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            color: "#ff6644",
            clipPath: "polygon(0 30%, 100% 30%, 100% 45%, 0 45%)",
            transform: "translateX(-3px)",
            animation: "nm-glitch1 3s infinite 1s",
            opacity: 0.6,
          }}
        >
          {glitchText}
        </span>
        {/* Glitch slice 2 */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            color: "#00ffcc",
            clipPath: "polygon(0 60%, 100% 60%, 100% 68%, 0 68%)",
            transform: "translateX(3px)",
            animation: "nm-glitch2 3s infinite 1.2s",
            opacity: 0.4,
          }}
        >
          {glitchText}
        </span>
      </div>

      {/* TO THE NIGHT MARKET */}
      <div
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 13,
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "rgba(220,200,200,0.55)",
          animation: "nm-fadein 0.5s ease-out 0.6s both",
        }}
      >
        TO THE NIGHT MARKET
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          width: 120,
          height: 1,
          background: "rgba(200,30,10,0.15)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "#cc2200",
            animation: "nm-progress 2.2s linear forwards",
          }}
        />
      </div>

      <style>{`
        @keyframes nm-scan {
          0%   { top: -2px; opacity: 0; }
          5%   { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes nm-corners {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 0.7; transform: scale(1); }
        }
        @keyframes nm-fadein {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes nm-welcome {
          0%   { opacity: 0; transform: scaleX(1.08) translateY(-4px); }
          60%  { opacity: 1; transform: scaleX(1); }
          100% { opacity: 1; transform: scaleX(1) translateY(0); }
        }
        @keyframes nm-glitch1 {
          0%, 92%, 100% { transform: translateX(-3px); opacity: 0.6; }
          93%            { transform: translateX(6px);  opacity: 0.8; }
          94%            { transform: translateX(-6px); opacity: 0.4; }
          95%            { transform: translateX(3px);  opacity: 0.6; }
        }
        @keyframes nm-glitch2 {
          0%, 90%, 100% { transform: translateX(3px);  opacity: 0.4; }
          91%            { transform: translateX(-8px); opacity: 0.7; }
          93%            { transform: translateX(5px);  opacity: 0.3; }
        }
        @keyframes nm-progress {
          from { width: 0; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}

// ─── SECTION CARD ─────────────────────────────────────────────────────────────
function SectionCard({ section, index, onNavigate }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onNavigate(section.path)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        height: 168,
        overflow: "hidden",
        borderTop: "1px solid rgba(200,30,10,0.25)",
        borderBottom: "1px solid rgba(200,30,10,0.25)",
        margin: "1px 0",
        background: "#0d0608",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        opacity: 0,
        transform: "translateY(10px)",
        animation: `nm-cardin 0.5s cubic-bezier(0.22,1,0.36,1) ${0.1 + index * 0.08}s forwards`,
      }}
    >
      {/* Image — right bleed */}
      <img
        src={section.img}
        alt={section.name}
        onError={(e) => { if (e.target.src !== section.fallback) e.target.src = section.fallback; }}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "58%",
          height: "100%",
          objectFit: "cover",
          objectPosition: section.pos,
          filter: "brightness(0.7) saturate(0.85)",
          transform: hovered ? "scale(1.05)" : "scale(1)",
          transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)",
        }}
      />

      {/* Gradient fade left */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, #0d0608 32%, rgba(13,6,8,0.82) 52%, rgba(13,6,8,0.25) 75%, transparent 100%)",
          zIndex: 1,
        }}
      />

      {/* Text */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "0 20px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          maxWidth: "58%",
        }}
      >
        {/* Skull icon */}
        <svg width="16" height="16" viewBox="0 0 100 100" fill="none" style={{ marginBottom: 4, opacity: 0.85 }}>
          <circle cx="50" cy="43" r="26" stroke="#cc2200" strokeWidth="5" />
          <circle cx="40" cy="41" r="6" fill="#cc2200" />
          <circle cx="60" cy="41" r="6" fill="#cc2200" />
          <rect x="36" y="62" width="8" height="11" rx="2" fill="#cc2200" opacity="0.85" />
          <rect x="56" y="62" width="8" height="11" rx="2" fill="#cc2200" opacity="0.85" />
        </svg>

        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 40,
            fontWeight: 900,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#fff",
            lineHeight: 0.9,
          }}
        >
          {section.name}
        </div>

        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#e63320",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {section.sub}
          <span
            style={{
              width: 22,
              height: 22,
              border: "1px solid #e63320",
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              fontSize: 10,
              flexShrink: 0,
            }}
          >
            →
          </span>
        </div>
      </div>

      <style>{`
        @keyframes nm-cardin {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── NIGHT MARKET PAGE ────────────────────────────────────────────────────────
export default function NightMarketPage() {
  const router = useRouter();
  const [welcomed, setWelcomed] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  function navigate(path) {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => router.push(path), 320);
  }

  return (
    <>
      {/* ── WELCOME ENTRY SCREEN ── */}
      {!welcomed && <WelcomeScreen onDone={() => setWelcomed(true)} />}

      {/* ── PAGE ── */}
      <main
        style={{
          minHeight: "100vh",
          background: "#0a0608",
          color: "#e8e0dc",
          maxWidth: 480,
          margin: "0 auto",
          fontFamily: "'Barlow Condensed', sans-serif",
          position: "relative",
          opacity: welcomed ? 1 : 0,
          transition: "opacity 0.4s ease-out",
          paddingBottom: 80,
        }}
      >
        {/* ── HEADER ── */}
        <header
          style={{
            borderBottom: "1px solid rgba(200,30,10,0.25)",
            padding: "14px 16px 12px",
            background: "rgba(8,4,5,0.95)",
            position: "sticky",
            top: 0,
            zIndex: 30,
            backdropFilter: "blur(6px)",
          }}
        >
          <div
            style={{
              fontSize: 9,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(200,30,10,0.7)",
              marginBottom: 4,
            }}
          >
            SAVECHANGES FX // LIMITED DROPS
          </div>
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 28,
              fontWeight: 900,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#fff",
              lineHeight: 1,
              textShadow:
                "0 0 8px rgba(220,40,10,0.8), 0 0 20px rgba(220,40,10,0.3)",
              animation: "nm-neon 4s ease-in-out infinite",
            }}
          >
            NIGHT MARKET
          </div>
        </header>

        {/* ── DIVIDER LABEL ── */}
        <div
          style={{
            padding: "12px 16px 8px",
            fontSize: 9,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "rgba(200,190,185,0.35)",
          }}
        >
          SELECT CATEGORY
        </div>

        {/* ── CATEGORY SECTIONS ── */}
        <div>
          {SECTIONS.map((section, i) => (
            <SectionCard
              key={section.name}
              section={section}
              index={i}
              onNavigate={navigate}
            />
          ))}
        </div>

        {/* ── TRANSITION OVERLAY ── */}
        {transitioning && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "#0a0608",
              zIndex: 100,
              opacity: transitioning ? 1 : 0,
              transition: "opacity 0.3s ease-in",
            }}
          />
        )}

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&display=swap');
          @keyframes nm-neon {
            0%,100% { text-shadow: 0 0 8px rgba(220,40,10,0.8), 0 0 20px rgba(220,40,10,0.3); }
            5%       { text-shadow: 0 0 4px rgba(220,40,10,0.5); opacity: 0.9; }
            6%       { text-shadow: 0 0 10px rgba(220,40,10,1), 0 0 25px rgba(220,40,10,0.5); opacity: 1; }
            50%      { text-shadow: 0 0 8px rgba(220,40,10,0.8), 0 0 20px rgba(220,40,10,0.3); }
            82%      { opacity: 1; }
            83%      { opacity: 0.6; text-shadow: none; }
            84%      { opacity: 1; text-shadow: 0 0 8px rgba(220,40,10,0.8); }
          }
        `}</style>
      </main>

      {/* ── EXIT BUTTON — fixed anchor ── */}
      {welcomed && (
        <button
          onClick={() => router.push("/")}
          style={{
            position: "fixed",
            bottom: 24,
            right: 16,
            zIndex: 50,
            background: "#0a0608",
            border: "1px solid rgba(200,30,10,0.6)",
            color: "#e63320",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            padding: "10px 16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 0 12px rgba(200,30,10,0.2)",
            transition: "background 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(200,30,10,0.15)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(200,30,10,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#0a0608";
            e.currentTarget.style.boxShadow = "0 0 12px rgba(200,30,10,0.2)";
          }}
        >
          <span style={{ fontSize: 14, lineHeight: 1 }}>✕</span>
          EXIT
        </button>
      )}
    </>
  );
}
