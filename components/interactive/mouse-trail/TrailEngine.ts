import { DataTexture, FloatType, RGFormat, Vector2 } from "three";
import { TrailMaterial } from "./TrailMaterial";

const TRAIL_COUNT = 30;
const NULL_POS = [-10.0, -10.0];

export class TrailEngine {
  private data: Float32Array;
  private texture: DataTexture;
  private material: TrailMaterial;
  private lastX: number | null = null;
  private lastY: number | null = null;
  private pointerDelta = 0;
  private initialized = false;
  private activeCount = TRAIL_COUNT;
  private decayTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private decayDelay = 120;
  private isDecaying = false;

  constructor(material: TrailMaterial) {
    this.data = new Float32Array(TRAIL_COUNT * 2).fill(
      NULL_POS[0],
      0,
      TRAIL_COUNT * 2
    );
    this.texture = new DataTexture(
      this.data,
      TRAIL_COUNT,
      1,
      RGFormat,
      FloatType
    );
    this.texture.needsUpdate = true;

    this.material = material;
    this.material.uniforms.uTrailTexture.value = this.texture;
    this.material.uniforms.uActiveCount.value = this.activeCount;

    this.material.uniforms.uPointer.value = new Vector2(0, 0);

    this.trackMouse();
  }

  private trackMouse() {
    window.addEventListener("pointermove", (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -((e.clientY / window.innerHeight) * 2 - 1);

      this.material.uniforms.uPointer.value.set(x, y);

      if (this.decayTimeoutId) clearTimeout(this.decayTimeoutId);
      this.decayTimeoutId = setTimeout(
        () => this.animateDecay(),
        this.decayDelay
      );

      if (this.isDecaying) {
        this.isDecaying = false;
        this.activeCount = TRAIL_COUNT;
      }

      if (!this.initialized) {
        for (let i = 0; i < TRAIL_COUNT; i++) {
          this.data[i * 2] = x;
          this.data[i * 2 + 1] = y;
        }
        this.initialized = true;
        this.texture.needsUpdate = true;
        this.lastX = x;
        this.lastY = y;
        this.pointerDelta = 0;
        return;
      }

      const dx = x - (this.lastX ?? x);
      const dy = y - (this.lastY ?? y);
      const velocity = Math.sqrt(dx * dx + dy * dy);
      this.pointerDelta = velocity;

      this.lastX = x;
      this.lastY = y;

      for (let i = TRAIL_COUNT - 1; i > 0; i--) {
        this.data[i * 2] = this.data[(i - 1) * 2];
        this.data[i * 2 + 1] = this.data[(i - 1) * 2 + 1];
      }

      this.data[0] = x;
      this.data[1] = y;

      this.texture.needsUpdate = true;
      this.material.uniforms.uDecay.value = 1.0;
      this.material.uniforms.uVelocity.value = velocity;
      this.material.uniforms.uActiveCount.value = this.activeCount;
    });
  }

  private animateDecay = () => {
    if (this.isDecaying || !this.initialized) return;
    this.isDecaying = true;

    const decayStep = () => {
      if (!this.isDecaying || this.activeCount <= 0) return;

      for (let j = 0; j < 2; j++) {
        const i = this.activeCount - 1;
        this.data[i * 2] = NULL_POS[0];
        this.data[i * 2 + 1] = NULL_POS[1];
        this.activeCount--;
        if (this.activeCount <= 0) break;
      }

      this.texture.needsUpdate = true;
      this.material.uniforms.uVelocity.value = 0.0;
      this.material.uniforms.uActiveCount.value = this.activeCount;

      requestAnimationFrame(decayStep);
    };

    decayStep();
  };

  getVelocity(): number {
    return this.material.uniforms.uVelocity.value ?? 0;
  }

  getPointerDelta(): number {
    return this.pointerDelta;
  }
}
