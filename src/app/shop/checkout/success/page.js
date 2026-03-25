"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// ─────────────────────────────────────────
// TYPEWRITER — reused from shop/page.js
// ─────────────────────────────────────────
function TypeText({ text, speed = 40, onComplete }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <p className="font-mono text-sm tracking-[0.3em] text-gray-400">
      {displayed}
    </p>
  );
}

export default function CheckoutSuccess() {
  const [step,    setStep]    = useState(0);
  const [showCTA, setShowCTA] = useState(false);

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center px-6 text-center space-y-6">

      {/* Boot sequence mirrors shop/page.js exactly */}
      {step >= 0 && (
        <TypeText text="TRANSACTION CONFIRMED..." onComplete={() => setStep(1)} />
      )}

      {step >= 1 && (
        <TypeText text="IDENTITY PACKAGE: DISPATCHED" onComplete={() => setStep(2)} />
      )}

      {step >= 2 && (
        <TypeText
          text="YOUR NEW FACE IS ON ITS WAY."
          onComplete={() => setTimeout(() => setShowCTA(true), 600)}
        />
      )}

      {/* CTA — uses sci-widget styles from globals.css */}
      {showCTA && (
        <div className="fade-in flex flex-col items-center gap-6 mt-4">

          <div style={{
            width: "1px",
            height: "40px",
            background: "rgba(255,255,255,0.15)",
          }} />

          <p className="font-mono text-[10px] tracking-[0.4em] text-white/25">
            // CHECK YOUR EMAIL FOR ORDER CONFIRMATION
          </p>

          <Link href="/shop/browse">
            <div className="sci-widget" style={{ minWidth: "220px" }}>
              <span className="sci-label">←</span>
              <p>RETURN TO ARCHIVE</p>
            </div>
          </Link>

        </div>
      )}
    </div>
  );
}