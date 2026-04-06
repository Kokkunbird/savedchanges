"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const HERO_BACKGROUNDS = ["/story4.jpg", "/story3.jpg", "/story1.jpg", "/story2.jpg"];

const FEATURE_CARDS = [
  {
    title: "Night Market",
    subtitle: "Shop Now",
    path: "/shop",
    image: "/story4.jpg",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path d="M20 6C12.268 6 6 11.82 6 19c0 4.2 1.9 7.94 4.9 10.4V34h18v-4.6C31.1 26.94 34 23.2 34 19c0-7.18-6.268-13-14-13Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 22v4M20 22v4M26 22v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M14 19a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm8 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Enter Archives",
    subtitle: "Access: Restricted",
    path: "/archive",
    image: "/story3.jpg",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect x="6" y="12" width="28" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 16h28" stroke="currentColor" strokeWidth="1.2" />
        <path d="M6 12l4-4h8l2 4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <rect x="14" y="20" width="12" height="2" rx="1" fill="currentColor" />
      </svg>
    ),
  },
];

const CATEGORY_ROWS = [
  {
    title: "Armory",
    path: "/shop/armory",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path d="M20 4L8 10v10c0 7.18 5.2 13.9 12 15.5C27.8 33.9 32 27.18 32 20V10L20 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M14 20l4 4 8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Arsenal",
    path: "/shop/arsenal",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect x="4" y="15" width="26" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M30 18h4a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 25v4M16 25v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Accessories",
    path: "/shop/accessories",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path d="M20 8C13 8 8 14 8 20s5 12 12 12 12-6 12-12S27 8 20 8Z" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="3" stroke="currentColor" strokeWidth="1.3" />
        <path d="M20 4v4M20 32v4M4 20h4M32 20h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Apparel",
    path: "/shop/apparel",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path d="M14 6h12M14 6L6 14l6 4v16h16V18l6-4-8-8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M14 6c0 3.314 2.686 6 6 6s6-2.686 6-6" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

const PRODUCT_CARDS = [
  {
    name: "Cyberpunk Mask (Cyborg)",
    price: "SGD 376.71",
    note: "5 people have this in their basket",
    image: "/story4.jpg",
    position: "center 18%",
  },
  {
    name: "Cyberpunk Shaman Mask",
    price: "SGD 403.62",
    note: "12 people have this in their basket",
    image: "/story3.jpg",
    position: "center 18%",
  },
  {
    name: "Oni War Mask",
    price: "SGD 428.00",
    note: "3 people have this in their basket",
    image: "/story1.jpg",
    position: "center 28%",
  },
  {
    name: "Hollow Smile Mask",
    price: "SGD 392.40",
    note: "8 people have this in their basket",
    image: "/story2.jpg",
    position: "center 18%",
  },
];

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="20" r="1.2" fill="currentColor" />
      <circle cx="18" cy="20" r="1.2" fill="currentColor" />
      <path d="M3 4h2l2.2 9.2a1.5 1.5 0 0 0 1.46 1.16h8.78a1.5 1.5 0 0 0 1.46-1.16L21 8H7.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  const router = useRouter();
  const [activeBackground, setActiveBackground] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const loadTimer = setTimeout(() => setLoaded(true), 120);
    const cycleTimer = setInterval(() => {
      setActiveBackground((current) => (current + 1) % HERO_BACKGROUNDS.length);
    }, 4200);

    return () => {
      clearTimeout(loadTimer);
      clearInterval(cycleTimer);
    };
  }, []);

  function navigate(path) {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => router.push(path), 500);
  }

  return (
    <main className="sc-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800;900&family=Barlow:wght@400;500;600;700&display=swap');

        :root {
          --bg: #060304;
          --panel: rgba(14, 7, 8, 0.64);
          --panel-strong: rgba(18, 7, 8, 0.84);
          --line: rgba(201, 58, 53, 0.5);
          --line-strong: rgba(255, 93, 84, 0.7);
          --red: #d65047;
          --text-dim: rgba(255, 219, 214, 0.62);
          --ease: cubic-bezier(0.22, 1, 0.36, 1);
        }

        * { box-sizing: border-box; }
        html, body {
          margin: 0;
          background: #000;
          overflow-x: hidden;
        }

        .sc-page {
          position: relative;
          min-height: 100vh;
          color: #fff6f3;
          background: #050203;
          font-family: 'Barlow', sans-serif;
        }

        .sc-bg-wrap {
          position: fixed;
          inset: 0;
          overflow: hidden;
          z-index: 0;
        }

        .sc-bg {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 1.2s var(--ease), transform 4.2s ease;
          transform: scale(1.04);
        }

        .sc-bg.on {
          opacity: 1;
          transform: scale(1);
        }

        .sc-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 18%;
          filter: brightness(0.33) saturate(0.75) contrast(1.02);
        }

        .sc-bg-overlay,
        .sc-smoke,
        .sc-grid,
        .sc-noise {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .sc-bg-overlay {
          background:
            linear-gradient(180deg, rgba(0,0,0,0.24) 0%, rgba(0,0,0,0.56) 26%, rgba(0,0,0,0.74) 58%, rgba(0,0,0,0.92) 100%),
            radial-gradient(circle at 22% 18%, rgba(255, 70, 60, 0.1), transparent 20%);
        }

        .sc-smoke {
          background:
            radial-gradient(circle at 72% 28%, rgba(255, 68, 58, 0.22), transparent 15%),
            radial-gradient(circle at 62% 52%, rgba(255, 68, 58, 0.16), transparent 18%),
            radial-gradient(circle at 22% 74%, rgba(255, 68, 58, 0.12), transparent 20%);
          filter: blur(26px);
          animation: smokeDrift 9s ease-in-out infinite alternate;
          opacity: 0.92;
        }

        .sc-grid {
          background:
            linear-gradient(rgba(255, 82, 72, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 82, 72, 0.03) 1px, transparent 1px);
          background-size: 34px 34px;
          opacity: 0.22;
        }

        .sc-noise {
          background-image:
            radial-gradient(circle at 18% 22%, rgba(255,255,255,0.08) 0 1px, transparent 2px),
            radial-gradient(circle at 74% 38%, rgba(255,126,111,0.08) 0 1px, transparent 2px),
            radial-gradient(circle at 58% 76%, rgba(255,255,255,0.05) 0 1px, transparent 2px);
          background-size: 180px 180px;
          opacity: 0.16;
        }

        .sc-content {
          position: relative;
          z-index: 2;
          width: min(100%, 1220px);
          margin: 0 auto;
          padding: 20px 18px 32px;
        }

        .sc-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 34px;
          opacity: 0;
          transform: translateY(-8px);
          transition: opacity 0.8s var(--ease), transform 0.8s var(--ease);
        }

        .sc-topbar.on {
          opacity: 1;
          transform: translateY(0);
        }

        .sc-brand {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(28px, 3vw, 36px);
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .sc-cart {
          width: 44px;
          height: 44px;
          border: 1px solid var(--line);
          background: rgba(13, 6, 7, 0.7);
          color: #fff0ec;
          display: grid;
          place-items: center;
          position: relative;
        }

        .sc-cart svg {
          width: 19px;
          height: 19px;
        }

        .sc-cart::after {
          content: "";
          position: absolute;
          top: -4px;
          right: -4px;
          width: 11px;
          height: 11px;
          border-radius: 999px;
          background: #ff5a4d;
          box-shadow: 0 0 12px rgba(255, 90, 77, 0.9);
        }

        .sc-hero {
          min-height: 520px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          padding-top: 34px;
        }

        .sc-copy {
          width: min(100%, 320px);
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.95s var(--ease) 0.12s, transform 0.95s var(--ease) 0.12s;
        }

        .sc-copy.on {
          opacity: 1;
          transform: translateY(0);
        }

        .sc-title {
          margin: 0;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(68px, 10vw, 124px);
          font-weight: 900;
          line-height: 0.88;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .sc-subcopy {
          margin-top: 16px;
          font-size: 14px;
          line-height: 1.4;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(207, 93, 83, 0.82);
        }

        .sc-section-stack {
          margin-top: -36px;
        }

        .sc-card-stack {
          display: grid;
          gap: 12px;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.9s var(--ease) 0.28s, transform 0.9s var(--ease) 0.28s;
        }

        .sc-card-stack.on {
          opacity: 1;
          transform: translateY(0);
        }

        .sc-feature-card,
        .sc-category-row,
        .sc-about,
        .sc-product-card {
          background: linear-gradient(180deg, rgba(20, 8, 9, 0.72), rgba(12, 5, 6, 0.78));
          border: 1px solid var(--line);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.02);
          backdrop-filter: blur(6px);
        }

        .sc-feature-card {
          width: 100%;
          display: flex;
          align-items: stretch;
          overflow: hidden;
          min-height: 118px;
          text-align: left;
        }

        .sc-feature-main {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 18px;
        }

        .sc-feature-icon,
        .sc-category-icon {
          width: 34px;
          height: 34px;
          color: rgba(205, 79, 71, 0.9);
          flex: 0 0 auto;
        }

        .sc-feature-icon svg,
        .sc-category-icon svg {
          width: 100%;
          height: 100%;
        }

        .sc-feature-title,
        .sc-category-title {
          margin: 0;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(26px, 3.2vw, 38px);
          font-weight: 700;
          line-height: 1;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .sc-feature-sub {
          margin-top: 8px;
          font-size: 13px;
          line-height: 1.2;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(202, 94, 86, 0.78);
        }

        .sc-feature-arrow {
          width: 26px;
          height: 26px;
          margin-left: auto;
          border: 1px solid rgba(201, 58, 53, 0.3);
          border-radius: 999px;
          display: grid;
          place-items: center;
          color: rgba(202, 94, 86, 0.84);
          font-size: 12px;
        }

        .sc-feature-thumb {
          width: min(34vw, 220px);
          position: relative;
          overflow: hidden;
        }

        .sc-feature-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 12%;
          filter: brightness(0.82) contrast(1.04);
        }

        .sc-about {
          padding: 18px 18px 20px;
          margin-top: 12px;
        }

        .sc-about-title {
          margin: 0 0 8px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(24px, 3vw, 42px);
          line-height: 1;
          font-weight: 700;
        }

        .sc-about-body {
          margin: 0;
          max-width: 940px;
          font-size: clamp(13px, 1.45vw, 16px);
          line-height: 1.5;
          color: var(--text-dim);
        }

        .sc-category-list {
          display: grid;
          gap: 10px;
          margin-top: 14px;
        }

        .sc-category-row {
          display: flex;
          align-items: center;
          gap: 16px;
          width: 100%;
          min-height: 94px;
          padding: 0 16px;
          text-align: left;
        }

        .sc-products {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 18px;
        }

        .sc-product-card {
          overflow: hidden;
        }

        .sc-product-image {
          aspect-ratio: 1 / 1.08;
          background: rgba(255,255,255,0.02);
        }

        .sc-product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.82) contrast(1.04);
        }

        .sc-product-body {
          padding: 10px 10px 14px;
        }

        .sc-product-name {
          margin: 0;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(18px, 2.4vw, 30px);
          font-weight: 600;
          line-height: 1.02;
          text-transform: uppercase;
        }

        .sc-product-price {
          margin-top: 6px;
          color: #ffc18b;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(22px, 3vw, 34px);
          font-weight: 700;
          text-transform: uppercase;
        }

        .sc-pill {
          display: inline-flex;
          align-items: center;
          min-height: 28px;
          padding: 0 10px;
          margin-top: 8px;
          border-radius: 999px;
          background: rgba(56, 120, 47, 0.72);
          color: #d9ffcf;
          font-size: 12px;
          font-weight: 600;
        }

        .sc-product-note {
          margin-top: 8px;
          color: rgba(232, 115, 107, 0.84);
          font-size: clamp(12px, 1.5vw, 15px);
          line-height: 1.25;
        }

        .sc-button {
          cursor: pointer;
          transition: border-color 0.24s ease, background 0.24s ease, transform 0.24s ease;
        }

        .sc-button:hover {
          border-color: var(--line-strong);
          background: linear-gradient(180deg, rgba(28, 8, 10, 0.78), rgba(16, 4, 5, 0.88));
          transform: translateY(-1px);
        }

        .sc-loader {
          position: fixed;
          inset: 0;
          z-index: 10;
          display: grid;
          place-items: center;
          background: rgba(0,0,0,0.66);
          backdrop-filter: blur(4px);
        }

        .sc-loader p {
          margin: 0;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 16px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
        }

        @keyframes smokeDrift {
          0% { transform: translate3d(-4%, -1%, 0) scale(1); }
          50% { transform: translate3d(2%, 2%, 0) scale(1.06); }
          100% { transform: translate3d(-2%, 4%, 0) scale(0.98); }
        }

        @media (min-width: 900px) {
          .sc-content {
            padding: 26px 28px 46px;
          }

          .sc-hero {
            min-height: 640px;
            padding-top: 56px;
          }

          .sc-copy {
            width: 420px;
          }

          .sc-section-stack {
            margin-top: -90px;
            width: min(100%, 720px);
          }

          .sc-products {
            gap: 16px;
          }

          .sc-feature-thumb {
            width: 220px;
          }
        }

        @media (max-width: 640px) {
          .sc-content {
            padding: 16px 12px 24px;
          }

          .sc-hero {
            min-height: 430px;
          }

          .sc-copy {
            width: 240px;
          }

          .sc-title {
            font-size: 64px;
          }

          .sc-feature-card {
            min-height: 106px;
          }

          .sc-feature-main {
            padding: 12px 14px;
            gap: 12px;
          }

          .sc-feature-thumb {
            width: 120px;
          }

          .sc-category-row {
            min-height: 86px;
          }

          .sc-product-body {
            padding: 10px 8px 12px;
          }
        }
      `}</style>

      <div className="sc-bg-wrap">
        {HERO_BACKGROUNDS.map((src, index) => (
          <div key={src} className={`sc-bg ${index === activeBackground ? "on" : ""}`}>
            <img src={src} alt="Savechanges background" />
          </div>
        ))}
        <div className="sc-bg-overlay" />
        <div className="sc-smoke" />
        <div className="sc-grid" />
        <div className="sc-noise" />
      </div>

      <div className="sc-content">
        <header className={`sc-topbar ${loaded ? "on" : ""}`}>
          <div className="sc-brand">Savechanges</div>
          <button type="button" className="sc-cart sc-button" onClick={() => navigate("/shop")} aria-label="Cart">
            <CartIcon />
          </button>
        </header>

        <section className="sc-hero">
          <div className={`sc-copy ${loaded ? "on" : ""}`}>
            <h1 className="sc-title">
              ALTER
              <br />
              YOUR
              <br />
              EGO.
            </h1>
            <p className="sc-subcopy">Choose your new identity</p>
          </div>
        </section>

        <section className="sc-section-stack">
          <div className={`sc-card-stack ${loaded ? "on" : ""}`}>
            {FEATURE_CARDS.map((card) => (
              <button key={card.title} type="button" className="sc-feature-card sc-button" onClick={() => navigate(card.path)}>
                <div className="sc-feature-main">
                  <div className="sc-feature-icon">{card.icon}</div>
                  <div>
                    <h2 className="sc-feature-title">{card.title}</h2>
                    <div className="sc-feature-sub">{card.subtitle}</div>
                  </div>
                  <div className="sc-feature-arrow">&gt;</div>
                </div>
                <div className="sc-feature-thumb">
                  <img src={card.image} alt={card.title} />
                </div>
              </button>
            ))}
          </div>

          <section className="sc-about">
            <h2 className="sc-about-title">Where Artistry Meets Alter Ego</h2>
            <p className="sc-about-body">
              We specialize in bringing creatures, and whimsical characters to life through handcrafted masks and bespoke costume pieces. Produced in controlled batches, we work as a tribute to the art of the character. By blending traditional clay craft with modern digital design and meticulous hand painting, we ensure every piece meets an exacting standard of quality. Because we prioritize craftsmanship over mass production, each item is given the time and attention it deserves to become something truly unique. Step into a new identity. Embrace the extraordinary.
            </p>
          </section>

          <div className="sc-category-list">
            {CATEGORY_ROWS.map((row) => (
              <button key={row.title} type="button" className="sc-category-row sc-button" onClick={() => navigate(row.path)}>
                <div className="sc-category-icon">{row.icon}</div>
                <h3 className="sc-category-title">{row.title}</h3>
              </button>
            ))}
          </div>

          <section className="sc-products">
            {PRODUCT_CARDS.map((product) => (
              <article key={product.name} className="sc-product-card">
                <div className="sc-product-image">
                  <img src={product.image} alt={product.name} style={{ objectPosition: product.position }} />
                </div>
                <div className="sc-product-body">
                  <h3 className="sc-product-name">{product.name}</h3>
                  <div className="sc-product-price">{product.price}</div>
                  <div className="sc-pill">FREE delivery</div>
                  <div className="sc-product-note">{product.note}</div>
                </div>
              </article>
            ))}
          </section>
        </section>
      </div>

      {transitioning ? (
        <div className="sc-loader">
          <p>Loading</p>
        </div>
      ) : null}
    </main>
  );
}
