import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@erickhar/ui/components/card';
import { Button } from '@erickhar/ui/components/button';
import { addTaxYear, addDeduction, addTaxDocument } from './actions';

export default async function TaxesPage() {
	const supabase = await createClient();

	const { data: taxYears } = await supabase
		.from('tax_years')
		.select('*')
		.order('year', { ascending: false });

	const { data: deductions } = await supabase
		.from('deductions')
		.select('*, tax_years(year)')
		.order('created_at', { ascending: false })
		.limit(10);

	const { data: documents } = await supabase
		.from('tax_documents')
		.select('*, tax_years(year)')
		.order('created_at', { ascending: false })
		.limit(10);

	return (
		<div>
			<h1 className="text-3xl font-bold mb-8">Taxes</h1>

			{/* Tax Years Overview */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				{taxYears?.map((ty) => (
					<Card key={ty.id}>
						<CardHeader>
							<CardTitle>{ty.year}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground capitalize mb-2">
								Status: {ty.status.replace('_', ' ')}
							</p>
							<p>Income: ${Number(ty.total_income).toLocaleString()}</p>
							<p>Deductions: ${Number(ty.total_deductions).toLocaleString()}</p>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Add Tax Year */}
			<Card className="mb-8">
				<CardHeader>
					<CardTitle>Add Tax Year</CardTitle>
				</CardHeader>
				<CardContent>
					<form action={addTaxYear} className="grid grid-cols-2 gap-4">
						<input name="year" type="number" placeholder="Year (e.g. 2025)" required className="px-3 py-2 border border-border rounded-md bg-background" />
						<input name="total_income" type="number" step="0.01" placeholder="Total income" className="px-3 py-2 border border-border rounded-md bg-background" />
						<input name="total_deductions" type="number" step="0.01" placeholder="Total deductions" className="px-3 py-2 border border-border rounded-md bg-background" />
						<input name="notes" placeholder="Notes" className="px-3 py-2 border border-border rounded-md bg-background" />
						<Button type="submit">Add Tax Year</Button>
					</form>
				</CardContent>
			</Card>

			{/* Add Deduction */}
			{taxYears && taxYears.length > 0 && (
				<Card className="mb-8">
					<CardHeader>
						<CardTitle>Add Deduction</CardTitle>
					</CardHeader>
					<CardContent>
						<form action={addDeduction} className="grid grid-cols-2 gap-4">
							<select name="tax_year_id" required className="px-3 py-2 border border-border rounded-md bg-background">
								{taxYears.map((ty) => (
									<option key={ty.id} value={ty.id}>{ty.year}</option>
								))}
							</select>
							<input name="category" placeholder="Category" required className="px-3 py-2 border border-border rounded-md bg-background" />
							<input name="description" placeholder="Description" className="px-3 py-2 border border-border rounded-md bg-background" />
							<input name="amount" type="number" step="0.01" placeholder="Amount" required className="px-3 py-2 border border-border rounded-md bg-background" />
							<Button type="submit">Add Deduction</Button>
						</form>
					</CardContent>
				</Card>
			)}

			{/* Add Document */}
			{taxYears && taxYears.length > 0 && (
				<Card className="mb-8">
					<CardHeader>
						<CardTitle>Add Tax Document</CardTitle>
					</CardHeader>
					<CardContent>
						<form action={addTaxDocument} className="grid grid-cols-3 gap-4">
							<select name="tax_year_id" required className="px-3 py-2 border border-border rounded-md bg-background">
								{taxYears.map((ty) => (
									<option key={ty.id} value={ty.id}>{ty.year}</option>
								))}
							</select>
							<input name="name" placeholder="Document name" required className="px-3 py-2 border border-border rounded-md bg-background" />
							<select name="type" required className="px-3 py-2 border border-border rounded-md bg-background">
								<option value="w2">W-2</option>
								<option value="1099">1099</option>
								<option value="receipt">Receipt</option>
								<option value="other">Other</option>
							</select>
							<Button type="submit">Add Document</Button>
						</form>
					</CardContent>
				</Card>
			)}

			{/* Recent Deductions */}
			{deductions && deductions.length > 0 && (
				<Card className="mb-8">
					<CardHeader>
						<CardTitle>Recent Deductions</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							{deductions.map((d) => (
								<div key={d.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
									<div>
										<p className="font-medium">{d.category}</p>
										<p className="text-sm text-muted-foreground">{d.description}</p>
									</div>
									<p className="font-bold">${Number(d.amount).toFixed(2)}</p>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Recent Documents */}
			{documents && documents.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Recent Documents</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							{documents.map((doc) => (
								<div key={doc.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
									<p className="font-medium">{doc.name}</p>
									<p className="text-sm text-muted-foreground uppercase">{doc.type}</p>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
