"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FLOORS, type Unit, type LightColor, LIGHT_COLORS } from "@/data/units";

interface HexTowerProps {
  lightColor: LightColor;
  onUnitClick: (unit: Unit, position: THREE.Vector3) => void;
}

// ===== 內部核心：金庫/機密型 (C面金流, F面機密) =====
function VaultCore({ color }: { color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.5;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.1;
    }
  });

  return (
    <group ref={groupRef} scale={0.35}>
      {/* 中央金庫主體 */}
      <mesh>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.95}
          roughness={0.15}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* 金庫門環 */}
      <mesh ref={ringRef} position={[0, 0, 0.41]}>
        <torusGeometry args={[0.25, 0.03, 16, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={1}
          roughness={0.1}
          emissive={color}
          emissiveIntensity={0.8}
        />
      </mesh>
      {/* 角落螺絲 */}
      {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([x, y], i) => (
        <mesh key={i} position={[x * 0.35, y * 0.35, 0.41]}>
          <cylinderGeometry args={[0.04, 0.04, 0.05, 8]} />
          <meshStandardMaterial color="#888" metalness={1} roughness={0.2} />
        </mesh>
      ))}
      {/* 漂浮微型粒子 */}
      <FloatingParticles count={20} color={color} radius={0.6} />
    </group>
  );
}

// ===== 內部核心：能量柱型 (A面科技, D面AI) =====
function EnergyCore({ color }: { color: string }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      const mat = coreRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.8 + Math.sin(t * 3) * 0.3;
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.y = t * 0.8;
    }
  });

  return (
    <group scale={0.35}>
      {/* 中央能量柱 */}
      <mesh ref={coreRef}>
        <cylinderGeometry args={[0.15, 0.15, 1.2, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* 環繞管道 */}
      <group ref={ringsRef}>
        {[0.3, 0, -0.3].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.3, 0.02, 8, 24]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.6}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        ))}
      </group>
      {/* 電路板 */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((rot, i) => (
        <mesh key={i} position={[Math.cos(rot) * 0.4, 0, Math.sin(rot) * 0.4]} rotation={[0, -rot, 0]}>
          <boxGeometry args={[0.15, 0.6, 0.02]} />
          <meshStandardMaterial
            color="#0a1a2a"
            metalness={0.7}
            roughness={0.3}
            emissive={color}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
      <FloatingParticles count={15} color={color} radius={0.5} />
    </group>
  );
}

// ===== 內部核心：量子環型 (B面品牌, E面GEO) =====
function QuantumCore({ color }: { color: string }) {
  const ringsRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const spheresRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ringsRef.current) {
      ringsRef.current.rotation.x = t * 0.4;
      ringsRef.current.rotation.z = t * 0.3;
    }
    if (coreRef.current) {
      const mat = coreRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1 + Math.sin(t * 2) * 0.5;
    }
    if (spheresRef.current) {
      spheresRef.current.rotation.y = t * 0.5;
    }
  });

  return (
    <group scale={0.35}>
      {/* 中央發光球 */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* 雙環軌道 */}
      <group ref={ringsRef}>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[0.45, 0.02, 16, 48]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.8}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh rotation={[0, Math.PI / 3, Math.PI / 4]}>
          <torusGeometry args={[0.5, 0.015, 16, 48]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.6}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>
      {/* 懸浮發光球體 */}
      <group ref={spheresRef}>
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i / 5) * Math.PI * 2;
          const r = 0.4;
          return (
            <mesh key={i} position={[Math.cos(angle) * r, Math.sin(angle * 2) * 0.2, Math.sin(angle) * r]}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={1}
                transparent
                opacity={0.8}
              />
            </mesh>
          );
        })}
      </group>
      <FloatingParticles count={12} color={color} radius={0.55} />
    </group>
  );
}

// ===== 空置戶核心：微弱脈動 =====
function EmptyCore({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.2 + Math.sin(t * 1.5) * 0.15;
      ref.current.rotation.y = t * 0.2;
    }
  });

  return (
    <group scale={0.3}>
      <mesh ref={ref}>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.4}
          wireframe
        />
      </mesh>
    </group>
  );
}

