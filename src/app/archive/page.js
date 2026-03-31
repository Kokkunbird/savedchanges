"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  ArrowLeft,
  FolderOpen,
  X,
  AlertCircle,
  Skull,
  Eye,
  MapPin,
  Clock
} from 'lucide-react';

// --- DATA ---
const SPECIMEN_DATA = [
  {
    id: "099-SC",
    codename: "THE PORCELAIN PHANTOM",
    specimen: "UNKNOWN / UNCLASSIFIED",
    status: "DE-INITIALIZED",
    acquired: "2026.03.25",
    location: "SECTOR 7 — ABANDONED TEXTILE DISTRICT",
    image: "/IMG_2255.JPG",
    maskDescription: "A seamless white porcelain face, no visible joints. Surface temperature 2°C below ambient at all times.",
    backstory: `Subject was first observed at the intersection of Rue Mortel and Canal Blanc in 2019. Witnesses described a figure moving between sodium-vapor lights — always at the edge of visibility, never caught directly in frame. Local surveillance recorded 47 separate anomalies across a 14-month window.\n\nField agents recovered the mask at the textile district after a controlled de-initialization procedure lasting 11 hours. The subject's pulse had synchronized with the porcelain surface during acquisition — a phenomenon with no clinical precedent. Identity overwrite confirmed successful. No residual biological signature detected post-extraction.\n\nNotable: The mask retains a faint impression of the original face geometry. Analysis ongoing.`,
    tags: ["ORGANIC BOND", "THERMAL ANOMALY", "IDENTITY WIPE"],
    threat: "CLASS III",
    report: "Subject's pulse synced to porcelain. Identity overwrite successful."
  },
  {
    id: "102-SC",
    codename: "NEURAL_SENTINEL",
    specimen: "MALE / EST. 34–40 YRS",
    status: "LINKED",
    acquired: "2026.02.10",
    location: "SUBLEVEL 9 — RESEARCH ANNEX OMEGA",
    image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=500",
    maskDescription: "Articulated carbon-fiber lattice, self-adjusting to wearer geometry. Seams glow faintly under UV.",
    backstory: `Originally recruited as a neural interface test subject under the ECHOMIND initiative in 2021. The subject demonstrated an unexpected ability to retain stored memory fragments from previous wearers — a side effect that was suppressed in all prior trials.\n\nAfter 14 months of observation, the subject voluntarily underwent full biometric purge — erasing all traceable DNA markers from the public registry. The mask was recovered during a routine sweep of the Research Annex after the subject failed to report for scheduled recalibration.\n\nAll original biological data has been expunged. The mask now exhibits low-level autonomous response to external stimuli, suggesting residual neural imprinting from the host. Classification LINKED pending final review.`,
    tags: ["NEURAL IMPRINT", "BIOMETRIC PURGE", "AUTONOMOUS RESPONSE"],
    threat: "CLASS IV",
    report: "Biometric data purged. No original DNA traces remain."
  },
  {
    id: "117-SC",
    codename: "THE VERDIGRIS WIDOW",
    specimen: "FEMALE / EXACT AGE UNKNOWN",
    status: "ACTIVE — UNCONTAINED",
    acquired: "2025.11.03",
    location: "COASTAL FACILITY BRAVO — RETRIEVED FROM SEA FLOOR",
    image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?q=80&w=500",
    maskDescription: "Oxidized copper plate, formed in a single press. Surface pitting suggests submersion of 30+ years. Occasionally emits low-frequency resonance at 18 Hz.",
    backstory: `The mask was located aboard a sunken research vessel, the VSS Mireille, which disappeared during a classified deep-water retrieval operation in 1991. Recovered by drone at 340 meters depth. The specimen's identity was established via partial dental record cross-reference — a match to a marine biologist who was listed as lost at sea.\n\nMost disturbing: the subject was photographed at a harbour market in 2023 — 32 years after disappearance. The photograph shows the mask worn openly, in daylight, among civilians. Three individuals in proximity reported total memory loss for the duration of the encounter.\n\nSubject remains uncontained. All field agents are advised not to approach alone.`,
    tags: ["TEMPORAL ANOMALY", "MEMORY DISRUPTION", "UNCONTAINED"],
    threat: "CLASS V — CRITICAL",
    report: "Subject photographed 32 years post-disappearance. Memory disruption field confirmed."
  },
  {
    id: "088-SC",
    codename: "THE CARTOGRAPHER",
    specimen: "MALE / EST. 50–60 YRS",
    status: "ARCHIVED",
    acquired: "2024.07.18",
    location: "EASTERN VAULT — CORRIDOR 4",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=500",
    maskDescription: "Hammered iron with inlaid silver lines forming topographic contours. Contours do not correspond to any known geography.",
    backstory: `Subject was a cartographer for an unnamed state agency. Over 22 years, he submitted hundreds of maps — all of them accurate, all of them unremarkable. Then, in 2018, he submitted a final map: an impossibly detailed rendering of a landmass no satellite had ever recorded.\n\nThe agency flagged the submission. A retrieval team was dispatched within 72 hours. They found the cartographer at his drafting table, mask already formed across his face as if grown there, surrounded by thousands of hand-drawn sheets depicting the same coastline from every conceivable angle.\n\nHe did not resist acquisition. He said only: "You'll need these eventually."\n\nThe silver contours on the mask shift position by approximately 0.3 mm every 72 hours. Analysis of the movement suggests a pattern consistent with tidal cycles — on a body of water that does not exist.`,
    tags: ["UNKNOWN GEOGRAPHY", "MASK FORMATION EVENT", "CARTOGRAPHIC ANOMALY"],
    threat: "CLASS II",
    report: "Mask appeared to form organically. Silver contours show autonomous micro-movement."
  },
  {
    id: "131-SC",
    codename: "ECHO CHILD",
    specimen: "JUVENILE / AGE 11–13 (EST.)",
    status: "RESTRICTED — DIRECTOR CLEARANCE ONLY",
    acquired: "2026.01.09",
    location: "NORTHERN FACILITY — WARD C",
    image: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=500",
    maskDescription: "Thin resin, hand-painted with watercolour pigment. Depicts a smiling face. Anomalous: the smile changes expression subtly between observations.",
    backstory: `The subject was first reported by school officials in a rural district — a child who had arrived mid-semester with no enrollment records, no guardians, and no documentation of any kind. Teachers described the child as quiet, remarkably observant, and prone to repeating the last sentence spoken to them — often hours later, word for word, in the original speaker's voice.\n\nThe mask was discovered when a school nurse attempted a routine health screening. The child did not remove the mask. Medical imaging confirmed no face beneath — only clean anatomical structure with no epidermal layer.\n\nAcquisition required a full psychoacoustic suppression team. The child's "echoing" accelerated to include full conversations from people who had never been in the room. Ward C has been on acoustic lockdown since arrival.\n\nThis file is not to be discussed outside of Director-level briefings.`,
    tags: ["PSYCHOACOUSTIC", "NO EPIDERMAL LAYER", "RESTRICTED — LEVEL 9"],
    threat: "CLASS V — UNCLASSIFIED MECHANISM",
    report: "No biological face layer detected. Echo phenomenon ongoing. Ward locked down."
  },
  {
    id: "055-SC",
    codename: "SAINT LACUNA",
    specimen: "INDETERMINATE",
    status: "DECOMMISSIONED",
    acquired: "2023.04.30",
    location: "CHAPEL ANNEX — BELOW THE ARCHIVE",
    image: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=500",
    maskDescription: "Gold-leaf over carved bone. Provenance: pre-modern, exact era disputed. Tears appear to be genuine crystallized salt, renewed periodically.",
    backstory: `The oldest specimen in the archive. Provenance records are incomplete — the earliest documentation dates to 1887, when it was catalogued as a religious relic at a private estate in the Carpathian Basin. It passed through at least six hands before reaching the agency in 2023, each prior owner having died within a year of acquisition — all of natural causes, all in a posture of sleep, all with an expression described by coroners as "profound relief."\n\nThe identity of the original specimen is entirely unknown. Bone analysis suggests the carved substrate is human — but from an individual whose skeletal structure falls outside any recorded anthropological category.\n\nThe mask weeps. Salt crystals form at the eye apertures every 19 days, regardless of environmental humidity. The chapel annex was constructed specifically to house it after it began to audibly hum during the winter solstice of 2023.\n\nDecommissioned status is nominal. No one has formally approved removal.`,
    tags: ["PRE-MODERN ORIGIN", "AUTONOMOUS WEEPING", "INDETERMINATE SPECIMEN"],
    threat: "CLASS I — PASSIVE / UNVERIFIED",
    report: "Oldest specimen on record. Original host identity unresolved. Periodic auditory event confirmed."
  }
];

