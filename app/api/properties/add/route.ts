import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Property from '@/models/Property';

export async function POST(request: Request) {
  try {
    const { imageUrls, name, type, price, address } = await request.json();
    await connectToDatabase();

    const propertyId = `property_${Math.random().toString(36).substring(2, 15)}`;

    const newProperty = new Property({
      propertyId,
      imageUrls,
      name,
      type,
      price,
      address,
    });

    await newProperty.save();
    return NextResponse.json({ message: 'Property added successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error adding property' }, { status: 500 });
  }
}
