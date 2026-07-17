"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Ported from the "Sentra" design's Three.js hero camera.
const ACCENT = "#22d3ee";
const SHELL = "#dfe7ee";
const DARK = "#11161d";
const GLASS = "#05080b";

/**
 * Bullet-style surveillance camera (ported 1:1 from the Sentra design).
 * Slowly pans/scans, drifts toward the pointer, floats, and pulses its beam.
 */
export function SecurityCamera({
  reducedMotion = false,
}: {
  reducedMotion?: boolean;
}) {
  const cam = useRef<THREE.Group>(null);
  const coneMat = useRef<THREE.MeshBasicMaterial>(null);
  const gringMat = useRef<THREE.MeshStandardMaterial>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state) => {
    const g = cam.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const tx = pointer.current.x;
    const ty = pointer.current.y;

    // Slow scan pan + drift toward pointer (matches Sentra).
    const scan = reducedMotion ? 0 : Math.sin(t * 0.35) * 0.5;
    g.rotation.y += (scan + tx * 0.4 - g.rotation.y) * 0.05 + (reducedMotion ? 0 : 0.0008);
    g.rotation.x += (-ty * 0.22 - g.rotation.x) * 0.05;
    g.position.y = 0.1 + (reducedMotion ? 0 : Math.sin(t * 0.8) * 0.07);

    if (coneMat.current) {
      coneMat.current.opacity = 0.06 + Math.abs(Math.sin(t * 1.1)) * 0.07;
    }
    if (gringMat.current) {
      gringMat.current.emissiveIntensity = 1.1 + Math.sin(t * 2) * 0.5;
    }
  });

  return (
    <group ref={cam} position={[0, 0.1, 0]} scale={1.15}>
      {/* body (bullet) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 2.1, 40]} />
        <meshStandardMaterial color={SHELL} metalness={0.5} roughness={0.42} />
      </mesh>

      {/* back cap */}
      <mesh position={[0, 0, -1.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <sphereGeometry args={[0.55, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={SHELL} metalness={0.5} roughness={0.42} />
      </mesh>

      {/* sunshield */}
      <mesh position={[0, 0.06, 0.35]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.63, 0.63, 1.15, 40, 1, true, 0, Math.PI]} />
        <meshStandardMaterial color={SHELL} metalness={0.5} roughness={0.42} side={THREE.DoubleSide} />
      </mesh>

      {/* front bezel ring */}
      <mesh position={[0, 0, 1.05]}>
        <torusGeometry args={[0.5, 0.075, 20, 44]} />
        <meshStandardMaterial color={DARK} metalness={0.6} roughness={0.35} />
      </mesh>

      {/* accent glow ring */}
      <mesh position={[0, 0, 1.09]}>
        <torusGeometry args={[0.4, 0.028, 16, 44]} />
        <meshStandardMaterial
          ref={gringMat}
          color={ACCENT}
          emissive={ACCENT}
          emissiveIntensity={1.4}
          metalness={0.4}
          roughness={0.3}
          toneMapped={false}
        />
      </mesh>

      {/* lens */}
      <mesh position={[0, 0, 1.08]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.2, 40]} />
        <meshStandardMaterial color={GLASS} metalness={0.9} roughness={0.08} />
      </mesh>
      <mesh position={[0, 0, 1.12]} rotation={[-Math.PI / 2, 0, 0]}>
        <sphereGeometry args={[0.34, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={GLASS} metalness={0.9} roughness={0.08} />
      </mesh>

      {/* IR dots around the lens */}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.46, Math.sin(a) * 0.46, 1.06]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshStandardMaterial color="#2a3a48" emissive="#223344" emissiveIntensity={0.4} />
          </mesh>
        );
      })}

      {/* mount arm + joint + base plate */}
      <mesh position={[0, -0.85, -0.55]} rotation={[-0.32, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 1.1, 20]} />
        <meshStandardMaterial color={DARK} metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, -0.42, -0.42]}>
        <sphereGeometry args={[0.17, 24, 20]} />
        <meshStandardMaterial color={DARK} metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, -1.4, -0.72]}>
        <cylinderGeometry args={[0.42, 0.42, 0.12, 32]} />
        <meshStandardMaterial color={SHELL} metalness={0.5} roughness={0.42} />
      </mesh>

      {/* scanning cone / field-of-view beam */}
      <mesh position={[0, 0, 2.85]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[1.15, 3.4, 40, 1, true]} />
        <meshBasicMaterial
          ref={coneMat}
          color={ACCENT}
          transparent
          opacity={0.09}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
