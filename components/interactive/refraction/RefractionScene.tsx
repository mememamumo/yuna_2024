"use client";

import { useGLTF } from "@/drei/src/core";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import {
  ShapeKey,
  shapeMotionSettings,
} from "@/lib/settings/shapeMotionSettings";
import { TrailEngine } from "../mouse-trail/TrailEngine";
import refractionFragmentShader from "./shaders/refractionFragmentShader";
import refractionVertexShader from "./shaders/refractionVertexShader";
import createGridRoomMesh from "./utils/createGridRoomMesh";
import WaveShape from "./WaveShape";

type RefractionSceneProps = {
  sceneTexture: THREE.Texture;
  dummyScene: THREE.Scene;
  trailEngine: TrailEngine;
};

export default function RefractionScene({
  sceneTexture,
  dummyScene,
  trailEngine,
}: RefractionSceneProps) {
  const { mouse, camera } = useThree();

  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const gridRoomRef = useRef<THREE.Group>(null);

  const torusRef = useRef<THREE.Mesh>(null);
  const cylinderRef = useRef<THREE.Mesh>(null);
  const cubeRef = useRef<THREE.Mesh>(null);
  const waveRef = useRef<THREE.Mesh>(null);

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouseVec2 = useRef(new THREE.Vector2());
  const lastGridRotation = useRef(new THREE.Euler());

  const [isReady, setIsReady] = useState(false);
  const [gridRoomMeshForDummy, setGridRoomMeshForDummy] =
    useState<THREE.Group | null>(null);
  const [gridRoomMeshForMain, setGridRoomMeshForMain] =
    useState<THREE.Group | null>(null);

  const stateMap = useRef(
    new Map<
      ShapeKey,
      {
        ref: React.RefObject<THREE.Mesh>;
        baseVelocity: number;
        boostVelocity: number;
        direction: number;
        decay: number;
        gain: number;
        max: number;
        damp: number;
      }
    >(
      (
        Object.entries({
          cube: { ref: cubeRef },
          torus: { ref: torusRef },
          cylinder: { ref: cylinderRef },
          wave: { ref: waveRef },
        }) as [ShapeKey, { ref: React.RefObject<THREE.Mesh> }][]
      ).map(([key, base]) => {
        const setting = shapeMotionSettings[key];
        return [
          key,
          {
            ...base,
            ...setting,
            boostVelocity: 0,
            direction: 1,
            decay: 0,
          },
        ];
      })
    )
  );

  const { nodes } = useGLTF("/model/shapes.gltf") as any;

  // 비동기 GridRoom load
  useEffect(() => {
    (async () => {
      const dummy = await createGridRoomMesh();
      const main = await createGridRoomMesh();
      setGridRoomMeshForDummy(dummy);
      setGridRoomMeshForMain(main);
    })();
  }, []);

  useEffect(() => {
    if (dummyScene && gridRoomMeshForDummy) {
      dummyScene.add(gridRoomMeshForDummy);
      setIsReady(true);
    }
  }, [dummyScene, gridRoomMeshForDummy]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: refractionVertexShader,
      fragmentShader: refractionFragmentShader,
      uniforms: {
        uSceneTexture: { value: sceneTexture },
        uTransparent: { value: 0.5 }, // 투명도 강함
        uRefractPower: { value: 0.3 }, // 굴절 강도 강화
        winResolution: {
          value: new THREE.Vector2(
            window.innerWidth,
            window.innerHeight
          ).multiplyScalar(Math.min(window.devicePixelRatio, 2)),
        },
        uVelocity: { value: 1.0 }, //트레일/움직임 반응속도 0.8 ~ 1.5
        uActiveCount: { value: 0 }, //활성 트레일 수 0 ~ 30 (트레일 길이)
        uDecay: { value: 1.0 }, //트레일 감쇠 속도 0.95 ~ 1.0
        uTrailTexture: { value: null },
        uPointer: { value: new THREE.Vector2() },
      },
      transparent: true,
      toneMapped: false,
    });
  }, [sceneTexture]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uSceneTexture.value = sceneTexture;
    }
  }, [sceneTexture]);

  useFrame(({ clock }) => {
    if (!isReady) return;

    const t = clock.getElapsedTime();
    const pointer =
      materialRef.current?.uniforms.uPointer.value ?? new THREE.Vector2(0, 0);
    const pointerDelta = trailEngine.getPointerDelta();

    mouseVec2.current.copy(mouse);
    raycaster.setFromCamera(mouseVec2.current, camera);

    const objects: THREE.Object3D[] = [];
    stateMap.current.forEach((s) => {
      if (s.ref.current) objects.push(s.ref.current);
    });

    const hits = raycaster.intersectObjects(objects, false);
    const hitSet = new Set(hits.map((h) => h.object));

    const decayRate = 1 / 60;
    const mx = Math.abs(mouse.x);
    const my = Math.abs(mouse.y);
    const rotationSpeed = mx + my > 0.01 ? 0.05 : 0.015;

    const rotateGrid = (group: THREE.Group | null | undefined) => {
      if (!group) return;
      const prev = lastGridRotation.current;

      const nextX = THREE.MathUtils.lerp(
        group.rotation.x,
        mouse.y * 0.3,
        rotationSpeed
      );
      const nextY = THREE.MathUtils.lerp(
        group.rotation.y,
        mouse.x * 0.5,
        rotationSpeed
      );

      const hasChanged =
        Math.abs(nextX - prev.x) > 0.0001 || Math.abs(nextY - prev.y) > 0.0001;

      if (hasChanged) {
        group.rotation.x = nextX;
        group.rotation.y = nextY;
        lastGridRotation.current.set(nextX, nextY, 0);
      }
    };

    rotateGrid(gridRoomRef.current);
    rotateGrid(gridRoomMeshForDummy);

    const deltaX = pointer.x;
    const deltaY = pointer.y;

    stateMap.current.forEach((state, key) => {
      const mesh = state.ref.current;
      if (!mesh) return;

      if (hitSet.has(mesh) && pointerDelta > 0.002) {
        const mainDelta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
        if (Math.abs(mainDelta) > 0.005) {
          if (Math.sign(mainDelta) !== Math.sign(state.direction)) {
            state.direction *= -1;
          }
        }

        const boost = Math.pow(pointerDelta + 0.01, 1.4) * state.gain;
        state.boostVelocity = Math.min(state.boostVelocity + boost, state.max);
        state.decay = 1.0;
      } else if (state.decay > 0) {
        state.decay -= decayRate;
        state.boostVelocity *= state.damp;
      }

      const speed = state.baseVelocity + state.boostVelocity;

      if (key === "cube") {
        mesh.rotation.x += speed * state.direction;
        mesh.rotation.y += speed * state.direction * 1.2;

        // 초기 Y 저장 후 sin offset 추가
        if (!("initialY" in mesh.userData)) {
          mesh.userData.initialY = mesh.position.y;
        }
        mesh.position.y = mesh.userData.initialY + Math.sin(t * 1.0) * 0.05;
      }
      if (key === "torus") {
        mesh.rotation.x += speed * state.direction * 0.4;
        mesh.rotation.y += speed * state.direction;
        mesh.rotation.z += speed * state.direction * 0.5;
      }
      if (key === "cylinder") {
        mesh.rotation.x += speed * state.direction * 0.3;
        mesh.rotation.y += speed * state.direction;
        mesh.rotation.z = Math.sin(t * 0.5) * 0.5;
      }
      if (key === "wave") {
        mesh.rotation.z += speed * state.direction;
        mesh.rotation.x += speed * state.direction * 0.2;
      }
    });
  });

  return (
    <>
      <WaveShape ref={waveRef} material={material} position={[-2.7, -1, 0]} />
      {/* {nodes.Cube && (
        <mesh
          ref={cubeRef}
          geometry={nodes.Cube.geometry}
          material={material}
          position={[2, -0.3, 0]}
          scale={[0.1, 0.1, 0.1]}
        />
      )} */}
      {nodes.Torus && (
        <mesh
          ref={torusRef}
          geometry={nodes.Torus.geometry}
          material={material}
          position={[2.3, -0.3, 0]}
          scale={[0.1, 0.1, 0.1]}
          rotation={[0.5, 0, 0]}
        />
      )}
      {nodes.Cylinder && (
        <mesh
          ref={cylinderRef}
          geometry={nodes.Cylinder.geometry}
          material={material}
          position={[-2.5, 1, 0]}
          scale={[0.05, 0.05, 0.05]}
        />
      )}
      {gridRoomMeshForMain && (
        <primitive
          object={gridRoomMeshForMain}
          ref={gridRoomRef}
          position={[0, 0, -0.01]}
        />
      )}
    </>
  );
}
