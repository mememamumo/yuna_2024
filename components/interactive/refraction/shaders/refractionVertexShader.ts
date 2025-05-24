const refractionVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vViewPos; // ← 추가
  varying vec4 vProjectedPos;
  varying vec4 vRefractedProjected;

  uniform float uIOR;
  uniform float uDistortion;

  void main() {
    vUv = uv;

    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vec3 normalWorld = normalize(normalMatrix * normal);
    vec4 viewPosition = viewMatrix * worldPosition;

    vNormal = normalWorld;
    vViewDir = normalize(-viewPosition.xyz);
    vViewPos = -viewPosition.xyz; // ← Maxime fragment와 호환되도록 추가

    vProjectedPos = projectionMatrix * viewPosition;

    vec3 refracted = refract(vViewDir, normalWorld, 1.0 / uIOR);
    vec3 refractedWorldPos = worldPosition.xyz + refracted * uDistortion;
    vec4 refractedViewPos = viewMatrix * vec4(refractedWorldPos, 1.0);
    vRefractedProjected = projectionMatrix * refractedViewPos;

    gl_Position = vProjectedPos;
  }
`;

export default refractionVertexShader;
