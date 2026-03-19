import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@erickhar/ui/components/card';

export default async function DashboardHome() {
	const supabase = await createClient();

	const [{ count: vehicleCount }, { count: accountCount }, { count: taxYearCount }] =
		await Promise.all([
			supabase.from('vehicles').select('*', { count: 'exact', head: true }),
			supabase.from('accounts').select('*', { count: 'exact', head: true }),
			supabase.from('tax_years').select('*', { count: 'exact', head: true }),
		]);

	return (
		<div>
			<h1 className="text-3xl font-bold mb-8">Overview</h1>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Vehicles</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-bold">{vehicleCount ?? 0}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Accounts</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-bold">{accountCount ?? 0}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Tax Years</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-bold">{taxYearCount ?? 0}</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
