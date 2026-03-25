"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useRouter } from "next/navigation";

function Mask() {
  const { scene } = useGLTF("/models/jin_sakai_mask.glb");
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.002;
      ref.current.position.y =
        -0.9 + Math.sin(state.clock.elapsedTime) * 0.08;
    }
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={1.8}
      position={[0, -0.9, 0]}
    />
  );
}

export default function Home() {
  const [entering, setEntering] = useState(false);
  const router = useRouter();

  const handleEnter = () => {
    setEntering(true);

    setTimeout(() => {
      router.push("/shop");
    }, 1200);
  };

  return (
    <div className="bg-black text-white h-screen w-full relative overflow-hidden">

      {/* 3D BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 6] }}>
          <ambientLight intensity={0.2} />
          <directionalLight position={[5, 5, 5]} intensity={2} />
          <pointLight position={[0, 0, 3]} color="red" intensity={2} />

          <Mask />
        </Canvas>
      </div>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* CONTENT */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center">

        <h1 className="text-6xl md:text-8xl font-bold tracking-widest">
          SAVE CHANGES
        </h1>

        <p className="mt-4 text-gray-300 text-lg">
          Become Unrecognizable.
        </p>

        <p className="mt-6 text-xs tracking-[0.3em] text-gray-600">
          WARNING: THIS ACTION CANNOT BE UNDONE
        </p>

        <button
          onClick={handleEnter}
          className="mt-10 px-12 py-4 border border-white text-lg tracking-widest 
          hover:bg-white hover:text-black transition duration-300"
        >
          ERASE IDENTITY
        </button>
      </div>

      {/* TRANSITION SCREEN */}
      {entering && (
        <div className="absolute inset-0 bg-black z-50 flex items-center justify-center animate-fade">
          <div className="text-center">
            <p className="text-xs tracking-[0.4em] text-gray-500">
              PROCESSING
            </p>

            <h2 className="mt-4 text-2xl tracking-widest glitch">
              ERASING IDENTITY...
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}