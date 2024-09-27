import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/db'; 
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `user_${Math.random().toString(36).substring(2, 15)}`;
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      userId,
    });

    await newUser.save();
    const payload = { userId: newUser.userId, email: newUser.email };
    console.log(payload);

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '48h',
    });

    return NextResponse.json({ token }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
