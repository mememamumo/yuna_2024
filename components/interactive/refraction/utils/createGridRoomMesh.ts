import * as THREE from "three";

export default function createGridRoomMesh(): Promise<THREE.Group> {
  return new Promise((resolve) => {
    const group = new THREE.Group();

    const width = 12;
    const height = 8;
    const depth = 12;

    const geometry = new THREE.BoxGeometry(width, height, depth);
    const materials = [
      new THREE.MeshBasicMaterial({
        color: "#111",
        side: THREE.BackSide,
        toneMapped: false,
      }),
      new THREE.MeshBasicMaterial({
        color: "#111",
        side: THREE.BackSide,
        toneMapped: false,
      }),
      new THREE.MeshBasicMaterial({
        color: "#111",
        side: THREE.BackSide,
        toneMapped: false,
      }),
      new THREE.MeshBasicMaterial({
        color: "#d1d1d5",
        side: THREE.BackSide,
        toneMapped: false,
      }),
      new THREE.MeshBasicMaterial({
        color: "#f1f1f5",
        side: THREE.BackSide,
        toneMapped: false,
      }),
      new THREE.MeshBasicMaterial({
        color: "#f1f1f5",
        side: THREE.BackSide,
        toneMapped: false,
      }),
    ];
    const box = new THREE.Mesh(geometry, materials);
    box.renderOrder = -1;
    group.add(box);

    const loader = new THREE.TextureLoader();

    // 1. 로고 이미지 Plane (left)
    loader.load("/yuna-left.png", (texture) => {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = 4;

      const logo = new THREE.Mesh(
        new THREE.PlaneGeometry(8, 8),
        new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          toneMapped: false,
        })
      );
      logo.position.set(-width / 2 + 0.01, 0, -2);
      logo.rotation.y = Math.PI / 2;
      group.add(logo);
    });

    // 2. 텍스트 이미지 (back 중앙)
    loader.load("/yuna-center.png", (texture) => {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = 4;

      const text = new THREE.Mesh(
        new THREE.PlaneGeometry(9.5, 1.48),
        new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          toneMapped: false,
        })
      );
      text.position.set(0, 0, -depth / 2 + 0.01);
      group.add(text);
    });

    // 3. 사이드 이미지 (right face)
    loader.load("/yuna-right.png", (texture) => {
      const sideImg = new THREE.Mesh(
        new THREE.PlaneGeometry(8, 8),
        new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          toneMapped: false,
        })
      );
      sideImg.position.set(width / 2 - 0.01, 0, -2);
      sideImg.rotation.y = -Math.PI / 2;
      group.add(sideImg);
    });

    // 모든 추가 완료 후 resolve
    resolve(group);
  });
}
