"use client";

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import * as THREE from "three";

class ModularUCurve extends THREE.Curve<THREE.Vector3> {
  scale: number;

  constructor(scale = 1) {
    super();
    this.scale = scale;
  }

  getPoint(t: number): THREE.Vector3 {
    const waveCount = 6;
    const totalLength = 3;
    const segment = 1 / waveCount;

    const progress = t / segment;
    const current = Math.floor(progress);
    const localT = progress % 1;

    const spacing = totalLength / waveCount;
    const x = current * spacing + localT * spacing - totalLength / 2;
    const isUp = current % 2 === 0;

    const baseY = isUp
      ? -Math.pow(localT - 0.5, 2) + 0.25
      : Math.pow(localT - 0.5, 2) - 0.25;

    const y = baseY * 1.2;
    return new THREE.Vector3(x, y, 0).multiplyScalar(this.scale);
  }
}

interface WaveShapeProps {
  material: THREE.ShaderMaterial;
  position?: [number, number, number];
}

const WaveShape = forwardRef<THREE.Mesh, WaveShapeProps>(
  ({ material, position = [0, 0, 0] }, ref) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useImperativeHandle(ref, () => meshRef.current!, []);

    const curve = useMemo(() => new ModularUCurve(0.6), []);

    const geometry = useMemo(() => {
      const geom = new THREE.TubeGeometry(curve, 300, 0.1, 16, false);
      geom.center();
      return geom;
    }, [curve]);

    return (
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        position={position}
      />
    );
  }
);

export default WaveShape;
