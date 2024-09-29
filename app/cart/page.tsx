"use client";
import React, { useEffect, useState } from "react";
import { API_URL } from "@/app/config";
import jwt from "jsonwebtoken";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import { MdDelete } from "react-icons/md";

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
    <div className="flex items-center border-b p-4 bg-white shadow-md rounded-md">
      <img
        src={property.imageUrls[0]}
        alt={property.name}
        className="w-20 h-20 object-cover mr-6 rounded"
      />
      <div className="flex-1">
        <h2 className="font-bold text-lg">{property.name}</h2>
        <p className="text-gray-700 text-sm">Price: ${property.price}</p>
        <p className="text-gray-700 text-sm">Quantity: {quantity}</p>
      </div>
      <div className="flex flex-col items-center ml-4 space-y-2">
        <button
          onClick={onIncrease}
          className="bg-green-500 text-white rounded p-2 hover:bg-green-600 shadow-md transition"
        >
          +
        </button>
        <button
          onClick={onDecrease}
          className="bg-red-500 text-white rounded p-2 hover:bg-red-600 shadow-md transition"
        >
          -
        </button>
        <button
          onClick={onRemove}
          className="text-red-600 hover:text-red-800 transition text-3xl"
        >
          <MdDelete />
        </button>
      </div>
    </div>
  );
};

// Confirmation Modal component
const ConfirmationModal: React.FC<{
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Confirm Checkout</h2>
        <p className="text-gray-700 mb-6">
          Are you sure you want to proceed with the checkout?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition duration-150"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-150"
          >
            Confirm
          </button>
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
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isEmptyCart, setIsEmptyCart] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwt.decode(token) as { userId: string };
        setUserId(decodedToken.userId);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`${API_URL}/cart/view?userId=${userId}`);
        const data: CartItem[] = await response.json();
        
        if (data.length === 0) {
          setIsEmptyCart(true); 
        } else {
          setCartItems(data);
          setIsEmptyCart(false); 
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false); 
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
            const response = await fetch(
              `${API_URL}/properties/${item.propertyId}`
            );
            return await response.json();
          })
        );
        setProperties(propertiesData);
      } catch (error) {
        console.error("Error fetching property details:", error);
      }
    };

    fetchPropertyDetails();
  }, [cartItems]);

  useEffect(() => {
    const fetchTotalPrice = async () => {
      if (!userId) return;
      try {
        const response = await fetch(
          `${API_URL}/cart/total?userId=${userId}`
        );
        const data = await response.json();
        setTotalPrice(data.totalPrice);
      } catch (error) {
        console.error("Error fetching total price:", error);
      }
    };

    fetchTotalPrice();
  }, [cartItems, userId]);

  const handleCheckout = () => {
    setShowModal(true);
  };

  const confirmCheckout = async () => {
    try {
      await fetch(`${API_URL}/cart/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      window.location.href = "/profile";
    } catch (error) {
      console.error("Error during checkout:", error);
    } finally {
      setShowModal(false);
    }
  };

  const cancelCheckout = () => {
    setShowModal(false);
  };

  const updateCartItem = async (propertyId: string, quantity: number) => {
    try {
      const updatedCartItems = cartItems.map((item) =>
        item.propertyId === propertyId
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );

      setCartItems(updatedCartItems);

      await fetch(`${API_URL}/cart/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, propertyId, quantity }),
      });
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  const handleIncrease = (propertyId: string) => {
    updateCartItem(propertyId, 1);
  };

  const handleDecrease = (propertyId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateCartItem(propertyId, -1);
    }
  };

  const handleRemove = async (propertyId: string) => {
    try {
      const updatedCartItems = cartItems.filter(
        (item) => item.propertyId !== propertyId
      );
        setCartItems(updatedCartItems);
        const updatedProperties = properties.filter(
        (property) => property.propertyId !== propertyId
      );
      setProperties(updatedProperties);
      await fetch(`${API_URL}/cart/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, propertyId }),
      });
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  };
  
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (cartItems.length === 0) return;
      try {
        const propertiesData: Property[] = await Promise.all(
          cartItems.map(async (item) => {
            const response = await fetch(
              `${API_URL}/properties/${item.propertyId}`
            );
            return await response.json();
          })
        );
        setProperties(propertiesData);
      } catch (error) {
        console.error("Error fetching property details:", error);
      }
    };
  
    fetchPropertyDetails();
  }, [cartItems]);
  
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>
        {isEmptyCart ? ( 
          <div className="text-center text-gray-500 mt-12">
            <p className="text-lg">Your cart is empty.</p>
            <p className="text-gray-600">
              Start adding properties to see them here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {properties.map((property, index) => (
              <Item
                key={property.propertyId}
                property={property}
                quantity={cartItems[index].quantity}
                onIncrease={() => handleIncrease(property.propertyId)}
                onDecrease={() =>
                  handleDecrease(property.propertyId, cartItems[index].quantity)
                }
                onRemove={() => handleRemove(property.propertyId)}
              />
            ))}
            <div className="mt-4">
              <h2 className="text-xl font-semibold">
                Total Price: ${totalPrice}
              </h2>
              <button
                onClick={handleCheckout}
                className="mt-4 bg-green-500 text-white rounded-lg py-2 px-6 hover:bg-green-600 shadow-md transition duration-150"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
        {showModal && (
          <ConfirmationModal onConfirm={confirmCheckout} onCancel={cancelCheckout} />
        )}
      </div>
    </div>
  );
};

export default CartPage;
