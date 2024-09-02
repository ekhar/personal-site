import { error } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		if (params.slug === 'raycasting-tutorial') {
			// Load the interactive raycasting component
			const post = await import('../../../posts/raycasting-tutorial.svelte');
			return {
				content: post.default,
				meta: post.metadata,
				interactive: true
			};
		} else {
			// Load regular Markdown posts
			const post = await import(`../../../posts/${params.slug}.md`);
			return {
				content: post.default,
				meta: post.metadata,
				interactive: false
			};
		}
	} catch (e) {
		throw error(404, `Could not find ${params.slug}`);
	}
}
