<!-- MapEditor.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';

	interface Point {
		x: number;
		y: number;
	}

	interface Line {
		start: Point;
		end: Point;
		id: number;
	}

	interface SpawnPoint extends Point {}

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	const cellSize: number = 16;
	const gridSize: number = 32;
	let mode: 'add' | 'erase' = 'add';
	let lineType: 'orthogonal' | 'diagonal' = 'orthogonal';
	let isDragging: boolean = false;
	let lastPoint: Point | null = null;
	let highlightedLine: Line | null = null;

	let map: Line[] = [
		//top wall
		{ start: { x: 5, y: 5 }, end: { x: 25, y: 5 }, id: 0 },
		//right wall
		{ start: { x: 25, y: 10 }, end: { x: 25, y: 5 }, id: 1 },

		{ start: { x: 25, y: 20 }, end: { x: 25, y: 15 }, id: 1 },
		//bottom wall
		{ start: { x: 25, y: 20 }, end: { x: 5, y: 20 }, id: 2 },
		//left wall
		{ start: { x: 5, y: 20 }, end: { x: 5, y: 5 }, id: 3 },
		//interior 1
		{ start: { x: 10, y: 5 }, end: { x: 10, y: 15 }, id: 4 },
		//interior 2
		{ start: { x: 20, y: 10 }, end: { x: 20, y: 20 }, id: 5 },
		//side room top
		{ start: { x: 25, y: 10 }, end: { x: 30, y: 5 }, id: 6 },
		//side room bottom
		{ start: { x: 25, y: 15 }, end: { x: 30, y: 15 }, id: 7 },
		//side room right
		{ start: { x: 30, y: 5 }, end: { x: 30, y: 15 }, id: 8 }
	];

	let nextLineId = map.length;

	let spawnPoints: SpawnPoint[] = [];
	let playerPosition: Point | null = null;

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		canvas.width = gridSize * cellSize;
		canvas.height = gridSize * cellSize;
		redraw();
	});

	function drawGrid(): void {
		ctx.strokeStyle = '#ccc';
		ctx.lineWidth = 1;

		for (let i = 0; i <= gridSize; i++) {
			ctx.beginPath();
			ctx.moveTo(i * cellSize, 0);
			ctx.lineTo(i * cellSize, canvas.height);
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(0, i * cellSize);
			ctx.lineTo(canvas.width, i * cellSize);
			ctx.stroke();
		}
	}

	function drawMap(): void {
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 2;

		map.forEach((line) => {
			ctx.beginPath();
			ctx.moveTo(line.start.x * cellSize, line.start.y * cellSize);
			ctx.lineTo(line.end.x * cellSize, line.end.y * cellSize);
			ctx.stroke();
		});

		// Draw spawn points
		ctx.fillStyle = 'red';
		spawnPoints.forEach((point) => {
			ctx.beginPath();
			ctx.arc(point.x * cellSize, point.y * cellSize, cellSize / 3, 0, 2 * Math.PI);
			ctx.fill();
		});

		// Draw player
		if (playerPosition) {
			ctx.fillStyle = 'blue';
			ctx.beginPath();
			ctx.arc(
				playerPosition.x * cellSize,
				playerPosition.y * cellSize,
				cellSize / 2,
				0,
				2 * Math.PI
			);
			ctx.fill();
		}
	}

	function getClosestGridPoint(x: number, y: number): Point {
		const gridX = Math.round(x / cellSize);
		const gridY = Math.round(y / cellSize);
		return { x: gridX, y: gridY };
	}

	function handleMouseDown(event: MouseEvent): void {
		if (mode === 'add') {
			isDragging = true;
			const rect = canvas.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;
			lastPoint = getClosestGridPoint(x, y);
		} else if (mode === 'erase' && highlightedLine) {
			map = map.filter((line) => line.id !== highlightedLine?.id);
			highlightedLine = null;
			redraw();
		}
	}

	function handleMouseMove(event: MouseEvent): void {
		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		let currentPoint = getClosestGridPoint(x, y);

		if (mode === 'add' && isDragging && lastPoint) {
			if (lineType === 'orthogonal') {
				if (Math.abs(currentPoint.x - lastPoint.x) > Math.abs(currentPoint.y - lastPoint.y)) {
					currentPoint.y = lastPoint.y;
				} else {
					currentPoint.x = lastPoint.x;
				}
			} else if (lineType === 'diagonal') {
				const dx = Math.abs(currentPoint.x - lastPoint.x);
				const dy = Math.abs(currentPoint.y - lastPoint.y);
				const diagonalDistance = Math.min(dx, dy);

				if (diagonalDistance > 0) {
					const dirX = currentPoint.x > lastPoint.x ? 1 : -1;
					const dirY = currentPoint.y > lastPoint.y ? 1 : -1;
					currentPoint = {
						x: lastPoint.x + diagonalDistance * dirX,
						y: lastPoint.y + diagonalDistance * dirY
					};
				} else {
					return;
				}
			}

			if (currentPoint.x !== lastPoint.x || currentPoint.y !== lastPoint.y) {
				map = [...map, { start: lastPoint, end: currentPoint, id: nextLineId++ }];
				redraw();
				lastPoint = currentPoint;
			}
		} else if (mode === 'erase') {
			highlightedLine = findNearestLine(currentPoint);
			redraw();
		}
	}

	function handleMouseUp(): void {
		isDragging = false;
	}

	function findNearestLine(point: Point): Line | null {
		const threshold = 0.5; // Adjust this value to change the sensitivity
		let nearestLine: Line | null = null;
		let minDistance = Infinity;

		for (const line of map) {
			const distance = distanceToLine(point, line);
			if (distance < minDistance && distance < threshold) {
				minDistance = distance;
				nearestLine = line;
			}
		}

		return nearestLine;
	}

	function distanceToLine(point: Point, line: Line): number {
		const { start, end } = line;
		const A = point.x - start.x;
		const B = point.y - start.y;
		const C = end.x - start.x;
		const D = end.y - start.y;

		const dot = A * C + B * D;
		const lenSq = C * C + D * D;
		let param = dot / lenSq;

		let xx, yy;

		if (param < 0) {
			xx = start.x;
			yy = start.y;
		} else if (param > 1) {
			xx = end.x;
			yy = end.y;
		} else {
			xx = start.x + param * C;
			yy = start.y + param * D;
		}

		const dx = point.x - xx;
		const dy = point.y - yy;
		return Math.sqrt(dx * dx + dy * dy);
	}

	function redraw(): void {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawGrid();
		drawMap();
		if (highlightedLine) {
			drawHighlightedLine(highlightedLine);
		}
	}

	function drawHighlightedLine(line: Line): void {
		ctx.strokeStyle = 'red';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(line.start.x * cellSize, line.start.y * cellSize);
		ctx.lineTo(line.end.x * cellSize, line.end.y * cellSize);
		ctx.stroke();
	}

	function toggleMode(): void {
		if (mode === 'add') mode = 'erase';
		else if (mode === 'erase') mode = 'add';
		else mode = 'add';
		highlightedLine = null;
		redraw();
	}

	function toggleLineType(): void {
		lineType = lineType === 'orthogonal' ? 'diagonal' : 'orthogonal';
	}

	function placePlayer(): void {
		const placePlayerHandler = (event: MouseEvent) => {
			const rect = canvas.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;
			playerPosition = getClosestGridPoint(x, y);
			redraw();
			canvas.removeEventListener('click', placePlayerHandler);
		};

		canvas.addEventListener('click', placePlayerHandler);
	}
</script>

<div>
	<canvas
		bind:this={canvas}
		on:mousedown={handleMouseDown}
		on:mousemove={handleMouseMove}
		on:mouseup={handleMouseUp}
		on:mouseleave={handleMouseUp}
	></canvas>
	<div>
		<button on:click={toggleMode}>
			Mode: {mode}
		</button>
		<button on:click={toggleLineType}>
			Line Type: {lineType}
		</button>
		<button on:click={placePlayer}>Place Player</button>
	</div>
</div>

<style>
	canvas {
		border: 1px solid #000;
	}
	div {
		margin-top: 10px;
	}
	button {
		margin-right: 10px;
	}
</style>
