<script lang="ts">
	import { formatDate } from '$lib/utils';
	export let data;
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
</svelte:head>

<article>
	<hgroup>
		<h1>{data.meta.title}</h1>
	</hgroup>

	{#if data.interactive}
		<div class="interactive-post">
			<svelte:component this={data.content} />
		</div>
	{:else}
		<div class="prose">
			<svelte:component this={data.content} />
		</div>
	{/if}

	<p>Published at {formatDate(data.meta.date)}</p>
</article>

<style>
	article {
		max-inline-size: var(--size-content-3);
		margin-inline: auto;
	}
	h1 {
		text-transform: capitalize;
	}
	h1 + p {
		margin-top: var(--size-2);
		color: var(--text-2);
	}
	.interactive-post {
		margin-top: var(--size-7);
	}
</style>
