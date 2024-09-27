"use client";
import React, { useEffect, useState } from 'react';
import { API_URL } from '@/app/config';
import jwt from 'jsonwebtoken'; 

interface Property {
  _id: string;
  propertyId: string;
  name: string;
  price: number;
  imageUrls: string[];
}

interface CartItem {
  propertyId: string;
  quantity: number;
}

const Item: React.FC<{
  property: Property;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}> = ({ property, quantity, onIncrease, onDecrease, onRemove }) => {
  return (
    <div className="flex items-center border-b p-4">
      <img src={property.imageUrls[0]} alt={property.name} className="w-16 h-16 object-cover mr-4" />
      <div className="flex-1">
        <h2 className="font-semibold">{property.name}</h2>
        <p className="text-gray-700">Price: ${property.price}</p>
        <p className="text-gray-700">Quantity: {quantity}</p>
      </div>
      <div className="flex flex-col ml-4">
        <button onClick={onIncrease} className="bg-green-500 text-white rounded p-1 mb-1">+</button>
        <button onClick={onDecrease} className="bg-red-500 text-white rounded p-1 mb-1">-</button>
        <button onClick={onRemove} className="text-red-600">🗑️</button>
      </div>
    </div>
  );
};

const ConfirmationModal: React.FC<{ onConfirm: () => void; onCancel: () => void }> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-lg font-semibold">Are you sure you want to checkout?</h2>
        <div className="mt-4">
          <button onClick={onConfirm} className="bg-blue-500 text-white rounded p-2 mr-2">Yes</button>
          <button onClick={onCancel} className="bg-gray-300 rounded p-2">Cancel</button>
        </div>
      </div>
    </div>
  );
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwt.decode(token) as { userId: string };
        setUserId(decodedToken.userId);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`${API_URL}/cart/view?userId=${userId}`);
        const data: CartItem[] = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, [userId]);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (cartItems.length === 0) return; 
      try {
        const propertiesData: Property[] = await Promise.all(
          cartItems.map(async (item) => {
            const response = await fetch(`${API_URL}/properties/${item.propertyId}`);
            return await response.json();
          })
        );
        setProperties(propertiesData);
      } catch (error) {
        console.error('Error fetching property details:', error);
      }
    };

    fetchPropertyDetails();
  }, [cartItems]);

  useEffect(() => {
    const fetchTotalPrice = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`${API_URL}/cart/total?userId=${userId}`);
        const data = await response.json();
        setTotalPrice(data.totalPrice);
      } catch (error) {
        console.error('Error fetching total price:', error);
      }
    };

    fetchTotalPrice();
  }, [cartItems, userId]);

  const handleCheckout = () => {
    setShowModal(true);
  };

  const confirmCheckout = async () => {
    try {
      const response = await fetch(`${API_URL}/cart/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      const result = await response.json();
      alert(result.message); 
      window.location.href = '/profile'; 
    } catch (error) {
      console.error('Error during checkout:', error);
    } finally {
      setShowModal(false);
    }
  };

  const cancelCheckout = () => {
    setShowModal(false);
  };

  const updateCartItem = async (propertyId: string, quantity: number) => {
    try {
      await fetch(`${API_URL}/cart/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, propertyId, quantity }),
      });
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const handleIncrease = (propertyId: string, currentQuantity: number) => {
    console.log(currentQuantity);
    updateCartItem(propertyId, 1); 
  };

  const handleDecrease = (propertyId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateCartItem(propertyId, -1); 
    }
  };

  const handleRemove = async (propertyId: string) => {
    try {
      await fetch(`${API_URL}/cart/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, propertyId }),
      });

      setCartItems((prevItems) => prevItems.filter((item) => item.propertyId !== propertyId));
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {properties.length > 0 ? (
        properties.map((property, index) => (
          <Item 
            key={property.propertyId} 
            property={property} 
            quantity={cartItems[index].quantity}
            onIncrease={() => handleIncrease(property.propertyId, cartItems[index].quantity)}
            onDecrease={() => handleDecrease(property.propertyId, cartItems[index].quantity)}
            onRemove={() => handleRemove(property.propertyId)}
          />
        ))
      ) : (
        <p>Your cart is empty.</p>
      )}
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Total Price: ${totalPrice}</h2>
        <button 
          onClick={handleCheckout}
          className="mt-4 bg-green-500 text-white rounded p-2"
        >
          Checkout
        </button>
      </div>
      {showModal && (
        <ConfirmationModal onConfirm={confirmCheckout} onCancel={cancelCheckout} />
      )}
    </div>
  );
};

export default CartPage;
