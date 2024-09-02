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
			ctx = canvas.getContext('2d')!;
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
		wasmModule.draw2d_map(ctx);
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
		if (wasmModule && wasmModule.move_player) {
			wasmModule.move_player(moveX, moveY);
			updateCanvas();
		}
	}
</script>

<div class="canvas-container">
	<canvas bind:this={canvas}></canvas>
	<p>2D Map with Player Movement</p>
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
