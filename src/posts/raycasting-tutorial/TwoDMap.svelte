<script lang="ts">
	import { onMount } from 'svelte';
	import { initWasm } from '$lib/raycast_wasm/go-wasm-module';

	let canvas: HTMLCanvasElement;
	let wasmModule: any;
	let ctx: CanvasRenderingContext2D;
	let isFocused = false;
	let scale = 1;

	// Adjust this value to change the size of the map (e.g., 0.5 for half size)
	const SIZE_MULTIPLIER = 0.5;

	onMount(async () => {
		try {
			wasmModule = await initWasm();
			ctx = canvas.getContext('2d')!;

			function resizeCanvas() {
				const mapWidth = 24;
				const mapHeight = 24;
				const aspectRatio = mapWidth / mapHeight;

				// Calculate base size
				let baseWidth = window.innerWidth * SIZE_MULTIPLIER;
				let baseHeight = window.innerHeight * SIZE_MULTIPLIER;

				if (baseWidth / baseHeight > aspectRatio) {
					canvas.height = baseHeight;
					canvas.width = canvas.height * aspectRatio;
				} else {
					canvas.width = baseWidth;
					canvas.height = canvas.width / aspectRatio;
				}

				scale = canvas.width / (mapWidth * 20); // 20 is the original cellSize
				updateCanvas();
			}

			resizeCanvas();
			window.addEventListener('resize', resizeCanvas);
			window.addEventListener('keydown', handleKeyDown);

			if (typeof wasmModule.draw2d_map === 'function') {
				updateCanvas();
			} else {
				console.error('draw2d_map is not a function');
			}

			return () => {
				window.removeEventListener('keydown', handleKeyDown);
				window.removeEventListener('resize', resizeCanvas);
			};
		} catch (error) {
			console.error('Failed to load WebAssembly module:', error);
		}
	});

	function updateCanvas() {
		if (ctx && wasmModule && typeof wasmModule.draw2d_map === 'function') {
			wasmModule.draw2d_map(ctx, scale);
		} else {
			console.error('Unable to call draw2d_map');
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (!isFocused) return;
		let moveY = 0;
		let rotate = 0;
		switch (event.key.toLowerCase()) {
			case 'w':
				moveY = 1;
				break;
			case 's':
				moveY = -1;
				break;
			case 'a':
				rotate = -1;
				break;
			case 'd':
				rotate = 1;
				break;
		}
		if (wasmModule && wasmModule.move_player) {
			wasmModule.move_player(moveY, rotate);
			console.log(moveY, rotate);
			updateCanvas();
		}
	}

	function handleFocus() {
		isFocused = true;
	}

	function handleBlur() {
		isFocused = false;
	}
</script>

<div class="canvas-container" on:click={handleFocus} on:blur={handleBlur} tabindex="0">
	<canvas bind:this={canvas}></canvas>
	<p>2D Map with Player Movement</p>
	{#if !isFocused}
		<div class="focus-prompt">Click to enable w-a-s-d controls</div>
	{/if}
</div>

<style>
	.canvas-container {
		text-align: center;
		position: relative;
		outline: none;
		display: inline-block;
		margin: 20px auto;
	}
	canvas {
		border: 1px solid #ccc;
	}
	.focus-prompt {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: rgba(0, 0, 0, 0.7);
		color: white;
		padding: 10px;
		border-radius: 5px;
	}
	p {
		margin: 10px 0 0;
	}
</style>
