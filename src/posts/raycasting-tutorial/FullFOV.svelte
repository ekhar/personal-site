<script lang="ts">
	import { onMount } from 'svelte';
	import { initWasm } from '$lib/raycast_wasm/go-wasm-module';

	let mapCanvas: HTMLCanvasElement;
	let renderCanvas: HTMLCanvasElement;
	let wasmModule: any;
	let mapCtx: CanvasRenderingContext2D;
	let renderCtx: CanvasRenderingContext2D;
	let isFocused = false;
	let scale = 1;

	// Adjust these values to change the size of the canvases
	const MAP_SIZE_MULTIPLIER = 0.15; // Reduced from 0.2 to make the map smaller
	const RENDER_SIZE_MULTIPLIER = 0.6; // New multiplier for the render canvas

	onMount(async () => {
		try {
			wasmModule = await initWasm();
			mapCtx = mapCanvas.getContext('2d')!;
			renderCtx = renderCanvas.getContext('2d')!;

			function resizeCanvases() {
				const mapWidth = 24;
				const mapHeight = 24;
				const mapAspectRatio = mapWidth / mapHeight;

				// Resize map canvas
				let mapBaseWidth = window.innerWidth * MAP_SIZE_MULTIPLIER;
				let mapBaseHeight = window.innerHeight * MAP_SIZE_MULTIPLIER;
				if (mapBaseWidth / mapBaseHeight > mapAspectRatio) {
					mapCanvas.height = mapBaseHeight;
					mapCanvas.width = mapCanvas.height * mapAspectRatio;
				} else {
					mapCanvas.width = mapBaseWidth;
					mapCanvas.height = mapCanvas.width / mapAspectRatio;
				}
				scale = mapCanvas.width / (mapWidth * 20); // 20 is the original cellSize

				// Resize render canvas
				renderCanvas.width = window.innerWidth * RENDER_SIZE_MULTIPLIER;
				renderCanvas.height = window.innerHeight * RENDER_SIZE_MULTIPLIER;

				updateCanvases();
			}

			resizeCanvases();
			window.addEventListener('resize', resizeCanvases);
			window.addEventListener('keydown', handleKeyDown);

			if (typeof wasmModule.draw2d_map === 'function') {
				updateCanvases();
			} else {
				console.error('draw2d_map is not a function');
			}

			return () => {
				window.removeEventListener('keydown', handleKeyDown);
				window.removeEventListener('resize', resizeCanvases);
			};
		} catch (error) {
			console.error('Failed to load WebAssembly module:', error);
		}
	});

	function updateCanvases() {
		if (mapCtx && wasmModule && typeof wasmModule.draw2d_map === 'function') {
			wasmModule.draw2d_map(mapCtx, scale);
			if (typeof wasmModule.dda_single === 'function') {
				wasmModule.dda_single(mapCtx, scale);
			}
		} else {
			console.error('Unable to call draw2d_map or dda_single');
		}

		// TODO: Implement rendering on renderCanvas
		// This is where you'll add your raycast rendering code
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
			updateCanvases();
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
	<div class="map-container">
		<canvas bind:this={mapCanvas}></canvas>
		<p>2D Map</p>
	</div>
	<div class="render-container">
		<canvas bind:this={renderCanvas}></canvas>
		<p>3D Render</p>
	</div>
	{#if !isFocused}
		<div class="focus-prompt">Click to enable controls</div>
	{/if}
</div>

<style>
	.canvas-container {
		display: flex;
		justify-content: space-around;
		align-items: flex-start;
		padding: 20px;
		position: relative;
		outline: none;
	}

	.map-container,
	.render-container {
		text-align: center;
	}

	canvas {
		border: 1px solid #ccc;
		margin-bottom: 10px;
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
		z-index: 10;
	}

	p {
		margin: 0;
	}
</style>
