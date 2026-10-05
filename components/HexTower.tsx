"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FLOORS, type Unit, type LightColor, LIGHT_COLORS } from "@/data/units";

interface HexTowerProps {
  lightColor: LightColor;
  onUnitClick: (unit: Unit, position: THREE.Vector3) => void;
}

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
  const meshRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const [hovered, setHovered] = useState(false);
  const baseColor = LIGHT_COLORS[lightColor].hex;
  const unitColor = unit.color || baseColor;

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    if (unit.status === "available") {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.15 + Math.sin(t * 2) * 0.1;
    }
    if (unit.status === "isolated") {
      meshRef.current.rotation.y += 0.002;
    }
    if (hovered && meshRef.current) {
      meshRef.current.scale.setScalar(1.05);
    } else {
      meshRef.current.scale.setScalar(1.0);
    }
  });

  const hexShape = useMemo(() => {
    const shape = new THREE.Shape();
    const size = 0.85;
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
      depth: 0.8,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2,
    }),
    []
  );

  const edgesGeometry = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(hexShape, extrudeSettings);
    return new THREE.EdgesGeometry(geo);
  }, [hexShape, extrudeSettings]);

  const getStatusColor = () => {
    switch (unit.status) {
      case "available":
        return "#4488ff";
      case "occupied":
        return unitColor;
      case "isolated":
        return "#ff4444";
    }
  };

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        rotation={[Math.PI / 2, 0, 0]}
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
        <extrudeGeometry args={[hexShape, extrudeSettings]} />
        <meshStandardMaterial
          color={getStatusColor()}
          transparent
          opacity={unit.status === "available" ? 0.2 : 0.6}
          roughness={0.1}
          metalness={0.8}
          emissive={getStatusColor()}
          emissiveIntensity={
            unit.status === "available"
              ? 0.3
              : unit.status === "isolated"
              ? 0.8
              : 0.5
          }
        />
      </mesh>
      <lineSegments ref={edgesRef} geometry={edgesGeometry} rotation={[Math.PI / 2, 0, 0]}>
        <lineBasicMaterial
          color={getStatusColor()}
          transparent
          opacity={hovered ? 1 : 0.6}
          linewidth={1}
        />
      </lineSegments>
      {unit.status === "occupied" && (
        <pointLight
          position={[0, 0, 0.5]}
          color={unitColor}
          intensity={0.5}
          distance={2}
        />
      )}
    </group>
  );
}

export default function HexTower({ lightColor, onUnitClick }: HexTowerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
    if (glowRef.current) {
      const t = state.clock.elapsedTime;
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.05 + Math.sin(t) * 0.02;
    }
  });

  const FLOOR_HEIGHT = 1.2;
  const HEX_RADIUS = 1.1;

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
      {/* 中央核心柱 */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 9, 6]} />
        <meshStandardMaterial
          color={LIGHT_COLORS[lightColor].hex}
          transparent
          opacity={0.15}
          emissive={LIGHT_COLORS[lightColor].hex}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* 外圍光暈 */}
      <mesh ref={glowRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 10, 32]} />
        <meshBasicMaterial
          color={LIGHT_COLORS[lightColor].hex}
          transparent
          opacity={0.05}
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
      <mesh position={[0, 5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
        <meshStandardMaterial
          color={LIGHT_COLORS[lightColor].hex}
          emissive={LIGHT_COLORS[lightColor].hex}
          emissiveIntensity={1}
        />
      </mesh>
      <pointLight
        position={[0, 6, 0]}
        color={LIGHT_COLORS[lightColor].hex}
        intensity={2}
        distance={5}
      />
    </group>
  );
}
