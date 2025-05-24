const refractionFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTransparent;
  uniform float uRefractPower;
  uniform vec2 winResolution;
  uniform sampler2D uSceneTexture;

  varying vec3 vNormal;
  varying vec3 vViewPos;

  #define PI 3.141592653589793
  const int LOOP = 16;

  float random(vec2 p) {
    return fract(sin(dot(p.xy ,vec2(12.9898,78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / winResolution.xy;

    // 굴절 벡터 보정 (곡률 반영 확대)
    vec2 refractNormal = vNormal.xy * (1.0 - vNormal.z * 0.6);

    vec3 refractCol = vec3(0.0);

    // RGB 반복 샘플링
    for (int i = 0; i < LOOP; i++) {
      float noise = random(uv) * 0.025;
      float slide = float(i) / float(LOOP) * 0.1 + noise;

      // RGB 디스퍼전 범위 강화
      vec2 refractUvR = uv - refractNormal * (uRefractPower + slide * 1.5) * uTransparent;
      vec2 refractUvG = uv - refractNormal * (uRefractPower + slide * 2.5) * uTransparent;
      vec2 refractUvB = uv - refractNormal * (uRefractPower + slide * 3.5) * uTransparent;

      refractCol.r += texture2D(uSceneTexture, refractUvR).r;
      refractCol.g += texture2D(uSceneTexture, refractUvG).g;
      refractCol.b += texture2D(uSceneTexture, refractUvB).b;
    }

    // 평균화
    refractCol /= float(LOOP);

    // Phong 계열 조명 (하이라이트 강조)
    float shininess = 200.0; // 날카로운 스펙큘러
    vec3 lightVector = normalize(vec3(1.0, 1.0, 1.0));
    vec3 viewVector = normalize(vViewPos);
    vec3 normalVector = normalize(vNormal);
    vec3 halfVector = normalize(viewVector + lightVector);

    float NdotL = dot(normalVector, lightVector);
    float NdotH = dot(normalVector, halfVector);

    float kDiffuse = max(0.0, NdotL);
    float kSpecular = pow(NdotH * NdotH, shininess);

    // 조명 계수 강화
    refractCol += (kSpecular * 1.0 + kDiffuse * 0.1);

    gl_FragColor = vec4(refractCol, 1.0);
  }
`;

export default refractionFragmentShader;
