<script lang="ts" context="module">
	export const metadata = {
		title: 'Interactive Raycasting Tutorial',
		description: 'Learn about raycasting with this interactive tutorial.',
		date: '2024-09-01',
		categories: ['graphics', 'webassembly', 'go'],
		published: true
	};
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { initWasm } from '$lib/raycast_wasm/go-wasm-module';

	let characterX = 0;
	let characterY = 0;
	let canvasLeft: HTMLCanvasElement;
	let canvasRight: HTMLCanvasElement;
	let wasmModule: any;

	onMount(async () => {
		try {
			wasmModule = await initWasm();
			console.log('WebAssembly module loaded successfully');
		} catch (error) {
			console.error('Failed to load WebAssembly module:', error);
		}

		const ctxLeft = canvasLeft.getContext('2d');
		const ctxRight = canvasRight.getContext('2d');

		function updateCharacter() {
			ctxLeft.clearRect(0, 0, canvasLeft.width, canvasLeft.height);
			ctxLeft.fillStyle = 'red';
			ctxLeft.fillRect(characterX, characterY, 10, 10);
		}

		function handleKeyDown(event: KeyboardEvent) {
			switch (event.key) {
				case 'ArrowUp':
					characterY = Math.max(0, characterY - 5);
					break;
				case 'ArrowDown':
					characterY = Math.min(canvasLeft.height - 10, characterY + 5);
					break;
				case 'ArrowLeft':
					characterX = Math.max(0, characterX - 5);
					break;
				case 'ArrowRight':
					characterX = Math.min(canvasLeft.width - 10, characterX + 5);
					break;
			}
			updateCharacter();

			// Call Go function to update raycasting
			if (wasmModule && wasmModule.updateRaycasting) {
				wasmModule.updateRaycasting(characterX, characterY);
				updateRaycastingView();
			} else {
				console.error('updateRaycasting function not available');
			}
		}

		function updateRaycastingView() {
			// Update the right canvas based on the raycasting result
			// This function should be implemented based on your raycasting logic
			// For now, we'll just draw a simple representation
			ctxRight.clearRect(0, 0, canvasRight.width, canvasRight.height);
			ctxRight.fillStyle = 'blue';
			ctxRight.fillRect(characterX * 2, 0, 10, canvasRight.height);
		}

		window.addEventListener('keydown', handleKeyDown);
		updateCharacter();

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});
</script>

<h2>Welcome to the Interactive Raycasting Tutorial</h2>
<p>
	In this tutorial, we'll explore the basics of raycasting using Go (compiled to WebAssembly) and
	TypeScript. You can move the character in the left canvas using arrow keys, and see the raycasted
	result on the right.
</p>
<div class="interactive-section">
	<div class="canvas-container">
		<canvas bind:this={canvasLeft} width="200" height="200"></canvas>
		<p>2D View</p>
	</div>
	<div class="canvas-container">
		<canvas bind:this={canvasRight} width="400" height="200"></canvas>
		<p>Raycasted View</p>
	</div>
</div>
<p>
	As we progress through the tutorial, we'll add more interactive elements and explain the
	raycasting process step by step.
</p>

<style>
	.interactive-section {
		display: flex;
		justify-content: space-between;
		margin-top: 20px;
	}
	.canvas-container {
		text-align: center;
	}
	canvas {
		border: 1px solid #ccc;
	}
</style>
