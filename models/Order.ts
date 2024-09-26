import mongoose, { Schema, model, models, Document } from 'mongoose';

// Define the type for each item in the order
interface OrderItem {
  propertyId: string;
  quantity: number;
  price: number;
}

// Define the type for the order document
interface OrderDocument extends Document {
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: Date;
}

// Create the Order schema
const OrderSchema = new Schema<OrderDocument>({
  userId: { type: String, required: true },
  items: [
    {
      propertyId: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Check if the model already exists, and only create it if it doesn't
const Order = models.Order || model<OrderDocument>('Order', OrderSchema);

export default Order;
