"use client";

import { Suspense, useRef, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
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
  const controlsRef = useRef<any>(null);

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
      camera={{ position: [7, 3.5, 7], fov: 50, near: 0.1, far: 100 }}
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor("#050510", 0);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.2;
      }}
    >
      <Suspense fallback={<LoadingFallback />}>
        {/* 環境光照 */}
        <EnvironmentScene theme={theme} />

        {/* 環境貼圖（用於玻璃反射） */}
        <Environment preset="city" environmentIntensity={0.5} />

        {/* 六角大樓 */}
        <HexTower lightColor={lightColor} onUnitClick={handleUnitClick} />

        {/* Bloom 後處理 — 霓虹極光質感 */}
        <EffectComposer>
          <Bloom
            intensity={1.2}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.85}
            mipmapBlur
            radius={0.85}
          />
        </EffectComposer>

        {/* 軌道控制 — 解除滾輪卡死，允許頁面滾動 */}
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          rotateSpeed={0.5}
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
