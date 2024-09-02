import './wasm_exec.js';

let wasmModule: any;

export async function initWasm() {
	if (wasmModule) return wasmModule;

	const go = new (window as any).Go();

	try {
		const response = await fetch('/wasm/raycasting.wasm');
		if (!response.ok) {
			throw new Error(`Failed to fetch WebAssembly module: ${response.statusText}`);
		}

		const buffer = await response.arrayBuffer();
		const result = await WebAssembly.instantiate(buffer, go.importObject);

		go.run(result.instance);

		// Export all the necessary functions
		wasmModule = {
			draw2d_map: (window as any).draw2d_map,
			move_player: (window as any).move_player,
			dda_single: (window as any).dda_single,
			dda_fov: (window as any).dda_fov,
			render_dda_single: (window as any).render_dda_single,
			render_dda_fov: (window as any).render_dda_fov
		};

		// Log available functions for debugging
		// console.log('Available WebAssembly functions:', Object.keys(wasmModule));

		// Check if all required functions are available
		const requiredFunctions = [
			'draw2d_map',
			'move_player',
			'dda_single',
			'dda_fov',
			'render_dda_single',
			'render_dda_fov'
		];
		for (const funcName of requiredFunctions) {
			if (typeof wasmModule[funcName] !== 'function') {
				console.warn(`Warning: ${funcName} is not a function in the WebAssembly module`);
			}
		}

		return wasmModule;
	} catch (error) {
		console.error('Failed to initialize WebAssembly module:', error);
		throw error;
	}
}
