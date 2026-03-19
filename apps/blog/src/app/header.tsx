'use client';

import Link from 'next/link';
import { ThemeToggle } from '@erickhar/ui/components/theme-toggle';

export function Header() {
	return (
		<header className="flex justify-between items-center px-8 py-4 bg-[#222] dark:bg-[#333] text-[#ecf0f1] max-w-[1200px] mx-auto mt-4 rounded-xl shadow-md">
			<h1 className="text-xl font-bold">
				<Link href="/" className="text-inherit no-underline hover:no-underline">
					Eric&apos;s Website
				</Link>
			</h1>
			<nav className="flex gap-4 items-center">
				<Link href="/blog" className="text-inherit no-underline font-bold hover:underline">
					Blog
				</Link>
				<Link href="/linux-config" className="text-inherit no-underline font-bold hover:underline">
					Linux Config
				</Link>
				<ThemeToggle />
			</nav>
		</header>
	);
}
