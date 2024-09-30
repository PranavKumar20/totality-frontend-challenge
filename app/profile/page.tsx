"use client"; // Ensure this component is client-side rendered
import React, { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import { API_URL } from '../config';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';

interface UserDetails {
  name: string;
  email: string;
}

interface OrderItem {
  propertyId: string;
  quantity: number;
  price: number;
  _id: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
}

interface DecodedToken {
  userId: string;
}

const ProfilePage = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    const fetchUserDetails = async () => {
      if (!token) return;

      try {
        const decodedToken = jwt.decode(token) as DecodedToken;
        const userId = decodedToken?.userId;

        if (!userId) {
          throw new Error('User ID not found in token');
        }

        const userResponse = await fetch(`${API_URL}/userdetails`, {
          method: 'GET',
          headers: {
            Authorization: token,
          },
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user details');
        }

        const userData = await userResponse.json();
        setUserDetails(userData);

        const ordersResponse = await fetch(`${API_URL}/orders/view?userId=${userId}`);

        if (!ordersResponse.ok) {
          throw new Error('Failed to fetch orders');
        }

        const ordersData = await ordersResponse.json();
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching user details or orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  // if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (loading) return <Loading />;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6">
        {userDetails ? (
          <>
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h1 className="text-3xl font-bold mb-4">Profile Information</h1>
              <div className="text-lg">
                <p className="mb-2">
                  <span className="font-semibold">Name:</span> {userDetails.name}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {userDetails.email}
                </p>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
              {orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order._id} className="border border-gray-300 rounded-lg p-4 shadow-md">
                      <div className="mb-3">
                        <h3 className="font-semibold text-lg">Order ID: {order._id}</h3>
                        <p className="text-sm text-gray-500">
                          Date: {new Date(order.createdAt).toLocaleString()}
                        </p>
                        <p className="font-semibold mt-2">Total Amount: ₹{order.totalAmount}</p>
                      </div>
                      <h4 className="font-semibold mb-2">Items:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {order.items.map((item) => (
                          <li key={item._id} className="text-gray-600">
                            <span className="font-semibold">Property ID:</span> {item.propertyId}, 
                            <span className="font-semibold"> Quantity:</span> {item.quantity}, 
                            <span className="font-semibold"> Price:</span> ₹{item.price}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No orders found.</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-red-500">User details not found.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
