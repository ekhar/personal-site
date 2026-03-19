'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addTaxYear(formData: FormData) {
	const supabase = await createClient();
	const { error } = await supabase.from('tax_years').insert({
		year: Number(formData.get('year')),
		total_income: Number(formData.get('total_income')) || 0,
		total_deductions: Number(formData.get('total_deductions')) || 0,
		notes: (formData.get('notes') as string) || null,
	});
	if (error) throw new Error(error.message);
	revalidatePath('/taxes');
}

export async function addDeduction(formData: FormData) {
	const supabase = await createClient();
	const { error } = await supabase.from('deductions').insert({
		tax_year_id: formData.get('tax_year_id') as string,
		category: formData.get('category') as string,
		description: (formData.get('description') as string) || '',
		amount: Number(formData.get('amount')),
	});
	if (error) throw new Error(error.message);
	revalidatePath('/taxes');
}

export async function addTaxDocument(formData: FormData) {
	const supabase = await createClient();
	const { error } = await supabase.from('tax_documents').insert({
		tax_year_id: formData.get('tax_year_id') as string,
		name: formData.get('name') as string,
		type: formData.get('type') as string,
	});
	if (error) throw new Error(error.message);
	revalidatePath('/taxes');
}

export async function updateTaxYearStatus(id: string, status: string) {
	const supabase = await createClient();
	const { error } = await supabase.from('tax_years').update({ status }).eq('id', id);
	if (error) throw new Error(error.message);
	revalidatePath('/taxes');
}
