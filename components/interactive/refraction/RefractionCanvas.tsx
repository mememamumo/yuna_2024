"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

import { useCursorStore } from "@/store/useCursorStore";
import RefractionSceneWrapper from "./RefractionSceneWrapper";

import TrailDisplayMesh from "../mouse-trail/TrailDisplayMesh";
import { TrailMaterial } from "../mouse-trail/TrailMaterial";

export default function RefractionCanvas() {
  const setCursor = useCursorStore((s) => s.setCursor);

  // 마우스 위치 저장
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setCursor([x, y]);
    };
    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [setCursor]);

  // trailTexture 및 공용 머티리얼 생성
  const trailTexture = useMemo(() => {
    const data = new Float32Array(30 * 2).fill(-10.0);
    const tex = new THREE.DataTexture(
      data,
      30,
      1,
      THREE.RGFormat,
      THREE.FloatType
    );
    tex.needsUpdate = true;
    return tex;
  }, []);

  const trailMaterial = useMemo(
    () => new TrailMaterial(trailTexture),
    [trailTexture]
  );

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ position: "absolute", inset: 0 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 3, 3]} intensity={1} />

        {/* 트레일을 화면에 직접 표시 */}
        <TrailDisplayMesh material={trailMaterial} />

        {/* GridRoom + 트레일을 FBO로 렌더 후 굴절용 sceneTexture 전달 */}
        <RefractionSceneWrapper trailMaterial={trailMaterial} />
      </Canvas>
    </div>
  );
}
