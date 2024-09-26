import mongoose, { Schema, Document } from 'mongoose';

interface IProperty extends Document {
  propertyId: string;
  imageUrls: string[];
  name: string;
  type: string;
  price: number;
  address: string;
  rating: number;
}

const PropertySchema: Schema = new Schema({
  propertyId: { type: String, required: true, unique: true },
  imageUrls: { type: [String], required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  address: { type: String, required: true },
  rating: { type: Number, default: 0 },
});

export default mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);
