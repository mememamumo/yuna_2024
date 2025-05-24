/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  webpack(config, { isServer }) {
    // glsl 로더 등록
    config.module.rules.push({
      test: /\.(glsl|vert|frag)$/,
      use: ["raw-loader", "glslify-loader"],
      exclude: /node_modules/,
    });

    // 브라우저 번들에서 fs 무시
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }

    // troika-three-text
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/troika-three-text/,
      type: "javascript/auto",
    });

    config.resolve.alias["@"] = path.resolve(__dirname);

    return config;
  },
};

module.exports = nextConfig;
