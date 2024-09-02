import './wasm_exec.js';

let singleRaycastModule: any;

export async function initSingleRaycast() {
	if (singleRaycastModule) return singleRaycastModule;
	const go = new (window as any).Go();
	try {
		const response = await fetch('/wasm/single-raycast.wasm');
		if (!response.ok) {
			throw new Error(`Failed to fetch WebAssembly module: ${response.statusText}`);
		}
		const buffer = await response.arrayBuffer();
		const result = await WebAssembly.instantiate(buffer, go.importObject);
		go.run(result.instance);
		singleRaycastModule = {
			drawSingleRaycast: (window as any).drawSingleRaycast
		};
		return singleRaycastModule;
	} catch (error) {
		console.error('Failed to initialize single raycast WebAssembly module:', error);
		throw error;
	}
}
