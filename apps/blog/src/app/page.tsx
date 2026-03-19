'use client';

import { useState } from 'react';
import Link from 'next/link';

const timelineItems = [
	{
		date: '2017',
		title: 'Starting Python',
		description:
			'I wanted to learn Python for fun (also to automate some completion-based math homework.) Jose Portilla on Udemy set me up!',
	},
	{
		date: '2019 - 2022',
		title: 'Computer Science Degree',
		description:
			'Attended the University of Virginia and graduated with a B.S. in Computer Science. (Wish I had taken more math and physics courses)',
	},
	{
		date: 'Feb 2023 - Dec 2023',
		title: 'Junior Software Engineer at Capital One',
		description:
			"Worked on internal tooling for Capital One's cloud deployment pipeline. Got certified in AWS. Learned that banks move very slowly.",
	},
	{
		date: 'Jan 2024 - Feb 2024',
		title: 'Flamethrower Startup',
		description:
			'Learned the basics of CAD, 3D modeling, circuit design, and microcontroller code. Blew up in my face though... and decided maybe not a good first company.',
	},
	{
		date: 'March 2024 - Present',
		title: 'Chess Opening Trainer',
		description:
			'Built a custom database in PostgreSQL - it was $500/month to host because of the data. Took the lichess opening database in Rust, fit it to chess.com games = 26x compression. Threw in some Docker containers and it is AWS free tier now.',
	},
	{
		date: 'May 2024 - Present',
		title: 'Solo Founder - myegift.org',
		description:
			'First real business project. Built a website to sell personalized eGift cards. Never did frontend, set up an LLC, or ran Google Ads before this.',
	},
];

export default function HomePage() {
	const [expandedItems, setExpandedItems] = useState<boolean[]>(
		new Array(timelineItems.length).fill(false),
	);

	function toggleItem(index: number) {
		setExpandedItems((prev) => {
			const next = [...prev];
			next[index] = !next[index];
			return next;
		});
	}

	return (
		<>
			{/* Hero */}
			<section className="text-center mb-12">
				<h1 className="text-3xl font-bold mb-4">Digital Diary</h1>
				<p>
					This site is a backlog of projects, thoughts, and ideas for me in 2050 to get a
					snapshot into what I was doing and what I felt proud of when I was younger.
				</p>
				<img
					src="/flamethrower.webp"
					alt="Flamethrower pic"
					width={130}
					height={200}
					className="mx-auto my-4"
				/>
				<p>
					So far the coolest thing I&apos;ve done was try to start a flamethrower company
					and accidentally cause a fire in my bathroom sink because of 3D printing errors.
				</p>
				<p className="text-sm text-muted-foreground mt-2">
					<em>
						(Making internal tools for internal tools to &ldquo;Change Banking for
						Good&rdquo; at Capital One was a close second).
					</em>
				</p>
			</section>

			{/* Career Timeline */}
			<section className="text-center mb-8">
				<h2 className="text-2xl font-bold mb-2">Professional Career</h2>
				<div className="w-24 h-[3px] bg-accent mx-auto rounded" />
			</section>

			<div className="relative flex flex-col items-center py-8">
				<div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-border" />
				{timelineItems.map((item, i) => (
					<div
						key={item.date}
						className={`relative w-1/2 p-4 flex ${
							i % 2 === 0
								? '-translate-x-[26%] justify-end text-left'
								: 'translate-x-[26%] justify-start text-left'
						}`}
					>
						<div className="bg-card border-2 border-border rounded-lg shadow p-4 max-w-[300px] transition-transform hover:scale-105 hover:border-accent">
							<button
								className="flex justify-between items-center w-full text-left bg-transparent border-none cursor-pointer font-inherit p-0"
								onClick={() => toggleItem(i)}
							>
								<h3 className="text-sm font-semibold m-0 text-card-foreground">
									{item.date} - {item.title}
								</h3>
								<span
									className={`transition-transform ${expandedItems[i] ? 'rotate-180' : ''}`}
								>
									&#9660;
								</span>
							</button>
							<div
								className={`overflow-hidden transition-all ${
									expandedItems[i] ? 'max-h-[500px]' : 'max-h-0'
								}`}
							>
								<p className="text-muted-foreground text-sm mt-2">
									{item.description}
								</p>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Blog Posts */}
			<section className="mt-16 p-8 bg-muted rounded-lg">
				<h2 className="text-center text-2xl font-bold mb-8">Recent Blog Posts</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<PostCard
						slug="raycasting-part1"
						title="Raycasting With WebAssembly"
						date="Sep 1, 2024"
						description="My first foray into computer graphics"
					/>
				</div>
			</section>
		</>
	);
}

function PostCard({
	slug,
	title,
	date,
	description,
}: {
	slug: string;
	title: string;
	date: string;
	description: string;
}) {
	return (
		<div className="bg-card border border-border rounded-lg p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
			<h3 className="text-lg font-semibold mb-1">
				<Link href={`/blog/${slug}`} className="text-card-foreground no-underline hover:text-accent">
					{title}
				</Link>
			</h3>
			<p className="text-sm text-muted-foreground mb-2">{date}</p>
			<p className="text-muted-foreground mb-4">{description}</p>
			<Link href={`/blog/${slug}`} className="text-accent font-bold no-underline hover:underline">
				Read More
			</Link>
		</div>
	);
}
