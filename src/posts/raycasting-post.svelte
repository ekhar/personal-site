<script lang="ts" context="module">
	export const metadata = {
		title: 'WebAssembly Raycasting Learning',
		description: 'A simple raycasting demo using Go WebAssembly and Svelte.',
		date: '2024-09-01',
		categories: ['graphics', 'webassembly', 'go'],
		published: true
	};
</script>

<script lang="ts">
	import Step1 from './raycasting-tutorial/TwoDMap.svelte';
	import Step2 from './raycasting-tutorial/DDA.svelte';
	import Step3 from './raycasting-tutorial/SingleRaycast.svelte';
	import Step4 from './raycasting-tutorial/FullFOV.svelte';
</script>

<h1>WebAssembly Raycasting Learning</h1>

<section>
	<h2>Step 1: Draw a simple 2D map</h2>
	<p>In this step, we create a basic 2D representation of our game world.</p>
	<Step1 />
</section>

<section>
	<h2>Step 2: Implement DDA</h2>
	<Step2 />
</section>

<section>
	<h2>Step 3: Render the single raycast</h2>
	<p>We implement a single raycast to demonstrate how the raycasting algorithm works.</p>
	<Step3 />
</section>

<section>
	<h2>Step 4: Implement and render full FOV raycasting</h2>
	<p>Extending the single raycast, we now implement a full field of view.</p>
	<Step4 />
</section>
