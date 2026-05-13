import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ barcode: string }> }
) {
  const { barcode } = await params;

  if (!barcode) {
    return NextResponse.json({ error: "Barcode is required" }, { status: 400 });
  }

  // "Smart Mock" response for the Open Food Facts API
  return NextResponse.json({
    name: "Panadol Extra 500mg",
    suggestedPrice: 150,
  });
}
