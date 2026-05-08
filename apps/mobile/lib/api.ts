import { supabase } from './supabase';

export async function getMedicineByBarcode(barcode: string) {
  const { data, error } = await supabase
    .from('inventory')
    .select('name, price, stock_count')
    .eq('barcode', barcode)
    .single();

  if (error) {
    console.error('Error fetching medicine by barcode:', error);
    return null;
  }

  return data;
}
