"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const PHOTO_SLOTS = {
  hero:         { preferred: "/sections/hero-identity-main.jpg",      fallback: "/story4.jpg", position: "center 20%" },
  nightMarket:  { preferred: "/sections/night-market-banner.jpg",     fallback: "/story3.jpg", position: "center 40%" },
  archives:     { preferred: "/sections/feature-archive-card.jpg",    fallback: "/story2.jpg", position: "center 30%" },
  identities:   { preferred: "/categories/category-identities.jpg",   fallback: "/story1.jpg", position: "left center" },
  armory:       { preferred: "/categories/category-armory.jpg",       fallback: "/story3.jpg", position: "left center" },
  arsenal:      { preferred: "/categories/category-arsenal.jpg",      fallback: "/oni.jpg",    position: "left center" },
  accessories:  { preferred: "/categories/category-accessories.jpg",  fallback: "/story2.jpg", position: "left center" },
  apparel:      { preferred: "/categories/category-apparel.jpg",      fallback: "/story4.jpg", position: "left center" },
  productOne:   { preferred: "/products/product-mecha-maul.png",      fallback: "/story4.jpg", position: "center top" },
  productTwo:   { preferred: "/products/product-samson-robot.png",    fallback: "/story4.jpg", position: "center top" },
  productThree: { preferred: "/products/product-samson-shaman.png",   fallback: "/story1.jpg", position: "center top" },
  productFour:  { preferred: "/products/product-oni-crimson.png",     fallback: "/story3.jpg", position: "center top" },
  productFive:  { preferred: "/products/product-oni-nightvision.png", fallback: "/story3.jpg", position: "center top" },
  productSix:   { preferred: "/products/product-smiling-man-2.png",   fallback: "/story2.jpg", position: "center top" },
};

const PRODUCT_CARDS = [
  { id: "ID. MECHA MAUL",        category: "CYBERPUNK MASK",                    price: "USD 325",  note: "5 PEOPLE HAVE THIS IN THEIR BASKET",  slot: "productOne"   },
  { id: "ID. SAMSON | ROBOT",    category: "CYBERPUNK MASK",                    price: "USD 280",  note: null,                                   slot: "productTwo"   },
  { id: "ID. SAMSON | SHAMAN",   category: "CYBERPUNK MASK",                    price: "USD 300",  note: "3 PEOPLE HAVE THIS IN THEIR BASKET",  slot: "productThree" },
  { id: "ID. ONI | CRIMSON",     category: "CYBERPUNK MASK",                    price: "USD 325",  note: null,                                   slot: "productFour"  },
  { id: "ID. ONI | NIGHT VISION",category: "CYBERPUNK MASK",                    price: "USD 325",  note: null,                                   slot: "productFive"  },
  { id: "ID. SMILINGMAN 2.0",    category: "HALLOWEEN MASK | UNCANNY VALLEY",   price: "USD 250+", note: null,                                   slot: "productSix"   },
];

const CATEGORY_BANNERS = [
  { name: "IDENTITIES", sub: "MASKS . COSTUME",                      path: "/shop/identities",  slot: "identities",  icon: "/icons/IDENTITY ICON 2.PNG" },
  { name: "ARMORY",     sub: "COSTUME . ARMOUR",                     path: "/shop/armory",      slot: "armory",      icon: "/icons/ARMOURY ICON.PNG"    },
  { name: "ARSENAL",    sub: "KATANAS . PROPS",                      path: "/shop/arsenal",     slot: "arsenal",     icon: "/icons/WEAPONARY ICON.PNG"  },
  { name: "ACCESSORIES",sub: "PENDANTS . EARRINGS . BRACELETS",      path: "/shop/accessories", slot: "accessories", icon: "/icons/ACCESSORIES ICON.PNG"},
  { name: "APPAREL",    sub: "CLOTHING . GEAR",                      path: "/shop/apparel",     slot: "apparel",     icon: "/icons/JACKET.PNG"          },
];

function SmartImage({ slot, alt, className, style }) {
  const config = PHOTO_SLOTS[slot];
  const [src, setSrc] = useState(config.preferred);

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{ objectPosition: config.position, ...style }}
      onError={() => {
        if (src !== config.fallback) setSrc(config.fallback);
      }}
    />
  );
}

// Archive background cycling — add files named bg-1.jpg … bg-10.jpg to /public/archive-backgrounds/
const ARCHIVE_BG_SLOTS = Array.from({ length: 10 }, (_, i) => ({
  preferred: `/archive-backgrounds/bg-${i + 1}.jpg`,
  fallback: i < 5 ? "/story2.jpg" : "/story3.jpg",
}));

