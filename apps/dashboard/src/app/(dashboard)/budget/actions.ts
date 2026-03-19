'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addAccount(formData: FormData) {
	const supabase = await createClient();
	const { error } = await supabase.from('accounts').insert({
		name: formData.get('name') as string,
		type: formData.get('type') as string,
		balance: Number(formData.get('balance')) || 0,
	});
	if (error) throw new Error(error.message);
	revalidatePath('/budget');
}

export async function addCategory(formData: FormData) {
	const supabase = await createClient();
	const { error } = await supabase.from('categories').insert({
		name: formData.get('name') as string,
		color: (formData.get('color') as string) || null,
	});
	if (error) throw new Error(error.message);
	revalidatePath('/budget');
}

export async function addTransaction(formData: FormData) {
	const supabase = await createClient();
	const { error } = await supabase.from('transactions').insert({
		account_id: formData.get('account_id') as string,
		category_id: (formData.get('category_id') as string) || null,
		amount: Number(formData.get('amount')),
		description: (formData.get('description') as string) || '',
		date: formData.get('date') as string,
		type: formData.get('type') as string,
	});
	if (error) throw new Error(error.message);
	revalidatePath('/budget');
}
