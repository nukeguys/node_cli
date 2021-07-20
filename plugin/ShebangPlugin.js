const fs = require("fs");

const pluginName = "ShebangPlugin";

class ShebangPlugin {
  apply(compiler) {
    compiler.hooks.assetEmitted.tap(
      pluginName,
      (file, { content, source, outputPath, compilation, targetPath }) => {
        const data = fs.readFileSync(targetPath, "utf8");
        const shebang = "#!/usr/bin/env node\n\n";
        fs.writeFileSync(targetPath, shebang + data);
      }
    );
  }
}

module.exports = ShebangPlugin;
