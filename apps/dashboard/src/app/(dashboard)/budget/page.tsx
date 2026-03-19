import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@erickhar/ui/components/card';
import { Button } from '@erickhar/ui/components/button';
import { addAccount, addCategory, addTransaction } from './actions';

export default async function BudgetPage() {
	const supabase = await createClient();

	const { data: accounts } = await supabase
		.from('accounts')
		.select('*')
		.order('name');

	const { data: categories } = await supabase
		.from('categories')
		.select('*')
		.order('name');

	const { data: transactions } = await supabase
		.from('transactions')
		.select('*, accounts(name), categories(name)')
		.order('date', { ascending: false })
		.limit(20);

	return (
		<div>
			<h1 className="text-3xl font-bold mb-8">Budget</h1>

			{/* Accounts Overview */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				{accounts?.map((a) => (
					<Card key={a.id}>
						<CardHeader>
							<CardTitle>{a.name}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-2xl font-bold">${Number(a.balance).toFixed(2)}</p>
							<p className="text-sm text-muted-foreground capitalize">{a.type}</p>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Add Account */}
			<Card className="mb-8">
				<CardHeader>
					<CardTitle>Add Account</CardTitle>
				</CardHeader>
				<CardContent>
					<form action={addAccount} className="grid grid-cols-3 gap-4">
						<input name="name" placeholder="Account name" required className="px-3 py-2 border border-border rounded-md bg-background" />
						<select name="type" required className="px-3 py-2 border border-border rounded-md bg-background">
							<option value="checking">Checking</option>
							<option value="savings">Savings</option>
							<option value="credit">Credit</option>
						</select>
						<input name="balance" type="number" step="0.01" placeholder="Balance" className="px-3 py-2 border border-border rounded-md bg-background" />
						<Button type="submit">Add Account</Button>
					</form>
				</CardContent>
			</Card>

			{/* Add Transaction */}
			{accounts && accounts.length > 0 && (
				<Card className="mb-8">
					<CardHeader>
						<CardTitle>Add Transaction</CardTitle>
					</CardHeader>
					<CardContent>
						<form action={addTransaction} className="grid grid-cols-2 gap-4">
							<select name="account_id" required className="px-3 py-2 border border-border rounded-md bg-background">
								{accounts.map((a) => (
									<option key={a.id} value={a.id}>{a.name}</option>
								))}
							</select>
							<select name="type" required className="px-3 py-2 border border-border rounded-md bg-background">
								<option value="expense">Expense</option>
								<option value="income">Income</option>
								<option value="transfer">Transfer</option>
							</select>
							<input name="amount" type="number" step="0.01" placeholder="Amount" required className="px-3 py-2 border border-border rounded-md bg-background" />
							<input name="description" placeholder="Description" className="px-3 py-2 border border-border rounded-md bg-background" />
							<select name="category_id" className="px-3 py-2 border border-border rounded-md bg-background">
								<option value="">No category</option>
								{categories?.map((c) => (
									<option key={c.id} value={c.id}>{c.name}</option>
								))}
							</select>
							<input name="date" type="date" required className="px-3 py-2 border border-border rounded-md bg-background" />
							<Button type="submit">Add Transaction</Button>
						</form>
					</CardContent>
				</Card>
			)}

			{/* Recent Transactions */}
			{transactions && transactions.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Recent Transactions</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							{transactions.map((t) => (
								<div key={t.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
									<div>
										<p className="font-medium">{t.description || 'No description'}</p>
										<p className="text-sm text-muted-foreground">{t.date} | {t.type}</p>
									</div>
									<p className={`font-bold ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
										{t.type === 'income' ? '+' : '-'}${Math.abs(Number(t.amount)).toFixed(2)}
									</p>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
