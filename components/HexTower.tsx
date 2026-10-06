"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FLOORS, type Unit, type LightColor, LIGHT_COLORS } from "@/data/units";

interface HexTowerProps {
  lightColor: LightColor;
  onUnitClick: (unit: Unit, position: THREE.Vector3) => void;
}

// ===== 漂浮粒子系統 =====
function FloatingParticles({ count, color, radius }: { count: number; color: string; radius: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  // 使用 useRef 初始化隨機值，避免 React 19 strict mode 錯誤
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    // 使用 deterministic seed 避免 strict mode 問題
    let seed = count * radius * 1000;
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < count; i++) {
      const theta = seededRandom() * Math.PI * 2;
      const phi = seededRandom() * Math.PI;
      const r = radius * (0.3 + seededRandom() * 0.7);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return pos;
  }, [count, radius]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color={color}
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

// ===== 金庫核心 (C面金流, F面機密) — 參考圖1: 藍色金屬保險箱 =====
function VaultCore({ color }: { color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringRef.current) ringRef.current.rotation.z = t * 0.6;
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.4;
    if (groupRef.current) groupRef.current.rotation.y = t * 0.12;
  });

  return (
    <group ref={groupRef} scale={0.32}>
      {/* 中央金屬方塊 — 保險箱主體 */}
      <mesh>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshStandardMaterial
          color="#111122"
          metalness={0.95}
          roughness={0.12}
          emissive={color}
          emissiveIntensity={0.08}
        />
      </mesh>
      {/* 外層旋轉環 */}
      <mesh ref={ringRef} position={[0, 0, 0]}>
        <torusGeometry args={[0.5, 0.025, 16, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={1}
          roughness={0.08}
          emissive={color}
          emissiveIntensity={0.9}
        />
      </mesh>
      {/* 內層反向旋轉環 */}
      <mesh ref={ring2Ref} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.02, 16, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={1}
          roughness={0.1}
          emissive={color}
          emissiveIntensity={0.6}
        />
      </mesh>
      {/* 四角螺絲 */}
      {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([x, y], i) => (
        <mesh key={i} position={[x * 0.3, y * 0.3, 0.36]}>
          <cylinderGeometry args={[0.035, 0.035, 0.04, 8]} />
          <meshStandardMaterial color="#666" metalness={1} roughness={0.15} />
        </mesh>
      ))}
      {/* 側面管道 */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((rot, i) => (
        <mesh key={`pipe-${i}`} position={[Math.cos(rot) * 0.36, 0, Math.sin(rot) * 0.36]} rotation={[0, -rot, 0]}>
          <boxGeometry args={[0.06, 0.5, 0.03]} />
          <meshStandardMaterial
            color="#0a0a1a"
            metalness={0.8}
            roughness={0.2}
            emissive={color}
            emissiveIntensity={0.15}
          />
        </mesh>
      ))}
      <FloatingParticles count={18} color={color} radius={0.55} />
    </group>
  );
}

// ===== 能量核心 (A面科技, D面AI) — 參考圖1: 藍色能量柱 =====
function EnergyCore({ color }: { color: string }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const platesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      const mat = coreRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.8 + Math.sin(t * 3) * 0.4;
    }
    if (ringsRef.current) ringsRef.current.rotation.y = t * 0.9;
    if (platesRef.current) platesRef.current.rotation.y = -t * 0.3;
  });

  return (
    <group scale={0.32}>
      {/* 中央能量柱 */}
      <mesh ref={coreRef}>
        <cylinderGeometry args={[0.12, 0.12, 1.3, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.2}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* 外層能量光柱 */}
      <mesh>
        <cylinderGeometry args={[0.18, 0.18, 1.1, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      {/* 環繞管道環 */}
      <group ref={ringsRef}>
        {[0.35, 0, -0.35].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.32, 0.018, 8, 24]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.7}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        ))}
      </group>
      {/* 電路板 */}
      <group ref={platesRef}>
        {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((rot, i) => (
          <mesh key={i} position={[Math.cos(rot) * 0.42, 0, Math.sin(rot) * 0.42]} rotation={[0, -rot, 0]}>
            <boxGeometry args={[0.12, 0.7, 0.015]} />
            <meshStandardMaterial
              color="#0a1a2a"
              metalness={0.7}
              roughness={0.25}
              emissive={color}
              emissiveIntensity={0.2}
            />
          </mesh>
        ))}
      </group>
      <FloatingParticles count={14} color={color} radius={0.5} />
    </group>
  );
}

