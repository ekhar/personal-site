'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@erickhar/ui/components/button';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	async function handleLogin(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError('');

		const supabase = createClient();
		const { error } = await supabase.auth.signInWithPassword({ email, password });

		if (error) {
			setError(error.message);
			setLoading(false);
		} else {
			router.push('/');
			router.refresh();
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center">
			<form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 p-8">
				<h1 className="text-2xl font-bold text-center mb-8">Sign In</h1>
				{error && (
					<p className="text-red-500 text-sm text-center">{error}</p>
				)}
				<div>
					<label htmlFor="email" className="block text-sm font-medium mb-1">
						Email
					</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full px-3 py-2 border border-border rounded-md bg-background"
						required
					/>
				</div>
				<div>
					<label htmlFor="password" className="block text-sm font-medium mb-1">
						Password
					</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full px-3 py-2 border border-border rounded-md bg-background"
						required
					/>
				</div>
				<Button type="submit" className="w-full" disabled={loading}>
					{loading ? 'Signing in...' : 'Sign In'}
				</Button>
			</form>
		</div>
	);
}
