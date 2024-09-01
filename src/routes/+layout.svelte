<script>
	import { darkMode } from '$lib/stores';
	import { onMount } from 'svelte';
	import '../app.css';

	onMount(() => {
		const storedTheme = localStorage.getItem('theme');
		if (storedTheme) {
			$darkMode = storedTheme === 'dark';
		} else {
			$darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
		}
	});

	$: {
		if (typeof document !== 'undefined') {
			document.body.classList.toggle('dark-mode', $darkMode);
			localStorage.setItem('theme', $darkMode ? 'dark' : 'light');
		}
	}

	function toggleDarkMode() {
		$darkMode = !$darkMode;
	}
</script>

<div class="header">
	<h1><a href="/">Eric's Website</a></h1>
	<nav class="nav-links">
		<a href="/blog">Blog</a>
		<a href="/linux-config">Linux Config</a>
		<a href="/home-server">Home Server Specs</a>
		<a href="/projects">Projects</a>
		<button on:click={toggleDarkMode}>
			{$darkMode ? '☀️' : '🌙'}
		</button>
	</nav>
</div>

<main class="container">
	<slot />
</main>

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
		background-color: var(--bg-header);
		color: var(--header-text-color);
		max-width: 1200px; /* Maximum width to control on wide screens */
		margin: 1rem auto; /* Center the header and add margin around it */
		border-radius: 12px; /* Rounded corners */
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add a subtle shadow */
	}

	.nav-links {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.nav-links a,
	.header h1 a {
		text-decoration: none;
		color: var(--header-text-color);
		font-weight: bold;
	}

	.container {
		max-width: 800px; /* Maximum width for content to improve readability */
		margin: 0 auto;
		padding: 2rem;
	}

	button {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 1.5rem;
	}

	/* Responsive design for smaller screens */
	@media (max-width: 600px) {
		.header {
			flex-direction: column;
			align-items: flex-start;
		}

		.nav-links {
			justify-content: center;
			width: 100%;
			margin-top: 0.5rem;
		}
	}
</style>
