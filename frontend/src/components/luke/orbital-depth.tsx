"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";

function Core() {
  const ref = useRef<any>(null);
  const inner = useRef<any>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.35;
    if (inner.current) {
      inner.current.rotation.x += delta * 0.18;
      inner.current.rotation.z -= delta * 0.22;
    }
  });
  return (
    <group ref={ref}>
      <mesh>
        <torusGeometry args={[1.45, 0.015, 16, 160]} />
        <meshStandardMaterial color="#60a5fa" emissive="#1d4ed8" metalness={0.75} roughness={0.2} />
      </mesh>
      <mesh rotation={[1.25, 0.35, 0.2]}>
        <torusGeometry args={[1.05, 0.012, 16, 160]} />
        <meshStandardMaterial color="#a78bfa" emissive="#5b21b6" metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.58, 1]} />
        <meshStandardMaterial color="#dbeafe" emissive="#2563eb" metalness={0.95} roughness={0.16} transparent opacity={0.86} />
      </mesh>
      {[-1.05, 0, 1.05].map((x, index) => (
        <mesh key={x} position={[x, index === 1 ? 0.9 : -0.65, 0.3]}>
          <boxGeometry args={[0.48, 0.04, 0.28]} />
          <meshStandardMaterial color={index === 1 ? "#f8fafc" : "#93c5fd"} emissive="#0f172a" metalness={0.55} roughness={0.32} />
        </mesh>
      ))}
    </group>
  );
}

export function OrbitalDepth() {
  return (
    <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 opacity-90 md:h-[26rem] md:w-[26rem]">
      <Canvas camera={{ position: [0, 0, 4.8], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[3, 4, 4]} intensity={24} />
        <pointLight position={[-3, -2, 3]} intensity={10} color="#8b5cf6" />
        <Core />
      </Canvas>
    </div>
  );
}