// ===== 量子核心 (B面品牌, E面GEO) — 參考圖2: 紫色量子軌道 =====
function QuantumCore({ color }: { color: string }) {
  const ringsRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const spheresRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringsRef.current) {
      ringsRef.current.rotation.x = t * 0.45;
      ringsRef.current.rotation.z = t * 0.3;
    }
    if (coreRef.current) {
      const mat = coreRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.2 + Math.sin(t * 2.5) * 0.6;
    }
    if (spheresRef.current) spheresRef.current.rotation.y = t * 0.55;
  });

  return (
    <group scale={0.32}>
      {/* 中央發光球 */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* 外層光暈球 */}
      <mesh>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>
      {/* 雙環軌道 */}
      <group ref={ringsRef}>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[0.42, 0.018, 16, 48]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.8}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh rotation={[0, Math.PI / 3, Math.PI / 4]}>
          <torusGeometry args={[0.48, 0.014, 16, 48]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.6}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh rotation={[Math.PI / 6, Math.PI / 2, 0]}>
          <torusGeometry args={[0.38, 0.012, 16, 48]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>
      {/* 懸浮發光球體 */}
      <group ref={spheresRef}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i / 6) * Math.PI * 2;
          const r = 0.38;
          return (
            <mesh key={i} position={[Math.cos(angle) * r, Math.sin(angle * 2) * 0.15, Math.sin(angle) * r]}>
              <sphereGeometry args={[0.045, 16, 16]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={1.2}
                transparent
                opacity={0.85}
              />
            </mesh>
          );
        })}
      </group>
      <FloatingParticles count={12} color={color} radius={0.5} />
    </group>
  );
}

// ===== 空置戶核心：微弱脈動 =====
function EmptyCore({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.15 + Math.sin(t * 1.5) * 0.1;
      ref.current.rotation.y = t * 0.2;
      ref.current.rotation.x = t * 0.1;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.3;
    }
  });

  return (
    <group scale={0.28}>
      <mesh ref={ref}>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>
      <mesh ref={innerRef}>
        <octahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
}

// ===== 選擇核心類型 =====
function getCoreType(unit: Unit): "vault" | "energy" | "quantum" | "empty" {
  if (unit.status === "available") return "empty";
  if (unit.face === "C" || unit.face === "F") return "vault";
  if (unit.face === "A" || unit.face === "D") return "energy";
  return "quantum";
}

function InnerCore({ unit, color }: { unit: Unit; color: string }) {
  const coreType = getCoreType(unit);
  switch (coreType) {
    case "vault":
      return <VaultCore color={color} />;
    case "energy":
      return <EnergyCore color={color} />;
    case "quantum":
      return <QuantumCore color={color} />;
    default:
      return <EmptyCore color={color} />;
  }
}

