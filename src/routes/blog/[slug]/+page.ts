import { error } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		// Load the interactive raycasting component
		const post = await import(`../../../posts/${params.slug}.md`);
		return {
			content: post.default,
			meta: post.metadata,
			interactive: false
		};
	} catch (e) {
		throw error(404, `Could not find ${params.slug}`);
	}
}
