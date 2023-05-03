import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isRunningWebpack = !!process.env.WEBPACK;
const isRunningRspack = !!process.env.RSPACK;
if (!isRunningRspack && !isRunningWebpack) {
  throw new Error("Unknown bundler");
}

/**
 * @type {import('webpack').Configuration | import('@rspack/cli').Configuration}
 */
const config = {
  mode: "development",
  devtool: false,
  target: 'node',
  entry: {
    main: "./src/index.js",
  },
  experiments: {
    ...(isRunningWebpack ? ({ css: true }): {})
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        resourceQuery: /raw/,
        type: "asset/source",
      },
    ],
  },
  output: {
    clean: true,
    path: isRunningWebpack
      ? path.resolve(__dirname, "webpack-dist")
      : path.resolve(__dirname, "rspack-dist"),
    filename: "[id].js",
  },
  resolve: {
    alias: {
      "./answer": path.resolve(__dirname, "./src/answer.js?raw"),
    },
  },
  optimization: {
    splitChunks: {
      minSize: 1,
      cacheGroups: {
        foo: {
          chunks: "all",
					name: "split_foo",
					test: /foo\.js$/,
					priority: 99
        }
      }
    }
  }
};

export default config;
