import * as vercel from '@pulumiverse/vercel';
import { secrets } from '../config/secrets.ts';
import { blogDomain } from '../config/stage.ts';

// Blog project on Vercel (static export)
export const blogProject = new vercel.Project('blog', {
	name: 'erickhar-blog',
	framework: 'nextjs',
	gitRepository: {
		type: 'github',
		repo: 'ekhar/personal-site',
	},
	rootDirectory: 'apps/blog',
	buildCommand: 'cd ../.. && bun run build:blog',
	installCommand: 'bun install',
	environments: [
		{
			key: 'BUN_VERSION',
			value: '1.3.10',
			targets: ['production', 'preview'],
		},
	],
});

export const blogApexDomain = new vercel.ProjectDomain('blog-apex', {
	projectId: blogProject.id,
	domain: blogDomain,
});

export const blogWwwDomain = new vercel.ProjectDomain('blog-www', {
	projectId: blogProject.id,
	domain: `www.${blogDomain}`,
	redirect: blogDomain,
});

// Dashboard project on Vercel (SSR + Supabase)
export const dashboardProject = new vercel.Project('dashboard', {
	name: 'erickhar-dashboard',
	framework: 'nextjs',
	gitRepository: {
		type: 'github',
		repo: 'ekhar/personal-site',
	},
	rootDirectory: 'apps/dashboard',
	buildCommand: 'cd ../.. && bun run build:dashboard',
	installCommand: 'bun install',
	environments: [
		{
			key: 'BUN_VERSION',
			value: '1.3.10',
			targets: ['production', 'preview'],
		},
		{
			key: 'NEXT_PUBLIC_SUPABASE_URL',
			value: secrets.SupabaseUrl,
			targets: ['production', 'preview'],
		},
		{
			key: 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY',
			value: secrets.SupabasePublishableKey,
			targets: ['production', 'preview'],
		},
	],
});

export const vercelProjects = {
	blogProject,
	dashboardProject,
};