// ===== 漂浮粒子系統 =====
function FloatingParticles({ count, color, radius }: { count: number; color: string; radius: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = radius * (0.3 + Math.random() * 0.7);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return pos;
  }, [count, radius]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={color}
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
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

// ===== 單一六角戶別單元 =====
function HexUnit({
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
  const glassRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const baseColor = LIGHT_COLORS[lightColor].hex;
  const unitColor = unit.color || baseColor;

  useFrame((state) => {
    if (groupRef.current && hovered) {
      groupRef.current.scale.lerp(new THREE.Vector3(1.05, 1.05, 1.05), 0.1);
    } else if (groupRef.current) {
      groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  // 六角形形狀
  const hexShape = useMemo(() => {
    const shape = new THREE.Shape();
    const size = 0.82;
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const x = Math.cos(angle) * size;
      const y = Math.sin(angle) * size;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return shape;
  }, []);

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.75,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 3,
    }),
    []
  );

  const getStatusEmissive = () => {
    if (unit.status === "isolated") return "#ff2222";
    if (unit.status === "occupied") return unitColor;
    return "#4488ff";
  };

  const emissiveIntensity = unit.status === "available" ? 0.05 : unit.status === "isolated" ? 0.3 : 0.15;

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
      {/* 外殼：高質感玻璃六角柱 */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <extrudeGeometry args={[hexShape, extrudeSettings]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={unit.status === "available" ? 0.15 : 0.25}
          roughness={0.05}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.05}
          reflectivity={1}
          emissive={getStatusEmissive()}
          emissiveIntensity={emissiveIntensity}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 內部核心 */}
      <InnerCore unit={unit} color={unitColor} />

      {/* 內部點光源 */}
      <pointLight
        position={[0, 0, 0]}
        color={unitColor}
        intensity={unit.status === "available" ? 0.3 : unit.status === "isolated" ? 2 : 1.2}
        distance={3}
        decay={2}
      />

      {/* 底部光暈圈 */}
      {unit.status !== "available" && (
        <mesh position={[0, 0, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.85, 6]} />
          <meshBasicMaterial
            color={unitColor}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

// ===== 主六角大樓 =====
export default function HexTower({ lightColor, onUnitClick }: HexTowerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0008;
    }
    if (coreRef.current) {
      const t = state.clock.elapsedTime;
      const mat = coreRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.5 + Math.sin(t * 2) * 0.2;
    }
  });

  const FLOOR_HEIGHT = 1.15;
  const HEX_RADIUS = 1.05;

  const unitPositions = useMemo(() => {
    const positions: { unit: Unit; pos: [number, number, number] }[] = [];
    FLOORS.forEach((floor) => {
      floor.units.forEach((unit, i) => {
        const angle = (Math.PI / 3) * i;
        const x = Math.cos(angle) * HEX_RADIUS;
        const z = Math.sin(angle) * HEX_RADIUS;
        const y = (floor.floor - 1) * FLOOR_HEIGHT - 3;
        positions.push({ unit, pos: [x, y, z] });
      });
    });
    return positions;
  }, []);

  return (
    <group ref={groupRef}>
      {/* 中央核心柱 - 發光能量柱 */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 8.5, 6]} />
        <meshStandardMaterial
          color={LIGHT_COLORS[lightColor].hex}
          transparent
          opacity={0.3}
          emissive={LIGHT_COLORS[lightColor].hex}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* 中央柱光暈 */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 8.5, 16]} />
        <meshBasicMaterial
          color={LIGHT_COLORS[lightColor].hex}
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* 六角單元 */}
      {unitPositions.map(({ unit, pos }) => (
        <HexUnit
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
      <mesh position={[0, 4.8, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 2, 8]} />
        <meshStandardMaterial
          color={LIGHT_COLORS[lightColor].hex}
          emissive={LIGHT_COLORS[lightColor].hex}
          emissiveIntensity={1.5}
        />
      </mesh>
      <pointLight
        position={[0, 5.8, 0]}
        color={LIGHT_COLORS[lightColor].hex}
        intensity={3}
        distance={8}
        decay={2}
      />

      {/* 黑曜石反射地面 */}
      <mesh position={[0, -4.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color="#0a0a0f"
          metalness={0.95}
          roughness={0.05}
          envMapIntensity={1}
        />
      </mesh>
    </group>
  );
}
