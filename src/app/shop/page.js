"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@%$";

function SciFiWidget({ href, label, index }) {
  const labelRef = useRef(null);
  const scrambleRef = useRef(null);

  function startScramble() {
    let frame = 0;
    const total = 14;
    clearInterval(scrambleRef.current);
    scrambleRef.current = setInterval(() => {
      if (!labelRef.current) return;
      if (frame >= total) {
        labelRef.current.textContent = label;
        clearInterval(scrambleRef.current);
        return;
      }
      labelRef.current.textContent = label
        .split("")
        .map((c, i) =>
          i < Math.floor((frame / total) * label.length)
            ? c
            : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        )
        .join("");
      frame++;
    }, 40);
  }

  function stopScramble() {
    clearInterval(scrambleRef.current);
    if (labelRef.current) labelRef.current.textContent = label;
  }

  return (
    <Link href={href}>
      <div
        className="sci-widget"
        onMouseEnter={startScramble}
        onMouseLeave={stopScramble}
      >
        <span className="sci-label">0{index}</span>
        <div className="sci-pulse" />
        <p ref={labelRef}>{label}</p>
        <div className="sci-dot" />
      </div>
    </Link>
  );
}

/* TYPEWRITER */
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

export default function Shop() {
  const [step, setStep] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div className="bg-black text-white overflow-hidden">

      {/* SYSTEM INTRO */}
      {!showVideo && (
        <div className="h-screen flex flex-col justify-center px-6 md:px-16 space-y-4">

          {step >= 0 && (
            <TypeText
              text="INITIALIZING SYSTEM..."
              onComplete={() => setStep(1)}
            />
          )}

          {step >= 1 && (
            <TypeText
              text="IDENTITY STATUS: UNDEFINED"
              onComplete={() => setStep(2)}
            />
          )}

          {step >= 2 && (
            <TypeText
              text="RECOMMENDATION: ERASE IDENTITY"
              onComplete={() => {
                setTimeout(() => setShowVideo(true), 600);
              }}
            />
          )}

        </div>
      )}

      {/* VIDEO + OVERLAY */}
      {showVideo && (
        <div className="fixed inset-0 bg-black z-50">

          {/* VIDEO BACKGROUND */}
          <video
            src="/video1.mp4"
            autoPlay
            muted
            loop
            className="w-full h-full object-cover"
            onLoadedData={() => {
              setTimeout(() => setShowOverlay(true), 1200);
            }}
          />

          {/* DARK LAYER */}
          <div className="absolute inset-0 bg-black/40" />

          {/* WIDGETS — anchored to bottom of screen */}
          {showOverlay && (
            <div className="absolute bottom-16 left-0 right-0 flex justify-center fade-in px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">

                <SciFiWidget href="/browse" label="BROWSE" index={1} />
                <SciFiWidget href="/about" label="ABOUT" index={2} />
                <SciFiWidget href="/archive" label="ARCHIVE" index={3} />

              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}