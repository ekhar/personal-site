import Link from 'next/link';
import { Car, DollarSign, FileText, Home, LogOut } from 'lucide-react';
import { ThemeToggle } from '@erickhar/ui/components/theme-toggle';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

async function signOut() {
	'use server';
	const supabase = await createClient();
	await supabase.auth.signOut();
	redirect('/login');
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) redirect('/login');

	return (
		<div className="flex min-h-screen">
			<aside className="w-64 border-r border-border bg-card p-6 flex flex-col gap-2">
				<h1 className="text-lg font-bold mb-6">Dashboard</h1>
				<NavLink href="/" icon={<Home className="w-4 h-4" />} label="Home" />
				<NavLink href="/car" icon={<Car className="w-4 h-4" />} label="Car Maintenance" />
				<NavLink href="/budget" icon={<DollarSign className="w-4 h-4" />} label="Budget" />
				<NavLink href="/taxes" icon={<FileText className="w-4 h-4" />} label="Taxes" />
				<div className="mt-auto flex items-center gap-2">
					<ThemeToggle />
					<form action={signOut}>
						<button
							type="submit"
							className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
						>
							<LogOut className="w-4 h-4" /> Sign Out
						</button>
					</form>
				</div>
			</aside>
			<main className="flex-1 p-8">{children}</main>
		</div>
	);
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
	return (
		<Link
			href={href}
			className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors no-underline text-foreground"
		>
			{icon}
			{label}
		</Link>
	);
}
