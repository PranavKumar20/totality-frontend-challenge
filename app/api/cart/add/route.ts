// app/api/cart/add/route.ts
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Cart from '@/models/Cart';

export async function POST(request: Request) {
  const { userId, propertyId, quantity } = await request.json();

  try {
    await connectToDatabase();
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      const newCart = new Cart({ userId, items: [{ propertyId, quantity }] });
      await newCart.save();
      return NextResponse.json({ message: 'Property added to cart' }, { status: 201 });
    }

    const existingItem = cart.items.find(item => item.propertyId === propertyId);
    if (existingItem) {
      existingItem.quantity += quantity; 
    } else {
      cart.items.push({ propertyId, quantity });
    }

    await cart.save();
    return NextResponse.json({ message: 'Property added to cart' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error adding to cart' }, { status: 500 });
  }
}
