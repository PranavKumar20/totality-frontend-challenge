import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Cart from '@/models/Cart';
import { API_URL } from '@/app/config';

export async function POST(request: Request) {
  const { userId } = await request.json();

  try {
    await connectToDatabase();
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Initialize an array to hold items with their prices
    const itemsWithPrices = await Promise.all(
      cart.items.map(async (item) => {
        // Fetch the property details to get the price
        const propertyResponse = await fetch(`${API_URL}/properties/${item.propertyId}`);
        
        if (!propertyResponse.ok) {
          throw new Error(`Failed to fetch property ${item.propertyId}`);
        }

        const propertyData = await propertyResponse.json();
        
        // Ensure the property has a price
        if (!propertyData.price) {
          throw new Error(`Property ${item.propertyId} does not have a price`);
        }

        // Return the item with the price
        return {
          propertyId: item.propertyId,
          quantity: item.quantity,
          price: propertyData.price,
        };
      })
    );

    // Calculate the total amount
    const totalAmount = itemsWithPrices.reduce((total, item) => total + item.quantity * item.price, 0);

    // Proceed with the order creation
    const orderResponse = await fetch(`${API_URL}/orders/add`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        items: itemsWithPrices,
        totalAmount,
      }),
    });

    if (!orderResponse.ok) {
      return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
    }

    // Clear the cart after successful checkout
    await Cart.deleteOne({ userId });

    return NextResponse.json({ message: 'Checkout successful' }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Error during checkout' }, { status: 500 });
  }
}
