const webpack = require("webpack");
const path = require("path");
const glob = require("glob");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ShebangPlugin = require("./plugin/ShebangPlugin");

module.exports = {
  target: "node",
  node: false,
  entry: glob.sync("./src/command/**/index.ts").reduce(
    (obj, el) => {
      obj[path.parse(el).dir.split("/").pop()] = el;
      return obj;
    },
    { nu: "./src/nu.ts" }
  ),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    modules: [path.join(__dirname, "src"), "node_modules"],
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: "./node_modules/shelljs/src/exec-child.js",
          to: "",
        },
      ],
    }),
    new ShebangPlugin(),
  ],
  optimization: {
    minimizer: [new TerserPlugin({ extractComments: false })],
  },
};
