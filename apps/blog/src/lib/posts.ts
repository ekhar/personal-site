import fs from 'fs';
import path from 'path';

export interface Post {
	title: string;
	slug: string;
	description: string;
	date: string;
	categories?: string[];
	published: boolean;
	interactive?: boolean;
}

interface PostMetadata {
	title: string;
	description: string;
	date: string;
	categories?: string[];
	published: boolean;
	interactive?: boolean;
}

const postsDirectory = path.join(process.cwd(), '..', '..', 'packages', 'content', 'posts');

function extractField(content: string, field: string): string | undefined {
	const match = content.match(new RegExp(`${field}:\\s*['"](.+?)['"]`));
	return match?.[1];
}

function extractBoolField(content: string, field: string): boolean {
	const match = content.match(new RegExp(`${field}:\\s*(true|false)`));
	return match?.[1] === 'true';
}

function extractArrayField(content: string, field: string): string[] {
	const match = content.match(new RegExp(`${field}:\\s*\\[([^\\]]*?)\\]`));
	if (!match) return [];
	return match[1]
		.split(',')
		.map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
		.filter(Boolean);
}

function extractMetadata(fileContents: string): PostMetadata | null {
	const block = fileContents.match(/export\s+const\s+metadata\s*=\s*\{[\s\S]*?\n\};/);
	if (!block) return null;
	const content = block[0];

	const title = extractField(content, 'title');
	const description = extractField(content, 'description');
	const date = extractField(content, 'date');
	if (!title || !description || !date) return null;

	return {
		title,
		description,
		date,
		categories: extractArrayField(content, 'categories'),
		published: extractBoolField(content, 'published'),
		interactive: extractBoolField(content, 'interactive'),
	};
}

export function getAllPosts(): Post[] {
	const files = fs.readdirSync(postsDirectory);
	const posts = files
		.filter((file) => file.endsWith('.mdx'))
		.map((file) => {
			const slug = file.replace(/\.mdx$/, '');
			const fullPath = path.join(postsDirectory, file);
			const fileContents = fs.readFileSync(fullPath, 'utf8');
			const data = extractMetadata(fileContents);
			if (!data) return null;
			return {
				slug,
				title: data.title,
				description: data.description,
				date: data.date,
				categories: data.categories,
				published: data.published ?? false,
				interactive: data.interactive ?? false,
			} satisfies Post;
		})
		.filter((post) => post !== null && post.published) as Post[];

	posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return posts;
}
