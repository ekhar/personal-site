import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { formatDate } from '@/lib/utils';

export default function BlogPage() {
	const posts = getAllPosts();

	return (
		<article>
			<h2 className="text-2xl font-bold mb-8">Recent Blog Posts</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{posts.map((post) => (
					<div
						key={post.slug}
						className="bg-card border border-border rounded-lg p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
					>
						<h3 className="text-lg font-semibold mb-1">
							<Link
								href={`/blog/${post.slug}`}
								className="text-card-foreground no-underline hover:text-accent"
							>
								{post.title}
							</Link>
						</h3>
						<p className="text-sm text-muted-foreground mb-2">
							{formatDate(post.date)}
						</p>
						<p className="text-muted-foreground mb-4">{post.description}</p>
						<Link
							href={`/blog/${post.slug}`}
							className="text-accent font-bold no-underline hover:underline"
						>
							Read More
						</Link>
					</div>
				))}
			</div>
		</article>
	);
}
