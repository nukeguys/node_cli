import { build } from "esbuild";
import glob from "glob";

build({
  entryPoints: [...glob.sync("./src/commands/**/index.ts"), "./src/index.ts"],
  bundle: true,
  outdir: "dist",
  minify: true,
  target: ["node16"],
  platform: "node",
  format: "esm",
  banner: {
    js: [
      "#!/usr/bin/env node",
      // shelljs가 dynamic require를 사용하면서 에러나서 추가(참고: https://github.com/evanw/esbuild/issues/1921#issuecomment-1197938703)
      "import { createRequire } from 'module';const require = createRequire(import.meta.url);",
    ].join("\n"),
  },
  external: ["shelljs"],
}).catch(() => process.exit(1));
