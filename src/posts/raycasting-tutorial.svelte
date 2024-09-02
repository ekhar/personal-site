<script lang="ts" context="module">
	export const metadata = {
		title: 'WebAssembly Raycasting Demo',
		description: 'A simple raycasting demo using Go WebAssembly and Svelte.',
		date: '2024-09-01',
		categories: ['graphics', 'webassembly', 'go'],
		published: true
	};
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { initWasm } from '$lib/raycast_wasm/go-wasm-module';

	let canvas: HTMLCanvasElement;
	let wasmModule: any;
	let ctx: CanvasRenderingContext2D;

	onMount(async () => {
		try {
			wasmModule = await initWasm();
			console.log('WebAssembly module loaded successfully');

			ctx = canvas.getContext('2d');
			canvas.width = 480;
			canvas.height = 480;

			updateCanvas();
			window.addEventListener('keydown', handleKeyDown);

			return () => {
				window.removeEventListener('keydown', handleKeyDown);
			};
		} catch (error) {
			console.error('Failed to load WebAssembly module:', error);
		}
	});

	function updateCanvas() {
		if (wasmModule && wasmModule.updateRaycasting) {
			const imageData = wasmModule.updateRaycasting(canvas.width, canvas.height);
			const uint8Array = new Uint8ClampedArray(imageData);
			const imageDataObj = new ImageData(uint8Array, canvas.width, canvas.height);
			ctx.putImageData(imageDataObj, 0, 0);
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		let moveX = 0;
		let moveY = 0;

		switch (event.key) {
			case 'ArrowUp':
				moveY = -1;
				break;
			case 'ArrowDown':
				moveY = 1;
				break;
			case 'ArrowLeft':
				moveX = -1;
				break;
			case 'ArrowRight':
				moveX = 1;
				break;
		}

		if (wasmModule && wasmModule.movePlayer) {
			wasmModule.movePlayer(moveX, moveY);
			updateCanvas();
		}
	}
</script>

<h2>Welcome to the 2D Map Explorer</h2>
<p>
	Use the arrow keys to move the character around the map. The WebAssembly module handles the game
	logic and rendering.
</p>
<div class="canvas-container">
	<canvas bind:this={canvas}></canvas>
	<p>2D Map View</p>
</div>

<style>
	.canvas-container {
		text-align: center;
		margin-top: 20px;
	}
	canvas {
		border: 1px solid #ccc;
	}
</style>
