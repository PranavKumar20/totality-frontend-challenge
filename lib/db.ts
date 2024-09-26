import mongoose from 'mongoose';

const MONGODB_URI: string = process.env.MONGODB_URI as string;
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

async function connectToDatabase() {
  // Establish a new connection to the database
  const opts = {
    bufferCommands: false,
  };

  // Connect to MongoDB and return the connection
  return mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
    return mongoose.connection;
  });
}

export default connectToDatabase;
