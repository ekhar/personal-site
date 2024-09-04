<script lang="ts">
	import { formatDate } from '$lib/utils';
	export let data;
</script>

<article>
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
</article>
