import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import serve from 'rollup-plugin-serve';
import json from '@rollup/plugin-json';
import ignore from "./rollup-ignore-plugin.js";
import { copyFileSync, mkdirSync } from 'fs';
import { dirname, join, resolve } from 'path';

const dev = process.env.ROLLUP_WATCH;

function copyDraco() {
  return {
    name: 'copy-draco-decoder',
    writeBundle(options) {
      const outDir = options.dir || dirname(options.file || 'dist/hass-3d-floorplan.js');
      const threeEntry = require.resolve('three');
      const dracoSrc = resolve(dirname(threeEntry), '..', 'examples', 'js', 'libs', 'draco', 'gltf');
      const dracoOut = join(outDir, 'draco');
      mkdirSync(dracoOut, { recursive: true });
      for (const file of ['draco_decoder.js', 'draco_decoder.wasm', 'draco_wasm_wrapper.js']) {
        copyFileSync(join(dracoSrc, file), join(dracoOut, file));
      }
    },
  };
}

const serveopts = {
  contentBase: ['./dist'],
  host: '0.0.0.0',
  port: 5000,
  allowCrossOrigin: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};

const plugins = [
  nodeResolve({}),
  commonjs(),
  typescript({ tsconfig: './tsconfig.json' }),
  json(),
  babel({
    babelHelpers: 'bundled',
    exclude: 'node_modules/**',
  }),
  dev && serve(serveopts),
  !dev && terser(),
  ignore({
    files: [
      require.resolve("@material/mwc-notched-outline/mwc-notched-outline.js"),
      require.resolve("@material/mwc-ripple/mwc-ripple.js"),
      require.resolve("@material/mwc-list/mwc-list-item.js"),
      require.resolve("@material/mwc-list/mwc-list.js"),
      require.resolve("@material/mwc-menu/mwc-menu.js"),
      require.resolve("@material/mwc-menu/mwc-menu-surface.js"),
      require.resolve("@material/mwc-icon/mwc-icon.js"),
      require.resolve("@material/mwc-button/mwc-button.js"),
    ],
  })
];

export default [
  {
    input: 'src/hass-3d-floorplan.ts',
    output: {
      dir: 'dist',
      format: 'es',
    },
    plugins: [...plugins, copyDraco()],
  },
];


