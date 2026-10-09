"use client";

import { Suspense, useRef, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import HexTower from "./HexTower";
import EnvironmentScene from "./Environment";
import type { Theme, LightColor, Unit } from "@/data/units";

interface SceneProps {
  theme: Theme;
  lightColor: LightColor;
  onUnitClick: (unit: Unit, position: THREE.Vector3) => void;
}

function LoadingFallback() {
  return (
    <mesh>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.5} wireframe />
    </mesh>
  );
}

export default function Scene({ theme, lightColor, onUnitClick }: SceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const handleUnitClick = useCallback(
    (unit: Unit, position: THREE.Vector3) => {
      onUnitClick(unit, position);
      if (controlsRef.current) {
        const controls = controlsRef.current;
        const targetPos = position.clone();
        const startTarget = controls.target.clone();
        const duration = 1000;
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);

          controls.target.lerpVectors(startTarget, targetPos, eased);
          controls.update();

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        animate();
      }
    },
    [onUnitClick]
  );

  return (
    <Canvas
      camera={{ position: [8, 4.5, 8], fov: 48, near: 0.1, far: 100 }}
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor("#050510", 0);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.0;
      }}
    >
      <Suspense fallback={<LoadingFallback />}>
        {/* === 環境光照 — 對齊參考圖的戲劇性打光 === */}
        <EnvironmentScene theme={theme} />

        {/* === 聚光燈 — 對齊參考圖的頂部聚光燈 === */}
        <spotLight
          position={[0, 12, 0]}
          angle={0.4}
          penumbra={0.8}
          intensity={2.5}
          color="#ffffff"
          castShadow={false}
        />
        <spotLight
          position={[5, 8, 5]}
          angle={0.5}
          penumbra={0.9}
          intensity={1.2}
          color="#88ccff"
          castShadow={false}
        />
        <spotLight
          position={[-5, 8, -5]}
          angle={0.5}
          penumbra={0.9}
          intensity={1.0}
          color="#4488ff"
          castShadow={false}
        />

        {/* === 環境貼圖（用於玻璃反射） === */}
        <Environment preset="city" environmentIntensity={0.6} />

        {/* === 六角大樓 === */}
        <HexTower lightColor={lightColor} onUnitClick={handleUnitClick} />

        {/* === Bloom 後處理 — 更強的霓虹極光質感 === */}
        <EffectComposer>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
            mipmapBlur
            radius={0.9}
          />
        </EffectComposer>

        {/* === 軌道控制 — 解除滾輪卡死，允許頁面滾動 === */}
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          rotateSpeed={0.55}
          zoomSpeed={0.8}
          panSpeed={0.45}
          minDistance={5}
          maxDistance={18}
          minPolarAngle={Math.PI * 0.15}
          maxPolarAngle={Math.PI * 0.75}
          autoRotate={true}
          autoRotateSpeed={0.3}
          enableDamping={true}
          dampingFactor={0.08}
        />
      </Suspense>
    </Canvas>
  );
}
