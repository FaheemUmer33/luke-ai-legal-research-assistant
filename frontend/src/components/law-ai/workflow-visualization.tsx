"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { memo, useEffect, useMemo, useRef, useState } from "react";

const palette = {
  deep: "#260201",
  surface: "#4b2e25",
  elevated: "#631c0b",
  accent: "#802d05",
  secondary: "#763b27",
  warm: "#a7704f",
  foreground: "#e6dad8",
};

type WorkflowVisualizationProps = {
  activeIndex: number;
  mode?: "manual" | "ai";
};

const MovingParticle = memo(function MovingParticle({ index, mode }: { index: number; mode: "manual" | "ai" }) {
  const ref = useRef<any>(null);
  const speed = mode === "ai" ? 1.25 + index * 0.12 : 0.28;
  const offset = index * 0.9;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (clock.elapsedTime * speed + offset) % 5;
    const x = -2.2 + t * 1.1;
    const y = Math.sin(t * 1.25) * (mode === "ai" ? 0.32 : 0.12);
    ref.current.position.set(x, y, mode === "ai" ? 0.28 : 0.04);
    ref.current.scale.setScalar(mode === "ai" ? 1 : 0.68);
  });

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial color={mode === "ai" ? palette.foreground : palette.warm} emissive={mode === "ai" ? palette.warm : palette.deep} emissiveIntensity={mode === "ai" ? 1.2 : 0.32} />
      </mesh>
    </group>
  );
});

function WorkflowCore({ activeIndex, mode }: Required<WorkflowVisualizationProps>) {
  const group = useRef<any>(null);
  const nodes = useMemo(
    () => [
      [-2.2, 0.55, 0],
      [-1.1, -0.42, 0.24],
      [0, 0.38, -0.12],
      [1.1, -0.38, 0.22],
      [2.2, 0.5, 0],
    ],
    [],
  );

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * (mode === "ai" ? 0.16 : 0.045);
    group.current.rotation.x = Math.sin(clock.elapsedTime / 2.2) * (mode === "ai" ? 0.08 : 0.025);
  });

  return (
    <group ref={group}>
      {nodes.map((position, index) => (
        <group key={position.join("-")} position={position as [number, number, number]}>
          <mesh>
            <sphereGeometry args={[index === activeIndex ? 0.23 : 0.17, 20, 20]} />
            <meshStandardMaterial
              color={index === activeIndex ? palette.foreground : mode === "ai" ? palette.warm : palette.secondary}
              emissive={index === activeIndex || mode === "ai" ? palette.accent : palette.deep}
              emissiveIntensity={index === activeIndex ? 1 : mode === "ai" ? 0.64 : 0.12}
              metalness={0.58}
              roughness={0.28}
            />
          </mesh>
          <mesh rotation={[0.4, 0.2, 0]}>
            <torusGeometry args={[0.34, 0.01, 8, 48]} />
            <meshStandardMaterial color={mode === "ai" ? palette.foreground : palette.secondary} emissive={palette.elevated} metalness={0.58} roughness={0.24} transparent opacity={mode === "ai" ? 0.78 : 0.34} />
          </mesh>
        </group>
      ))}

      {nodes.slice(0, -1).map((position, index) => {
        const next = nodes[index + 1];
        const mid: [number, number, number] = [
          (position[0] + next[0]) / 2,
          (position[1] + next[1]) / 2,
          (position[2] + next[2]) / 2,
        ];
        const dx = next[0] - position[0];
        const dy = next[1] - position[1];
        const length = Math.sqrt(dx * dx + dy * dy);
        return (
          <mesh key={`edge-${position.join("-")}`} position={mid} rotation={[0, 0, Math.atan2(dy, dx)]}>
            <boxGeometry args={[length, mode === "ai" ? 0.035 : 0.018, mode === "ai" ? 0.035 : 0.018]} />
            <meshStandardMaterial color={index < activeIndex || mode === "ai" ? palette.foreground : palette.secondary} emissive={mode === "ai" ? palette.warm : palette.deep} emissiveIntensity={mode === "ai" ? 0.75 : 0.08} metalness={0.42} roughness={0.3} transparent opacity={mode === "ai" ? 0.9 : 0.42} />
          </mesh>
        );
      })}

      {Array.from({ length: mode === "ai" ? 6 : 2 }).map((_, index) => (
        <MovingParticle key={index} index={index} mode={mode} />
      ))}

      <mesh position={[0, 0, -0.62]}>
        <torusKnotGeometry args={[0.76, mode === "ai" ? 0.042 : 0.024, 80, 8]} />
        <meshStandardMaterial color={mode === "ai" ? palette.accent : palette.surface} emissive={mode === "ai" ? palette.warm : palette.deep} emissiveIntensity={mode === "ai" ? 0.62 : 0.08} metalness={0.82} roughness={0.18} transparent opacity={mode === "ai" ? 0.74 : 0.32} />
      </mesh>
    </group>
  );
}

export function WorkflowVisualization({ activeIndex, mode = "ai" }: WorkflowVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      rootMargin: "160px",
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="h-[360px] w-full overflow-hidden rounded-lg border border-accent-secondary/25 bg-bg-deep/70 shadow-2xl shadow-bg-deep/50">
      <Canvas
        camera={{ position: [0, 0, 5.35], fov: 44 }}
        dpr={[1, 1.25]}
        frameloop={isVisible ? "always" : "demand"}
        gl={{ antialias: false, powerPreference: "low-power" }}
      >
        <ambientLight intensity={mode === "ai" ? 0.82 : 0.42} />
        <pointLight position={[3, 3, 5]} intensity={mode === "ai" ? 34 : 12} color={palette.foreground} />
        <pointLight position={[-4, -3, 3]} intensity={mode === "ai" ? 22 : 8} color={palette.warm} />
        <WorkflowCore activeIndex={activeIndex} mode={mode} />
      </Canvas>
    </div>
  );
}
