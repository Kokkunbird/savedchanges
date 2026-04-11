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

// ─── LIGHTBOX ─────────────────────────────────────────────────────────────────
function Lightbox({ src, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "rgba(0,0,0,0.94)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16,
    }}>
      <img src={src} alt="" onClick={e => e.stopPropagation()} style={{
        maxWidth: "100%", maxHeight: "88vh", objectFit: "contain", display: "block",
      }} />
      <button onClick={onClose} style={{
        position: "absolute", top: 14, right: 14,
        background: "none", border: "1px solid rgba(200,30,10,0.5)",
        color: "#e63320", fontSize: 9, letterSpacing: "0.3em",
        textTransform: "uppercase", padding: "5px 12px", cursor: "pointer",
        fontFamily: "'Courier New', monospace",
      }}>✕ CLOSE</button>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function SubjectDossierPage() {
  const router = useRouter();
  const params = useParams();
  const [glitch, setGlitch] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  const subject = ALL_SUBJECTS.find(s => s.slug === params.id);

  useEffect(() => {
    const t = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 130);
    }, 6500);
    return () => clearInterval(t);
  }, []);

  if (!subject) {
    return (
      <main style={{ minHeight: "100vh", background: "#0a0608", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Courier New', monospace", gap: 14 }}>
        <div style={{ fontSize: 8, letterSpacing: "0.4em", color: "rgba(200,30,10,0.5)", textTransform: "uppercase" }}>FILE NOT FOUND</div>
        <button onClick={() => router.push("/archive")} style={{ background: "none", border: "1px solid rgba(200,30,10,0.4)", color: "#e63320", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", padding: "8px 22px", cursor: "pointer" }}>
          ← BACK
        </button>
      </main>
    );
  }

  const sc = statusColor(subject.status);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Barlow:wght@400&display=swap');
        * { box-sizing: border-box; }

        @keyframes pg { 0%,100%{transform:none;filter:none} 15%{transform:translateX(-3px);filter:hue-rotate(25deg)} 30%{transform:translateX(3px)} 45%{transform:none} }
        .pg { animation: pg 0.22s steps(1) forwards; }

        .sl {
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #f59e0b;
          margin-bottom: 4px;
          display: block;
          font-family: 'Courier New', monospace;
        }

        .ent {
          font-size: 7px;
          color: rgba(209,213,219,0.72);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 3px;
          padding-left: 6px;
          border-left: 1px solid rgba(200,30,10,0.28);
          line-height: 1.45;
          font-family: 'Courier New', monospace;
        }

        .br { height: 1px; background: rgba(200,30,10,0.14); margin: 6px 0; }

        .click-photo {
          display: block;
          width: 100%;
          cursor: pointer;
          transition: filter 0.15s ease;
        }
        .click-photo:hover { filter: brightness(1.15) !important; }
      `}</style>

      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}

      <main className={glitch ? "pg" : ""} style={{
        minHeight: "100vh",
        background: "#0a0608",
        maxWidth: 480,
        margin: "0 auto",
        fontFamily: "'Courier New', Courier, monospace",
        color: "#d1d5db",
        position: "relative",
      }}>
        {/* Scanlines */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 50, backgroundImage: "linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.05) 50%)", backgroundSize: "100% 3px" }} />

        {/* ── HEADER ── */}
        <div style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(8,4,5,0.98)", backdropFilter: "blur(8px)" }}>
          {/* Status bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 11px", background: "rgba(200,30,10,0.1)", borderBottom: "1px solid rgba(200,30,10,0.2)" }}>
            <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: "0.3em", textTransform: "uppercase", color: "#e63320" }}>◆ STATUS : CLASSIFIED</span>
            <div style={{ display: "flex", gap: 12 }}>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(209,213,219,0.5)", fontSize: 13, padding: 0, lineHeight: 1 }}>🔍</button>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(209,213,219,0.5)", fontSize: 13, padding: 0, lineHeight: 1 }}>🛍</button>
            </div>
          </div>
          {/* Origin */}
          <div style={{ padding: "5px 11px", borderBottom: "1px solid rgba(200,30,10,0.14)" }}>
            <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(209,213,219,0.55)", fontFamily: "'Barlow Condensed', sans-serif" }}>
              {ORIGIN_FULL[subject.origin]}
            </span>
          </div>
        </div>

        {/* ── DOSSIER BODY ── */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(200,30,10,0.18)" }}>

          {/* ══ LEFT COLUMN (43%) ══ */}
          <div style={{ width: "43%", flexShrink: 0, borderRight: "1px solid rgba(200,30,10,0.18)", display: "flex", flexDirection: "column" }}>

            {/* Sighting label + photo */}
            {subject.sightingPhoto && (
              <>
                <div style={{ padding: "5px 7px 3px" }}>
                  <span style={{ fontSize: 6.5, fontStyle: "italic", color: "rgba(209,213,219,0.38)", letterSpacing: "0.04em", fontFamily: "'Barlow', sans-serif" }}>
                    {subject.sightingLabel}
                  </span>
                </div>
                <img
                  className="click-photo"
                  src={subject.sightingPhoto}
                  alt="sighting"
                  style={{ filter: "contrast(1.08) saturate(0.7)" }}
                  onClick={() => setLightbox(subject.sightingPhoto)}
                />
              </>
            )}

            {/* Main subject photo (shown here if NO sighting photo) */}
            {!subject.sightingPhoto && subject.photo && (
              <img
                className="click-photo"
                src={subject.photo}
                alt={subject.alias}
                style={{ filter: "contrast(1.08) saturate(0.72)" }}
                onClick={() => setLightbox(subject.photo)}
              />
            )}

            {/* No photo fallback */}
            {!subject.sightingPhoto && !subject.photo && (
              <div style={{ height: 140, background: "#0d0a0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 8, color: "rgba(200,30,10,0.18)", letterSpacing: "0.3em", textTransform: "uppercase" }}>NO VISUAL</span>
              </div>
            )}

            {/* Classification */}
            <div style={{ padding: "7px 7px 5px", borderTop: "1px solid rgba(200,30,10,0.14)" }}>
              <span className="sl">SUBJECT CLASSIFICATION</span>
              <div style={{ fontSize: 7, color: "rgba(209,213,219,0.45)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{subject.type}</div>
              <div style={{ fontSize: 7, color: "rgba(209,213,219,0.6)", textTransform: "uppercase", letterSpacing: "0.04em", lineHeight: 1.4, marginBottom: 4 }}>{subject.classification}</div>
              <div style={{ fontSize: 6.5, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>ALIAS: {subject.alias}</div>
              <div style={{ fontSize: 6, color: "rgba(209,213,219,0.25)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{subject.caseRef}</div>
            </div>

            {/* Biological profile */}
            <div style={{ padding: "6px 7px", borderTop: "1px solid rgba(200,30,10,0.14)" }}>
              <span className="sl">BIOLOGICAL PROFILE</span>
              {[["HEIGHT", subject.bio.height], ["WEIGHT", subject.bio.weight], ["BUILD", subject.bio.build], ["EYES", subject.bio.eyes]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", gap: 4, marginBottom: 3 }}>
                  <span style={{ fontSize: 6.5, color: "rgba(209,213,219,0.32)", textTransform: "uppercase", letterSpacing: "0.09em", minWidth: 34, flexShrink: 0, fontFamily: "'Courier New', monospace" }}>{l}:</span>
                  <span style={{ fontSize: 6.5, color: "rgba(209,213,219,0.78)", textTransform: "uppercase", letterSpacing: "0.04em", fontFamily: "'Courier New', monospace" }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Secondary subject photo — if sighting photo was shown above, put portrait here */}
            {subject.sightingPhoto && subject.photo && (
              <div style={{ borderTop: "1px solid rgba(200,30,10,0.14)", marginTop: "auto" }}>
                <img
                  className="click-photo"
                  src={subject.photo}
                  alt={subject.name}
                  style={{ filter: "contrast(1.1) saturate(0.65)" }}
                  onClick={() => setLightbox(subject.photo)}
                />
              </div>
            )}
          </div>

          {/* ══ RIGHT COLUMN ══ */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

            {/* Panel (criminal record / achievements / etc.) */}
            <div style={{ padding: "7px 8px", borderBottom: "1px solid rgba(200,30,10,0.14)" }}>
              <span className="sl">{subject.panel.title}</span>
              <div style={{ fontSize: 6.5, color: sc, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 5 }}>STATUS: {subject.panelStatus}</div>
              {subject.panel.entries.map(e => <div key={e} className="ent">{e}</div>)}
            </div>

            {/* Secondary / police dept photo */}
            {subject.secondaryPhoto && (
              <div style={{ borderBottom: "1px solid rgba(200,30,10,0.14)" }}>
                {subject.secondaryPhotoLabel && (
                  <div style={{ padding: "4px 8px 2px", fontSize: 6.5, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(209,213,219,0.3)" }}>{subject.secondaryPhotoLabel}</div>
                )}
                <img
                  className="click-photo"
                  src={subject.secondaryPhoto}
                  alt="secondary"
                  style={{ filter: "contrast(1.08) saturate(0.65)" }}
                  onClick={() => setLightbox(subject.secondaryPhoto)}
                />
              </div>
            )}

            {/* Threat level */}
            <div style={{ padding: "7px 8px", borderBottom: "1px solid rgba(200,30,10,0.14)" }}>
              <span className="sl">THREAT LEVEL :</span>
              <div style={{
                fontSize: 44, fontWeight: 900,
                fontFamily: "'Barlow Condensed', sans-serif",
                color: "#e63320", lineHeight: 1, letterSpacing: "0.04em",
                textShadow: "0 0 18px rgba(230,51,32,0.4)",
              }}>{subject.threatLevel}</div>
            </div>

            {/* Condition notes */}
            <div style={{ padding: "7px 8px", borderBottom: "1px solid rgba(200,30,10,0.14)" }}>
              <span className="sl">CONDITION NOTES:</span>
              {subject.conditions.map(c => <div key={c} className="ent">{c}</div>)}
            </div>

            {/* Psychological */}
            <div style={{ padding: "7px 8px", borderBottom: "1px solid rgba(200,30,10,0.14)" }}>
              <span className="sl">PSYCHOLOGICAL STATE:</span>
              {subject.psych.map(p => <div key={p} className="ent">{p}</div>)}
            </div>

            {/* Abilities */}
            {subject.abilities && (
              <div style={{ padding: "7px 8px", borderBottom: "1px solid rgba(200,30,10,0.14)" }}>
                <span className="sl" style={{ color: "#a78bfa" }}>KNOWN ABILITIES:</span>
                {subject.abilities.map(a => (
                  <div key={a} style={{ fontSize: 7, color: "#c4b5fd", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 3, paddingLeft: 6, borderLeft: "1px solid rgba(167,139,250,0.3)", lineHeight: 1.45, fontFamily: "'Courier New', monospace" }}>▸ {a}</div>
                ))}
              </div>
            )}

            {/* Assessment */}
            {subject.assessment && (
              <div style={{ padding: "7px 8px", flex: 1 }}>
                <span className="sl">ASSESSMENT</span>
                <p style={{ fontSize: 7, color: "rgba(156,163,175,0.65)", lineHeight: 1.65, textTransform: "uppercase", letterSpacing: "0.03em", margin: 0 }}>{subject.assessment}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── BARCODE STRIP ── */}
        <div style={{ background: "#050305", borderBottom: "1px solid rgba(200,30,10,0.1)", padding: "7px 11px", display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ display: "flex", gap: 1.5, alignItems: "stretch", height: 20, flexShrink: 0 }}>
            {[2,1,3,1,2,1,1,2,3,1,2,1,1,3,2,1,2,1,2,1,1,3,1,2].map((w, i) => (
              <div key={i} style={{ width: w, background: i % 2 === 0 ? "rgba(209,213,219,0.5)" : "transparent" }} />
            ))}
          </div>
          <div>
            <div style={{ fontSize: 5.5, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(209,213,219,0.28)" }}>FUSEDCORP ARCHIVES // INTERNAL DATABASE</div>
            <div style={{ fontSize: 5, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(209,213,219,0.12)", marginTop: 2 }}>{subject.id} // CLEARANCE LVL 4</div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer style={{ padding: "11px 12px 26px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0, opacity: 0.38 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.74a4.85 4.85 0 01-1.01-.05z" fill="#d1d5db"/></svg>
            </button>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0, opacity: 0.38 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="#d1d5db" strokeWidth="2" fill="none"/><circle cx="12" cy="12" r="4" stroke="#d1d5db" strokeWidth="2" fill="none"/><circle cx="17.5" cy="6.5" r="1.5" fill="#d1d5db"/></svg>
            </button>
          </div>
          <button
            onClick={() => router.push("/archive")}
            style={{ background: "none", border: "1px solid rgba(200,30,10,0.5)", color: "#e63320", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", padding: "7px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
          >
            ← BACK
          </button>
        </footer>
      </main>
    </>
  );
}
