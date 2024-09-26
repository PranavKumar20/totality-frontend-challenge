// api/userdetails/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export async function GET(request: Request) {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get('Authorization');
    console.log(authHeader);
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header is missing' }, { status: 401 });
    }

    // Extract token from the Authorization header
    const token = authHeader; // Assumes the format is "Bearer <token>"
    if (!token) {
      return NextResponse.json({ error: 'Token is missing' }, { status: 401 });
    }

    // Verify the token
    const decoded: any = jwt.verify(token as string, process.env.JWT_SECRET as string);
    const userId = decoded.userId;
    console.log(userId);

    await connectToDatabase();

    // Fetch user details based on userId
    const user = await User.findOne({ userId }).select('name email'); // Only fetch name and email
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return user details
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
