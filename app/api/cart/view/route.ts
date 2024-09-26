// app/api/cart/view/route.ts
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Cart from '@/models/Cart';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    return NextResponse.json(cart.items, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Error fetching cart' }, { status: 500 });
  }
}
