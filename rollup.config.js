import typescript from "@rollup/plugin-typescript"
import nodeResolve from "@rollup/plugin-node-resolve"

export default {
	input: "src/index.ts",
	output: {
		file: "build/bb-dc-pr-helper.js",
		format: "iife",
		name: "bbdcprhelper",
	},
	treeshake: false,
	plugins: [typescript({ target: "esnext", module: "esnext" }), nodeResolve()],
}
