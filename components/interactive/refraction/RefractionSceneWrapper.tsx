"use client";

import { useFBO } from "@/drei/src/core";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import createTrailMesh from "../mouse-trail/createTrailMesh";
import { TrailEngine } from "../mouse-trail/TrailEngine";
import { TrailMaterial } from "../mouse-trail/TrailMaterial";
import RefractionScene from "./RefractionScene";
import createGridRoomMesh from "./utils/createGridRoomMesh";

const COLORS = [
  "#f87171",
  "#fb923c",
  "#facc15",
  "#4ade80",
  "#2dd4bf",
  "#60a5fa",
  "#818cf8",
  "#c084fc",
  "#f472b6",
  "#fbbf24",
];

export default function RefractionSceneWrapper({
  trailMaterial,
}: {
  trailMaterial: TrailMaterial;
}) {
  const { gl, camera, size } = useThree();
  const dummyScene = useMemo(() => new THREE.Scene(), []);
  const [isReady, setIsReady] = useState(false);

  const fboA = useFBO({ stencilBuffer: false });
  const fboB = useFBO({ stencilBuffer: false });

  const writeFBORef = useRef(fboA);
  const readFBORef = useRef(fboB);
  const trailEngineRef = useRef<TrailEngine | null>(null);

  // FBO 해상도 동기화
  useEffect(() => {
    fboA.setSize(size.width / 2, size.height / 2);
    fboB.setSize(size.width / 2, size.height / 2);
  }, [size]);

  // TrailEngine 초기화
  useMemo(() => {
    trailEngineRef.current = new TrailEngine(trailMaterial);
  }, [trailMaterial]);

  // GridRoom 및 TrailMesh 동기화하여 dummyScene 구성
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const [gridRoom, trailMesh] = await Promise.all([
        createGridRoomMesh(),
        Promise.resolve(createTrailMesh(trailMaterial)),
      ]);

      if (cancelled) return;

      if (gridRoom) dummyScene.add(gridRoom);
      if (trailMesh) dummyScene.add(trailMesh);

      setIsReady(true);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [dummyScene, trailMaterial]);

  // FBO 더블 버퍼링 렌더링
  useFrame(({ clock }) => {
    if (!isReady) return;

    const elapsed = clock.getElapsedTime();
    const colorIndex = Math.floor(elapsed * 0.5) % COLORS.length;
    const nextColor = new THREE.Color(COLORS[colorIndex]);

    trailMaterial.uniforms.uTime.value = elapsed;
    trailMaterial.uniforms.uColor.value.copy(nextColor);

    gl.setRenderTarget(writeFBORef.current);
    gl.clear();
    gl.render(dummyScene, camera);
    gl.setRenderTarget(null);

    // Swap buffers
    const temp = writeFBORef.current;
    writeFBORef.current = readFBORef.current;
    readFBORef.current = temp;
  });

  return (
    <RefractionScene
      sceneTexture={readFBORef.current.texture}
      dummyScene={dummyScene}
      trailEngine={trailEngineRef.current!}
    />
  );
}
