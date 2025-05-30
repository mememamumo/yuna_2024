import { Color, DataTexture, ShaderMaterial, Vector2 } from "three";

const TRAIL_COUNT = 30;

export class TrailMaterial extends ShaderMaterial {
  constructor(trailTexture: DataTexture) {
    super({
      uniforms: {
        uTrailTexture: { value: trailTexture },
        uResolution: {
          value: new Vector2(window.innerWidth, window.innerHeight),
        },
        uDecay: { value: 1.0 },
        uVelocity: { value: 0.0 },
        uPointer: { value: new Vector2(0, 0) },
        uActiveCount: { value: TRAIL_COUNT },
        uTime: { value: 0.0 },
        uColor: { value: new Color("#fff") },
      },
      vertexShader: `
        varying vec2 vPosition;
        void main() {
          vPosition = position.xy;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;

        uniform sampler2D uTrailTexture;
        uniform float uDecay;
        uniform float uVelocity;
        uniform float uActiveCount;
        uniform vec3 uColor;

        varying vec2 vPosition;

        float distanceToSegment(vec2 p, vec2 a, vec2 b) {
          vec2 pa = p - a;
          vec2 ba = b - a;
          float h = clamp(dot(pa, ba) / (dot(ba, ba) + 0.0001), 0.0, 1.0);
          return length(pa - ba * h);
        }

        void main() {
          float alpha = 0.0;
          float maxLength = 0.3;

          float minThickness = 0.005;
          float maxThickness = 0.05;

          float velocityFactor = clamp(uVelocity * 5.0, 0.0, 1.0);
          float baseThickness = mix(minThickness, maxThickness, velocityFactor);

          for (int i = 0; i < ${TRAIL_COUNT - 1}; i++) {
            float fi = float(i) + 0.5;
            float fip1 = float(i + 1) + 0.5;

            vec2 p0 = texture2D(uTrailTexture, vec2(fi / float(${TRAIL_COUNT}), 0.5)).rg;
            vec2 p1 = texture2D(uTrailTexture, vec2(fip1 / float(${TRAIL_COUNT}), 0.5)).rg;

            if (p0.x < -1.5 || p1.x < -1.5) continue;
            if (distance(p0, p1) > maxLength) continue;

            float d = distanceToSegment(vPosition, p0, p1);
            float edgeFade = sin(fi / float(${TRAIL_COUNT}) * 3.141592);
            float dynamicThickness = baseThickness * edgeFade * uDecay;

            alpha += step(d, dynamicThickness);
          }

          alpha = clamp(alpha, 0.0, 1.0);
          if (alpha < 0.01) discard;

          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    });
  }
}
