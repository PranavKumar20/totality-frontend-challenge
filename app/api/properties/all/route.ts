import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Property from '@/models/Property';

export async function GET() {
  try {
    await connectToDatabase();
    const properties = await Property.find({});
    return NextResponse.json(properties, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching properties' }, { status: 500 });
  }
}
