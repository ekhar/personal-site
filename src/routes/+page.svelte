<script lang="ts">
	import { onMount } from 'svelte';
	import { formatDate } from '$lib/utils';
	export let data;

	let timelineItems = [
		{
			date: '2017',
			title: 'Starting Python',
			description:
				'I wanted to learn Python for fun (also to automate some completion based math homework.) Jose Portilla on Udemy set me up!',
			expanded: false
		},
		{
			date: '2019 - 2022',
			title: 'Computer Science Degree',
			description:
				'Attended University of Virginia and graduated with a B.S. in Computer Science. (Wish I took more math and physics courses)',
			expanded: false
		},
		{
			date: 'Feb 2023 - Dec 2023',
			title: 'Junior Software Engineer at Capital One',
			description:
				"Worked on internal tooling for Capital One's cloud deployment pipeline. Got certified in AWS. Learned that banks move very slowly ",
			expanded: false
		},
		{
			date: 'Jan 2024 - Feb 2024',
			title: 'Flamethrower Startup',
			description:
				'Learned the basics of CAD, 3D modeling, circuit design, and microcontroller code. Blew up in my face though... and decided maybe not a good first company',
			expanded: false
		},
		{
			date: 'March 2024 - April 2024',
			title: 'Chess Opening Trainer',
			description:
				'Built custom database in postgres - it was $500/month to host because of the data. Took lichess opening database in rust, fit it to chess.com games = 25x compression. Throw in some docker containers and it is AWS free tier now',
			expanded: false
		},
		{
			date: 'May 2024 - Present',
			title: 'Solo Founder - myegift.org',
			description:
				'First real business project. Built a website to sell personalized egift cards. Never did frontend, set up an llc, or ran google ads before this',
			expanded: false
		}
	];
	let expandedItems = new Array(timelineItems.length).fill(false);

	function toggleItem(index) {
		expandedItems[index] = !expandedItems[index];
		expandedItems = expandedItems;
	}

	onMount(() => {
		// Add animation logic here if needed
	});
</script>

<section class="hero">
	<h1>Digital Diary</h1>
	<p>
		This site is a backlog of projects, thoughts, and ideas for me in 2050 to get a snapshot into
		what I was doing and what I felt proud of when I was younger.
	</p>
</section>

<!-- Professional Career Section Header -->
<section class="career-header">
	<h2>Professional Career</h2>
</section>

<div class="timeline">
	{#each timelineItems as item, i}
		<div class="timeline-item {i % 2 === 0 ? 'left' : 'right'}">
			<div class="content">
				<button class="header" on:click={() => toggleItem(i)}>
					<h3>{item.date} - {item.title}</h3>
					<span class="arrow" class:rotated={expandedItems[i]}>▼</span>
				</button>
				<div class="details" class:expanded={expandedItems[i]}>
					<p>{item.description}</p>
				</div>
			</div>
		</div>
	{/each}
</div>

<!-- Posts -->
<section class="blog-posts">
	<h2>Recent Blog Posts</h2>
	<div class="posts-grid">
		{#each data.posts as post}
			<div class="post-card">
				<h3><a href="/blog/{post.slug}">{post.title}</a></h3>
				<p class="date">{formatDate(post.date)}</p>
				<p class="description">{post.description}</p>
				<a href="/blog/{post.slug}" class="read-more">Read More</a>
			</div>
		{/each}
	</div>
</section>

<style>
	.career-header {
		text-align: center;
		margin: 2rem 0;
		font-size: 1.8rem;
		font-weight: bold;
		color: var(--text-color, #333); /* Use a CSS variable for text color */
		letter-spacing: 1px;
		position: relative;
	}

	.career-header::after {
		content: '';
		display: block;
		width: 100px;
		height: 3px;
		background-color: #ff6600;
		margin: 0.5rem auto 0;
		border-radius: 5px;
	}

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
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		padding: 1rem;
		transition: transform 0.3s;
		max-width: 300px;
		color: #333;
	}

	.timeline-item .header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
	}

	.timeline-item .arrow {
		transition: transform 0.3s;
	}

	.timeline-item .arrow.rotated {
		transform: rotate(180deg);
	}

	.timeline-item .header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
		background: none;
		border: none;
		width: 100%;
		text-align: left;
		padding: 0;
		font: inherit;
	}

	.timeline-item .details {
		max-height: 0;
		overflow: hidden;
		transition: max-height 0.3s ease-out;
	}

	.timeline-item .details.expanded {
		max-height: 500px; /* Adjust this value based on your content */
		transition: max-height 0.3s ease-in;
	}

	.timeline-item:hover .content {
		transform: scale(1.05);
		background-color: #ffffff;
		border-color: #ff6600;
	}

	.timeline-item h3 {
		margin: 0;
	}

	.timeline-item p {
		color: #666;
	}
	.blog-posts {
		margin-top: 4rem;
		padding: 2rem;
		background-color: #f9f9f9;
		border-radius: 8px;
	}

	.blog-posts h2 {
		text-align: center;
		margin-bottom: 2rem;
		color: #333;
		font-size: 2rem;
	}

	.posts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.post-card {
		background-color: #ffffff;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		padding: 1.5rem;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
	}

	.post-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
	}

	.post-card h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.4rem;
	}

	.post-card h3 a {
		color: #333;
		text-decoration: none;
	}

	.post-card h3 a:hover {
		color: #ff6600;
	}

	.post-card .date {
		font-size: 0.9rem;
		color: #666;
		margin-bottom: 0.5rem;
	}

	.post-card .description {
		font-size: 1rem;
		color: #444;
		margin-bottom: 1rem;
	}

	.post-card .read-more {
		display: inline-block;
		padding: 0.5rem 1rem;
		background-color: #ff6600;
		color: white;
		text-decoration: none;
		border-radius: 4px;
		transition: background-color 0.3s ease;
	}

	.post-card .read-more:hover {
		background-color: #e55c00;
	}
</style>
