"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Theme } from "@/data/units";

interface EnvironmentProps {
  theme: Theme;
}

function CyberNight() {
  const particlesRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 2000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
      const c = new THREE.Color();
      c.setHSL(0.55 + Math.random() * 0.1, 0.8, 0.5 + Math.random() * 0.3);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <>
      <fog attach="fog" args={["#050520", 5, 30]} />
      <ambientLight intensity={0.1} color="#2233ff" />
      <directionalLight position={[5, 10, 5]} intensity={0.3} color="#6644ff" />
      <pointLight position={[-10, 5, -10]} intensity={0.5} color="#ff0066" distance={20} />
      <pointLight position={[10, -5, 10]} intensity={0.5} color="#00ffff" distance={20} />
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.05} vertexColors transparent opacity={0.8} sizeAttenuation />
      </points>
      {/* 地面網格 */}
      <gridHelper args={[40, 40, "#0044ff", "#001133"]} position={[0, -5, 0]} />
    </>
  );
}

function CloudMountain() {
  const cloudsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 1500;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = Math.random() * 15 - 3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
      const c = new THREE.Color();
      c.setHSL(0.08 + Math.random() * 0.05, 0.6, 0.7 + Math.random() * 0.3);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <>
      <fog attach="fog" args={["#1a0a2e", 8, 40]} />
      <ambientLight intensity={0.3} color="#ffaa44" />
      <directionalLight position={[10, 15, 5]} intensity={1} color="#ffcc66" />
      <pointLight position={[0, 10, 0]} intensity={0.8} color="#ff8800" distance={30} />
      <points ref={cloudsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.15} vertexColors transparent opacity={0.4} sizeAttenuation />
      </points>
    </>
  );
}

function DeepSea() {
  const particlesRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 1800;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 35;
      const c = new THREE.Color();
      c.setHSL(0.5 + Math.random() * 0.15, 0.9, 0.3 + Math.random() * 0.4);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const t = state.clock.elapsedTime;
      particlesRef.current.rotation.y = t * 0.015;
      particlesRef.current.rotation.x = Math.sin(t * 0.1) * 0.05;
    }
  });

  return (
    <>
      <fog attach="fog" args={["#000815", 3, 25]} />
      <ambientLight intensity={0.05} color="#003366" />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#0066ff" distance={15} />
      <pointLight position={[-8, -3, 5]} intensity={0.4} color="#00ff88" distance={12} />
      <pointLight position={[8, 2, -5]} intensity={0.4} color="#0088ff" distance={12} />
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.06} vertexColors transparent opacity={0.7} sizeAttenuation />
      </points>
    </>
  );
}

export default function Environment({ theme }: EnvironmentProps) {
  switch (theme) {
    case "cyber":
      return <CyberNight />;
    case "cloud":
      return <CloudMountain />;
    case "deepsea":
      return <DeepSea />;
  }
}
