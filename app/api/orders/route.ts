import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for orders (replace with database in production)
let orders: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.customerName || !body.email || !body.items) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const order = {
      id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...body,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    orders.push(order);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('Orders retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve orders' },
      { status: 500 }
    );
  }
}
