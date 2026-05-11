import { supabase } from './supabase';

import { CartItem } from '../store/cartStore';

export async function getMedicineByBarcode(barcode: string) {
  const { data, error } = await supabase
    .from('Inventory')
    .select('name, price, stock_count')
    .eq('barcode', barcode)
    .single();

  if (error) {
    console.error('Error fetching medicine by barcode:', error);
    return null;
  }

  return data;
}

export async function processCheckout(cartItems: CartItem[]) {
  try {
    for (const item of cartItems) {
      // 1. Fetch current stock
      const { data: stockData, error: fetchError } = await supabase
        .from('Inventory')
        .select('stock_count')
        .eq('barcode', item.id)
        .single();

      if (fetchError) {
        console.error(`Error fetching stock for item ${item.id}:`, fetchError);
        throw new Error(`Could not fetch stock for ${item.name}`);
      }

      // 2. Calculate new stock
      const currentStock = stockData.stock_count || 0;
      const newStock = Math.max(0, currentStock - item.quantity); // Prevent negative stock

      // 3. Update stock
      const { error: updateError } = await supabase
        .from('Inventory')
        .update({ stock_count: newStock })
        .eq('barcode', item.id);

      if (updateError) {
        console.error(`Error updating stock for item ${item.id}:`, updateError);
        throw new Error(`Could not update stock for ${item.name}`);
      }
    }
    return { success: true };
  } catch (error) {
    console.error('Checkout process failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error during checkout' };
  }
}
