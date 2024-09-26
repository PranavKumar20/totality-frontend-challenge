// app/api/cart/total/route.ts
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Cart from '@/models/Cart';
import Property from '@/models/Property';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    await connectToDatabase();
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    let totalPrice = 0;
    for (const item of cart.items) {
      const property = await Property.findOne({ propertyId: item.propertyId });
      if (property) {
        totalPrice += property.price * item.quantity;
      }
    }

    return NextResponse.json({ totalPrice }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error calculating total price' }, { status: 500 });
  }
}
