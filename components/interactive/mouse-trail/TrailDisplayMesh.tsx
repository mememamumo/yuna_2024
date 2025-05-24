"use client";

import { useRef } from "react";
import { Mesh } from "three";
import { TrailMaterial } from "./TrailMaterial";

export default function TrailDisplayMesh({
  material,
}: {
  material: TrailMaterial;
}) {
  const meshRef = useRef<Mesh>(null);

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
