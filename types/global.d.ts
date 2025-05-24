import { RefractionMaterial as RefractionMaterialImpl } from "@/components/interactive/refraction/RefractionMaterial";

declare global {
  interface Window {
    __THREE__?: {
      scene: THREE.Scene;
      renderer: THREE.WebGLRenderer;
      camera: THREE.Camera;
    };
  }

  namespace JSX {
    interface IntrinsicElements {
      refractionMaterial: ReactThreeFiber.Object3DNode<
        RefractionMaterialImpl,
        typeof RefractionMaterialImpl
      >;
    }
  }
}

export {};