// Images that cycle inside the Night Market banner
const NM_CYCLE_SLOTS = [
  { preferred: "/sections/night-market-banner.jpg",  fallback: "/story3.jpg" },
  { preferred: "/products/product-mask-01.jpg",      fallback: "/story4.jpg" },
  { preferred: "/products/product-mask-04.jpg",      fallback: "/story3.jpg" },
  { preferred: "/products/product-mask-06.jpg",      fallback: "/story2.jpg" },
  { preferred: "/products/product-mask-02.jpg",      fallback: "/story4.jpg" },
];

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [nmGlitch, setNmGlitch] = useState(false);
  const [nmImgIdx, setNmImgIdx] = useState(0);
  const [nmImgSrc, setNmImgSrc] = useState(NM_CYCLE_SLOTS[0].preferred);
  const [nmFade, setNmFade] = useState(true);

  // Archive bg cycling state
  const [archGlitch, setArchGlitch] = useState(false);
  const [archImgIdx, setArchImgIdx] = useState(0);
  const [archImgSrc, setArchImgSrc] = useState(ARCHIVE_BG_SLOTS[0].preferred);
  const [archFade, setArchFade] = useState(true);
  // track which archive bg slots actually loaded (skip 404s)
  const archLoadedRef = React.useRef(new Set([0]));
  const [menuOpen, setMenuOpen] = useState(false);

  // Cycle Night Market banner image every 2.8s
  useEffect(() => {
    const t = setInterval(() => {
      setNmFade(false);
      setTimeout(() => {
        setNmImgIdx((prev) => {
          const next = (prev + 1) % NM_CYCLE_SLOTS.length;
          setNmImgSrc(NM_CYCLE_SLOTS[next].preferred);
          return next;
        });
        setNmFade(true);
      }, 280);
    }, 2800);
    return () => clearInterval(t);
  }, []);

  // Cycle archive background image every 3.2s
  useEffect(() => {
    const t = setInterval(() => {
      setArchFade(false);
      setTimeout(() => {
        setArchImgIdx((prev) => {
          const loaded = [...archLoadedRef.current];
          if (loaded.length === 0) return prev;
          const currentPos = loaded.indexOf(prev);
          const nextPos = (currentPos + 1) % loaded.length;
          const next = loaded[nextPos];
          setArchImgSrc(ARCHIVE_BG_SLOTS[next].preferred);
          return next;
        });
        setArchFade(true);
      }, 300);
    }, 3200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 120);
    return () => clearTimeout(timer);
  }, []);

  function navigate(path) {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => router.push(path), 360);
  }

  function navigateNightMarket() {
    if (transitioning) return;
    setNmGlitch(true);
    setTimeout(() => setNmGlitch(false), 600);
    setTransitioning(true);
    setTimeout(() => router.push("/shop/night-market"), 680);
  }

  function navigateArchive() {
    if (transitioning) return;
    setArchGlitch(true);
    setTimeout(() => setArchGlitch(false), 600);
    setTransitioning(true);
    setTimeout(() => router.push("/archive"), 680);
  }

  return (
    <main className="sc-home">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Barlow:wght@300;400;500;600;700&display=swap');

        :root {
          --bg: #0a0608;
          --red: #cc2200;
          --red-bright: #e63320;
          --red-border: rgba(200, 30, 10, 0.85);
          --red-border-dim: rgba(180, 20, 5, 0.5);
          --text: #e8e0dc;
          --text-soft: rgba(220, 210, 205, 0.7);
          --text-dim: rgba(200, 190, 185, 0.45);
          --ease: cubic-bezier(0.22, 1, 0.36, 1);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .sc-home {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: 'Barlow', sans-serif;
          overflow-x: hidden;
          max-width: 480px;
          margin: 0 auto;
        }

        /* ── NAVBAR ── */
        .sc-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(8, 4, 5, 0.92);
          backdrop-filter: blur(6px);
          border-bottom: 1px solid rgba(180, 20, 5, 0.2);
        }

        .sc-nav-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
        }

        .sc-logo {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text);
          display: flex;
          align-items: baseline;
          gap: 5px;
        }

        .sc-logo-fx {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.12em;
          color: var(--text-soft);
        }

        .sc-nav-icons {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sc-icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text);
          display: grid;
          place-items: center;
          padding: 4px;
        }

        .sc-cart-btn {
          background: var(--red);
          border: none;
          cursor: pointer;
          color: #fff;
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 3px;
        }

        .sc-nav-bottom {
          padding: 6px 14px 8px;
          border-top: 1px solid rgba(255,255,255,0.04);
        }

        .sc-hamburger {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-soft);
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 4px 0;
        }

        .sc-hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: currentColor;
          border-radius: 1px;
          transition: transform 0.22s ease, opacity 0.22s ease;
        }

        .sc-hamburger.open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .sc-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .sc-hamburger.open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

        /* ── SIDE PANEL ── */
        .sc-menu-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          z-index: 90;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s ease;
        }
        .sc-menu-backdrop.open {
          opacity: 1;
          pointer-events: all;
        }

        .sc-menu-panel {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 78vw;
          max-width: 300px;
          background: #0a0608;
          border-right: 1px solid rgba(200,30,10,0.25);
          z-index: 100;
          display: flex;
          flex-direction: column;
          transform: translateX(-100%);
          transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
          overflow-y: auto;
        }
        .sc-menu-panel.open {
          transform: translateX(0);
        }

        .sc-menu-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border-bottom: 1px solid rgba(200,30,10,0.18);
          background: rgba(200,30,10,0.06);
        }

        .sc-menu-logo {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 18px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #fff;
        }

        .sc-menu-close {
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(209,213,219,0.5);
          font-size: 18px;
          line-height: 1;
          padding: 4px;
        }

        .sc-menu-section-label {
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          color: rgba(200,30,10,0.5);
          padding: 14px 16px 6px;
          font-family: 'Courier New', monospace;
        }

        .sc-menu-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          cursor: pointer;
          background: none;
          border-left: none;
          border-top: none;
          border-right: none;
          width: 100%;
          text-align: left;
          transition: background 0.15s ease;
          gap: 10px;
        }
        .sc-menu-item:hover {
          background: rgba(200,30,10,0.06);
        }

        .sc-menu-item-text {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 18px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #fff;
          line-height: 1;
        }

        .sc-menu-item-sub {
          font-family: 'Courier New', monospace;
          font-size: 7px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(209,213,219,0.3);
          margin-top: 3px;
        }

        .sc-menu-item-arrow {
          font-size: 11px;
          color: rgba(200,30,10,0.5);
          flex-shrink: 0;
        }

        .sc-menu-divider {
          height: 1px;
          background: rgba(200,30,10,0.1);
          margin: 4px 0;
        }

        /* ── HERO ── */
        .sc-hero {
          position: relative;
          height: 70vh;
          min-height: 480px;
          overflow: hidden;
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.9s var(--ease), transform 0.9s var(--ease);
        }

        .sc-hero.on { opacity: 1; transform: translateY(0); }

        .sc-hero-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.52) saturate(0.75);
        }

        .sc-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0,0,0,0.1) 0%,
            rgba(5,2,3,0.15) 30%,
            rgba(5,2,3,0.65) 70%,
            rgba(5,2,3,0.96) 100%
          );
        }

        .sc-hero-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 0 20px 28px;
        }

        .sc-hero-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(78px, 22vw, 110px);
          font-weight: 800;
          line-height: 0.85;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 14px;
        }

        .sc-hero-title span {
          display: block;
        }

        .sc-hero-title span:last-child {
          color: rgba(220, 215, 210, 0.9);
        }

        .sc-hero-sub {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--red-bright);
          margin-bottom: 16px;
        }

        .sc-hero-cta {
          display: inline-block;
          padding: 10px 20px;
          border: 1px solid var(--text);
          background: transparent;
          color: var(--text);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          width: fit-content;
        }

        .sc-hero-cta:hover {
          background: var(--text);
          color: var(--bg);
        }

        /* ── SECTION SPACING ── */
        .sc-section {
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.8s var(--ease), transform 0.8s var(--ease);
        }
        .sc-section.on { opacity: 1; transform: translateY(0); }

        /* ── PRODUCT SCROLL ROW ── */
        .sc-products-label {
          padding: 18px 16px 10px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--text-dim);
        }

        .sc-products-scroll {
          display: flex;
          gap: 0;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding: 0 0 2px;
        }

        .sc-products-scroll::-webkit-scrollbar { display: none; }

        .sc-product-card {
          flex: 0 0 calc(100% / 2.4);
          scroll-snap-align: start;
          border: 1px solid var(--red-border);
          background: #0d0608;
          cursor: pointer;
          transition: border-color 0.2s;
          display: flex;
          flex-direction: column;
        }

        .sc-product-card:hover {
          border-color: var(--red-bright);
        }

        .sc-product-img-wrap {
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          background: #111;
        }

        .sc-product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.9);
          display: block;
          -webkit-mask-image: linear-gradient(to bottom, black 76%, transparent 90%);
          mask-image: linear-gradient(to bottom, black 76%, transparent 90%);
        }

        .sc-product-body {
          padding: 10px 10px 14px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sc-product-id {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--red-bright);
          line-height: 1.2;
        }

        .sc-product-cat {
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-dim);
          margin-bottom: 4px;
        }

        .sc-product-price {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: var(--text);
          line-height: 1;
          margin-top: 4px;
        }

        .sc-product-note {
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--red-bright);
          margin-top: 8px;
          line-height: 1.4;
        }

        /* ── NIGHT MARKET BANNER ── */
        .sc-banner {
          position: relative;
          height: 280px;
          overflow: hidden;
          border-top: 1px solid var(--red-border-dim);
          border-bottom: 1px solid var(--red-border-dim);
          cursor: pointer;
          margin: 2px 0;
        }

        .sc-banner-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.45) saturate(0.8);
          transition: transform 0.4s var(--ease);
        }

        .sc-banner:hover .sc-banner-img { transform: scale(1.03); }

        .sc-banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0.55) 0%, transparent 70%);
        }

        .sc-banner-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 22px 20px;
        }

        .sc-banner-skull {
          font-size: 22px;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sc-banner-skull-icon {
          width: 28px;
          height: 28px;
          opacity: 0.85;
        }

        .sc-banner-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 36px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #fff;
          line-height: 1;
          margin-bottom: 8px;
          position: relative;
          display: inline-block;
          text-shadow:
            0 0 8px rgba(230,51,32,0.9),
            0 0 20px rgba(230,51,32,0.5),
            0 0 40px rgba(230,51,32,0.25);
          animation: sc-neon-flicker 4s ease-in-out infinite;
        }

        @keyframes sc-neon-flicker {
          0%,  100% { opacity: 1; text-shadow: 0 0 8px rgba(230,51,32,0.9), 0 0 20px rgba(230,51,32,0.5), 0 0 40px rgba(230,51,32,0.25); }
          5%         { opacity: 0.85; text-shadow: 0 0 4px rgba(230,51,32,0.6); }
          6%         { opacity: 1; text-shadow: 0 0 8px rgba(230,51,32,0.9), 0 0 20px rgba(230,51,32,0.5), 0 0 40px rgba(230,51,32,0.25); }
          48%        { opacity: 1; }
          50%        { opacity: 0.9; text-shadow: 0 0 6px rgba(230,51,32,0.7); }
          51%        { opacity: 1; text-shadow: 0 0 10px rgba(230,51,32,1), 0 0 24px rgba(230,51,32,0.6), 0 0 48px rgba(230,51,32,0.3); }
          80%        { opacity: 1; }
          82%        { opacity: 0.7; text-shadow: none; }
          83%        { opacity: 1; text-shadow: 0 0 8px rgba(230,51,32,0.9), 0 0 20px rgba(230,51,32,0.5); }
        }

        /* ── NIGHT MARKET GLITCH ── */
        .sc-banner-title.nm-glitching {
          animation: sc-nm-glitch 0.6s steps(1) forwards;
        }

        .sc-banner-title.nm-glitching::before,
        .sc-banner-title.nm-glitching::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          font-family: inherit;
          font-size: inherit;
          font-weight: inherit;
          letter-spacing: inherit;
          text-transform: inherit;
          color: inherit;
        }

        .sc-banner-title.nm-glitching::before {
          color: #00ffcc;
          clip-path: polygon(0 20%, 100% 20%, 100% 35%, 0 35%);
          transform: translateX(-4px);
          animation: sc-nm-slice1 0.6s steps(1) forwards;
        }

        .sc-banner-title.nm-glitching::after {
          color: #ff4466;
          clip-path: polygon(0 60%, 100% 60%, 100% 72%, 0 72%);
          transform: translateX(4px);
          animation: sc-nm-slice2 0.6s steps(1) forwards;
        }

        @keyframes sc-nm-glitch {
          0%  { transform: translate(0); }
          10% { transform: translate(-3px, 1px) skewX(-2deg); }
          20% { transform: translate(3px, -1px) skewX(2deg); }
          30% { transform: translate(-2px, 0) skewX(0); }
          40% { transform: translate(2px, 1px); }
          50% { transform: translate(-3px, -1px) skewX(-1deg); }
          60% { transform: translate(1px, 0); }
          70% { transform: translate(-1px, 1px); }
          80% { transform: translate(0); }
          100%{ transform: translate(0); }
        }

        @keyframes sc-nm-slice1 {
          0%,100%{ opacity: 0; }
          15%,45%{ opacity: 1; transform: translateX(-4px); }
          30%    { transform: translateX(6px); }
        }

        @keyframes sc-nm-slice2 {
          0%,100%{ opacity: 0; }
          20%,50%{ opacity: 1; transform: translateX(4px); }
          35%    { transform: translateX(-6px); }
        }

        /* ── ARCHIVE TITLE GLITCH ── */
        .sc-archives-title.arch-glitching {
          animation: sc-arch-glitch 0.6s steps(1) forwards;
          position: relative;
        }

        .sc-archives-title.arch-glitching::before,
        .sc-archives-title.arch-glitching::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          font-family: inherit;
          font-size: inherit;
          font-weight: inherit;
          letter-spacing: inherit;
          text-transform: inherit;
          color: inherit;
        }

        .sc-archives-title.arch-glitching::before {
          color: #00ccff;
          clip-path: polygon(0 15%, 100% 15%, 100% 32%, 0 32%);
          transform: translateX(-5px);
          animation: sc-arch-slice1 0.6s steps(1) forwards;
        }

        .sc-archives-title.arch-glitching::after {
          color: #ff44aa;
          clip-path: polygon(0 55%, 100% 55%, 100% 68%, 0 68%);
          transform: translateX(5px);
          animation: sc-arch-slice2 0.6s steps(1) forwards;
        }

        @keyframes sc-arch-glitch {
          0%  { transform: translate(0); }
          10% { transform: translate(-4px, 2px) skewX(-3deg); }
          20% { transform: translate(4px, -2px) skewX(3deg); }
          30% { transform: translate(-2px, 0); }
          40% { transform: translate(3px, 1px); }
          50% { transform: translate(-3px, -1px) skewX(-1deg); }
          60% { transform: translate(1px, 0); }
          70% { transform: translate(-1px, 2px); }
          80% { transform: translate(0); }
          100%{ transform: translate(0); }
        }

        @keyframes sc-arch-slice1 {
          0%,100%{ opacity: 0; }
          12%,48%{ opacity: 1; transform: translateX(-5px); }
          28%    { transform: translateX(7px); }
        }

        @keyframes sc-arch-slice2 {
          0%,100%{ opacity: 0; }
          18%,52%{ opacity: 1; transform: translateX(5px); }
          34%    { transform: translateX(-7px); }
        }

        /* ── NM IMAGE CROSSFADE ── */
        .sc-banner-img {
          transition: opacity 0.28s ease-in-out, transform 0.4s var(--ease) !important;
        }

        .sc-banner-link {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--red-bright);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sc-banner-arrow {
          width: 26px;
          height: 26px;
          border: 1px solid var(--red-bright);
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 12px;
        }

        /* ── ENTER ARCHIVES CARD ── */
        .sc-archives {
          position: relative;
          height: 260px;
          overflow: hidden;
          border: 1px solid var(--red-border);
          cursor: pointer;
          margin: 2px 0;
          transition: border-color 0.2s;
        }

        .sc-archives:hover { border-color: var(--red-bright); }

        .sc-archives-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.3) saturate(0.5);
        }

        .sc-archives-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%);
        }

        .sc-archives-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 26px 22px;
        }

        .sc-archives-icon-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .sc-archives-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 34px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #fff;
          line-height: 1;
          margin-bottom: 12px;
        }

        .sc-archives-sub {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--red-bright);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sc-folder-icon {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0.55;
        }

        /* ── ABOUT PANEL ── */
        .sc-about {
          padding: 28px 20px 24px;
          background: #0d0608;
          position: relative;
        }

        .sc-about-skull {
          position: absolute;
          top: 22px;
          right: 20px;
          opacity: 0.6;
          font-size: 28px;
        }

        .sc-about-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text);
          margin-bottom: 14px;
          max-width: 80%;
          line-height: 1.2;
        }

        .sc-about-body {
          font-size: 13px;
          line-height: 1.7;
          color: var(--text-soft);
          margin-bottom: 16px;
        }

        .sc-about-tagline {
          font-size: 14px;
          font-weight: 500;
          color: var(--text);
          margin-bottom: 22px;
          line-height: 1.5;
        }

        .sc-learn-more {
          display: flex;
          align-items: center;
          gap: 12px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .sc-learn-more span {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--red-bright);
        }

        .sc-learn-more-arrow {
          width: 30px;
          height: 30px;
          border: 1px solid var(--red-bright);
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: var(--red-bright);
          font-size: 14px;
        }

        /* ── CATEGORY BANNERS ── */
        .sc-category-banner {
          position: relative;
          height: 168px;
          overflow: hidden;
          border-top: 1px solid var(--red-border-dim);
          border-bottom: 1px solid var(--red-border-dim);
          cursor: pointer;
          margin: 1px 0;
          background: #0d0608;
          display: flex;
          align-items: center;
          transition: border-color 0.25s;
        }

        .sc-category-banner:hover { border-color: var(--red-bright); }

        .sc-category-img {
          position: absolute;
          right: 0;
          top: 0;
          width: 58%;
          height: 100%;
          object-fit: cover;
          object-position: left center;
          filter: brightness(0.75) saturate(0.85);
          transition: transform 0.45s var(--ease);
        }

        .sc-category-banner:hover .sc-category-img { transform: scale(1.05); }

        /* fades image into dark bg from left */
        .sc-category-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            #0d0608 32%,
            rgba(13,6,8,0.82) 52%,
            rgba(13,6,8,0.25) 75%,
            transparent 100%
          );
          z-index: 1;
        }

        .sc-category-content {
          position: relative;
          z-index: 2;
          padding: 0 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 2px;
          max-width: 58%;
        }

        .sc-category-icon {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 5px;
          opacity: 0.85;
        }

        .sc-category-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 40px;
          font-weight: 900;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #fff;
          line-height: 0.9;
          margin-bottom: 6px;
        }

        .sc-category-sub {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--red-bright);
          display: flex;
          align-items: center;
          gap: 10px;
          line-height: 1;
        }

        /* ── FOOTER ── */
        .sc-footer {
          padding: 20px 20px 36px;
          border-top: 1px solid rgba(180,20,5,0.2);
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .sc-footer-icon {
          font-size: 22px;
          cursor: pointer;
          opacity: 0.75;
          transition: opacity 0.2s;
          display: grid;
          place-items: center;
          background: none;
          border: none;
          color: var(--text);
          padding: 0;
        }

        .sc-footer-icon:hover { opacity: 1; }

        /* ── TRANSITION LOADER ── */
        .sc-loader {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 100;
          background: #0a0608;
          gap: 22px;
        }

        .sc-loader-sigil {
          width: 48px;
          height: 48px;
          position: relative;
          animation: sc-sigil-spin 1.4s linear infinite;
        }

        @keyframes sc-sigil-spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .sc-loader-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1.5px solid transparent;
          border-top-color: var(--red-bright);
          border-right-color: rgba(200,30,10,0.3);
        }

        .sc-loader-ring-inner {
          position: absolute;
          inset: 10px;
          border-radius: 50%;
          border: 1px solid transparent;
          border-bottom-color: var(--red-bright);
          border-left-color: rgba(200,30,10,0.3);
          animation: sc-sigil-spin 0.9s linear infinite reverse;
        }

        .sc-loader-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 5px;
          height: 5px;
          background: var(--red-bright);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 8px var(--red-bright), 0 0 16px rgba(230,51,32,0.5);
          animation: sc-dot-pulse 1.4s ease-in-out infinite;
        }

        @keyframes sc-dot-pulse {
          0%, 100% { opacity: 1; transform: translate(-50%,-50%) scale(1); }
          50%       { opacity: 0.5; transform: translate(-50%,-50%) scale(0.6); }
        }

        .sc-loader-text {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px;
          letter-spacing: 0.45em;
          text-transform: uppercase;
          color: var(--text-dim);
          animation: sc-text-flicker 2s ease-in-out infinite;
        }

        @keyframes sc-text-flicker {
          0%, 100% { opacity: 0.45; }
          40%      { opacity: 1; }
          42%      { opacity: 0.3; }
          44%      { opacity: 1; }
          80%      { opacity: 0.6; }
        }

        /* ── SCROLL INDICATOR ── */
        .sc-scroll-hint {
          padding: 6px 16px 4px;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-dim);
          text-align: right;
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="sc-nav">
        <div className="sc-nav-top">
          <div className="sc-logo">
            SAVECHANGES <span className="sc-logo-fx">FX</span>
          </div>
          <div className="sc-nav-icons">
            <button className="sc-icon-btn" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
            <button className="sc-cart-btn" aria-label="Cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="sc-nav-bottom">
          <button className={`sc-hamburger${menuOpen ? " open" : ""}`} aria-label="Menu" onClick={() => setMenuOpen(true)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── SIDE PANEL ── */}
      <div className={`sc-menu-backdrop${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(false)} />
      <div className={`sc-menu-panel${menuOpen ? " open" : ""}`}>
        {/* Header */}
        <div className="sc-menu-header">
          <span className="sc-menu-logo">SAVECHANGES <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(209,213,219,0.45)", letterSpacing: "0.14em" }}>FX</span></span>
          <button className="sc-menu-close" onClick={() => setMenuOpen(false)}>✕</button>
        </div>

        {/* Main nav */}
        <div className="sc-menu-section-label">NAVIGATE</div>

        {[
          { label: "HOME", sub: "Landing page", path: "/" },
          { label: "NIGHT MARKET", sub: "Browse the collection", path: "/shop/night-market" },
          { label: "ENTER ARCHIVES", sub: "Blacksite subject files", path: "/archive", isArchive: true },
        ].map(item => (
          <button
            key={item.label}
            className="sc-menu-item"
            onClick={() => {
              setMenuOpen(false);
              if (item.isArchive) {
                navigateArchive();
              } else {
                navigate(item.path);
              }
            }}
          >
            <div>
              <div className="sc-menu-item-text">{item.label}</div>
              <div className="sc-menu-item-sub">{item.sub}</div>
            </div>
            <span className="sc-menu-item-arrow">→</span>
          </button>
        ))}

        <div className="sc-menu-divider" />
        <div className="sc-menu-section-label">SHOP BY CATEGORY</div>

        {[
          { label: "IDENTITIES", sub: "Masks & wearable identity", path: "/shop/identities", icon: "/icons/IDENTITY ICON 2.PNG"  },
          { label: "ARMORY",     sub: "Tactical gear & hardware",  path: "/shop/armory",     icon: "/icons/ARMOURY ICON.PNG"     },
          { label: "ARSENAL",    sub: "Weapons & accessories",     path: "/shop/arsenal",    icon: "/icons/WEAPONARY ICON.PNG"   },
          { label: "ACCESSORIES",sub: "Wearables & extras",        path: "/shop/accessories",icon: "/icons/ACCESSORIES ICON.PNG" },
          { label: "APPAREL",    sub: "Clothing & outerwear",      path: "/shop/apparel",    icon: "/icons/JACKET.PNG"           },
        ].map(item => (
          <button
            key={item.label}
            className="sc-menu-item"
            onClick={() => { setMenuOpen(false); navigate(item.path); }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img src={item.icon} alt={item.label} style={{ width: 36, height: 36, objectFit: "contain", flexShrink: 0, borderRadius: 3 }} />
              <div>
                <div className="sc-menu-item-text">{item.label}</div>
                <div className="sc-menu-item-sub">{item.sub}</div>
              </div>
            </div>
            <span className="sc-menu-item-arrow">→</span>
          </button>
        ))}

        {/* Footer strip */}
        <div style={{ marginTop: "auto", padding: "14px 16px", borderTop: "1px solid rgba(200,30,10,0.1)" }}>
          <div style={{ fontSize: 6, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(209,213,219,0.15)", fontFamily: "'Courier New', monospace" }}>
            SAVECHANGES FX // ALL RIGHTS RESERVED
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className={`sc-hero ${mounted ? "on" : ""}`}>
        <SmartImage slot="hero" alt="Savechanges hero" className="sc-hero-img" />
        <div className="sc-hero-overlay" />
        <div className="sc-hero-content">
          <h1 className="sc-hero-title">
            <span>ALTER</span>
            <span>YOUR</span>
            <span>EGO.</span>
          </h1>
          <div className="sc-hero-sub">CHOOSE YOUR<br />NEW IDENTITY</div>
          <button className="sc-hero-cta" onClick={() => navigate("/shop")}>
            SHOP NOW
          </button>
        </div>
      </section>

      {/* PRODUCT SCROLL ROW */}
      <section className={`sc-section ${mounted ? "on" : ""}`}>
        <div className="sc-products-label">New Identities</div>
        <div className="sc-scroll-hint">← Scroll →</div>
        <div className="sc-products-scroll">
          {PRODUCT_CARDS.map((p) => (
            <article
              key={p.id}
              className="sc-product-card"
              onClick={() => navigate("/shop")}
            >
              <div className="sc-product-img-wrap">
                <SmartImage slot={p.slot} alt={p.id} className="sc-product-img" />
              </div>
              <div className="sc-product-body">
                <div className="sc-product-id">{p.id}</div>
                <div className="sc-product-cat">{p.category}</div>
                <div className="sc-product-price">{p.price}</div>
                {p.note && <div className="sc-product-note">{p.note}</div>}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* NIGHT MARKET BANNER */}
      <section className={`sc-section ${mounted ? "on" : ""}`}>
        <div className="sc-banner" onClick={navigateNightMarket}>
          {/* Cycling product image with crossfade */}
          <img
            src={nmImgSrc}
            alt="Night Market"
            className="sc-banner-img"
            style={{ opacity: nmFade ? 1 : 0, position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%", filter: "brightness(0.45) saturate(0.8)" }}
            onError={(e) => { const slot = NM_CYCLE_SLOTS[nmImgIdx]; if (e.target.src !== slot.fallback) e.target.src = slot.fallback; }}
          />
          <div className="sc-banner-overlay" />
          <div className="sc-banner-content">
            <div className="sc-banner-skull">
              <svg className="sc-banner-skull-icon" viewBox="0 0 100 100" fill="white" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="45" r="32" fill="white" opacity="0.9"/>
                <rect x="34" y="68" width="10" height="14" rx="2" fill="white"/>
                <rect x="56" y="68" width="10" height="14" rx="2" fill="white"/>
                <circle cx="38" cy="42" r="7" fill="#0a0608"/>
                <circle cx="62" cy="42" r="7" fill="#0a0608"/>
                <path d="M44 58 Q50 54 56 58" stroke="#0a0608" strokeWidth="2" fill="none"/>
                <circle cx="20" cy="35" r="4" fill="white" opacity="0.7"/>
                <circle cx="80" cy="35" r="4" fill="white" opacity="0.7"/>
                <circle cx="50" cy="18" r="3" fill="white" opacity="0.7"/>
              </svg>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "13px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(220,210,205,0.6)" }}>LIMITED DROPS</span>
            </div>
            {/* Glitch title — data-text mirrors content for CSS ::before/::after */}
            <div
              className={`sc-banner-title${nmGlitch ? " nm-glitching" : ""}`}
              data-text="NIGHT MARKET"
            >
              NIGHT MARKET
            </div>
            <div className="sc-banner-link">
              SHOP NOW
              <div className="sc-banner-arrow">→</div>
            </div>
          </div>
        </div>
      </section>

      {/* ENTER ARCHIVES */}
      <section className={`sc-section ${mounted ? "on" : ""}`}>
        <div className="sc-archives" onClick={navigateArchive}>
          {/* Cycling background image */}
          <img
            src={archImgSrc}
            alt="Enter Archives"
            className="sc-archives-img"
            style={{ opacity: archFade ? 1 : 0, transition: "opacity 0.3s ease-in-out" }}
            onError={(e) => {
              const slot = ARCHIVE_BG_SLOTS[archImgIdx];
              if (e.target.src !== slot.fallback) e.target.src = slot.fallback;
              else archLoadedRef.current.delete(archImgIdx);
            }}
            onLoad={() => { archLoadedRef.current.add(archImgIdx); }}
          />
          <div className="sc-archives-overlay" />
          <div className="sc-archives-content">
            <div className="sc-archives-icon-row">
              <svg width="24" height="24" viewBox="0 0 100 100" fill="white" opacity="0.8" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="45" r="32" fill="white" opacity="0.9"/>
                <circle cx="38" cy="42" r="7" fill="#0a0608"/>
                <circle cx="62" cy="42" r="7" fill="#0a0608"/>
                <rect x="34" y="68" width="10" height="14" rx="2" fill="white"/>
                <rect x="56" y="68" width="10" height="14" rx="2" fill="white"/>
              </svg>
            </div>
            {/* Glitch title */}
            <div
              className={`sc-archives-title${archGlitch ? " arch-glitching" : ""}`}
              data-text="ENTER ARCHIVES"
            >
              ENTER ARCHIVES
            </div>
            <div className="sc-archives-sub">
              ACCESS: RESTRICTED
              <div className="sc-banner-arrow">→</div>
            </div>
          </div>
          {/* Folder icon */}
          <div className="sc-folder-icon">
            <svg width="64" height="54" viewBox="0 0 64 54" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="14" width="60" height="38" rx="4" stroke="#cc2200" strokeWidth="2.5"/>
              <path d="M2 18C2 15.8 3.8 14 6 14H24L30 8H58C60.2 8 62 9.8 62 12V18H2Z" fill="none" stroke="#cc2200" strokeWidth="2.5"/>
              <rect x="8" y="22" width="48" height="24" rx="2" stroke="#cc2200" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5"/>
            </svg>
          </div>
        </div>
      </section>

      {/* WHERE ARTISTRY MEETS ALTER EGO */}
      <section className={`sc-about sc-section ${mounted ? "on" : ""}`}>
        <div className="sc-about-skull">
          <svg width="32" height="32" viewBox="0 0 100 100" fill="white" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="45" r="32"/>
            <circle cx="38" cy="42" r="7" fill="#0d0608"/>
            <circle cx="62" cy="42" r="7" fill="#0d0608"/>
            <rect x="34" y="68" width="10" height="14" rx="2"/>
            <rect x="56" y="68" width="10" height="14" rx="2"/>
            <circle cx="20" cy="35" r="4" opacity="0.7"/>
            <circle cx="80" cy="35" r="4" opacity="0.7"/>
            <circle cx="50" cy="18" r="3" opacity="0.7"/>
          </svg>
        </div>
        <div className="sc-about-title">WHERE ARTISTRY MEETS ALTER EGO</div>
        <p className="sc-about-body">
          We specialise in bringing creatures, monsters, and whimsical characters to life through handcrafted masks and bespoke costume pieces. Produced in controlled batches, our work is a tribute to the art of the character. By blending traditional clay sculpting with modern digital design and meticulous hand-painting, we ensure every piece meets an exacting standard of quality. Because we prioritise craftsmanship over mass production, each item is given the time and attention it deserves to become something truly unique.
        </p>
        <p className="sc-about-tagline">Step into a new identity. Embrace the extraordinary.</p>
        <button className="sc-learn-more" onClick={() => navigate("/about")}>
          <span>LEARN MORE</span>
          <div className="sc-learn-more-arrow">→</div>
        </button>
      </section>

      {/* CATEGORY BANNERS */}
      <section className={`sc-section ${mounted ? "on" : ""}`}>
        {CATEGORY_BANNERS.map((cat) => (
          <div
            key={cat.name}
            className="sc-category-banner"
            onClick={() => navigate(cat.path)}
          >
            <SmartImage slot={cat.slot} alt={cat.name} className="sc-category-img" />
            <div className="sc-category-overlay" />
            <div className="sc-category-content">
              <div className="sc-category-icon">
                <img src={cat.icon} alt={cat.name} style={{ width: 44, height: 44, objectFit: "contain" }} />
              </div>
              <div className="sc-category-name">{cat.name}</div>
              <div className="sc-category-sub">
                {cat.sub}
                <div className="sc-banner-arrow" style={{ flexShrink: 0, marginLeft: 6 }}>→</div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className={`sc-footer sc-section ${mounted ? "on" : ""}`}>
        {/* Robot icon */}
        <button className="sc-footer-icon" aria-label="Chat">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="8" width="18" height="13" rx="2"/>
            <path d="M9 11h.01M15 11h.01"/>
            <path d="M9 15h6"/>
            <path d="M12 8V5"/>
            <circle cx="12" cy="4" r="1"/>
            <path d="M5 8V7a2 2 0 012-2h10a2 2 0 012 2v1"/>
          </svg>
        </button>
        {/* TikTok */}
        <button className="sc-footer-icon" aria-label="TikTok">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.73a8.22 8.22 0 004.84 1.56V6.84a4.85 4.85 0 01-1.07-.15z"/>
          </svg>
        </button>
        {/* Instagram */}
        <button className="sc-footer-icon" aria-label="Instagram">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
          </svg>
        </button>
      </footer>

      {transitioning && (
        <div className="sc-loader">
          <div className="sc-loader-sigil">
            <div className="sc-loader-ring" />
            <div className="sc-loader-ring-inner" />
            <div className="sc-loader-dot" />
          </div>
          <div className="sc-loader-text">Accessing</div>
        </div>
      )}
    </main>
  );
}