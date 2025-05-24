import * as THREE from "three";
import { TrailMaterial } from "./TrailMaterial";

export default function createTrailMesh(material: TrailMaterial): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 0, 2);
  mesh.frustumCulled = false;
  mesh.renderOrder = -1;
  return mesh;
}
