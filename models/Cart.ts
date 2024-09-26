import mongoose, { Schema, model, models, Model, Document } from 'mongoose';

// Define the type for each item in the cart
interface CartItem {
  propertyId: string;
  quantity: number;
}

// Define the type for the cart document
interface CartDocument extends Document {
  userId: string;
  items: CartItem[];
}

// Define the Mongoose model type for the Cart schema
type CartModel = Model<CartDocument>;

// Create the Cart schema
const CartSchema = new Schema<CartDocument>({
  userId: { type: String, required: true },
  items: [
    {
      propertyId: { type: String, required: true },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
});

// Ensure the Cart model is created only once
const Cart = (models.Cart as CartModel) || model<CartDocument, CartModel>('Cart', CartSchema);

export default Cart;
