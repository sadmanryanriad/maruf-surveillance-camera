"use client";

import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { SecurityCamera } from "./security-camera";

export default function HeroScene() {
  const reduced = useReducedMotion() ?? false;

  // R3F sizes the canvas from a ResizeObserver that can miss the first layout
  // pass when mounted via dynamic import. Nudge a re-measure once mounted.
  useEffect(() => {
    const nudge = () => window.dispatchEvent(new Event("resize"));
    const raf = requestAnimationFrame(() => {
      nudge();
      requestAnimationFrame(nudge);
    });
    const t = setTimeout(nudge, 250);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0.3, 6.2], fov: 38 }}
      dpr={[1, 2]}
      frameloop="always"
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: "none" }}
    >
      {/* Lights ported from the Sentra design */}
      <ambientLight color="#88a0b8" intensity={0.7} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} />
      <directionalLight position={[-5, 2, -3]} intensity={1.6} color="#22d3ee" />
      <pointLight position={[0.6, 0.2, 2]} intensity={3} distance={8} color="#22d3ee" />

      <SecurityCamera reducedMotion={reduced} />
    </Canvas>
  );
}
