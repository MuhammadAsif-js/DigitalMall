import { NextResponse } from 'next/server';

export async function GET() {
  const inventoryItems = [
    { id: '1', barcode: '890123', name: 'Panadol Extra 500mg', price: 150, costPrice: 100, stock: 45 },
    { id: '2', barcode: '890124', name: 'Brufen 400mg', price: 200, costPrice: 150, stock: 120 },
    { id: '3', barcode: '890125', name: 'Augmentin 625mg', price: 450, costPrice: 380, stock: 15 },
    { id: '4', barcode: '890126', name: 'Arinac Forte', price: 180, costPrice: 130, stock: 60 }
  ];

  return NextResponse.json(inventoryItems);
}
