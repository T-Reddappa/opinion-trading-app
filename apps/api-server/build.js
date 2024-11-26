// apps/api-server/build.js
const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

// Ensure dist directory exists
if (!fs.existsSync("dist")) {
  fs.mkdirSync("dist");
}

// Copy package.json to dist
const packageJson = require("./package.json");
const distPackageJson = {
  name: packageJson.name,
  version: packageJson.version,
  dependencies: packageJson.dependencies,
};
fs.writeFileSync(
  path.join("dist", "package.json"),
  JSON.stringify(distPackageJson, null, 2)
);

esbuild
  .build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    platform: "node",
    target: "node20",
    outfile: "dist/index.js",
    external: [
      // Add all external dependencies
      "express",
      "mongoose",
      "jsonwebtoken",
      "bcryptjs",
      "@repo/db",
      // AWS related
      "aws-sdk",
      "mock-aws-s3",
      "nock",
      // Other problematic dependencies
      "@mapbox/node-pre-gyp",
    ],
    loader: {
      ".html": "text",
    },
    sourcemap: true,
    minify: false,
    format: "cjs",
  })
  .then(() => console.log("⚡ Build complete! ⚡"))
  .catch(() => process.exit(1));
