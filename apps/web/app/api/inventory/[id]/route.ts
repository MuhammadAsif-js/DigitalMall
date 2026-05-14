import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { price, stock } = body;

    // Here we would typically validate the data and update the database.
    // For this mock, we just return a success response.
    return NextResponse.json({
      success: true,
      message: "Item updated",
      data: {
        id,
        price,
        stock
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update item" },
      { status: 500 }
    );
  }
}