// ===== 單一晶體方塊戶別單元 (對齊參考圖: 玻璃方塊展示櫃) =====
function CrystalUnit({
  unit,
  position,
  lightColor,
  onClick,
}: {
  unit: Unit;
  position: [number, number, number];
  lightColor: LightColor;
  onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const baseColor = LIGHT_COLORS[lightColor].hex;
  const unitColor = unit.color || baseColor;

  useFrame((state) => {
    if (groupRef.current && hovered) {
      groupRef.current.scale.lerp(new THREE.Vector3(1.06, 1.06, 1.06), 0.08);
    } else if (groupRef.current) {
      groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.08);
    }
  });

  const getStatusEmissive = () => {
    if (unit.status === "isolated") return "#ff2222";
    if (unit.status === "occupied") return unitColor;
    return "#4488ff";
  };

  const emissiveIntensity = unit.status === "available" ? 0.03 : unit.status === "isolated" ? 0.2 : 0.1;

  // 晶體方塊尺寸
  const cubeSize = 0.72;

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "crosshair";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* === 外殼：高透光玻璃方塊 (MeshPhysicalMaterial + transmission) === */}
      <mesh>
        <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
        <meshPhysicalMaterial
          color={unit.status === "available" ? "#88ccff" : "#ffffff"}
          transparent
          transmission={unit.status === "available" ? 0.92 : 0.85}
          thickness={0.5}
          roughness={0.02}
          metalness={0.0}
          clearcoat={1}
          clearcoatRoughness={0.02}
          reflectivity={1}
          ior={1.5}
          emissive={getStatusEmissive()}
          emissiveIntensity={emissiveIntensity}
          side={THREE.DoubleSide}
          envMapIntensity={2.0}
        />
      </mesh>

      {/* === 方塊邊框發光線條 === */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)]} />
        <lineBasicMaterial
          color={unit.status === "available" ? "#4488ff" : unitColor}
          transparent
          opacity={unit.status === "available" ? 0.25 : 0.5}
        />
      </lineSegments>

      {/* === 內部核心 === */}
      <InnerCore unit={unit} color={unitColor} />

      {/* === 內部點光源 === */}
      <pointLight
        position={[0, 0, 0]}
        color={unitColor}
        intensity={unit.status === "available" ? 0.2 : unit.status === "isolated" ? 1.8 : 1}
        distance={2.5}
        decay={2}
      />

      {/* === 底部發光底座 === */}
      <mesh position={[0, -cubeSize / 2 - 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[cubeSize * 0.9, cubeSize * 0.9]} />
        <meshBasicMaterial
          color={unitColor}
          transparent
          opacity={unit.status === "available" ? 0.05 : 0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// ===== 主六角大樓 =====
export default function HexTower({ lightColor, onUnitClick }: HexTowerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0006;
    }
    if (coreRef.current) {
      const t = state.clock.elapsedTime;
      const mat = coreRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.4 + Math.sin(t * 2) * 0.15;
    }
  });

  const FLOOR_HEIGHT = 1.05;
  const HEX_RADIUS = 0.95;

  const unitPositions = useMemo(() => {
    const positions: { unit: Unit; pos: [number, number, number] }[] = [];
    FLOORS.forEach((floor) => {
      floor.units.forEach((unit, i) => {
        const angle = (Math.PI / 3) * i;
        const x = Math.cos(angle) * HEX_RADIUS;
        const z = Math.sin(angle) * HEX_RADIUS;
        const y = (floor.floor - 1) * FLOOR_HEIGHT - 2.5;
        positions.push({ unit, pos: [x, y, z] });
      });
    });
    return positions;
  }, []);

  return (
    <group ref={groupRef}>
      {/* 中央核心柱 - 發光能量柱 */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 7.5, 6]} />
        <meshStandardMaterial
          color={LIGHT_COLORS[lightColor].hex}
          transparent
          opacity={0.25}
          emissive={LIGHT_COLORS[lightColor].hex}
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* 中央柱外層光暈 */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 7.5, 16]} />
        <meshBasicMaterial
          color={LIGHT_COLORS[lightColor].hex}
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>

      {/* 晶體方塊單元 */}
      {unitPositions.map(({ unit, pos }) => (
        <CrystalUnit
          key={unit.id}
          unit={unit}
          position={pos}
          lightColor={lightColor}
          onClick={() => {
            const worldPos = new THREE.Vector3(...pos);
            if (groupRef.current) {
              worldPos.applyMatrix4(groupRef.current.matrixWorld);
            }
            onUnitClick(unit, worldPos);
          }}
        />
      ))}

      {/* 頂樓天線 */}
      <mesh position={[0, 4.2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 1.8, 8]} />
        <meshStandardMaterial
          color={LIGHT_COLORS[lightColor].hex}
          emissive={LIGHT_COLORS[lightColor].hex}
          emissiveIntensity={1.5}
        />
      </mesh>
      <pointLight
        position={[0, 5.1, 0]}
        color={LIGHT_COLORS[lightColor].hex}
        intensity={2.5}
        distance={6}
        decay={2}
      />

      {/* === 黑曜石反射地面 (對齊參考圖) === */}
      <mesh position={[0, -3.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[18, 64]} />
        <meshStandardMaterial
          color="#080810"
          metalness={0.97}
          roughness={0.03}
          envMapIntensity={1.5}
        />
      </mesh>
    </group>
  );
}
