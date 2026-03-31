"use client";

import React, { useRef, useState, useEffect, memo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Float, Preload, Environment } from "@react-three/drei";
import { useRouter } from "next/navigation";

/** * 1. OPTIMIZED 3D COMPONENT
 * Moved to a separate memoized component so it NEVER re-renders 
 * when UI state (hovering, text changes) updates.
 */
const MaskModel = memo(() => {
  const { scene } = useGLTF("/models/jin_sakai_mask.glb");
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      // Direct mutation is faster than state-based rotation
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.4}>
      <primitive 
        ref={meshRef} 
        object={scene} 
        scale={1.8} 
        position={[0, -0.9, 0]} 
      />
    </Float>
  );
});
MaskModel.displayName = "MaskModel";

const Scene = memo(() => (
  <div className="sc-canvas-container">
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 2]} // Performance: limits resolution on high-dpi screens
      gl={{ 
        antialias: false, // Turn off for major perf boost on mobile
        powerPreference: "high-performance",
        alpha: true 
      }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 6, 4]} intensity={1} />
        <MaskModel />
        <Preload all />
      </Suspense>
    </Canvas>
  </div>
));
Scene.displayName = "Scene";

/**
 * 2. DATA
 */
const MASKS = [
  { id: "01", name: "Phantom",  tag: "STEALTH SERIES",  desc: "Forged in obsidian resin. Worn by those who prefer silence." },
  { id: "02", name: "Revenant", tag: "HERITAGE SERIES", desc: "Lacquered cedar, hand-finished. A face from another century." },
  { id: "03", name: "Specter",  tag: "VOID SERIES",      desc: "Matte titanium alloy. The mask that wears the dark." },
];

/**
 * 3. MAIN PAGE
 */
export default function Home() {
  const [transitioning, setTransitioning] = useState(false);
  const [activeMask, setActiveMask] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleEnter = () => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => router.push("/shop"), 600);
  };

  return (
    <main className="sc-root">
      <style>{`
        :root { --ease: cubic-bezier(0.23, 1, 0.32, 1); }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #000; color: #fff; font-family: system-ui, sans-serif; overflow-x: hidden; }
        
        .sc-root { background: #000; min-height: 100vh; width: 100%; }

        /* Performance: Pointer-events none on canvas so scrolling is smooth */
        .sc-canvas-container { 
          position: absolute; inset: 0; z-index: 0; 
          pointer-events: none; 
          background: radial-gradient(circle at 50% 40%, #111 0%, #000 70%);
        }

        /* NAV */
        .sc-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; justify-content: space-between; align-items: center;
          padding: 24px 48px; border-bottom: 1px solid rgba(255,255,255,0.05);
          background: rgba(0,0,0,0.8); backdrop-filter: blur(10px);
          opacity: 0; transform: translateY(-10px);
          transition: all 0.8s var(--ease);
        }
        .sc-nav.on { opacity: 1; transform: translateY(0); }
        .sc-nav-logo { font-size: 11px; letter-spacing: .4em; color: rgba(255,255,255,0.4); }
        .sc-nav-links { display: flex; gap: 32px; }
        .sc-nav-btn { background: none; border: none; font-size: 10px; color: #777; letter-spacing: .2em; cursor: pointer; transition: color .2s; }
        .sc-nav-btn:hover { color: #fff; }

        /* HERO */
        .sc-hero { position: relative; height: 100vh; display: flex; align-items: flex-end; padding: 60px 48px; overflow: hidden; }
        .sc-hero-content { 
          position: relative; z-index: 2; opacity: 0; transform: translateY(20px);
          transition: all 1s var(--ease) 0.2s; 
        }
        .sc-hero-content.on { opacity: 1; transform: translateY(0); }
        .sc-h1 { font-size: clamp(40px, 8vw, 110px); line-height: 0.9; font-weight: 800; letter-spacing: -0.04em; margin: 20px 0; }
        
        .btn-p { background: #fff; color: #000; border: none; padding: 16px 36px; font-size: 11px; font-weight: 700; letter-spacing: 0.2em; cursor: pointer; }
        .btn-o { background: none; border: 1px solid #333; color: #fff; padding: 16px 36px; font-size: 11px; letter-spacing: 0.2em; margin-left: 12px; cursor: pointer; }

        /* GRID */
        .sc-grid { 
          display: grid; grid-template-columns: repeat(3, 1fr); 
          gap: 1px; background: rgba(255,255,255,0.1); border-top: 1px solid rgba(255,255,255,0.1);
        }
        .sc-card { 
          background: #000; padding: 40px; cursor: pointer; 
          transition: background 0.3s ease; position: relative;
        }
        .sc-card:hover { background: #050505; }
        .sc-card.active { background: #0a0a0a; }
        .sc-card.active::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 2px; background: #fff; }
        
        .sc-card-id { font-size: 10px; color: #444; margin-bottom: 40px; display: block; }
        .sc-card-name { font-size: 24px; margin-bottom: 8px; }
        .sc-card-desc { font-size: 14px; color: #666; line-height: 1.6; }

        /* LOADING BAR (Transition) */
        .sc-loader { 
          position: fixed; inset: 0; background: #000; z-index: 1000; 
          display: flex; align-items: center; justify-content: center; 
        }
        .sc-loader p { font-size: 10px; letter-spacing: 0.5em; color: #fff; }

        @media (max-width: 768px) {
          .sc-grid { grid-template-columns: 1fr; }
          .sc-hero { padding: 40px 24px; }
          .sc-nav { padding: 20px; }
        }
      `}</style>

      {/* NAVIGATION */}
      <nav className={`sc-nav ${loaded ? "on" : ""}`}>
        <div className="sc-nav-logo">SAVE CHANGES</div>
        <div className="sc-nav-links">
          <button className="sc-nav-btn" onClick={() => window.scrollTo({top: window.innerHeight, behavior: 'smooth'})}>COLLECTION</button>
          <button className="sc-nav-btn" onClick={handleEnter}>SHOP</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="sc-hero">
        <Scene />
        <div className={`sc-hero-content ${loaded ? "on" : ""}`}>
          <p style={{ fontSize: '10px', letterSpacing: '0.6em', color: '#555' }}>SS/2026 EDITION</p>
          <h1 className="sc-h1">ALTER YOUR<br />EGO.</h1>
          <button className="btn-p" onClick={handleEnter}>VIEW CATALOG</button>
          <button className="btn-o">STORY</button>
        </div>
      </section>

      {/* COLLECTION GRID */}
      <section className="sc-grid">
        {MASKS.map((mask, i) => (
          <div 
            key={mask.id} 
            className={`sc-card ${activeMask === i ? 'active' : ''}`}
            onMouseEnter={() => setActiveMask(i)}
          >
            <span className="sc-card-id">{mask.id} — {mask.tag}</span>
            <h3 className="sc-card-name">{mask.name}</h3>
            <p className="sc-card-desc">{mask.desc}</p>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '60px 48px', borderTop: '1px solid #111', textAlign: 'center' }}>
        <p style={{ fontSize: '10px', color: '#222', letterSpacing: '0.3em' }}>© 2026 SAVE CHANGES CLOTHING</p>
      </footer>

      {/* TRANSITION OVERLAY */}
      {transitioning && (
        <div className="sc-loader">
          <p>INITIALIZING SHOP...</p>
        </div>
      )}
    </main>
  );
}

// Preload the model
useGLTF.preload("/models/jin_sakai_mask.glb");