// --- STATUS COLOR ---
function statusStyle(status) {
  if (status.includes("ACTIVE") || status.includes("UNCONTAINED")) return { color: "#ef4444", bg: "rgba(239,68,68,0.1)" };
  if (status.includes("LINKED")) return { color: "#3b82f6", bg: "rgba(59,130,246,0.1)" };
  if (status.includes("RESTRICTED")) return { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" };
  if (status.includes("ARCHIVED") || status.includes("DECOMMISSIONED")) return { color: "#6b7280", bg: "rgba(107,114,128,0.1)" };
  return { color: "#22c55e", bg: "rgba(34,197,94,0.1)" };
}

// --- MODAL ---
function CaseFile({ subject, onClose }) {
  const sc = statusStyle(subject.status);
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 999,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
        background: "rgba(0,0,0,0.95)",
        backdropFilter: "blur(8px)"
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ duration: 0.25 }}
        style={{
          width: "100%", maxWidth: "780px",
          background: "#080808",
          border: "1px solid #1d4ed8",
          boxShadow: "0 0 60px rgba(29,78,216,0.25), inset 0 0 60px rgba(0,0,0,0.6)",
          fontFamily: "'Courier New', monospace",
          maxHeight: "90vh",
          overflowY: "auto"
        }}
      >
        {/* Header bar */}
        <div style={{
          background: "#1d4ed8", padding: "8px 16px",
          display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <span style={{ color: "#000", fontSize: 10, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase" }}>
            <AlertCircle size={12} style={{ display: "inline", marginRight: 6 }} />
            RESTRICTED FILE // {subject.id} // {subject.threat}
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#000" }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Left col */}
          <div>
            <img
              src={subject.image}
              alt="Specimen mask"
              style={{ width: "100%", aspectRatio: "1", objectFit: "cover", filter: "grayscale(1) contrast(1.2)", border: "1px solid #1e3a8a" }}
            />
            <div style={{ marginTop: 12, padding: "12px", background: "#0a0a0a", border: "1px solid #1e3a8a" }}>
              <p style={{ fontSize: 9, color: "#1d4ed8", fontWeight: 900, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>MASK DESCRIPTION</p>
              <p style={{ fontSize: 11, color: "#93c5fd", lineHeight: 1.7 }}>{subject.maskDescription}</p>
            </div>
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {subject.tags.map(t => (
                <span key={t} style={{
                  fontSize: 9, padding: "3px 8px",
                  border: "1px solid #1e3a8a", color: "#3b82f6",
                  textTransform: "uppercase", letterSpacing: 1
                }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Right col */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <p style={{ fontSize: 9, color: "#1d4ed8", fontWeight: 900, textTransform: "uppercase", letterSpacing: 2 }}>CODENAME</p>
              <h2 style={{ fontSize: 22, fontWeight: 900, fontStyle: "italic", color: "#fff", lineHeight: 1.1, marginTop: 4 }}>{subject.codename}</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { label: "SPECIMEN", val: subject.specimen },
                { label: "STATUS", val: subject.status, style: { color: sc.color } },
                { label: "DATE ACQUIRED", val: subject.acquired },
                { label: "THREAT LEVEL", val: subject.threat },
              ].map(f => (
                <div key={f.label} style={{ padding: "8px", background: "#0a0a0a", border: "1px solid #1e3a8a14" }}>
                  <p style={{ fontSize: 8, color: "#1e3a8a", fontWeight: 900, letterSpacing: 2, marginBottom: 2 }}>{f.label}</p>
                  <p style={{ fontSize: 10, color: "#93c5fd", fontWeight: 700, ...(f.style || {}) }}>{val => val}{f.val}</p>
                </div>
              ))}
            </div>

            <div style={{ padding: "10px 12px", background: "#0a0a0a", border: "1px solid #1e3a8a", display: "flex", gap: 8, alignItems: "flex-start" }}>
              <MapPin size={10} style={{ color: "#1d4ed8", flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 10, color: "#60a5fa", letterSpacing: 1, textTransform: "uppercase" }}>{subject.location}</p>
            </div>

            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 9, color: "#1d4ed8", fontWeight: 900, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>
                ACQUISITION RECORD
              </p>
              <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.9, whiteSpace: "pre-wrap", maxHeight: 220, overflowY: "auto", paddingRight: 4 }}>
                {subject.backstory}
              </div>
            </div>

            <button style={{
              width: "100%", background: "#1d4ed8", color: "#000",
              padding: "12px", fontSize: 10, fontWeight: 900,
              textTransform: "uppercase", letterSpacing: 3,
              border: "none", cursor: "pointer", fontFamily: "'Courier New', monospace"
            }}
              onMouseEnter={e => e.target.style.background = "#fff"}
              onMouseLeave={e => e.target.style.background = "#1d4ed8"}
            >
              [DOWNLOAD_FULL_DOSSIER]
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- MAIN ---
export default function ArchivePage() {
  const router = useRouter();
  const [activeSubject, setActiveSubject] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
    }, 7000);
    return () => clearInterval(t);
  }, []);

  const statuses = ["ALL", "ACTIVE — UNCONTAINED", "LINKED", "DE-INITIALIZED", "ARCHIVED", "RESTRICTED — DIRECTOR CLEARANCE ONLY", "DECOMMISSIONED"];
  const visible = filter === "ALL" ? SPECIMEN_DATA : SPECIMEN_DATA.filter(s => s.status === filter);

  return (
    <main style={{
      minHeight: "100vh",
      background: "#000",
      color: "#3b82f6",
      fontFamily: "'Courier New', monospace",
      padding: "24px",
      position: "relative"
    }}>
      {/* Scanline overlay */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 50,
        backgroundImage: "linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.08) 50%)",
        backgroundSize: "100% 4px",
        opacity: 0.4
      }} />

      {/* Glitch flicker */}
      {glitch && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 60, pointerEvents: "none",
          background: "rgba(29,78,216,0.04)",
          animation: "none"
        }} />
      )}

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 10 }}>

        {/* Header */}
        <header style={{ marginBottom: 48, borderBottom: "1px solid #1e3a8a30", paddingBottom: 32 }}>
          <button
            onClick={() => router.back()}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 10, fontWeight: 900, color: "#1e3a8a",
              fontFamily: "'Courier New', monospace",
              textTransform: "uppercase", letterSpacing: 3,
              display: "flex", alignItems: "center", gap: 8, marginBottom: 20
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#fff"}
            onMouseLeave={e => e.currentTarget.style.color = "#1e3a8a"}
          >
            <ArrowLeft size={12} /> [BACK_TO_SYSTEM]
          </button>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ fontSize: 9, color: "#1e3a8a", letterSpacing: 4, textTransform: "uppercase", marginBottom: 8 }}>
                CLASSIFIED — SPECIMEN ACQUISITION ARCHIVE
              </p>
              <h1 style={{
                fontSize: "clamp(36px, 8vw, 72px)", fontWeight: 900,
                fontStyle: "italic", textTransform: "uppercase",
                color: "#fff", lineHeight: 1, display: "flex", alignItems: "center", gap: 16
              }}>
                <Database color="#1d4ed8" size={48} />
                MASK ARCHIVE
              </h1>
              <p style={{ fontSize: 10, color: "#1e3a8a", marginTop: 8, letterSpacing: 2 }}>
                {SPECIMEN_DATA.length} SPECIMENS CATALOGUED // ACCESS LEVEL: RESTRICTED
              </p>
            </div>

            {/* Filter */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["ALL", "ACTIVE — UNCONTAINED", "LINKED", "DE-INITIALIZED", "ARCHIVED", "DECOMMISSIONED"].map(f => {
                const sc = f === "ALL" ? { color: "#3b82f6" } : statusStyle(f);
                return (
                  <button key={f} onClick={() => setFilter(f)} style={{
                    fontSize: 8, padding: "4px 10px",
                    border: `1px solid ${filter === f ? sc.color : "#1e3a8a40"}`,
                    background: filter === f ? sc.bg || "rgba(59,130,246,0.1)" : "transparent",
                    color: filter === f ? sc.color : "#1e3a8a",
                    cursor: "pointer", textTransform: "uppercase", letterSpacing: 2,
                    fontFamily: "'Courier New', monospace",
                    transition: "all 0.15s"
                  }}>
                    {f === "ACTIVE — UNCONTAINED" ? "UNCONTAINED" : f}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 24
        }}>
          {visible.map((item, i) => {
            const sc = statusStyle(item.status);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                style={{
                  border: "1px solid #1e3a8a30",
                  background: "#050505",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "border-color 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#1d4ed8"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#1e3a8a30"}
              >
                {/* Image */}
                <div style={{ aspectRatio: "1", overflow: "hidden", position: "relative" }}>
                  <img
                    src={item.image}
                    alt="mask"
                    style={{
                      width: "100%", height: "100%", objectFit: "cover",
                      filter: "grayscale(1) contrast(1.2)",
                      opacity: 0.35,
                      transition: "opacity 0.3s, filter 0.3s"
                    }}
                    onMouseEnter={e => { e.target.style.opacity = 1; e.target.style.filter = "grayscale(0) contrast(1.1)"; }}
                    onMouseLeave={e => { e.target.style.opacity = 0.35; e.target.style.filter = "grayscale(1) contrast(1.2)"; }}
                  />
                  <div style={{
                    position: "absolute", top: 10, right: 10,
                    background: sc.bg, border: `1px solid ${sc.color}`,
                    padding: "3px 8px", fontSize: 8, color: sc.color,
                    fontWeight: 900, letterSpacing: 2, textTransform: "uppercase"
                  }}>
                    {item.status.split(" —")[0]}
                  </div>
                  <div style={{
                    position: "absolute", bottom: 10, left: 10,
                    fontSize: 9, color: "#1e3a8a", fontWeight: 900, letterSpacing: 2
                  }}>
                    ID: {item.id}
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <Skull size={10} color="#1e3a8a" />
                    <span style={{ fontSize: 9, color: "#1e3a8a", textTransform: "uppercase", letterSpacing: 2 }}>
                      {item.specimen}
                    </span>
                  </div>
                  <h3 style={{
                    fontSize: 16, fontWeight: 900, color: "#fff",
                    fontStyle: "italic", textTransform: "uppercase",
                    marginBottom: 8, lineHeight: 1.2
                  }}>
                    {item.codename}
                  </h3>
                  <p style={{ fontSize: 10, color: "#374151", lineHeight: 1.6, marginBottom: 16 }}>
                    {item.report}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                    <Clock size={9} color="#1e3a8a" />
                    <span style={{ fontSize: 9, color: "#1e3a8a", letterSpacing: 1 }}>{item.acquired}</span>
                    <Eye size={9} color="#1e3a8a" style={{ marginLeft: 8 }} />
                    <span style={{ fontSize: 9, color: sc.color, letterSpacing: 1 }}>{item.threat}</span>
                  </div>

                  <button
                    onClick={() => setActiveSubject(item)}
                    style={{
                      width: "100%",
                      border: "1px solid #1d4ed880",
                      padding: "12px",
                      fontSize: 9, fontWeight: 900,
                      textTransform: "uppercase", letterSpacing: 3,
                      color: "#1d4ed8", background: "transparent",
                      cursor: "pointer", fontFamily: "'Courier New', monospace",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      transition: "all 0.15s"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#1d4ed8"; e.currentTarget.style.color = "#000"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1d4ed8"; }}
                  >
                    <FolderOpen size={12} /> [EXTRACT_METADATA]
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <footer style={{ marginTop: 64, borderTop: "1px solid #1e3a8a20", paddingTop: 24 }}>
          <p style={{ fontSize: 8, color: "#1e3a8a", textTransform: "uppercase", letterSpacing: 3, textAlign: "center" }}>
            SPECIMEN ARCHIVE // ALL DATA CLASSIFIED ABOVE CLEARANCE LEVEL 4 // UNAUTHORIZED ACCESS IS A PROTOCOL VIOLATION
          </p>
        </footer>
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