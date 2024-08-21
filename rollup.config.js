import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import {visualizer} from "rollup-plugin-visualizer";
import {glob} from "glob";

/** @type {[import("rollup").RollupOptions]}*/
const rollupOptions = [{
    input: ['src/index.ts', ...glob.sync('src/**/*.setup.ts')],
    output: [
        {
            dir: 'dist',
            format: 'cjs',
            preserveModules: true,
            preserveModulesRoot: 'src',
            // sourcemap: true, // 没有压缩，无需 sourcemap
            entryFileNames: '[name].cjs'
        },
        {
            // file: 'dist/index.mjs',
            dir: 'dist',
            format: 'esm',
            preserveModules: true,
            preserveModulesRoot: 'src',
            // sourcemap: true,
            entryFileNames: '[name].mjs'
        }
    ],
    plugins: [
        resolve(),
        typescript({tsconfig: "./tsconfig.json",}),
        // terser(), // 类库不需要压缩，由最终目标压缩
        // peerDepsExternal(),
        visualizer({filename: "stats.html", template: "treemap",}),
    ],
    external: [/node_modules/, /tslib/], // 外部化所有依赖
}];
export default rollupOptions;
