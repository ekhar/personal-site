import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: 3000,
		fs: {
			allow: ['static']
		}
	},
	optimizeDeps: {
		exclude: ['@/lib/wasm_exec.js']
	},
	build: {
		target: 'esnext'
	},
	assetsInclude: ['**/*.wasm']
});
