<script lang="ts">
	import { onMount } from 'svelte';
	import { initWasm } from '$lib/raycast_wasm/go-wasm-module';

	let canvas2D: HTMLCanvasElement;
	let canvas3D: HTMLCanvasElement;
	let wasmModule: any;
	let ctx2D: CanvasRenderingContext2D;
	let ctx3D: CanvasRenderingContext2D;

	onMount(async () => {
		try {
			wasmModule = await initWasm();
			console.log('WebAssembly module loaded successfully');
			ctx2D = canvas2D.getContext('2d');
			ctx3D = canvas3D.getContext('2d');
			canvas2D.width = 240;
			canvas2D.height = 240;
			canvas3D.width = 640;
			canvas3D.height = 480;
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
		wasmModule.draw2d_map(ctx2D);
		wasmModule.dda_single(ctx2D);
		wasmModule.render_dda_single(ctx3D);
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
	<div class="canvas-wrapper">
		<canvas bind:this={canvas2D}></canvas>
		<p>2D Map View</p>
	</div>
	<div class="canvas-wrapper">
		<canvas bind:this={canvas3D}></canvas>
		<p>3D Raycasting View</p>
	</div>
</div>

<style>
	.canvas-container {
		display: flex;
		justify-content: space-around;
		margin-top: 20px;
	}
	.canvas-wrapper {
		text-align: center;
	}
	canvas {
		border: 1px solid #ccc;
	}
</style>
