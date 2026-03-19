'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addVehicle(formData: FormData) {
	const supabase = await createClient();
	const { error } = await supabase.from('vehicles').insert({
		make: formData.get('make') as string,
		model: formData.get('model') as string,
		year: Number(formData.get('year')),
		vin: (formData.get('vin') as string) || null,
		mileage: Number(formData.get('mileage')) || 0,
	});
	if (error) throw new Error(error.message);
	revalidatePath('/car');
}

export async function deleteVehicle(id: string) {
	const supabase = await createClient();
	const { error } = await supabase.from('vehicles').delete().eq('id', id);
	if (error) throw new Error(error.message);
	revalidatePath('/car');
}

export async function addMaintenanceRecord(formData: FormData) {
	const supabase = await createClient();
	const { error } = await supabase.from('maintenance_records').insert({
		vehicle_id: formData.get('vehicle_id') as string,
		type: formData.get('type') as string,
		description: (formData.get('description') as string) || '',
		cost: Number(formData.get('cost')) || 0,
		mileage: Number(formData.get('mileage')) || 0,
		date: formData.get('date') as string,
	});
	if (error) throw new Error(error.message);
	revalidatePath('/car');
}

export async function addFuelLog(formData: FormData) {
	const supabase = await createClient();
	const { error } = await supabase.from('fuel_logs').insert({
		vehicle_id: formData.get('vehicle_id') as string,
		gallons: Number(formData.get('gallons')),
		cost_per_gallon: Number(formData.get('cost_per_gallon')),
		mileage: Number(formData.get('mileage')),
		date: formData.get('date') as string,
	});
	if (error) throw new Error(error.message);
	revalidatePath('/car');
}
