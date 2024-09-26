import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Cart from '@/models/Cart';

export async function DELETE(request: Request) {
  const { userId, propertyId } = await request.json();

  try {
    await connectToDatabase();
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    // Filter out the property from the cart's items
    cart.items = cart.items.filter(item => item.propertyId !== propertyId);

    await cart.save();

    return NextResponse.json({ message: 'Property removed from cart' }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Error removing property from cart' }, { status: 500 });
  }
}
