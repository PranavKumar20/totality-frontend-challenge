import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Property from '@/models/Property';

// GET specific property details
export async function GET(request: Request, { params }: { params: { propertyId: string } }) {
  const { propertyId } = params;  // Get propertyId from dynamic route

  try {
    await connectToDatabase();
    
    const property = await Property.findOne({ propertyId });

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json(property, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching property' }, { status: 500 });
  }
}

// DELETE a specific property
export async function DELETE(request: Request, { params }: { params: { propertyId: string } }) {
  const { propertyId } = params;  // Get propertyId from dynamic route

  try {
    await connectToDatabase();
    
    const property = await Property.findOneAndDelete({ propertyId });

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Property deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting property' }, { status: 500 });
  }
}

// PUT (Update) a specific property's rating
export async function PUT(request: Request, { params }: { params: { propertyId: string } }) {
  const { propertyId } = params;
  const { rating } = await request.json();

  if (!rating || typeof rating !== 'number' || rating < 0 || rating > 5) {
    return NextResponse.json({ error: 'Invalid rating. Must be between 0 and 5.' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const property = await Property.findOne({ propertyId });
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    property.rating = rating;
    await property.save();

    return NextResponse.json({
      message: 'Rating updated successfully',
      propertyId,
      newRating: property.rating,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
