import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

interface DecodedToken {
  userId: string; 
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    console.log(authHeader);
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header is missing' }, { status: 401 });
    }
    const token = authHeader;
    if (!token) {
      return NextResponse.json({ error: 'Token is missing' }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken; 
    const userId = decoded.userId;
    console.log(userId);
    await connectToDatabase();
    const user = await User.findOne({ userId }).select('name email'); 
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
