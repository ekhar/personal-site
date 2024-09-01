<script>
	import { onMount } from 'svelte';

	let timelineItems = [
		{
			date: '2022',
			title: 'Started my Linux journey',
			description: '...Details about the experience...'
		},
		{
			date: '2023',
			title: 'Built my first home server',
			description: '...Details about the project...'
		},
		{
			date: '2024',
			title: 'Started new projects in SvelteKit',
			description: '...Details about this project...'
		}
	];

	onMount(() => {
		// Add animation logic here if needed
	});
</script>

<section class="hero">
	<h1>Digital Diary</h1>
	<p>
		This is a backlog of projects, thoughts, and ideas for Eric in 2050 to get a snapshot into what
		I was doing and what I felt proud of when I was younger.
	</p>
</section>

<div class="timeline">
	{#each timelineItems as item, i}
		<div class="timeline-item {i % 2 === 0 ? 'left' : 'right'}">
			<div class="content">
				<h3>{item.date} - {item.title}</h3>
				<p>{item.description}</p>
			</div>
		</div>
	{/each}
</div>

<style>
	.hero {
		text-align: center;
		margin-bottom: 3rem;
	}

	.timeline {
		position: relative;
		margin: 2rem 0;
		padding: 2rem 0;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.timeline::before {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: 50%;
		width: 2px;
		background: #ddd;
	}

	.timeline-item {
		position: relative;
		width: 50%;
		padding: 1rem;
		display: flex;
		justify-content: flex-end;
	}

	.timeline-item.left {
		left: -26%;
		justify-content: flex-end;
		text-align: right;
	}

	.timeline-item.right {
		left: 26%;
		justify-content: flex-start;
		text-align: left;
	}

	.timeline-item .content {
		background: #fff;
		border: 2px solid #e0e0e0; /* Add a subtle border */
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		padding: 1rem;
		transition: transform 0.3s;
		max-width: 300px;
		color: #333; /* Ensure text remains readable in dark mode */
	}

	.timeline-item:hover .content {
		transform: scale(1.05);
	}

	.timeline-item h3 {
		margin: 0;
	}

	.timeline-item p {
		color: #666;
	}
</style>
