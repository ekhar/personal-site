'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useWasm } from '../../hooks/use-wasm';

const MAP_SIZE_MULTIPLIER = 0.15;
const RENDER_SIZE_MULTIPLIER = 0.6;

export function FullFOV() {
	const mapCanvasRef = useRef<HTMLCanvasElement>(null);
	const renderCanvasRef = useRef<HTMLCanvasElement>(null);
	const [isFocused, setIsFocused] = useState(false);
	const scaleRef = useRef(1);
	const { wasm, error } = useWasm();

	const updateCanvases = useCallback(() => {
		const mapCanvas = mapCanvasRef.current;
		const renderCanvas = renderCanvasRef.current;
		if (!mapCanvas || !renderCanvas || !wasm) return;
		const mapCtx = mapCanvas.getContext('2d');
		const renderCtx = renderCanvas.getContext('2d');
		if (!mapCtx || !renderCtx) return;

		mapCtx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
		renderCtx.clearRect(0, 0, renderCanvas.width, renderCanvas.height);

		wasm.draw2d_map(mapCtx, scaleRef.current);
		wasm.dda_fov(mapCtx, scaleRef.current, renderCanvas.width);
		wasm.render_dda_fov(renderCtx, scaleRef.current, renderCanvas.width, renderCanvas.height);
	}, [wasm]);

	useEffect(() => {
		const mapCanvas = mapCanvasRef.current;
		const renderCanvas = renderCanvasRef.current;
		if (!mapCanvas || !renderCanvas || !wasm) return;

		function resize() {
			if (!mapCanvas || !renderCanvas) return;
			const mapWidth = 24;
			const mapHeight = 24;
			const aspect = mapWidth / mapHeight;
			let baseW = window.innerWidth * MAP_SIZE_MULTIPLIER;
			let baseH = window.innerHeight * MAP_SIZE_MULTIPLIER;
			if (baseW / baseH > aspect) {
				mapCanvas.height = baseH;
				mapCanvas.width = mapCanvas.height * aspect;
			} else {
				mapCanvas.width = baseW;
				mapCanvas.height = mapCanvas.width / aspect;
			}
			scaleRef.current = mapCanvas.width / (mapWidth * 20);
			renderCanvas.width = window.innerWidth * RENDER_SIZE_MULTIPLIER;
			renderCanvas.height = window.innerHeight * RENDER_SIZE_MULTIPLIER;
			updateCanvases();
		}

		resize();
		window.addEventListener('resize', resize);
		return () => window.removeEventListener('resize', resize);
	}, [wasm, updateCanvases]);

	useEffect(() => {
		if (!wasm) return;
		function handleKeyDown(e: KeyboardEvent) {
			if (!isFocused) return;
			let moveY = 0;
			let rotate = 0;
			switch (e.key.toLowerCase()) {
				case 'w': moveY = 1; break;
				case 's': moveY = -1; break;
				case 'a': rotate = 1; break;
				case 'd': rotate = -1; break;
			}
			wasm!.move_player(moveY, rotate);
			updateCanvases();
		}
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [wasm, isFocused, updateCanvases]);

	if (error) return <p>Failed to load WebAssembly module.</p>;

	return (
		<div
			style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', padding: '20px', position: 'relative', outline: 'none' }}
			onClick={() => setIsFocused(true)}
			onBlur={() => setIsFocused(false)}
			tabIndex={0}
		>
			<div style={{ textAlign: 'center' }}>
				<canvas ref={mapCanvasRef} style={{ border: '1px solid #ccc', marginBottom: '10px' }} />
			</div>
			<div style={{ textAlign: 'center' }}>
				<canvas ref={renderCanvasRef} style={{ border: '1px solid #ccc', marginBottom: '10px' }} />
			</div>
			{!isFocused && (
				<div style={{
					position: 'absolute', top: '50%', left: '50%',
					transform: 'translate(-50%, -50%)',
					backgroundColor: 'rgba(0,0,0,0.7)', color: 'white',
					padding: '10px', borderRadius: '5px', zIndex: 10,
				}}>
					Click to enable w-a-s-d controls
				</div>
			)}
		</div>
	);
}
