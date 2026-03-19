import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@erickhar/ui/components/card';
import { Button } from '@erickhar/ui/components/button';
import { addVehicle, addMaintenanceRecord, addFuelLog } from './actions';

export default async function CarPage() {
	const supabase = await createClient();

	const { data: vehicles } = await supabase
		.from('vehicles')
		.select('*')
		.order('created_at', { ascending: false });

	const { data: records } = await supabase
		.from('maintenance_records')
		.select('*, vehicles(make, model)')
		.order('date', { ascending: false })
		.limit(10);

	const { data: fuelLogs } = await supabase
		.from('fuel_logs')
		.select('*, vehicles(make, model)')
		.order('date', { ascending: false })
		.limit(10);

	return (
		<div>
			<h1 className="text-3xl font-bold mb-8">Car Maintenance</h1>

			{/* Add Vehicle Form */}
			<Card className="mb-8">
				<CardHeader>
					<CardTitle>Add Vehicle</CardTitle>
				</CardHeader>
				<CardContent>
					<form action={addVehicle} className="grid grid-cols-2 gap-4">
						<input name="make" placeholder="Make" required className="px-3 py-2 border border-border rounded-md bg-background" />
						<input name="model" placeholder="Model" required className="px-3 py-2 border border-border rounded-md bg-background" />
						<input name="year" type="number" placeholder="Year" required className="px-3 py-2 border border-border rounded-md bg-background" />
						<input name="vin" placeholder="VIN (optional)" className="px-3 py-2 border border-border rounded-md bg-background" />
						<input name="mileage" type="number" placeholder="Mileage" className="px-3 py-2 border border-border rounded-md bg-background" />
						<Button type="submit">Add Vehicle</Button>
					</form>
				</CardContent>
			</Card>

			{/* Vehicles List */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
				{vehicles?.map((v) => (
					<Card key={v.id}>
						<CardHeader>
							<CardTitle>
								{v.year} {v.make} {v.model}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">
								{v.mileage.toLocaleString()} miles{v.vin ? ` | VIN: ${v.vin}` : ''}
							</p>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Add Maintenance Record */}
			{vehicles && vehicles.length > 0 && (
				<Card className="mb-8">
					<CardHeader>
						<CardTitle>Log Maintenance</CardTitle>
					</CardHeader>
					<CardContent>
						<form action={addMaintenanceRecord} className="grid grid-cols-2 gap-4">
							<select name="vehicle_id" required className="px-3 py-2 border border-border rounded-md bg-background">
								{vehicles.map((v) => (
									<option key={v.id} value={v.id}>
										{v.year} {v.make} {v.model}
									</option>
								))}
							</select>
							<input name="type" placeholder="Type (oil change, tires, etc)" required className="px-3 py-2 border border-border rounded-md bg-background" />
							<input name="description" placeholder="Description" className="px-3 py-2 border border-border rounded-md bg-background" />
							<input name="cost" type="number" step="0.01" placeholder="Cost" className="px-3 py-2 border border-border rounded-md bg-background" />
							<input name="mileage" type="number" placeholder="Mileage at service" className="px-3 py-2 border border-border rounded-md bg-background" />
							<input name="date" type="date" required className="px-3 py-2 border border-border rounded-md bg-background" />
							<Button type="submit">Log Record</Button>
						</form>
					</CardContent>
				</Card>
			)}

			{/* Add Fuel Log */}
			{vehicles && vehicles.length > 0 && (
				<Card className="mb-8">
					<CardHeader>
						<CardTitle>Log Fuel</CardTitle>
					</CardHeader>
					<CardContent>
						<form action={addFuelLog} className="grid grid-cols-2 gap-4">
							<select name="vehicle_id" required className="px-3 py-2 border border-border rounded-md bg-background">
								{vehicles.map((v) => (
									<option key={v.id} value={v.id}>
										{v.year} {v.make} {v.model}
									</option>
								))}
							</select>
							<input name="gallons" type="number" step="0.001" placeholder="Gallons" required className="px-3 py-2 border border-border rounded-md bg-background" />
							<input name="cost_per_gallon" type="number" step="0.001" placeholder="Cost/gallon" required className="px-3 py-2 border border-border rounded-md bg-background" />
							<input name="mileage" type="number" placeholder="Odometer" required className="px-3 py-2 border border-border rounded-md bg-background" />
							<input name="date" type="date" required className="px-3 py-2 border border-border rounded-md bg-background" />
							<Button type="submit">Log Fuel</Button>
						</form>
					</CardContent>
				</Card>
			)}

			{/* Recent Maintenance Records */}
			{records && records.length > 0 && (
				<Card className="mb-8">
					<CardHeader>
						<CardTitle>Recent Maintenance</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							{records.map((r) => (
								<div key={r.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
									<div>
										<p className="font-medium">{r.type}</p>
										<p className="text-sm text-muted-foreground">{r.description}</p>
									</div>
									<div className="text-right">
										<p className="font-medium">${Number(r.cost).toFixed(2)}</p>
										<p className="text-sm text-muted-foreground">{r.date}</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
