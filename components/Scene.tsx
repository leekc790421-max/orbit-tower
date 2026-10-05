"use client";

import { Suspense, useRef, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import HexTower from "./HexTower";
import Environment from "./Environment";
import type { Theme, LightColor, Unit } from "@/data/units";

interface SceneProps {
  theme: Theme;
  lightColor: LightColor;
  onUnitClick: (unit: Unit, position: THREE.Vector3) => void;
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#00d4ff" wireframe />
    </mesh>
  );
}

export default function Scene({ theme, lightColor, onUnitClick }: SceneProps) {
  const controlsRef = useRef<any>(null);

  const handleUnitClick = useCallback(
    (unit: Unit, position: THREE.Vector3) => {
      onUnitClick(unit, position);
      // 鏡頭聚焦動畫
      if (controlsRef.current) {
        const controls = controlsRef.current;
        const targetPos = position.clone();
        // 平滑移動到目標位置
        const startTarget = controls.target.clone();
        const duration = 1000;
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic

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
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => {
        gl.setClearColor("#050510");
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.2;
      }}
    >
      <Suspense fallback={<LoadingFallback />}>
        <Environment theme={theme} />
        <HexTower lightColor={lightColor} onUnitClick={handleUnitClick} />
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
