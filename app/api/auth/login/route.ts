import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/db'; 
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    await connectToDatabase();
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    const payload = { userId: existingUser.userId, email: existingUser.email };
    console.log(payload);
    const token = jwt.sign(payload, process.env.JWT_SECRET as string);

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
