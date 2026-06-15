"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";

function Core() {
  const ref = useRef<any>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.35;
  });
  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[1, 0.18, 120, 12]} />
      <meshStandardMaterial color="#60a5fa" emissive="#172554" metalness={0.85} roughness={0.18} />
    </mesh>
  );
}

export function OrbitalDepth() {
  return (
    <div className="pointer-events-none absolute right-4 top-5 h-36 w-36 opacity-70 md:h-52 md:w-52">
      <Canvas camera={{ position: [0, 0, 4], fov: 48 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[3, 3, 4]} intensity={18} />
        <Core />
      </Canvas>
    </div>
  );
}
