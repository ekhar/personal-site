<main>
	<div class="container">
		<h1>Coming Soon</h1>
		<p>I will do this soon</p>

		<img src="/not_ready/jelly.webp" alt="jellyfish" width="250" height="107" />
		<p class="subtitle">Days until launch</p>
		<p class="countdown">420</p>
	</div>
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: Arial, sans-serif;
		background-color: #f0f0f0;
		color: #333;
	}

	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		text-align: center;
	}

	h1 {
		font-size: 3rem;
		margin-bottom: 0.5rem;
	}

	p {
		font-size: 1.2rem;
		color: #666;
		margin-bottom: 2rem;
	}

	.countdown {
		font-size: 8rem;
		font-weight: bold;
		color: #007bff;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		font-size: 1rem;
		color: #999;
		margin-top: 0;
	}
</style>
