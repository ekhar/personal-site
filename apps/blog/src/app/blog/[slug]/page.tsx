import { notFound } from 'next/navigation';
import { getAllPosts } from '@/lib/posts';
import { formatDate } from '@/lib/utils';

// Generate static params for all published posts
export function generateStaticParams() {
	const posts = getAllPosts();
	return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const posts = getAllPosts();
	const post = posts.find((p) => p.slug === slug);
	if (!post) return {};
	return {
		title: post.title,
		description: post.description,
		openGraph: {
			type: 'article',
			title: post.title,
		},
	};
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const posts = getAllPosts();
	const post = posts.find((p) => p.slug === slug);
	if (!post) notFound();

	// Dynamic import of the MDX file
	let PostContent: React.ComponentType;
	try {
		const mod = await import(`../../../../../../packages/content/posts/${slug}.mdx`);
		PostContent = mod.default;
	} catch {
		notFound();
	}

	return (
		<article className="max-w-prose mx-auto">
			<hgroup>
				<h1 className="text-3xl font-bold capitalize">{post.title}</h1>
			</hgroup>
			<div className="prose mt-8">
				<PostContent />
			</div>
			<p className="mt-8 text-muted-foreground">Published at {formatDate(post.date)}</p>
		</article>
	);
}
