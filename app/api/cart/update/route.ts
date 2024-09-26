// app/api/cart/update/route.ts
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Cart from '@/models/Cart';

export async function PUT(request: Request) {
  const { userId, propertyId, quantity } = await request.json();

  try {
    await connectToDatabase();
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    const item = cart.items.find(item => item.propertyId === propertyId);
    if (item) {
      item.quantity += quantity;
      await cart.save();
      return NextResponse.json({ message: 'Quantity updated successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Property not found in cart' }, { status: 404 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Error updating quantity' }, { status: 500 });
  }
}
