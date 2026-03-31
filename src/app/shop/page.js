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

function isMobileDevice() {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
  );
}

export default function Shop() {
  const [step, setStep] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Ref so onLoadedData always sees the latest value without re-binding
  const showVideoRef = useRef(false);

  useEffect(() => {
    const mobile = isMobileDevice();
    setIsMobile(mobile);

    const alreadySeen = sessionStorage.getItem("sc_intro_seen");

    if (alreadySeen || mobile) {
      showVideoRef.current = true;
      setShowVideo(true);
      setShowOverlay(true);
    }
  }, []);

  function handleIntroComplete() {
    sessionStorage.setItem("sc_intro_seen", "1");
    setTimeout(() => {
      showVideoRef.current = true;
      setShowVideo(true);
      // Show overlay shortly after video fades in
      setTimeout(() => setShowOverlay(true), 800);
    }, 600);
  }

  return (
    <div className="bg-black text-white overflow-hidden">

      {/* VIDEO — always mounted, fades in when ready */}
      <div
        className="fixed inset-0 z-0 transition-opacity duration-700"
        style={{ opacity: showVideo ? 1 : 0 }}
      >
        <video
          src="/video1.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          onLoadedData={() => {
            // Use ref so this callback always sees the current value
            if (showVideoRef.current) {
              setTimeout(() => setShowOverlay(true), 800);
            }
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* INTRO — first visit only, sits above video */}
      {!showVideo && !showOverlay && (
        <div className="relative z-10 h-screen flex flex-col justify-center px-6 md:px-16 space-y-4">
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
              onComplete={handleIntroComplete}
            />
          )}
        </div>
      )}

      {/* WIDGETS — over video, responsive layout */}
      {showOverlay && (
        <div className="fixed bottom-16 left-0 right-0 z-10 flex justify-center fade-in px-6">
          <div
            className={`grid gap-6 w-full ${
              isMobile ? "grid-cols-1 max-w-sm" : "grid-cols-3 max-w-4xl"
            }`}
          >
            <SciFiWidget href="/browse" label="BROWSE" index={1} />
            <SciFiWidget href="/about" label="ABOUT" index={2} />
            <SciFiWidget href="/archive" label="ARCHIVE" index={3} />
          </div>
        </div>
      )}

    </div>
  );
}