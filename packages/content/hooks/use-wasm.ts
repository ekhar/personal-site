'use client';

import { useEffect, useRef, useState } from 'react';

export interface WasmModule {
	draw2d_map: (ctx: CanvasRenderingContext2D, scale: number) => void;
	move_player: (moveY: number, rotate: number) => void;
	dda_single: (ctx: CanvasRenderingContext2D, scale: number) => void;
	dda_fov: (ctx: CanvasRenderingContext2D, scale: number, screenWidth: number) => void;
	render_dda_single: (
		ctx: CanvasRenderingContext2D,
		scale: number,
		width: number,
		height: number,
	) => void;
	render_dda_fov: (
		ctx: CanvasRenderingContext2D,
		scale: number,
		width: number,
		height: number,
	) => void;
}

let cachedModule: WasmModule | null = null;
let loadingPromise: Promise<WasmModule> | null = null;

async function loadWasm(): Promise<WasmModule> {
	if (cachedModule) return cachedModule;
	if (loadingPromise) return loadingPromise;

	loadingPromise = (async () => {
		// Load the Go WASM exec runtime
		await new Promise<void>((resolve, reject) => {
			const script = document.createElement('script');
			script.src = '/wasm/wasm_exec.js';
			script.onload = () => resolve();
			script.onerror = reject;
			document.head.appendChild(script);
		});

		const go = new (window as any).Go();
		const response = await fetch('/wasm/raycasting.wasm');
		const buffer = await response.arrayBuffer();
		const result = await WebAssembly.instantiate(buffer, go.importObject);
		go.run(result.instance);

		cachedModule = {
			draw2d_map: (window as any).draw2d_map,
			move_player: (window as any).move_player,
			dda_single: (window as any).dda_single,
			dda_fov: (window as any).dda_fov,
			render_dda_single: (window as any).render_dda_single,
			render_dda_fov: (window as any).render_dda_fov,
		};

		return cachedModule;
	})();

	return loadingPromise;
}

export function useWasm() {
	const [wasm, setWasm] = useState<WasmModule | null>(cachedModule);
	const [error, setError] = useState<Error | null>(null);
	const mounted = useRef(true);

	useEffect(() => {
		mounted.current = true;
		if (!wasm) {
			loadWasm()
				.then((mod) => {
					if (mounted.current) setWasm(mod);
				})
				.catch((err) => {
					if (mounted.current) setError(err);
				});
		}
		return () => {
			mounted.current = false;
		};
	}, [wasm]);

	return { wasm, error };
}
