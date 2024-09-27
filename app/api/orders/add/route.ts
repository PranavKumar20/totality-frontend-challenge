import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';

export async function POST(request: Request) {
  const { userId, items, totalAmount } = await request.json();
  if (!userId || !items || items.length === 0 || !totalAmount) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
  try {
    await connectToDatabase();
    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      createdAt: new Date(),
    });
    await newOrder.save();
    return NextResponse.json({ message: 'Order added successfully', orderId: newOrder._id }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Error adding order' }, { status: 500 });
  }
}
