"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const MASKS = [
  { id: "01", name: "Phantom",  tag: "STEALTH SERIES",  desc: "Forged in obsidian resin. Worn by those who prefer silence." },
  { id: "02", name: "Revenant", tag: "HERITAGE SERIES", desc: "Lacquered cedar, hand-finished. A face from another century." },
  { id: "03", name: "Specter",  tag: "VOID SERIES",      desc: "Matte titanium alloy. The mask that wears the dark." },
];

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [activeMask, setActiveMask] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleEnter = () => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => router.push("/shop"), 600);
  };

  return (
    <main style={{ background: "#000", minHeight: "100vh", color: "#fff", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,300;1,700&family=DM+Sans:wght@300;400;500&display=swap');
        :root {
          --red: #c0392b;
          --red-glow: rgba(192,57,43,0.55);
          --red-dim: rgba(192,57,43,0.12);
          --glass: rgba(255,255,255,0.03);
          --glass-border: rgba(255,255,255,0.07);
          --ease: cubic-bezier(0.23,1,0.32,1);
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #000; overflow-x: hidden; }

        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; justify-content: space-between; align-items: center;
          padding: 22px 52px;
          background: rgba(0,0,0,0.65);
          border-bottom: 1px solid var(--glass-border);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          opacity: 0; transform: translateY(-12px);
          transition: opacity 0.9s var(--ease), transform 0.9s var(--ease);
          font-family: 'DM Sans', sans-serif;
        }
        .nav.on { opacity: 1; transform: translateY(0); }
        .nav-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px; font-weight: 600; letter-spacing: 0.2em;
          color: #fff; text-transform: uppercase;
        }
        .nav-logo span { color: var(--red); }
        .nav-links { display: flex; gap: 36px; align-items: center; }
        .nav-link {
          background: none; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 400; letter-spacing: 0.18em;
          color: rgba(255,255,255,0.4); text-transform: uppercase;
          transition: color 0.2s;
        }
        .nav-link:hover { color: #fff; }
        .nav-cta {
          background: var(--red); color: #fff; border: none;
          padding: 10px 26px; font-size: 11px; font-weight: 500;
          letter-spacing: 0.18em; text-transform: uppercase;
          cursor: pointer; border-radius: 2px;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s, box-shadow 0.25s;
        }
        .nav-cta:hover { background: #a93226; box-shadow: 0 0 24px var(--red-glow); }

        /* HERO */
        .hero {
          position: relative; height: 100vh;
          display: flex; align-items: flex-end;
          overflow: hidden;
        }
        .hero-img-wrap {
          position: absolute; inset: 0;
          display: flex; justify-content: flex-end;
        }
        .hero-img {
          height: 100%; width: 62%;
          object-fit: cover; object-position: center 10%;
          filter: brightness(0.9) saturate(1.15);
          mask-image: linear-gradient(to left, black 50%, transparent 100%);
          -webkit-mask-image: linear-gradient(to left, black 50%, transparent 100%);
        }
        .hero-ambient {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 55% 65% at 72% 35%, rgba(192,57,43,0.2) 0%, transparent 65%),
            linear-gradient(to right, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0) 100%);
        }
        .hero-scanline {
          position: absolute; inset: 0; pointer-events: none; z-index: 2;
          background: repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 4px);
        }
        .hero-bg-title {
          position: absolute; right: -20px; top: 50%;
          transform: translateY(-52%);
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(160px, 28vw, 340px);
          font-weight: 700; line-height: 0.85;
          color: transparent;
          -webkit-text-stroke: 1px rgba(192,57,43,0.08);
          text-transform: uppercase; pointer-events: none;
          user-select: none; letter-spacing: -0.04em;
        }
        .hero-content {
          position: relative; z-index: 10;
          padding: 0 52px 80px;
          max-width: 560px;
          opacity: 0; transform: translateY(28px);
          transition: opacity 1.1s var(--ease) 0.25s, transform 1.1s var(--ease) 0.25s;
          font-family: 'DM Sans', sans-serif;
        }
        .hero-content.on { opacity: 1; transform: translateY(0); }
        .hero-label {
          font-size: 10px; letter-spacing: 0.5em; text-transform: uppercase;
          color: var(--red); font-weight: 500; margin-bottom: 18px;
          display: flex; align-items: center; gap: 12px;
        }
        .hero-label::before { content: ''; display: block; width: 32px; height: 1px; background: var(--red); }
        .hero-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(56px, 8vw, 100px);
          font-weight: 700; line-height: 0.9;
          letter-spacing: -0.025em; margin-bottom: 26px;
        }
        .hero-h1 em { font-style: italic; color: var(--red); }
        .hero-sub {
          font-size: 13px; color: rgba(255,255,255,0.42);
          line-height: 1.8; max-width: 380px; margin-bottom: 40px; font-weight: 300;
        }
        .hero-btns { display: flex; gap: 14px; align-items: center; }
        .btn-p {
          background: var(--red); color: #fff; border: none;
          padding: 14px 34px; font-size: 11px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          cursor: pointer; border-radius: 2px;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s, box-shadow 0.25s;
        }
        .btn-p:hover { background: #a93226; box-shadow: 0 0 30px var(--red-glow); }
        .btn-o {
          background: none; border: 1px solid rgba(255,255,255,0.14);
          color: rgba(255,255,255,0.55); padding: 14px 34px;
          font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
          cursor: pointer; border-radius: 2px;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-o:hover { border-color: rgba(255,255,255,0.38); color: #fff; }

        /* Floating stats */
        .hero-stats {
          position: absolute; right: 52px; bottom: 80px; z-index: 10;
          display: flex; flex-direction: column; gap: 10px;
          opacity: 0; transform: translateX(20px);
          transition: opacity 1s var(--ease) 0.55s, transform 1s var(--ease) 0.55s;
        }
        .hero-stats.on { opacity: 1; transform: translateX(0); }
        .stat-card {
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border-radius: 6px; padding: 14px 20px; min-width: 155px;
        }
        .stat-val {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px; font-weight: 600; color: #fff; line-height: 1;
        }
        .stat-val span { color: var(--red); }
        .stat-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; color: rgba(255,255,255,0.3);
          letter-spacing: 0.15em; text-transform: uppercase; margin-top: 5px;
        }

        /* COLLECTION */
        .collection { padding: 100px 52px; position: relative; }
        .collection::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(to right, transparent, rgba(192,57,43,0.35), transparent);
        }
        .section-header {
          display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 52px;
        }
        .section-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; letter-spacing: 0.4em; text-transform: uppercase;
          color: var(--red); margin-bottom: 10px;
        }
        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 4vw, 54px); font-weight: 600; line-height: 1.02;
        }
        .section-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; color: rgba(255,255,255,0.35);
          max-width: 320px; line-height: 1.75; text-align: right; font-weight: 300;
        }
        .cards-grid {
          display: grid; grid-template-columns: repeat(3,1fr); gap: 1px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden;
        }
        .mask-card {
          background: #050505; padding: 40px 36px;
          position: relative; cursor: pointer; overflow: hidden;
          transition: background 0.3s;
        }
        .mask-card::after {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: var(--red); transform: scaleX(0); transform-origin: left;
          transition: transform 0.35s var(--ease);
        }
        .mask-card:hover, .mask-card.active { background: #0a0a0a; }
        .mask-card:hover::after, .mask-card.active::after { transform: scaleX(1); }
        .card-id {
          font-family: 'DM Sans', sans-serif; font-size: 10px;
          color: rgba(255,255,255,0.18); letter-spacing: 0.3em; display: block; margin-bottom: 36px;
        }
        .card-tag {
          font-family: 'DM Sans', sans-serif; font-size: 9px;
          letter-spacing: 0.25em; text-transform: uppercase; color: var(--red);
          margin-bottom: 8px; display: block;
        }
        .card-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px; font-weight: 600; margin-bottom: 12px; line-height: 1;
        }
        .card-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; color: rgba(255,255,255,0.32); line-height: 1.75; font-weight: 300;
        }
        .card-arrow {
          position: absolute; bottom: 36px; right: 36px;
          font-size: 18px; color: rgba(255,255,255,0.1);
          transition: color 0.2s, transform 0.2s;
        }
        .mask-card:hover .card-arrow { color: var(--red); transform: translate(3px,-3px); }

        /* FEATURES */
        .features {
          display: grid; grid-template-columns: repeat(4,1fr); gap: 1px;
          background: rgba(255,255,255,0.05);
          border-top: 1px solid rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .feat { background: #000; padding: 44px 32px; }
        .feat-icon {
          width: 36px; height: 36px; margin-bottom: 20px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(192,57,43,0.28); border-radius: 4px;
          color: var(--red); font-size: 15px;
        }
        .feat-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px; font-weight: 600; margin-bottom: 10px;
        }
        .feat-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; color: rgba(255,255,255,0.32); line-height: 1.85; font-weight: 300;
        }

        /* FOOTER */
        .footer {
          padding: 44px 52px;
          display: flex; justify-content: space-between; align-items: center;
          border-top: 1px solid rgba(255,255,255,0.05);
          font-family: 'DM Sans', sans-serif;
        }
        .footer-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase;
        }
        .footer-logo span { color: var(--red); }
        .footer-text { font-size: 10px; color: rgba(255,255,255,0.18); letter-spacing: 0.2em; text-transform: uppercase; }

        .sc-loader {
          position: fixed; inset: 0; background: #000; z-index: 1000;
          display: flex; align-items: center; justify-content: center;
        }
        .sc-loader p {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; letter-spacing: 0.5em; color: #fff; text-transform: uppercase;
        }

        @media (max-width: 900px) {
          .nav { padding: 18px 24px; }
          .hero-content { padding: 0 24px 60px; max-width: 100%; }
          .hero-img { width: 100%; }
          .hero-stats { right: 24px; bottom: 60px; }
          .cards-grid { grid-template-columns: 1fr; }
          .features { grid-template-columns: 1fr 1fr; }
          .collection { padding: 72px 24px; }
          .footer { padding: 36px 24px; flex-direction: column; gap: 12px; text-align: center; }
        }
      `}</style>

      {/* NAV */}
      <nav className={`nav ${loaded ? "on" : ""}`}>
        <div className="nav-logo">SAVE <span>CHANGES</span></div>
        <div className="nav-links">
          <button className="nav-link" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}></button>
          <button className="nav-link"></button>
          <button className="nav-link"></button>
          <button className="nav-cta" onClick={handleEnter}>Enter Shop</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-img-wrap">
          <img className="hero-img" src="/oni.jpg" alt="Oni mask specimen" />
        </div>
        <div className="hero-ambient" />
        <div className="hero-scanline" />
        <div className="hero-bg-title">ONI</div>

        <div className={`hero-content ${loaded ? "on" : ""}`}>
          <p className="hero-label">SS / 2026 Edition</p>
          <h1 className="hero-h1">ALTER<br />YOUR<br /><em>EGO.</em></h1>
          <p className="hero-sub">Hand-crafted masks forged at the intersection of ancient ritual and machine precision. Each piece a complete identity shift.</p>
          <div className="hero-btns">
            <button className="btn-p" onClick={handleEnter}>View Catalog</button>
            <button className="btn-o">Our Story</button>
          </div>
        </div>

        <div className={`hero-stats ${loaded ? "on" : ""}`}>
          <div className="stat-card">
            <div className="stat-val">6<span>+</span></div>
            <div className="stat-label">Active Series</div>
          </div>
          <div className="stat-card">
            <div className="stat-val"><span>∞</span></div>
            <div className="stat-label">Identities</div>
          </div>
          <div className="stat-card">
            <div className="stat-val">01<span>/</span>26</div>
            <div className="stat-label">Current Drop</div>
          </div>
        </div>
      </section>

      {/* COLLECTION */}
      <section className="collection">
        <div className="section-header">
          <div>
            <p className="section-label">Current Collection</p>
            <h2 className="section-title">The Mask<br />Archetypes</h2>
          </div>
          <p className="section-desc">Three distinct lineages. Each carries its own material language, mythology, and intent.</p>
        </div>
        <div className="cards-grid">
          {MASKS.map((mask, i) => (
            <div key={mask.id} className={`mask-card ${activeMask === i ? "active" : ""}`} onMouseEnter={() => setActiveMask(i)}>
              <span className="card-id">{mask.id}</span>
              <span className="card-tag">{mask.tag}</span>
              <h3 className="card-name">{mask.name}</h3>
              <p className="card-desc">{mask.desc}</p>
              <span className="card-arrow">↗</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <div className="features">
        {[
          { icon: "⬡", title: "Hand-formed", desc: "Each mask is individually cast and finished by craftspeople trained in traditional Japanese lacquer techniques." },
          { icon: "◈", title: "Limited drops", desc: "No piece is mass produced. Every series is capped. Once gone, the mold is destroyed." },
          { icon: "◉", title: "Identity system", desc: "Masks are numbered to their wearer. Your mask exists once. There is no duplicate." },
          { icon: "⌬", title: "Material archive", desc: "Full provenance documentation ships with every piece — material origin, forge date, artisan mark." },
        ].map(f => (
          <div className="feat" key={f.title}>
            <div className="feat-icon">{f.icon}</div>
            <h4 className="feat-title">{f.title}</h4>
            <p className="feat-desc">{f.desc}</p>
          </div>
        ))}
      </div>

      <footer className="footer">
        <div className="footer-logo">SAVE <span>CHANGES</span></div>
        <p className="footer-text">© 2026 Save Changes Clothing — All identities reserved</p>
      </footer>

      {transitioning && (
        <div className="sc-loader"><p>Initializing Shop...</p></div>
      )}
    </main>
  );
}