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
      camera={{ position: [8, 4, 8], fov: 50, near: 0.1, far: 100 }}
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}
      gl={{
        antialias: true,
        alpha: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.3,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor("#050510");
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.3;
      }}
    >
      <Suspense fallback={<LoadingFallback />}>
        {/* 環境光照 */}
        <EnvironmentScene theme={theme} />

        {/* 環境貼圖（用於玻璃反射） */}
        <Environment preset="city" />

        {/* 六角大樓 */}
        <HexTower lightColor={lightColor} onUnitClick={handleUnitClick} />

        {/* Bloom 後處理 */}
        <EffectComposer>
          <Bloom
            intensity={1.2}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>

        {/* 軌道控制 */}
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={25}
          minPolarAngle={Math.PI * 0.2}
          maxPolarAngle={Math.PI * 0.7}
          autoRotate={false}
          autoRotateSpeed={0.5}
        />
      </Suspense>
    </Canvas>
  );
}
