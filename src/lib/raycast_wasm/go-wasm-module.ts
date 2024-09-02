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
		wasmModule = {
			updateRaycasting: (window as any).updateRaycasting
		};
		return wasmModule;
	} catch (error) {
		console.error('Failed to initialize WebAssembly module:', error);
		throw error;
	}
}
