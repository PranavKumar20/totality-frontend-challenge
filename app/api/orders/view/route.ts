import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    await connectToDatabase();
    const orders = await Order.find({ userId });

    if (!orders || orders.length === 0) {
      return NextResponse.json({ error: 'No orders found for this user' }, { status: 404 });
    }

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching orders' }, { status: 500 });
  }
}
