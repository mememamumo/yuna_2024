import * as THREE from "three";

function loadTextureAsync(url: string): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    new THREE.TextureLoader().load(
      url,
      (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = 4;
        texture.needsUpdate = true;
        resolve(texture);
      },
      undefined,
      reject
    );
  });
}

export default async function createGridRoomMesh(): Promise<THREE.Group> {
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

  // 이미지 텍스처 로딩
  const [leftTex, centerTex, rightTex] = await Promise.all([
    loadTextureAsync("/yuna-left.png"),
    loadTextureAsync("/yuna-center.png"),
    loadTextureAsync("/yuna-right.png"),
  ]);

  // 1. 로고 이미지 Plane (left)
  const logo = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    new THREE.MeshBasicMaterial({
      map: leftTex,
      transparent: true,
      toneMapped: false,
    })
  );
  logo.position.set(-width / 2 + 0.01, 0, -2);
  logo.rotation.y = Math.PI / 2;
  group.add(logo);

  // 2. 텍스트 이미지 (back 중앙)
  const text = new THREE.Mesh(
    new THREE.PlaneGeometry(9.5, 1.48),
    new THREE.MeshBasicMaterial({
      map: centerTex,
      transparent: true,
      toneMapped: false,
    })
  );
  text.position.set(0, 0, -depth / 2 + 0.01);
  group.add(text);

  // 3. 사이드 이미지 (right face)
  const sideImg = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    new THREE.MeshBasicMaterial({
      map: rightTex,
      transparent: true,
      toneMapped: false,
    })
  );
  sideImg.position.set(width / 2 - 0.01, 0, -2);
  sideImg.rotation.y = -Math.PI / 2;
  group.add(sideImg);

  return group;
}
