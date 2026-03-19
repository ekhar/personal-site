'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useWasm } from '../../hooks/use-wasm';

const SIZE_MULTIPLIER = 0.5;

export function TwoDMap() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isFocused, setIsFocused] = useState(false);
	const scaleRef = useRef(1);
	const { wasm, error } = useWasm();

	const updateCanvas = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas || !wasm) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		wasm.draw2d_map(ctx, scaleRef.current);
	}, [wasm]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || !wasm) return;

		function resize() {
			if (!canvas) return;
			const mapWidth = 24;
			const mapHeight = 24;
			const aspect = mapWidth / mapHeight;
			let baseW = window.innerWidth * SIZE_MULTIPLIER;
			let baseH = window.innerHeight * SIZE_MULTIPLIER;
			if (baseW / baseH > aspect) {
				canvas.height = baseH;
				canvas.width = canvas.height * aspect;
			} else {
				canvas.width = baseW;
				canvas.height = canvas.width / aspect;
			}
			scaleRef.current = canvas.width / (mapWidth * 20);
			updateCanvas();
		}

		resize();
		window.addEventListener('resize', resize);
		return () => window.removeEventListener('resize', resize);
	}, [wasm, updateCanvas]);

	useEffect(() => {
		if (!wasm) return;
		function handleKeyDown(e: KeyboardEvent) {
			if (!isFocused) return;
			let moveY = 0;
			let rotate = 0;
			switch (e.key.toLowerCase()) {
				case 'w': moveY = 1; break;
				case 's': moveY = -1; break;
				case 'a': rotate = -1; break;
				case 'd': rotate = 1; break;
			}
			wasm!.move_player(moveY, rotate);
			updateCanvas();
		}
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [wasm, isFocused, updateCanvas]);

	if (error) return <p>Failed to load WebAssembly module.</p>;

	return (
		<div
			style={{ textAlign: 'center', position: 'relative', outline: 'none', display: 'inline-block', margin: '20px auto' }}
			onClick={() => setIsFocused(true)}
			onBlur={() => setIsFocused(false)}
			tabIndex={0}
		>
			<canvas ref={canvasRef} style={{ border: '1px solid #ccc' }} />
			{!isFocused && (
				<div style={{
					position: 'absolute', top: '50%', left: '50%',
					transform: 'translate(-50%, -50%)',
					backgroundColor: 'rgba(0,0,0,0.7)', color: 'white',
					padding: '10px', borderRadius: '5px',
				}}>
					Click to enable w-a-s-d controls
				</div>
			)}
		</div>
	);
}
